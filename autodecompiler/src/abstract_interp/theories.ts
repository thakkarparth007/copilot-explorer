/* this file contains some helpful z3 assertions which act as theorems */

import * as Z3 from 'z3-solver';
import { ValT, valt2sort, z3API, z3ctx } from './interp';


const theorems: { [key: string]: Z3.Expr<"main", Z3.BoolSort<"main">> } = {};

// function binOpTheorem(
//     op: string, a: ValT, b: ValT, c: ValT,
//     // a predicate that takes (constA, constB, constC) and returns a boolean:
//     // this predicate will be wrapped inside a forall quantifier
//     pred: (a: any, b: any, c: any) => Z3.Expr<"main", Z3.BoolSort<"main">>
// ) {
//     const sorts = [valt2sort.get(a)!, valt2sort.get(b)!, valt2sort.get(c)!];
//     const constA = z3ctx.Const(`constA_${op}`, sorts[0]);
//     const constB = z3ctx.Const(`constB_${op}`, sorts[1]);
//     const constC = z3ctx.Const(`constC_${op}`, sorts[2]);
//     const names = [constA, constB, constC];

//     const forall = z3API.Z3.mk_forall(
//         z3ctx.ptr, 0, [],
//         sorts.map(s => s.ptr),
//         names.map(n => n.ptr),
//         pred
//     );
// }
// theorems for binary numeric operations
// theorems[
//     "OP_ADDNumeric,Numeric,Numeric"
// ] = 