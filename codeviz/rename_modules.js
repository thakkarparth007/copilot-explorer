/**
 * @fileoverview
 * This script renames the modules as per the mix of gold and predicted annotations.
 */

const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');

const babel = require('@babel/core');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

const prettier = require("prettier"); // unfortunately, we've to redo this....

const rootPath = path.join(__dirname, "muse/github.copilot-1.57.7193/dist");
const data_dir = path.join(__dirname, 'data');

let goldAnnotationsRaw = fs.readFileSync(path.join(data_dir, 'gold_annotations.js'), 'utf8');
let goldAnnotations = JSON.parse(goldAnnotationsRaw.replace("let gold_annotations = ", ""));
let predictedAnnotationsRaw = fs.readFileSync(path.join(data_dir, 'predicted_annotations.js'), 'utf8');
let predictedAnnotations = JSON.parse(predictedAnnotationsRaw.replace("let predicted_annotations = ", ""));

function mergeAnnotations(gold, pred) {
    let merged = {};
    for (let [moduleId, predAnnotations] of Object.entries(pred)) {
        let goldKey = "module-annotations-" + moduleId;
        let goldAnnotations = gold[goldKey] || {};

        merged[goldKey] = {
            "name": goldAnnotations.name || predAnnotations.name[0],
            "category": goldAnnotations.category || predAnnotations.category[0],
            "isNameGold": !!goldAnnotations.name,
            "isCategoryGold": !!goldAnnotations.category,
            // for debugging:
            "predictedNames": predAnnotations.name,
            "predictedCategories": predAnnotations.category,
        }
    }

    return merged;
}

let mergedAnnotations = mergeAnnotations(goldAnnotations, predictedAnnotations);

// now go through each module code file, rename imports.
// simplify reading by just reading module_codes.js
let moduleCodesRaw = fs.readFileSync(path.join(data_dir, 'module_codes.js'), 'utf8');
let moduleDepsRaw = fs.readFileSync(path.join(data_dir, 'module_deps.js'), 'utf8');
let moduleCodes = JSON.parse(moduleCodesRaw.replace("let module_codes_data = ", ""));
let moduleDeps = JSON.parse(moduleDepsRaw.replace("let module_deps_data = ", ""));

function renameImportsHelper(left, requireCall, scope, mergedAnnotations) {
    // left is the identifier of the variable that is assigned the require call - may be null
    // requireCall is the require call node
    // scope is the scope of the require call
    // mergedAnnotations is the merged annotations object
    let importedModule = requireCall.arguments[0].value.toString();
    let annotations = mergedAnnotations["module-annotations-" + importedModule];
    if (!annotations) {
        if (/^[\d_]+$/.test(importedModule)) {
            // only show warning for numeric modules
            console.log(`WARNING: no annotations for module ${importedModule}`);
            return;
        } else {
            // for non-numeric modules, just rename the import variable
            annotations = { name: importedModule, isNameGold: true };
        }
    }
    let name = annotations.name;
    let isNameGold = annotations.isNameGold;
    
    let importVarName = "M_" + name.replace(/-/g, "_");
    if (!isNameGold) {
        importVarName += "_maybe";
    }
    // console.log(left.name, importVarName);
    if (left) {
        scope.rename(left.name, importVarName);
    }
    requireCall.arguments[0] = babel.types.stringLiteral(name);

    // This code can identify which properties of the imported module are used.
    // For now I'm not using it, but it might be useful in the future.

    // let refs = scope.bindings[left.name].referencePaths;
    // for (const ref of refs) {
    //     if (ref.parentPath.node.type == "MemberExpression") {
    //         const prop = ref.parentPath.node.property;
    //         if (prop.type == "Identifier") {
    //             console.log("> ", left.name, prop.name);
    //             if (ref.parentPath.parentPath.node.type == "CallExpression") {
    //                 // get identifier args
    //                 let args = ref.parentPath.parentPath.node.arguments.filter(n => n.type == "Identifier");
    //                 console.log(args.map(a => a.name));
    //             }
    //         } else {
    //             console.log("prop is not an identifier", prop.type);
    //             console.log("Code:\n" + generate(ref.parentPath.node).code + "\n-----");
    //             throw new Error("prop is not an identifier");
    //         }
    //     }
    // }

    return importedModule;
}

function renameImportsOfModule(moduleId, moduleCode, moduleImportIds, mergedAnnotations) {
    // step 1: parse the module code into an AST
    // step 2: find all import statements and apply renaming
    // step 3: serialize the AST back into code

    // step 1: parse the module code into an AST
    let ast = babel.parse(moduleCode);
    let renamedModules = [];
    traverse(ast, {
        CallExpression(path) {
            const { node, scope } = path;
            if (node.callee.type == "Identifier" && node.callee.name == "require") {
                if (path.parent.type == "VariableDeclarator") {
                    let left = path.parent.id;
                    if (left.type == "Identifier") {
                        renamedModules.push(renameImportsHelper(left, node, scope, mergedAnnotations));
                    } else {
                        // console.log("left is not an identifier" + generate(left).code + " for module " + moduleId);
                        console.log(`INFO: module ${moduleId} has a require call that is not assigned to a variable. This is not supported. Code:\n${generate(path.parent).code}\n-----`);
                        renamedModules.push(renameImportsHelper(null, node, scope, mergedAnnotations));
                    }
                } else if (path.parent.type == "AssignmentExpression") {
                    let left = path.parent.left;
                    if (left.type == "Identifier") {
                        renamedModules.push(renameImportsHelper(left, node, scope, mergedAnnotations));
                    } else {
                        console.log(`INFO: module ${moduleId} has a require call that is not assigned to a variable. This is not supported. Code:\n${generate(path.parent).code}\n-----`);
                        renamedModules.push(renameImportsHelper(null, node, scope, mergedAnnotations));
                    }
                } else {
                    console.log(`INFO: module ${moduleId} Unsupported structure. Just renaming the required module. Code:\n${generate(path.parent).code}\n-----`);
                    renamedModules.push(renameImportsHelper(null, node, scope, mergedAnnotations));
                }
            }
        }
    });

    // print un-renamed modules
    for (let importId of moduleImportIds) {
        importId = importId.replace(/"/g, ""); // ugly thing, needed because dep extraction code was careless
        if (!renamedModules.includes(importId)) {
            console.log(`WARNING: module ${moduleId} has an import that is not renamed: ${importId}`);
        }
    }

    // step 3: serialize the AST back into code
    let code = generate(ast).code;
    return prettier.format(code, { parser: "babel" }); // pains me to do this...
}

let moduleCodes2 = {};
for (let [moduleId, moduleDepsEntry] of Object.entries(moduleDeps)) {
    let moduleCode = moduleCodes[moduleId];
    let moduleImportIds = moduleDepsEntry.deps;
    let renamedCode = renameImportsOfModule(moduleId, moduleCode, moduleImportIds, mergedAnnotations);
    fs.writeFileSync(path.join(data_dir, 'module_codes_renamed', moduleId + '.js'), renamedCode);

    moduleCodes2[moduleId] = renamedCode;
}

// write out the merged annotations
fs.writeFileSync(
    path.join(data_dir, 'gold_and_predicted_annotations.js'),
    "let gold_and_predicted_annotations = " + JSON.stringify(mergedAnnotations, null, 2)
);

// write out the renamed module codes
fs.writeFileSync(
    path.join(data_dir, 'module_codes_renamed.js'),
    "let module_codes_data = " + JSON.stringify(moduleCodes2, null, 2)
);