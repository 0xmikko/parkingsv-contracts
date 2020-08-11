"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
exports.TxUtil = void 0;
var axios_1 = require("axios");
var utils_1 = require("./scryptlib/utils");
var TxUtil = /** @class */ (function () {
    function TxUtil() {
    }
    TxUtil.getTxData = function (txHash) {
        return __awaiter(this, void 0, void 0, function () {
            var resp2, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (TxUtil.cache.has(txHash)) {
                            return [2 /*return*/, TxUtil.cache.get(txHash) || ""];
                        }
                        return [4 /*yield*/, axios_1.default.get("https://api.whatsonchain.com/v1/bsv/test/tx/hash/" + txHash)];
                    case 1:
                        resp2 = _a.sent();
                        result = resp2.data.vout[0].scriptPubKey.hex;
                        TxUtil.cache.set(txHash, result);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    TxUtil.getTxUnspentAmount = function (txHash) {
        return __awaiter(this, void 0, void 0, function () {
            var resp2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.get("https://api.whatsonchain.com/v1/bsv/test/tx/hash/" + txHash)];
                    case 1:
                        resp2 = _a.sent();
                        console.log(resp2.data.vout[0]);
                        return [2 /*return*/, Math.floor(resp2.data.vout[0].value * 100000000)];
                }
            });
        });
    };
    TxUtil.getLastTransaction = function (fundingTransaction) {
        return __awaiter(this, void 0, void 0, function () {
            var txData, s, scriptHash, resp, _a, _b, trans, resp2, e_1_1;
            var e_1, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, TxUtil.getTxData(fundingTransaction)];
                    case 1:
                        txData = _d.sent();
                        s = utils_1.bsv.crypto.Hash.sha256(Buffer.from(txData, "hex")).reverse();
                        scriptHash = utils_1.toHex(s);
                        _d.label = 2;
                    case 2: return [4 /*yield*/, axios_1.default.get("https://api.whatsonchain.com/v1/bsv/test/script/" + scriptHash + "/history")];
                    case 3:
                        resp = _d.sent();
                        if (!(resp.data.length === 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 100); })];
                    case 4:
                        _d.sent();
                        _d.label = 5;
                    case 5:
                        if (resp.data.length === 0) return [3 /*break*/, 2];
                        _d.label = 6;
                    case 6:
                        if (resp.data.length === 1 && resp.data[0].tx_hash === fundingTransaction)
                            return [2 /*return*/, fundingTransaction];
                        _d.label = 7;
                    case 7:
                        _d.trys.push([7, 13, 14, 15]);
                        _a = __values(resp.data), _b = _a.next();
                        _d.label = 8;
                    case 8:
                        if (!!_b.done) return [3 /*break*/, 12];
                        trans = _b.value;
                        return [4 /*yield*/, axios_1.default.get("https://api.whatsonchain.com/v1/bsv/test/tx/hash/" + trans.tx_hash)];
                    case 9:
                        resp2 = _d.sent();
                        if (!(resp2.data.vin[0].txid === fundingTransaction)) return [3 /*break*/, 11];
                        return [4 /*yield*/, TxUtil.getLastTransaction(trans.tx_hash)];
                    case 10: return [2 /*return*/, _d.sent()];
                    case 11:
                        _b = _a.next();
                        return [3 /*break*/, 8];
                    case 12: return [3 /*break*/, 15];
                    case 13:
                        e_1_1 = _d.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 15];
                    case 14:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 15: return [2 /*return*/, ""];
                }
            });
        });
    };
    TxUtil.cache = new Map();
    return TxUtil;
}());
exports.TxUtil = TxUtil;
//# sourceMappingURL=txUtil.js.map