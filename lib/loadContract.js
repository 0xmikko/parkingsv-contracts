"use strict";
var _a = require("./scryptlib"), bsv = _a.bsv, compile = _a.compile;
var exit = require("process").exit;
var path = require("path");
var _b = require("fs"), readFileSync = _b.readFileSync, existsSync = _b.existsSync;
function compileContract(fileName) {
    var filePath = path.join(__dirname, "../contracts", fileName);
    console.log("Compiling contract " + filePath + " ...");
    var result = compile({ path: filePath }, { desc: true, outputDir: path.join(__dirname, "../build") });
    if (result.errors.length > 0) {
        console.log("Contract " + filePath + " compiling failed with errors:");
        console.log(result.errors);
        throw result.errors;
    }
    return result;
}
function loadDesc(fileName) {
    var filePath = path.join(__dirname, "../build/" + fileName);
    if (!existsSync(filePath)) {
        throw new Error("Description file " + filePath + " not exist!\nIf You already run 'npm run watch', maybe fix the compile error first!");
    }
    return JSON.parse(readFileSync(filePath).toString());
}
module.exports = {
    compileContract: compileContract,
    loadDesc: loadDesc,
};
//# sourceMappingURL=loadContract.js.map