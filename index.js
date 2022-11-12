const babel = require('@babel/core');
const assert = require("assert").strict;
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const fs = require('fs');
const path = require('path');

const rootPath = path.join(__dirname, "muse/github.copilot-1.57.7193/dist");
const srcFile = path.join(rootPath, 'extension_expanded.js')
const code = fs.readFileSync(srcFile, 'utf8');

// navigate the AST of var e = {...}. Every property is a module.
// We want to separate each module into its own file.

const ast = babel.parse(code);

function getModulePath(moduleId) {
    return path.join(rootPath, "modules", moduleId + ".js");
}

function handleModule(moduleId, moduleAst, metadata) {
    assert(moduleAst.type == "ArrowFunctionExpression" || moduleAst.type == "FunctionExpression");
    assert.equal(moduleAst.body.type, "BlockStatement");

    // metadata["path"] = getModulePath(moduleId);
    metadata["deps"] = [];
    metadata["exports"] = [];

    let moduleCodeRaw = generate(moduleAst).code;
    if (moduleCodeRaw.trim().startsWith("function")) {
        // change `function(e, t, n) {` to `(e, t, n) => {`
        moduleCodeRaw = moduleCodeRaw.replace("function", "");
        moduleCodeRaw = moduleCodeRaw.replace(")", ") =>");
    }

    function collectDeps(moduleArrowFnPath) {
        assert.equal(moduleArrowFnPath.node.type, "ArrowFunctionExpression");

        // ensure the function takes `require` as an argument
        assert.equal(moduleArrowFnPath.node.params.length, 3);
        assert.equal(moduleArrowFnPath.node.params[2].name, "require");

        // find references to `require`
        const requireRefs = moduleArrowFnPath.scope.bindings.require.referencePaths;
        for (const requireRef of requireRefs) {
            const requireCall = requireRef.parentPath;
            if (requireCall.node.type != "CallExpression") {
                // e.g., e = n.nmd(e)
                continue;
            }
            assert.equal(requireCall.node.arguments.length, 1);
            const depId = requireCall.node.arguments[0].value;
            // metadata["deps"].push({depId, path: getModulePath(depId)});
            metadata["deps"].push(depId);
        }
    }

    function collectExports(moduleArrowFnPath) {
        assert.equal(moduleArrowFnPath.node.type, "ArrowFunctionExpression");

        // ensure the function takes `exports` as an argument
        assert(moduleArrowFnPath.node.params.length >= 2);
        assert.equal(moduleArrowFnPath.node.params[1].name, "exports");

        // find references to `exports`
        const exportsRefs = moduleArrowFnPath.scope.bindings.exports.referencePaths;
        for (const exportsRef of exportsRefs) {
            const exportsMemberExpr = exportsRef.parent;
            if (exportsMemberExpr.type != "MemberExpression") {
                console.log("WTF", moduleId, generate(exportsMemberExpr).code);
                continue;
            }
            assert.equal(exportsMemberExpr.object.name, "exports");
            assert.equal(exportsMemberExpr.property.type, "Identifier");
            const exportName = exportsMemberExpr.property.name;
            if (metadata["exports"].indexOf(exportName) == -1) {
                metadata["exports"].push(exportName);
            }
        }
    }

    // prettify the code
    let transformedArrowFn = false;
    const moduleTransformer = {
        ArrowFunctionExpression(path) {
            if (transformedArrowFn) {
                return;
            }

            const node = path.node; // the module's AST

            // at most 3 arguments: module, exports, require
            assert(node.params.length <= 3);
            
            // rename the arguments from (e, t, n) to (module, exports, require)
            node.params.forEach((param, i) => {
                path.scope.rename(param.name, ["module", "exports", "require"][i]);
            });
            
            if (node.params.length == 3)
                collectDeps(path);
            if (node.params.length >= 2)
                collectExports(path);

            transformedArrowFn = true;
        },
        // e.g., `(0, r.getConfig)(e, r.ConfigKey.DebugOverrideProxyUrl);`
        // gets transformed to r.getConfig(e, r.ConfigKey.DebugOverrideProxyUrl);
        CallExpression(path) {
            if (path.node.callee.type != "SequenceExpression") {
                return;
            }
            if (path.node.callee.expressions.length == 2 && path.node.callee.expressions[0].type == "NumericLiteral") {
                path.node.callee = path.node.callee.expressions[1];
            }
        },
        ExpressionStatement(path) {
            if (path.node.expression.type != "SequenceExpression") {
                return;
            }
            const exprs = path.node.expression.expressions;
            let exprStmts = exprs.map(e => { return babel.types.expressionStatement(e); });
            path.replaceWithMultiple(exprStmts);
        },
        IfStatement(path) {
          if (!path.node.test || path.node.test.type != "SequenceExpression") {
            return;
          }
          const exprs = path.node.test.expressions;
          let exprStmts = exprs.map(e => { return babel.types.expressionStatement(e); });
          let lastExpr = exprStmts.pop();
          path.node.test = lastExpr.expression;
          exprStmts.push(path.node);
          path.replaceWithMultiple(exprStmts);
        },
        ReturnStatement(path) {
            if (!path.node.argument || path.node.argument.type != "SequenceExpression") {
                return;
            }
            const exprs = path.node.argument.expressions;
            let exprStmts = exprs.map(e => { return babel.types.expressionStatement(e); });
            let lastExpr = exprStmts.pop();
            let returnStmt = babel.types.returnStatement(lastExpr.expression);
            exprStmts.push(returnStmt);
            path.replaceWithMultiple(exprStmts);
        },
        UnaryExpression(path) {
          if (path.node.operator == "void" && path.node.argument.type == "NumericLiteral" && path.node.argument.value == 0) {
            path.replaceWithSourceString("undefined");
          }
        }
    }
    moduleAst = babel.parse(moduleCodeRaw);
    traverse(moduleAst, moduleTransformer);

    assert (moduleAst.type == "File");
    assert (moduleAst.program.type == "Program");
    assert (moduleAst.program.body.length == 1);
    assert (moduleAst.program.body[0].type == "ExpressionStatement");
    assert (moduleAst.program.body[0].expression.type == "ArrowFunctionExpression");
    assert (moduleAst.program.body[0].expression.body.type == "BlockStatement");

    const mainBody = moduleAst.program.body[0].expression.body.body;
    const moduleCode = generate(babel.types.Program(mainBody)).code;
    
    fs.writeFileSync(getModulePath(moduleId), moduleCode);
}

const moduleDeps = {};
traverse(ast, {
    enter(path) {
        if (path.node.type == "VariableDeclarator" && path.node.id.name == "e") {
            const modules = path.node.init.properties;
            for (let module of modules) {
                const moduleId = module.key.value;
                const moduleAst = module.value;
                moduleDeps[moduleId] = {}
                try {
                    handleModule(
                        moduleId, moduleAst, moduleDeps[moduleId]
                    );
                } catch (e) {
                    console.log("Error handling module " + moduleId);
                    throw e;
                }
            }
            path.stop();
        }
    }
});

// write the module dependency graph
fs.writeFileSync(
    path.join(rootPath, "module_deps.json"),
    JSON.stringify(moduleDeps, null, 2)
);