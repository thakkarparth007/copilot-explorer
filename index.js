const babel = require('@babel/core');
const assert = require("assert").strict;
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const fs = require('fs');
const path = require('path');
const prettier = require("prettier");

const rootPath = path.join(__dirname, "muse/github.copilot-1.57.7193/dist");
const outPath = path.join(__dirname, "codeviz/data");
// const srcFile = path.join(rootPath, 'extension_expanded.js');
const srcFile = path.join(rootPath, 'extension_expanded_v2.js'); // this modifies module 3055 by splitting it into multiple modules (originally 3055 consisted of multiple nested modules which weren't being extracted automatically. So I extracted them manually)
const mainModuleSrcFile = path.join(rootPath, "extension_expanded_main.js");
const code = fs.readFileSync(srcFile, 'utf8');
const mainCode = fs.readFileSync(mainModuleSrcFile, 'utf8');

// navigate the AST of var e = {...}. Every property is a module.
// We want to separate each module into its own file.

const ast = babel.parse(code);

function getModulePath(moduleId) {
    return path.join(rootPath, "modules", moduleId + ".js");
}

function normalizeExports(moduleId, moduleCodeRaw) {
    /**
       Applies two transformations:
       First, it converts the modules defined as arrow functions of the form (e, t, n) => {...}
       into arrow functions of the form (module, exports, require) => {...}

       Second, and more importantly:
       Converts code of the form
       ```
       Object.defineProperty(exports, "KeywordCxt", {
          enumerable: !0,
          get: function () {
            return u.KeywordCxt;
          }
       });
       ```
       
       into

       ```
       exports.KeywordCxt = u.KeywordCxt;
       ```
     */
    if (moduleCodeRaw.trim().startsWith("function")) {
        // change `function(e, t, n) {` to `(e, t, n) => {`
        moduleCodeRaw = moduleCodeRaw.replace("function", "");
        moduleCodeRaw = moduleCodeRaw.replace(")", ") =>");
    }
    
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
            
            transformedArrowFn = true;
        },
        CallExpression(path) {
            const { node } = path;
            if (node.callee.type === 'MemberExpression' &&
                node.callee.object.type === 'Identifier' &&
                node.callee.object.name === 'Object' &&
                node.callee.property.type === 'Identifier' &&
                node.callee.property.name === 'defineProperty' &&
                node.arguments.length === 3 &&
                node.arguments[0].type === 'Identifier' &&
                node.arguments[0].name === 'exports' &&
                node.arguments[1].type === 'StringLiteral' &&
                node.arguments[2].type === 'ObjectExpression' &&
                node.arguments[2].properties.length === 2 &&
                node.arguments[2].properties[0].type === 'ObjectProperty' &&
                node.arguments[2].properties[0].key.type === 'Identifier' &&
                node.arguments[2].properties[0].key.name === 'enumerable' &&
                node.arguments[2].properties[1].type === 'ObjectProperty' &&
                node.arguments[2].properties[1].key.type === 'Identifier' &&
                node.arguments[2].properties[1].key.name === 'get' &&
                node.arguments[2].properties[1].value.type === 'FunctionExpression' &&
                node.arguments[2].properties[1].value.body.type === 'BlockStatement' &&
                node.arguments[2].properties[1].value.body.body.length === 1 &&
                node.arguments[2].properties[1].value.body.body[0].type === 'ReturnStatement' &&
                node.arguments[2].properties[1].value.body.body[0].argument.type === 'MemberExpression'
            ) {
                const newNode = babel.types.assignmentExpression(
                    '=',
                    babel.types.memberExpression(
                        node.arguments[0],
                        babel.types.Identifier(node.arguments[1].value),
                        false
                    ),
                    node.arguments[2].properties[1].value.body.body[0].argument
                );
                path.replaceWith(newNode);
                foundWeirdExport = true;
            }
        },
    }
    moduleAst = babel.parse(moduleCodeRaw);
    traverse(moduleAst, moduleTransformer);
    return moduleAst;
}

