"use strict";
const { bsv, compile } = require("scryptlib");
const { exit } = require("process");
const path = require("path");
const { readFileSync, existsSync } = require("fs");
function compileContract(fileName) {
    const filePath = path.join(__dirname, "../contracts", fileName);
    console.log(`Compiling contract ${filePath} ...`);
    const result = compile({ path: filePath }, { desc: true, outputDir: path.join(__dirname, "../build") });
    if (result.errors.length > 0) {
        console.log(`Contract ${filePath} compiling failed with errors:`);
        console.log(result.errors);
        throw result.errors;
    }
    return result;
}
function loadDesc(fileName) {
    const filePath = path.join(__dirname, `../build/${fileName}`);
    if (!existsSync(filePath)) {
        throw new Error(`Description file ${filePath} not exist!\nIf You already run 'npm run watch', maybe fix the compile error first!`);
    }
    return JSON.parse(readFileSync(filePath).toString());
}
module.exports = {
    compileContract,
    loadDesc,
};
//# sourceMappingURL=loadContract.node.js.map