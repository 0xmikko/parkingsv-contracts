"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ABICoder = exports.FunctionCall = exports.ABIEntityType = void 0;
var ts_optchain_1 = require("ts-optchain");
var utils_1 = require("./utils");
var scryptTypes_1 = require("./scryptTypes");
var ABIEntityType;
(function (ABIEntityType) {
    ABIEntityType["FUNCTION"] = "function";
    ABIEntityType["CONSTRUCTOR"] = "constructor";
})(ABIEntityType = exports.ABIEntityType || (exports.ABIEntityType = {}));
var FunctionCall = /** @class */ (function () {
    function FunctionCall(methodName, params, binding) {
        this.methodName = methodName;
        this.params = params;
        if (binding.lockingScriptASM === undefined && binding.unlockingScriptASM === undefined) {
            throw new Error("param binding.lockingScriptASM & binding.unlockingScriptASM cannot both be empty");
        }
        this.contract = binding.contract;
        if (binding.lockingScriptASM) {
            this.lockingScript = utils_1.bsv.Script.fromASM(binding.lockingScriptASM);
        }
        if (binding.unlockingScriptASM) {
            this.unlockingScript = utils_1.bsv.Script.fromASM(binding.unlockingScriptASM);
        }
    }
    FunctionCall.prototype.toASM = function () {
        if (this.lockingScript) {
            return this.lockingScript.toASM();
        }
        else {
            // @ts-ignore
            return this.unlockingScript.toASM();
        }
    };
    FunctionCall.prototype.toString = function () {
        return this.toHex();
    };
    FunctionCall.prototype.toScript = function () {
        return utils_1.bsv.Script.fromASM(this.toASM());
    };
    FunctionCall.prototype.toHex = function () {
        return this.toScript().toHex();
    };
    FunctionCall.prototype.verify = function (txContext) {
        if (this.unlockingScript) {
            return this.contract.run_verify(this.unlockingScript.toASM(), txContext);
        }
        throw new Error("verification failed, missing unlockingScript");
    };
    return FunctionCall;
}());
exports.FunctionCall = FunctionCall;
var ABICoder = /** @class */ (function () {
    function ABICoder(abi) {
        this.abi = abi;
    }
    ABICoder.prototype.encodeConstructorCall = function (contract, asmTemplate) {
        var _this = this;
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var constructorABI = this.abi.filter(function (entity) { return entity.type === ABIEntityType.CONSTRUCTOR; })[0];
        var cParams = ts_optchain_1.oc(constructorABI).params([]);
        if (args.length !== cParams.length) {
            throw new Error("wrong arguments length for #constructor, expected " + cParams.length + " but got " + args.length);
        }
        var lsASM = asmTemplate;
        cParams.forEach(function (param, index) {
            if (!asmTemplate.includes("$" + param.name)) {
                throw new Error("abi constructor params mismatch with args provided: missing " + param.name + " in asm tempalte");
            }
            lsASM = lsASM.replace("$" + param.name, _this.encodeParam(args[index], param.type));
        });
        return new FunctionCall('constructor', args, { contract: contract, lockingScriptASM: lsASM });
    };
    ABICoder.prototype.encodePubFunctionCall = function (contract, name, args) {
        var e_1, _a;
        try {
            for (var _b = __values(this.abi), _c = _b.next(); !_c.done; _c = _b.next()) {
                var entity = _c.value;
                if (entity.name === name) {
                    if (entity.params.length !== args.length) {
                        throw new Error("wrong arguments length for #" + name + ", expected " + entity.params.length + " but got " + args.length);
                    }
                    var asm = this.encodeParams(args, entity.params.map(function (p) { return p.type; }));
                    if (this.abi.length > 2 && entity.index !== undefined) {
                        var pubFuncIndex = entity.index + 1;
                        asm += " " + utils_1.int2Asm(pubFuncIndex.toString());
                    }
                    return new FunctionCall(name, args, { contract: contract, unlockingScriptASM: asm });
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        throw new Error("no function named '" + name + "' found in abi");
    };
    ABICoder.prototype.encodeParams = function (args, scryptTypeNames) {
        var _this = this;
        if (args.length !== scryptTypeNames.length) {
            throw new Error("wrong arguments length, expected " + scryptTypeNames.length + " but got " + args.length);
        }
        return args.map(function (arg, i) {
            return _this.encodeParam(arg, scryptTypeNames[i]);
        }).join(' ');
    };
    ABICoder.prototype.encodeParam = function (arg, scryptTypeName) {
        var typeofArg = typeof arg;
        if (typeofArg === 'boolean') {
            arg = new scryptTypes_1.Bool(arg);
        }
        if (typeofArg === 'number') {
            arg = new scryptTypes_1.Int(arg);
        }
        if (typeofArg === 'bigint') {
            arg = new scryptTypes_1.Int(arg);
        }
        if (arg.constructor.name.toLowerCase() !== scryptTypeName.toLowerCase()) {
            throw new Error("wrong argument type, expected " + scryptTypeName + " but got " + arg.constructor.name);
        }
        return arg.toASM();
    };
    return ABICoder;
}());
exports.ABICoder = ABICoder;
//# sourceMappingURL=abi.js.map