function makeModuleReadable(moduleId, moduleCodeRaw) {
    moduleAst = babel.parse(moduleCodeRaw);

    const moduleTransformer = {
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
            if (path.node.expression.type == "SequenceExpression") {
                const exprs = path.node.expression.expressions;
                let exprStmts = exprs.map(e => { return babel.types.expressionStatement(e); });
                path.replaceWithMultiple(exprStmts);
                return;
            }
            if (path.node.expression.type == "AssignmentExpression") {
                // handle cases like: `a = (expr1, expr2, expr3)`
                // convert to: `expr1; expr2; a = expr3;`
                if (path.node.expression.right.type == "SequenceExpression") {
                    const exprs = path.node.expression.right.expressions;
                    let exprStmts = exprs.map(e => { return babel.types.expressionStatement(e); });
                    let lastExpr = exprStmts.pop();
                    path.node.expression.right = lastExpr.expression;
                    exprStmts.push(path.node);
                    path.replaceWithMultiple(exprStmts);
                    return;
                }

                // handle cases like: `exports.GoodExplainableName = a;` where `a` is a function or a class
                // rename `a` to `GoodExplainableName` everywhere in the module
                if (path.node.expression.left.type == "MemberExpression" &&
                    path.node.expression.left.object.type == "Identifier" &&
                    path.node.expression.left.object.name == "exports" &&
                    path.node.expression.left.property.type == "Identifier" &&
                    path.node.expression.left.property.name != "default" &&
                    path.node.expression.right.type == "Identifier" &&
                    path.node.expression.right.name.length == 1
                ) {
                    path.scope.rename(
                        path.node.expression.right.name,
                        path.node.expression.left.property.name
                        );
                        return;
                }
            }
            if (path.node.expression.type == "ConditionalExpression") {
                // handle cases like: `<test> ? c : d;`
                // convert to: `if (<test>) { c; } else { d; }`
                const test = path.node.expression.test;
                const consequent = path.node.expression.consequent;
                const alternate = path.node.expression.alternate;

                const ifStmt = babel.types.ifStatement(
                    test,
                    babel.types.blockStatement([babel.types.expressionStatement(consequent)]),
                    babel.types.blockStatement([babel.types.expressionStatement(alternate)])
                );
                path.replaceWith(ifStmt);
                return;
            }
            if (path.node.expression.type == "LogicalExpression") {
                // handle cases like: `a && b;`
                // convert to: `if (a) { b; }`
                const test = path.node.expression.left;
                const consequent = path.node.expression.right;

                const ifStmt = babel.types.ifStatement(
                    test,
                    babel.types.blockStatement([babel.types.expressionStatement(consequent)]),
                    null
                );
                path.replaceWith(ifStmt);
                return;
            }
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
            return;
          }
        }
    }
    traverse(moduleAst, moduleTransformer);

    return moduleAst;
}

