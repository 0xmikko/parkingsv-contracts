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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpCodeType = exports.SigHashType = exports.Sha256 = exports.Sha1 = exports.Ripemd160 = exports.Sig = exports.PubKey = exports.PrivKey = exports.Bytes = exports.Bool = exports.Int = exports.ScryptType = void 0;
var utils_1 = require("./utils");
var ScryptType = /** @class */ (function () {
    function ScryptType(value) {
        try {
            this._value = value;
            this._literal = this.toLiteral();
            var _a = __read(utils_1.literal2Asm(this._literal), 2), asm = _a[0], scrType = _a[1];
            if (this.constructor.name.toLowerCase() !== scrType.toLowerCase()) {
                throw new Error("type mismatch " + scrType + " for " + this.constructor.name);
            }
            this._asm = asm;
        }
        catch (error) {
            throw new Error("constructor param for " + this.constructor.name + " " + error.message);
        }
    }
    Object.defineProperty(ScryptType.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScryptType.prototype, "literal", {
        get: function () {
            return this._literal;
        },
        enumerable: false,
        configurable: true
    });
    ScryptType.prototype.toASM = function () {
        return this._asm;
    };
    return ScryptType;
}());
exports.ScryptType = ScryptType;
var Int = /** @class */ (function (_super) {
    __extends(Int, _super);
    function Int(intVal) {
        return _super.call(this, intVal) || this;
    }
    Int.prototype.toLiteral = function () {
        return this._value.toString();
    };
    return Int;
}(ScryptType));
exports.Int = Int;
var Bool = /** @class */ (function (_super) {
    __extends(Bool, _super);
    function Bool(boolVal) {
        return _super.call(this, boolVal) || this;
    }
    Bool.prototype.toLiteral = function () {
        return this._value.toString();
    };
    return Bool;
}(ScryptType));
exports.Bool = Bool;
var Bytes = /** @class */ (function (_super) {
    __extends(Bytes, _super);
    function Bytes(bytesVal) {
        return _super.call(this, bytesVal) || this;
    }
    Bytes.prototype.toLiteral = function () {
        return "b'" + utils_1.getValidatedHexString(this._value.toString()) + "'";
    };
    return Bytes;
}(ScryptType));
exports.Bytes = Bytes;
var PrivKey = /** @class */ (function (_super) {
    __extends(PrivKey, _super);
    function PrivKey(intVal) {
        return _super.call(this, intVal) || this;
    }
    PrivKey.prototype.toLiteral = function () {
        return "PrivKey(" + this._value + ")";
    };
    return PrivKey;
}(ScryptType));
exports.PrivKey = PrivKey;
var PubKey = /** @class */ (function (_super) {
    __extends(PubKey, _super);
    function PubKey(bytesVal) {
        return _super.call(this, bytesVal) || this;
    }
    PubKey.prototype.toLiteral = function () {
        return "PubKey(b'" + utils_1.getValidatedHexString(this._value.toString()) + "')";
    };
    return PubKey;
}(ScryptType));
exports.PubKey = PubKey;
var Sig = /** @class */ (function (_super) {
    __extends(Sig, _super);
    function Sig(bytesVal) {
        return _super.call(this, bytesVal) || this;
    }
    Sig.prototype.toLiteral = function () {
        return "Sig(b'" + utils_1.getValidatedHexString(this._value.toString()) + "')";
    };
    return Sig;
}(ScryptType));
exports.Sig = Sig;
var Ripemd160 = /** @class */ (function (_super) {
    __extends(Ripemd160, _super);
    function Ripemd160(bytesVal) {
        return _super.call(this, bytesVal) || this;
    }
    Ripemd160.prototype.toLiteral = function () {
        return "Ripemd160(b'" + utils_1.getValidatedHexString(this._value.toString()) + "')";
    };
    return Ripemd160;
}(ScryptType));
exports.Ripemd160 = Ripemd160;
var Sha1 = /** @class */ (function (_super) {
    __extends(Sha1, _super);
    function Sha1(bytesVal) {
        return _super.call(this, bytesVal) || this;
    }
    Sha1.prototype.toLiteral = function () {
        return "Sha1(b'" + utils_1.getValidatedHexString(this._value.toString()) + "')";
    };
    return Sha1;
}(ScryptType));
exports.Sha1 = Sha1;
var Sha256 = /** @class */ (function (_super) {
    __extends(Sha256, _super);
    function Sha256(bytesVal) {
        return _super.call(this, bytesVal) || this;
    }
    Sha256.prototype.toLiteral = function () {
        return "Sha256(b'" + utils_1.getValidatedHexString(this._value.toString()) + "')";
    };
    return Sha256;
}(ScryptType));
exports.Sha256 = Sha256;
var SigHashType = /** @class */ (function (_super) {
    __extends(SigHashType, _super);
    function SigHashType(bytesVal) {
        return _super.call(this, bytesVal) || this;
    }
    SigHashType.prototype.toLiteral = function () {
        return "SigHashType(b'" + utils_1.getValidatedHexString(this._value.toString()) + "')";
    };
    return SigHashType;
}(ScryptType));
exports.SigHashType = SigHashType;
var OpCodeType = /** @class */ (function (_super) {
    __extends(OpCodeType, _super);
    function OpCodeType(bytesVal) {
        return _super.call(this, bytesVal) || this;
    }
    OpCodeType.prototype.toLiteral = function () {
        return "OpCodeType(b'" + utils_1.getValidatedHexString(this._value.toString()) + "')";
    };
    return OpCodeType;
}(ScryptType));
exports.OpCodeType = OpCodeType;
//# sourceMappingURL=scryptTypes.js.map