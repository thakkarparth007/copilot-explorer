/*
This module builds an abstract interpreter for JS.

It uses Babel to parse the JS, and uses the visitor pattern to
'execute' the code. It keeps track of computations and side effects
while 'executing' the code.

A parent module then uses this interpreter to get the sequence of side-effects
of running two pieces of code, and uses z3 to check if the two sequences are
equivalent.
*/

// import * as Babel from '@babel/core';
import { NodePath, Visitor } from '@babel/core';
import assert from 'assert';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as fs from 'fs';
import * as path from 'path';

// z3
import * as Z3 from 'z3-solver'
import * as t from '@babel/types';
export const z3API = await Z3.init();
const { Context } = z3API;

export const z3ctx = Context("main");

export enum ValT {
    Numeric, // includes both BigInt and Number. Not sure if that's a good idea.
    Boolean,
    String,
    RegExp,
    Null,
    Undefined,
    Object,
    Array,
    Function,
    Symbol,
    Unknown, // for when we don't know the type of a value
}

export const valt2sort = new Map<string | ValT, Z3.Sort>();
for (const type of Object.values(ValT)) {
    let t = "";
    if (typeof type === "string")
        t = type;
    else
        t = ValT[type];
    let sort: Z3.Sort;
    switch (t) {
        case "Numeric": sort = z3ctx.Real.sort(); break;
        case "Boolean": sort = z3ctx.Bool.sort(); break;
        default: sort = z3ctx.Sort.declare(t); break;
    }
    valt2sort.set(type, sort);
}

// z3-js doesn't have string support. So we'll just treat them as uninterpreted symbols.
// if refactoring breaks a string into multiple parts, we won't be able to handle it.
// Such is life.
// Alternatively we can spin up a python process and use z3 from there.
// But that's too much work for now.
const stringSort = valt2sort.get("String")!;

export class Val {
    type: ValT = ValT.Unknown;
    _jsValue: any = undefined;
    z3obj: Z3.Expr;
    constructor(type: ValT, jsValue: any, z3obj: Z3.Expr) {
        this.type = type;
        this._jsValue = jsValue;
        this.z3obj = z3obj;
    }
}

const nullVal : Val = {
    type: ValT.Null,
    _jsValue: null,
    z3obj: z3ctx.Const("null", valt2sort.get("Null")!),
};
const undefinedVal : Val = {
    type: ValT.Undefined,
    _jsValue: undefined,
    z3obj: z3ctx.Const("undefined", valt2sort.get("Undefined")!),
};

// Variable is a generic with a type parameter T that is a member of the ValueType enum.
// by default T is ValueType.Unknown
class Variable {
    name: string;
    value: any;
    type: ValT;
    z3obj: any; // z3 object representing the variable
    constructor(name: string, value: any, type: ValT = ValT.Unknown) {
        this.name = name;
        this.value = value;
        this.type = type;
        assert(valt2sort.has(ValT[type]), `Unknown type ${type}`);
        this.z3obj = z3ctx.Const(name, valt2sort.get(ValT[type])!);
    }
}

export class Scope {
    // maps variable names to their values
    vars: Map<string, Variable>;
    parent: Scope | undefined;
    global: Scope;
    constructor(vars?: Map<string, Variable>, parent?: Scope) {
        this.vars = vars || new Map();
        this.parent = parent;
        this.global = parent ? parent.global : this;
    }
    getVar(name: string): Variable {
        let cur: Scope = this;
        while (cur.parent) {
            if (cur.vars.has(name))
                return cur.vars.get(name)!;
            cur = cur.parent;
        }
        // reached the global scope
        // assume that the variable is defined
        if (!cur.vars.has(name))
            this.vars.set(name, new Variable(name, undefined, ValT.Unknown));
        return cur.vars.get(name)!;
    }
    setVar(name: string, val: Val) {
        // TODO: handle lookup in parent scopes and undefined variables
        this.vars.set(name, new Variable(name, val._jsValue, val.type));
    }
}

const funcs = new Map<string, Z3.FuncDecl>();
function getOperator(name: string, operandTypes: Array<ValT>, resultType: ValT) {
    const key = name + "_P_" + operandTypes.join("_") + "_R_" + resultType;
    if (!funcs.has(key)) {
        const sorts = operandTypes.map(t => valt2sort.get(ValT[t])!);
        sorts.push(valt2sort.get(ValT[resultType])!);
        const sorts2 = sorts as Z3.FuncDeclSignature<"main">; // to make typescript happy :(
        
        const fn = z3ctx.Function.declare(key, ...sorts2);
        funcs.set(key, fn);
    }

    return funcs.get(key)!;
}

// Abstract Expression Interpreter -- to handle expressions separately from statements
export class AExpressionInterp implements Visitor {
    _P: string; // name of the program
    _rootScope: Scope;
    _stack: Val[] = [];
    constructor(progName: string, scope: Scope) {
        this._P = progName;
        this._rootScope = scope;
    }

    _getResult(): Val {
        assert(this._stack.length === 1, "Stack should have exactly one element");
        return this._stack.pop()!;
    }

