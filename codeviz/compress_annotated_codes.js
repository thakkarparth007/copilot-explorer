// This is a simple script to collect all files under ./data/manually_annotated_modules and compress them into a single file ./data/annotated_module_codes.js (similar to ./data/module_codes.js)

const fs = require("fs");
const path = require("path");

const inputModulesDir = path.join(__dirname, "data", "manually_annotated_modules");
const outputFile = path.join(__dirname, "data", "annotated_module_codes.js");

const files = fs.readdirSync(inputModulesDir);
const output = {};

for (const file of files) {
    const filePath = path.join(inputModulesDir, file);
    const moduleCode = fs.readFileSync(filePath, "utf8");
    // output["<id>"] = "<code>";
    const id = file.replace(".js", "");
    output[id] = moduleCode;
}

const outputStr = "let annotated_module_codes_data = " + JSON.stringify(output, null, 4);
fs.writeFileSync(outputFile, outputStr);