function collectModuleDepsAndExports(moduleId, moduleCodeRaw, metadata) {
    moduleAst = babel.parse(moduleCodeRaw);

    metadata["deps"] = [];
    metadata["exports"] = [];

    // assert(moduleAst.type == "ArrowFunctionExpression" || moduleAst.type == "FunctionExpression");
    // assert.equal(moduleAst.body.type, "BlockStatement");

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
            metadata["deps"].push(depId + "");
        }
    }

    function collectExports(moduleArrowFnPath) {
        assert.equal(moduleArrowFnPath.node.type, "ArrowFunctionExpression");

        // ensure the function takes `exports` as an argument
        assert(moduleArrowFnPath.node.params.length >= 2);
        assert.equal(moduleArrowFnPath.node.params[1].name, "exports");

        // find references to `exports`
        const exportsRefPaths = moduleArrowFnPath.scope.bindings.exports.referencePaths;
        for (const exportsRefPath of exportsRefPaths) {
            const exportsMemberExpr = exportsRefPath.parent;
            if (exportsMemberExpr.type != "MemberExpression") {
                let code = generate(exportsMemberExpr).code;
                if (code.indexOf('Object.defineProperty(exports, "__esModule"') == 0) {
                    // ignore
                } else {
                    console.log("WTF", moduleId, code);
                }
                continue;
            }
            assert.equal(exportsMemberExpr.object.name, "exports");
            assert.equal(exportsMemberExpr.property.type, "Identifier");
            const exportName = exportsMemberExpr.property.name;
            if (metadata["exports"].indexOf(exportName) == -1) {
                metadata["exports"].push(exportName);
            }
        }

        // find references to `module.exports`
        // two cases:
        // 1. module.exports.foo = bar
        // 2. module.exports = foo
        const moduleRefPaths = moduleArrowFnPath.scope.bindings.module.referencePaths;
        for (const moduleRefPath of moduleRefPaths) {
            const moduleMemberExpr = moduleRefPath.parent;
            if (moduleMemberExpr.type != "MemberExpression") {
                console.log("WTF2", moduleId, generate(moduleMemberExpr).code);
                continue;
            }
            assert.equal(moduleMemberExpr.object.name, "module");
            assert.equal(moduleMemberExpr.property.type, "Identifier");
            assert.equal(moduleMemberExpr.property.name, "exports");

            // case 1:
            const moduleExportsMemberExpr = moduleRefPath.parentPath.parent;
            if (moduleExportsMemberExpr.type == "MemberExpression" &&
                moduleExportsMemberExpr.property.type == "Identifier" &&
                moduleExportsMemberExpr.object == moduleMemberExpr
            ) {
                const exportName = moduleExportsMemberExpr.property.name;
                if (metadata["exports"].indexOf(exportName) == -1) {
                    metadata["exports"].push(exportName);
                }
            }

            // case 2:
            const moduleExportsAssignmentExpr = moduleRefPath.parentPath.parent;
            if (moduleExportsAssignmentExpr.type == "AssignmentExpression") {
                // case 2.1: module.exports = {foo: bar}
                if (moduleExportsAssignmentExpr.right.type == "ObjectExpression") {
                    for (const prop of moduleExportsAssignmentExpr.right.properties) {
                        assert.equal(prop.type, "ObjectProperty");
                        assert.equal(prop.key.type, "Identifier");
                        const exportName = prop.key.name;
                        if (metadata["exports"].indexOf(exportName) == -1) {
                            metadata["exports"].push(exportName);
                        }
                    }
                }

                // case 2.2: module.exports = foo
                else if (moduleExportsAssignmentExpr.right.type == "Identifier") {
                    const exportName = moduleExportsAssignmentExpr.right.name;
                    if (metadata["exports"].indexOf(exportName) == -1) {
                        metadata["exports"].push("$maybe-default$ " + exportName + " $maybe-default$");
                    }
                }

                // case 2.3: module.exports = function() {}
                else if (moduleExportsAssignmentExpr.right.type == "FunctionExpression") {
                    let exportName = "<anonymouse-function>";
                    if (moduleExportsAssignmentExpr.right.id) {
                        exportName = moduleExportsAssignmentExpr.right.id.name;
                    }
                    if (metadata["exports"].indexOf(exportName) == -1) {
                        metadata["exports"].push("$maybe-default$ " + exportName + " $maybe-default$");
                    }
                }

                // case 2.4: module.exports = ...anything else...
                else {
                    const exportName = "$complex-export$ "
                                        + generate(moduleExportsAssignmentExpr.right).code
                                            .replace("<", "&lt;")
                                            .replace(">", "&gt;")
                                        + " $complex-export$";
                    if (metadata["exports"].indexOf(exportName) == -1) {
                        metadata["exports"].push(exportName);
                    }
                }
            }
        }
    }

    let transformedArrowFn = false;
    const moduleTransformer = {
        ArrowFunctionExpression(path) {
            if (transformedArrowFn) {
                return;
            }

            const node = path.node; // the module's AST

            // at most 3 arguments: module, exports, require
            assert(node.params.length <= 3);
            
            // This renaming is already done in `normalizeExports`.
            // // rename the arguments from (e, t, n) to (module, exports, require)
            // node.params.forEach((param, i) => {
            //     path.scope.rename(param.name, ["module", "exports", "require"][i]);
            // });
            
            if (node.params.length == 3)
                collectDeps(path);
            if (node.params.length >= 2)
                collectExports(path);

            transformedArrowFn = true;
        },
    }
    traverse(moduleAst, moduleTransformer);
    return moduleAst
}