    // handle literals
    BigIntLiteral = (path: NodePath<t.BigIntLiteral>) => {
        this._stack.push({
            type: ValT.Numeric,
            _jsValue: path.node.value,
            // z3obj: z3ctx.Const(`BigInt(${path.node.value})`, valt2sort.get(ValT.Numeric)!),
            z3obj: z3ctx.ToReal(BigInt(path.node.value)),
        });
    }

    NumericLiteral = (path: NodePath<t.NumericLiteral>) => {
        this._stack.push({
            type: ValT.Numeric,
            _jsValue: path.node.value,
            // z3obj: z3ctx.from(path.node.value),
            // z3obj: z3ctx.Const(`Numeric(${path.node.value})`, valt2sort.get(ValT.Numeric)!),
            z3obj: z3ctx.from(path.node.value),
        });
    }

    BooleanLiteral = (path: NodePath<t.BooleanLiteral>) => {
        this._stack.push({
            type: ValT.Boolean,
            _jsValue: path.node.value,
            // z3obj: z3ctx.Const(path.node.value ? "true" : "false", valt2sort.get(ValT.Boolean)!),
            z3obj: z3ctx.from(path.node.value),
        });
    }

    StringLiteral = (path: NodePath<t.StringLiteral>) => {
        this._stack.push({
            type: ValT.String,
            _jsValue: path.node.value,
            // maybe set the variable name differently?
            z3obj: z3ctx.Const("STRLITERAL_" + path.node.value, stringSort),
        });
    }

    RegExpLiteral = (path: NodePath<t.RegExpLiteral>) => {
        const val = {
            pattern: path.node.pattern,
            flags: path.node.flags,
        }
        this._stack.push({
            type: ValT.RegExp,
            _jsValue: val,
            z3obj: z3ctx.Const(`/${val.pattern}/${val.flags}`, stringSort),
        });
    }

    NullLiteral = (path: NodePath<t.NullLiteral>) => {
        this._stack.push(nullVal);
    }

    // handle identifiers
    Identifier = (path: NodePath<t.Identifier>) => {
        const name = path.node.name;
        // babel treats undefined as an identifier
        // but treating it as a literal is more convenient imo
        if (name === "undefined") {
            this._stack.push(undefinedVal);
        }

        const variable = this._rootScope.getVar(name);
        this._stack.push({
            type: variable.type,
            _jsValue: variable.value,
            z3obj: variable.z3obj
        });
    }

    // handle binary expressions
    BinaryExpression = {
        enter: (path: NodePath<t.BinaryExpression>) => {},
        exit: (path: NodePath<t.BinaryExpression>) => {
            console.log("BinaryExpression: " + path.node.operator)
            console.log("Stack: " + this._stack);
            const right = this._stack.pop()!;
            const left = this._stack.pop()!;
            const op = path.node.operator;

            let retType: ValT;
            let opFunc: Z3.FuncDecl;
            let opName = "OP_";

            // op can be one of the following:
            // "+" | "-" | "/" | "%" | "*" | "**" | "&" | "|" | ">>" | ">>>" | "<<" |
            // "^" | "==" | "===" | "!=" | "!==" | "in" | "instanceof" | ">" | "<" |
            // ">=" | "<=" | "|>"
            //
            // we'll handle case-by-case

            // "+" -> ["ADD", <retType>], "-" -> ["SUB", <retType>], etc.
            const cases: { [key: string]: [string, ValT] } = {
              // concat or numeric addition
              "+": [
                "ADD",
                left.type === ValT.String || right.type === ValT.String
                  ? ValT.String
                  : ValT.Numeric,
              ],

              // numeric operators
              "-":   ["SUB", ValT.Numeric],
              "*":   ["MUL", ValT.Numeric],
              "/":   ["DIV", ValT.Numeric],
              "%":   ["MOD", ValT.Numeric],
              "**":  ["POW", ValT.Numeric],
              "<<":  ["SHL", ValT.Numeric],
              ">>":  ["SHR", ValT.Numeric],
              ">>>": ["SHR", ValT.Numeric],
              "&":   ["AND", ValT.Numeric],
              "|":   ["OR",  ValT.Numeric],
              "^":   ["XOR", ValT.Numeric],

              // boolean operators
              "||":  ["OR",   ValT.Boolean],
              "&&":  ["AND",  ValT.Boolean],
              "==":  ["EQ2",  ValT.Boolean],
              "!=":  ["NEQ2", ValT.Boolean],
              "===": ["EQ3",  ValT.Boolean],
              "!==": ["NEQ3", ValT.Boolean],
              "<":   ["LT",   ValT.Boolean],
              "<=":  ["LTE",  ValT.Boolean],
              ">":   ["GT",   ValT.Boolean],
              ">=":  ["GTE",  ValT.Boolean],
              "in":  ["IN",   ValT.Boolean],
              "instanceof": ["INSTANCEOF", ValT.Boolean],
            };

            if (!(op in cases)) {
                throw new Error(`Unknown operator ${op}`);                
            }
            
            [opName, retType] = cases[op];
            opFunc = getOperator(opName, [left.type, right.type], retType);
            this._stack.push({
                type: retType,
                _jsValue: null,
                z3obj: opFunc.call(left.z3obj, right.z3obj),
            });
        }
    }
}

export class AInterp implements Visitor {

}
