"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compilerVersion = exports.compile = exports.DebugModeTag = exports.CompileErrorType = void 0;
var path_1 = require("path");
var child_process_1 = require("child_process");
var fs_1 = require("fs");
var ts_optchain_1 = require("ts-optchain");
var abi_1 = require("./abi");
var md5 = require("md5");
var SYNTAX_ERR_REG = /(?<filePath>[^\s]+):(?<line>\d+):(?<column>\d+):\n([^\n]+\n){3}(unexpected (?<unexpected>[^\n]+)\nexpecting (?<expecting>[^\n]+)|(?<message>[^\n]+))/g;
var SEMANTIC_ERR_REG = /Error:\s*(?<filePath>[^\s]+):(?<line>\d+):(?<column>\d+)\n(?<message>[^\n]+)\n/g;
var IMPORT_ERR_REG = /Syntax error:\s*(?<filePath>[^\s]+):(?<line>\d+):(?<column>\d+):\n([^\n]+\n){3}File not found: (?<fileName>[^\s]+)/g;
var CompileErrorType;
(function (CompileErrorType) {
    CompileErrorType["SyntaxError"] = "SyntaxError";
    CompileErrorType["SemanticError"] = "SemanticError";
    CompileErrorType["ImportError"] = "ImportError";
})(CompileErrorType = exports.CompileErrorType || (exports.CompileErrorType = {}));
var DebugModeTag;
(function (DebugModeTag) {
    DebugModeTag["FuncStart"] = "F0";
    DebugModeTag["FuncEnd"] = "F1";
    DebugModeTag["LoopStart"] = "L0";
})(DebugModeTag = exports.DebugModeTag || (exports.DebugModeTag = {}));
function compile(source, settings) {
    var _a;
    if (settings === void 0) { settings = {
        asm: true,
        debug: true
    }; }
    var sourcePath = source.path;
    var srcDir = path_1.dirname(sourcePath);
    var sourceFileName = path_1.basename(sourcePath);
    var outputDir = settings.outputDir || srcDir;
    var outputFiles = {};
    try {
        var sourceContent = source.content !== undefined ? source.content : fs_1.readFileSync(sourcePath, 'utf8');
        var cmd = "npx --no-install scryptc compile " + (settings.asm || settings.desc ? '--asm' : '') + " " + (settings.ast || settings.desc ? '--ast' : '') + " " + (settings.debug == false ? '' : '--debug') + " -r -o \"" + outputDir + "\" " + (settings.cmdArgs ? settings.cmdArgs : '');
        var output = child_process_1.execSync(cmd, { input: sourceContent, cwd: srcDir }).toString();
        if (output.startsWith('Error:')) {
            if (output.includes('import') && output.includes('File not found')) {
                var importErrors = __spread(output.matchAll(IMPORT_ERR_REG)).map(function (match) {
                    var filePath = ts_optchain_1.oc(match.groups).filePath('');
                    return {
                        type: CompileErrorType.ImportError,
                        filePath: getFullFilePath(filePath, srcDir, sourceFileName),
                        message: "Imported file " + ts_optchain_1.oc(match.groups).fileName() + " does not exist",
                        position: {
                            line: parseInt(ts_optchain_1.oc(match.groups).line('-1')),
                            column: parseInt(ts_optchain_1.oc(match.groups).column('-1')),
                        },
                        file: ts_optchain_1.oc(match.groups).fileName('')
                    };
                });
                return {
                    errors: importErrors
                };
            }
            else if (output.includes('Syntax error:')) {
                var syntaxErrors = __spread(output.matchAll(SYNTAX_ERR_REG)).map(function (match) {
                    var filePath = ts_optchain_1.oc(match.groups).filePath('');
                    var unexpected = ts_optchain_1.oc(match.groups).unexpected('');
                    var expecting = ts_optchain_1.oc(match.groups).expecting('');
                    return {
                        type: CompileErrorType.SyntaxError,
                        filePath: getFullFilePath(filePath, srcDir, sourceFileName),
                        position: {
                            line: parseInt(ts_optchain_1.oc(match.groups).line('-1')),
                            column: parseInt(ts_optchain_1.oc(match.groups).column('-1')),
                        },
                        message: ts_optchain_1.oc(match.groups).message("unexpected " + unexpected + "\nexpecting " + expecting),
                        unexpected: unexpected,
                        expecting: expecting,
                    };
                });
                return {
                    errors: syntaxErrors
                };
            }
            else {
                var semanticErrors = __spread(output.matchAll(SEMANTIC_ERR_REG)).map(function (match) {
                    var filePath = ts_optchain_1.oc(match.groups).filePath('');
                    return {
                        type: CompileErrorType.SemanticError,
                        filePath: getFullFilePath(filePath, srcDir, sourceFileName),
                        position: {
                            line: parseInt(ts_optchain_1.oc(match.groups).line('-1')),
                            column: parseInt(ts_optchain_1.oc(match.groups).column('-1')),
                        },
                        message: ts_optchain_1.oc(match.groups).message('')
                    };
                });
                return {
                    errors: semanticErrors
                };
            }
        }
        var result = { errors: [] };
        if (settings.ast || settings.desc) {
            var outputFilePath = getOutputFilePath(outputDir, 'ast');
            outputFiles['ast'] = outputFilePath;
            var allAst_1 = addSourceLocation(JSON.parse(fs_1.readFileSync(outputFilePath, 'utf8')), srcDir);
            result.ast = allAst_1['stdin'];
            result.dependencyAsts = Object.keys(allAst_1)
                .filter(function (k) { return k !== 'stdin'; })
                .reduce(function (res, key) {
                if (key === 'std') {
                    res[key] = allAst_1[key];
                }
                else {
                    res[path_1.join(srcDir, key)] = allAst_1[key];
                }
                return res;
            }, {});
        }
        if (settings.asm || settings.desc) {
            var outputFilePath = getOutputFilePath(outputDir, 'asm');
            outputFiles['asm'] = outputFilePath;
            if (settings.debug == false) {
                result.asm = fs_1.readFileSync(outputFilePath, 'utf8');
            }
            else {
                var asmObj = JSON.parse(fs_1.readFileSync(outputFilePath, 'utf8'));
                var sources_1 = asmObj.sources.map(function (s) {
                    return path_1.join(srcDir, s);
                });
                result.debugAsm = asmObj.output.map(function (item) {
                    var match = /^(?<fileIndex>-?\d+):(?<line>\d+):(?<col>\d+):(?<endLine>\d+):(?<endCol>\d+)(#(?<tagStr>.+))?/.exec(item.src);
                    if (match && match.groups) {
                        var fileIndex = parseInt(match.groups.fileIndex);
                        var debugTag = void 0;
                        var tagStr = match.groups.tagStr;
                        if (/\w+\.\w+:0/.test(tagStr)) {
                            debugTag = DebugModeTag.FuncStart;
                        }
                        if (/\w+\.\w+:1/.test(tagStr)) {
                            debugTag = DebugModeTag.FuncEnd;
                        }
                        if (/loop:0/.test(tagStr)) {
                            debugTag = DebugModeTag.LoopStart;
                        }
                        return {
                            file: fileIndex > -1 ? sources_1[fileIndex] : undefined,
                            line: sources_1[fileIndex] ? parseInt(match.groups.line) : undefined,
                            endLine: sources_1[fileIndex] ? parseInt(match.groups.endLine) : undefined,
                            column: sources_1[fileIndex] ? parseInt(match.groups.col) : undefined,
                            endColumn: sources_1[fileIndex] ? parseInt(match.groups.endCol) : undefined,
                            opcode: item.opcode,
                            stack: item.stack,
                            debugTag: debugTag
                        };
                    }
                    throw new Error('Compile Failed: Asm output parsing Error!');
                });
                result.asm = (_a = result === null || result === void 0 ? void 0 : result.debugAsm) === null || _a === void 0 ? void 0 : _a.map(function (item) { return item["opcode"].trim(); }).join(' ');
            }
        }
        if (settings.desc) {
            settings.outputToFiles = true;
            var _b = getABIDeclaration(result.ast), name = _b.contract, abi = _b.abi;
            var outputFilePath = getOutputFilePath(outputDir, 'desc');
            outputFiles['desc'] = outputFilePath;
            var description = {
                compilerVersion: compilerVersion(),
                contract: name,
                md5: md5(sourceContent),
                abi: abi,
                asm: result.asm || ""
            };
            fs_1.writeFileSync(outputFilePath, JSON.stringify(description, null, 4));
            result.compilerVersion = description.compilerVersion;
            result.contract = description.contract;
            result.md5 = description.md5;
            result.abi = abi;
        }
        return result;
    }
    finally {
        if (settings.outputToFiles) {
            Object.keys(outputFiles).forEach(function (outputType) {
                var file = outputFiles[outputType];
                if (fs_1.existsSync(file)) {
                    if (settings[outputType]) {
                        // rename all output files
                        fs_1.rename(file, file.replace('stdin', path_1.basename(sourcePath, '.scrypt')), function () { return; });
                    }
                    else {
                        fs_1.unlinkSync(file);
                    }
                }
            });
        }
        else {
            // cleanup all output files
            Object.values(outputFiles).forEach(function (file) {
                if (fs_1.existsSync(file)) {
                    fs_1.unlinkSync(file);
                }
            });
        }
    }
}
exports.compile = compile;
function compilerVersion() {
    var text = child_process_1.execSync("npx --no-install scryptc version").toString();
    // @ts-ignore
    return /Version:\s*([^\s]+)\s*/.exec(text)[1];
}
exports.compilerVersion = compilerVersion;
function addSourceLocation(astRoot, basePath) {
    for (var fileName in astRoot) {
        var path = fileName === 'std' ? null : path_1.join(basePath, fileName);
        astRoot[fileName] = _addSourceLocationProperty(astRoot[fileName], path);
    }
    return astRoot;
}
function _addSourceLocationProperty(astObj, path) {
    if (!(astObj instanceof Object)) {
        return astObj;
    }
    for (var field in astObj) {
        var value = astObj[field];
        if (field === 'src') {
            var matches = /:(\d+):(\d+):(\d+):(\d+)/.exec(value);
            if (!matches) {
                astObj.loc = null;
            }
            else {
                astObj.loc = {
                    source: path,
                    start: { line: parseInt(matches[1]), column: parseInt(matches[2]) },
                    end: { line: parseInt(matches[3]), column: parseInt(matches[4]) }
                };
            }
            delete astObj['src'];
        }
        else if (value instanceof Object) {
            _addSourceLocationProperty(value, path);
        }
    }
    return astObj;
}
function getOutputFilePath(baseDir, target) {
    return path_1.join(baseDir, "stdin_" + target + ".json");
}
function getFullFilePath(relativePath, baseDir, curFileName) {
    if (relativePath.endsWith('stdin')) {
        return path_1.join(baseDir, curFileName); // replace 'stdin' with real current compiling file name.
    }
    return path_1.join(baseDir, relativePath);
}
function getABIDeclaration(astRoot) {
    var mainContract = astRoot["contracts"][astRoot["contracts"].length - 1];
    var pubIndex = 0;
    var interfaces = mainContract['functions']
        .filter(function (f) { return f['visibility'] === 'Public'; })
        .map(function (f) {
        var entity = {
            type: abi_1.ABIEntityType.FUNCTION,
            name: f['name'],
            index: f['nodeType'] === 'Constructor' ? undefined : pubIndex++,
            params: f['params'].map(function (p) { return { name: p['name'], type: p['type'] }; }),
        };
        return entity;
    });
    // explict constructor
    if (mainContract['construcotr']) {
        interfaces.push({
            type: abi_1.ABIEntityType.CONSTRUCTOR,
            name: 'constructor',
            params: mainContract['construcotr']['params'].map(function (p) { return { name: p['name'], type: p['type'] }; }),
        });
    }
    else {
        // implicit constructor
        if (mainContract['properties']) {
            interfaces.push({
                type: abi_1.ABIEntityType.CONSTRUCTOR,
                name: 'constructor',
                params: mainContract['properties'].map(function (p) { return { name: p['name'].replace('this.', ''), type: p['type'] }; }),
            });
        }
    }
    return {
        contract: mainContract['name'],
        abi: interfaces
    };
}
//# sourceMappingURL=compilerWrapper.js.map