"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.VerificationError = exports.buildContractClass = exports.AbstractContract = void 0;
var abi_1 = require("./abi");
var utils_1 = require("./utils");
var AbstractContract = /** @class */ (function () {
    function AbstractContract() {
    }
    Object.defineProperty(AbstractContract.prototype, "lockingScript", {
        get: function () {
            var lsASM = this.scriptedConstructor.toASM();
            if (this._dataLoad !== undefined) {
                lsASM += " OP_RETURN " + this._dataLoad;
            }
            return utils_1.bsv.Script.fromASM(lsASM.trim());
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractContract.prototype, "txContext", {
        get: function () {
            // @ts-ignore
            return this._txContext;
        },
        set: function (txContext) {
            this._txContext = txContext;
        },
        enumerable: false,
        configurable: true
    });
    AbstractContract.prototype.run_verify = function (unlockingScriptASM, txContext) {
        var txCtx = Object.assign({}, this._txContext || {}, txContext || {});
        var us = utils_1.bsv.Script.fromASM(unlockingScriptASM);
        var ls = this.lockingScript;
        var tx = txCtx.tx || (txCtx.hex ? new utils_1.bsv.Transaction(txCtx.hex) : null);
        var inputIndex = txCtx.inputIndex || 0;
        var flags = txCtx.sighashFlags || utils_1.DEFAULT_FLAGS;
        var inputSatoshis = txCtx.inputSatoshis || 0;
        var si = utils_1.bsv.Script.Interpreter();
        // @ts-ignore
        var result = si.verify(us, ls, tx, inputIndex, flags, new utils_1.bsv.crypto.BN(inputSatoshis));
        if (!result) {
            // @ts-ignore
            throw new VerificationError("failed to verify due to " + si.errstr, {
                'lockingScriptASM': ls.toASM(),
                'unlockingScriptASM': us.toASM(),
                'txHex': tx ? tx.toString('hex') : undefined,
                inputIndex: inputIndex,
                flags: flags,
                inputSatoshis: inputSatoshis
            });
        }
        return true;
    };
    Object.defineProperty(AbstractContract.prototype, "dataLoad", {
        // @ts-ignore
        get: function () {
            return this._dataLoad || '';
        },
        // @ts-ignore
        set: function (dataInHex) {
            if (dataInHex === undefined || dataInHex === null) {
                this._dataLoad = undefined;
            }
            else {
                this._dataLoad = dataInHex.trim();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractContract.prototype, "codePart", {
        get: function () {
            return this.scriptedConstructor.lockingScript;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractContract.prototype, "dataPart", {
        get: function () {
            if (this._dataLoad !== undefined && this._dataLoad !== null) {
                return utils_1.bsv.Script.fromASM(this._dataLoad);
            }
            return undefined;
        },
        enumerable: false,
        configurable: true
    });
    return AbstractContract;
}());
exports.AbstractContract = AbstractContract;
var ContractClass = /** @class */ (function (_super) {
    __extends(ContractClass, _super);
    function ContractClass() {
        var _a;
        var ctorParams = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ctorParams[_i] = arguments[_i];
        }
        var _this = _super.call(this) || this;
        _this.scriptedConstructor = (_a = ContractClass.abiCoder).encodeConstructorCall.apply(_a, __spread([_this, ContractClass.asm], ctorParams));
        return _this;
    }
    return ContractClass;
}(AbstractContract));
;
function buildContractClass(desc) {
    if (!desc.contract) {
        throw new Error('missing field `contract` in description');
    }
    if (!desc.abi) {
        throw new Error('missing field `abi` in description');
    }
    if (!desc.asm) {
        throw new Error('missing field `asm` in description');
    }
    ContractClass.contracName = desc.contract;
    ContractClass.abi = desc.abi;
    ContractClass.asm = desc.asm;
    ContractClass.abiCoder = new abi_1.ABICoder(desc.abi);
    ContractClass.abi.forEach(function (entity) {
        ContractClass.prototype[entity.name] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return ContractClass.abiCoder.encodePubFunctionCall(this, entity.name, args);
        };
    });
    return ContractClass;
}
exports.buildContractClass = buildContractClass;
var VerificationError = /** @class */ (function (_super) {
    __extends(VerificationError, _super);
    function VerificationError(message, context) {
        var _this = _super.call(this, message) || this;
        _this.message = message;
        _this.context = context;
        return _this;
    }
    VerificationError.prototype.toString = function () {
        return "Error: " + this.message;
    };
    return VerificationError;
}(Error));
exports.VerificationError = VerificationError;
//# sourceMappingURL=contract.js.map