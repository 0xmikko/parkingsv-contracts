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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParkingToken = void 0;
var bsv_1 = require("bsv");
var contract_1 = require("./scryptlib/contract");
var scryptTypes_1 = require("./scryptlib/scryptTypes");
var utils_1 = require("./scryptlib/utils");
var contractHelper_1 = require("./contractHelper");
var helper_1 = require("./helper");
var ledger_1 = require("./ledger");
var txUtil_1 = require("./txUtil");
var ParkingToken = /** @class */ (function () {
    function ParkingToken(privateKey, desc) {
        this.amount = 30000;
        this.fee = 2000;
        var Token = contract_1.buildContractClass(desc);
        this.tokenContract = new Token();
        this.ledger = new ledger_1.Ledger();
        this.ownerPrivateKey = privateKey;
        this.ownerPublicKey = utils_1.bsv.PublicKey.fromPrivateKey(this.ownerPrivateKey);
    }
    ParkingToken.deployContract = function (privateKey, desc) {
        return __awaiter(this, void 0, void 0, function () {
            var instance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = new ParkingToken(privateKey, desc);
                        return [4 /*yield*/, instance.initContract()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, instance];
                }
            });
        });
    };
    ParkingToken.prototype.initContract = function () {
        return __awaiter(this, void 0, void 0, function () {
            var scriptLengthF, _a, _b, err_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        this.ledger.addHolder(utils_1.toHex(this.ownerPublicKey));
                        this.ledger.setBalance(utils_1.toHex(this.ownerPublicKey), 100);
                        this.tokenContract.dataLoad = this.ledger.getDataLoad();
                        scriptLengthF = this.tokenContract.lockingScript.toHex().length / 2 -
                            this.tokenContract.dataLoad.length / 2;
                        console.log("Script length: " + scriptLengthF + " bytes");
                        _a = this;
                        return [4 /*yield*/, helper_1.createLockingTx(this.ownerPrivateKey.toAddress(), this.amount, this.fee)];
                    case 1:
                        _a.lockingTx = _c.sent();
                        this.lockingTx.outputs[0].setScript(this.tokenContract.lockingScript);
                        this.lockingTx.sign(this.ownerPrivateKey);
                        console.log("fee:      ", this.fee);
                        _b = this;
                        return [4 /*yield*/, helper_1.sendTx(this.lockingTx)];
                    case 2:
                        _b.lockingTxid = _c.sent();
                        console.log("funding txid:      ", this.lockingTxid);
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _c.sent();
                        console.log(err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ParkingToken.prototype.initFromTxData = function (txData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.ledger = ledger_1.Ledger.fromTxData(txData);
                return [2 /*return*/];
            });
        });
    };
    ParkingToken.prototype.addNewUser = function (publicKey) {
        return __awaiter(this, void 0, void 0, function () {
            var cch, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // Getting last contract instance
                        console.log("[TOKEN CONTRACT]: Adding " + publicKey);
                        this.ledger.addHolder(publicKey);
                        return [4 /*yield*/, this.prepareCall()];
                    case 1:
                        cch = _b.sent();
                        cch.unlockingScript = this.tokenContract
                            .addNewMember(cch.sender, cch.signature, cch.preimage, cch.newAmount, new scryptTypes_1.PubKey(publicKey))
                            .toScript();
                        _a = this;
                        return [4 /*yield*/, cch.sendTX()];
                    case 2:
                        _a.lockingTxid = _b.sent();
                        this.amount = cch.newAmount;
                        return [2 /*return*/, this.lockingTxid];
                }
            });
        });
    };
    ParkingToken.fromTransaction = function (privateKey, lastKnownTransaction, desc) {
        return __awaiter(this, void 0, void 0, function () {
            var instance, lastTransaction, txData, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        instance = new ParkingToken(privateKey, desc);
                        return [4 /*yield*/, txUtil_1.TxUtil.getLastTransaction(lastKnownTransaction)];
                    case 1:
                        lastTransaction = _b.sent();
                        return [4 /*yield*/, txUtil_1.TxUtil.getTxData(lastTransaction)];
                    case 2:
                        txData = _b.sent();
                        instance.initFromTxData(txData);
                        instance.lockingTxid = lastKnownTransaction;
                        _a = instance;
                        return [4 /*yield*/, txUtil_1.TxUtil.getTxUnspentAmount(lastTransaction)];
                    case 3:
                        _a.amount = _b.sent();
                        console.log(instance.amount);
                        return [2 /*return*/, instance];
                }
            });
        });
    };
    ParkingToken.prototype.transferTokens = function (toAddress, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var transferData, cch, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        transferData = this.ledger.transfer(utils_1.toHex(this.ownerPublicKey), toAddress, amount);
                        console.log(this.ledger.toString());
                        console.log(transferData);
                        return [4 /*yield*/, this.prepareCall()];
                    case 1:
                        cch = _b.sent();
                        cch.unlockingScript = this.tokenContract
                            .transfer(cch.sender, cch.signature, cch.preimage, cch.newAmount, transferData.fromIndex, transferData.toIndex, transferData.amount)
                            .toScript();
                        _a = this;
                        return [4 /*yield*/, cch.sendTX()];
                    case 2:
                        _a.lockingTxid = _b.sent();
                        this.amount = cch.newAmount;
                        return [2 /*return*/];
                }
            });
        });
    };
    ParkingToken.prototype.transferTokensJSON = function (toAddress, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var transferData, cch;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        transferData = this.ledger.transfer(utils_1.toHex(this.ownerPublicKey), toAddress, amount);
                        console.log(this.ledger.toString());
                        console.log(transferData);
                        return [4 /*yield*/, this.prepareCall()];
                    case 1:
                        cch = _a.sent();
                        cch.unlockingScript = this.tokenContract
                            .transfer(cch.sender, cch.signature, cch.preimage, cch.newAmount, transferData.fromIndex, transferData.toIndex, transferData.amount)
                            .toScript();
                        return [2 /*return*/, cch.getTxJSON()];
                }
            });
        });
    };
    ParkingToken.prototype.payByJSON = function (txHex) {
        return __awaiter(this, void 0, void 0, function () {
            var buffer, tx, lockingTxid, txData, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        buffer = Buffer.from(txHex);
                        tx = new bsv_1.Transaction(buffer);
                        console.log(tx);
                        return [4 /*yield*/, helper_1.sendTxHex(txHex)];
                    case 1:
                        lockingTxid = _b.sent();
                        return [4 /*yield*/, txUtil_1.TxUtil.getTxData(lockingTxid)];
                    case 2:
                        txData = _b.sent();
                        this.initFromTxData(txData);
                        this.lockingTxid = lockingTxid;
                        _a = this;
                        return [4 /*yield*/, txUtil_1.TxUtil.getTxUnspentAmount(lockingTxid)];
                    case 3:
                        _a.amount = _b.sent();
                        console.log(this.amount);
                        return [2 /*return*/];
                }
            });
        });
    };
    ParkingToken.prototype.prepareCall = function () {
        return __awaiter(this, void 0, void 0, function () {
            var prevLockingScript, newLockingScriptASM, newAmount, unlockScriptTx, preimage, sig1;
            return __generator(this, function (_a) {
                prevLockingScript = this.tokenContract.lockingScript;
                this.tokenContract.dataLoad = this.ledger.getDataLoad();
                newLockingScriptASM = this.tokenContract.lockingScript.toASM();
                newAmount = this.amount - this.fee;
                if (newAmount < 0)
                    throw new Error("Not enough money on contract!");
                unlockScriptTx = helper_1.createUnlockingTx(this.lockingTxid, this.amount, prevLockingScript.toASM(), newAmount, newLockingScriptASM);
                preimage = utils_1.getPreimage(unlockScriptTx, prevLockingScript.toASM(), this.amount);
                sig1 = utils_1.signTx(unlockScriptTx, this.ownerPrivateKey, prevLockingScript.toASM(), this.amount);
                // Generating Contract Call Helper structure
                return [2 /*return*/, new contractHelper_1.ContractCallHelper({
                        sender: new scryptTypes_1.PubKey(utils_1.toHex(this.ownerPublicKey)),
                        signature: new scryptTypes_1.Sig(utils_1.toHex(sig1)),
                        preimage: new scryptTypes_1.Bytes(utils_1.toHex(preimage)),
                        newAmount: newAmount,
                        unlockScriptTx: unlockScriptTx,
                    })];
            });
        });
    };
    return ParkingToken;
}());
exports.ParkingToken = ParkingToken;
//# sourceMappingURL=token.js.map