function handleModule(moduleId, moduleAst, metadata) {
    assert(moduleAst.type == "ArrowFunctionExpression" || moduleAst.type == "FunctionExpression");
    assert.equal(moduleAst.body.type, "BlockStatement");

    let moduleCodeRaw = generate(moduleAst).code;

    // Step 1: Convert weird exports into nicer form before we collect exports.
    moduleAst = normalizeExports(moduleId, moduleCodeRaw);

    // Step 2: Prettify the module code.
    moduleCodeRaw = generate(moduleAst).code; // ugly...
    moduleAst = makeModuleReadable(moduleId, moduleCodeRaw);

    // Step 3: Collect exports and dependencies.
    moduleCodeRaw = generate(moduleAst).code; // ugly...
    moduleAst = collectModuleDepsAndExports(moduleId, moduleCodeRaw, metadata);

    // moduleAst = babel.parse(moduleCodeRaw);
    // traverse(moduleAst, moduleTransformer);

    assert (moduleAst.type == "File");
    assert (moduleAst.program.type == "Program");
    assert (moduleAst.program.body.length == 1);
    assert (moduleAst.program.body[0].type == "ExpressionStatement");
    assert (moduleAst.program.body[0].expression.type == "ArrowFunctionExpression");
    assert (moduleAst.program.body[0].expression.body.type == "BlockStatement");

    const mainBody = moduleAst.program.body[0].expression.body.body;
    const moduleCode = generate(babel.types.Program(mainBody)).code;

    const moduleCode2 = prettier.format(moduleCode, {
        parser: "babel",
    }).trim();
    
    fs.writeFileSync(getModulePath(moduleId), moduleCode2);
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

// handle the main module - special case because it's not in the `e` object
const mainModuleId = "main";
const mainModuleAst = babel.parse(mainCode).program.body[0].expression;
moduleDeps[mainModuleId] = {}
handleModule(mainModuleId, mainModuleAst, moduleDeps[mainModuleId]);

// add reverse dependencies
for (const moduleId in moduleDeps) {
    const metadata = moduleDeps[moduleId];
    metadata["importedBy"] = metadata["importedBy"] || [];
    for (const depId of metadata["deps"]) {
        assert (depId in moduleDeps,
                "Module " + moduleId + " depends on " + depId + " but it's not in the list of modules");
        moduleDeps[depId]["importedBy"] = moduleDeps[depId]["importedBy"] || [];
        moduleDeps[depId]["importedBy"].push(moduleId);
    }
}

function removeDups(arr) {
    return [...new Set(arr)];
}
function removeModule(moduleId) {
    if (!moduleDeps[moduleId]) {
        return;
    }

    const importers = moduleDeps[moduleId]["importedBy"];
    for (const importer of importers) {
        if (!moduleDeps[importer]) {
            console.log("WARNING: " + importer + " imports " + moduleId + " but it's not in the list of modules");
            continue;
        }
        
        const metadata = moduleDeps[importer];
        metadata["deps"] = metadata["deps"].filter(dep => dep != moduleId);
    }
    delete moduleDeps[moduleId];
}

const moduleCodes = {};
// add line number info
for (const moduleId in moduleDeps) {
    const metadata = moduleDeps[moduleId];
    const moduleCode = fs.readFileSync(getModulePath(moduleId), "utf8").trim();
    const lines = moduleCode.split("\n");
    metadata["lines"] = lines.length;
    if (lines.length == 1)
    {
        const isEmptyFunction = moduleCode == "module.exports = function () {};"
        const stdLibAliasMatch = moduleCode.match(/^module.exports = require\(("[^"]+")\);?$/);
        const internalAliasMatch = moduleCode.match(/^module.exports = require\(([\d_]+)\);?$/);

        if (isEmptyFunction)
        {
            // it's an empty module. Remove it. We don't want noise.
            removeModule(moduleId);
            console.log("Removing empty module " + moduleId);
            continue;
        } else if (stdLibAliasMatch || internalAliasMatch) {
            // it's an alias to another module. Remove the aliasing and
            // make modules that import it import the original module.
            // we're not doing this recursively because it's not needed for this project.

            const originalModuleId = stdLibAliasMatch ? stdLibAliasMatch[1] : (parseInt(internalAliasMatch[1].replace("_", "")) + "");
            const aliasingModule = moduleId;
            const importers = removeDups(moduleDeps[aliasingModule]["importedBy"]);

            // step 0: update originalModule's importedBy for internal modules
            if (internalAliasMatch) {
                moduleDeps[originalModuleId]["importedBy"] = removeDups(
                    moduleDeps[originalModuleId]["importedBy"].concat(
                        moduleDeps[aliasingModule]["importedBy"]
                    ).filter(x => x != aliasingModule)
                );
            }

            // update the deps and code
            for (const importer of importers) {
                if (!moduleDeps[importer]) {
                    console.log("WARNING: " + importer + " imports " + moduleId + " but it's not in the list of modules");
                    console.log(importers)
                }
                // step 1: update the importers
                const metadata = moduleDeps[importer];
                metadata["deps"] = removeDups(
                    metadata["deps"].map(x => x == aliasingModule ? originalModuleId : x)
                );

                console.log("Renaming " + aliasingModule + " to " + originalModuleId + " in " + importer);
                // step 2: update the code
                const moduleCode = moduleCodes[importer] || fs.readFileSync(getModulePath(importer), "utf8").trim();
                // replace all occurences of `require(aliasingModule)` with `require(originalModule)`
                const pattern = new RegExp(`require\\(${aliasingModule}\\)`, "g");
                assert (moduleCode.match(pattern), "Module " + importer + " imports " + aliasingModule + " but it's not in the code");
                const newModuleCode = moduleCode.replace(
                    pattern,
                    `require(${originalModuleId})`
                );
                fs.writeFileSync(getModulePath(importer), newModuleCode);
                moduleCodes[importer] = newModuleCode;
            }

            // finally remove the aliasing module
            delete moduleDeps[moduleId];
            console.log("Removing aliasing module " + moduleId + " (aliasing " + originalModuleId + ")");
            continue;
        }
    }
    // if it's not an empty/alias module, add it to the list of modules
    moduleCodes[moduleId] = moduleCode;
}

// write the module dependency graph
fs.writeFileSync(
    path.join(outPath, "module_deps.js"),
    "let module_deps_data = " + JSON.stringify(moduleDeps, null, 2),
);

// write the module codes
fs.writeFileSync(
    path.join(outPath, "module_codes.js"),
    "let module_codes_data = " + JSON.stringify(moduleCodes, null, 2),
);