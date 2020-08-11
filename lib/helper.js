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
var bsv = require("./scryptlib/utils").bsv;
var Signature = bsv.crypto.Signature;
var BN = bsv.crypto.BN;
var Interpreter = bsv.Script.Interpreter;
// number of bytes to denote some numeric value
var DataLen = 1;
var axios = require("axios");
var API_PREFIX = "https://api.whatsonchain.com/v1/bsv/test";
var inputIndex = 0;
var inputSatoshis = 1000000;
var flags = Interpreter.SCRIPT_VERIFY_MINIMALDATA |
    Interpreter.SCRIPT_ENABLE_SIGHASH_FORKID |
    Interpreter.SCRIPT_ENABLE_MAGNETIC_OPCODES |
    Interpreter.SCRIPT_ENABLE_MONOLITH_OPCODES;
var minFee = 546;
var dummyTxId = "a477af6b2667c29670467e4e0728b685ee07b240235771862318e29ddbe58458";
var utxo = {
    txId: dummyTxId,
    outputIndex: 0,
    script: "",
    satoshis: inputSatoshis,
};
var tx = new bsv.Transaction().from(utxo);
function createLockingTx(address, amountInContract, fee) {
    return __awaiter(this, void 0, void 0, function () {
        var utxos, tx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios.get(API_PREFIX + "/address/" + address + "/unspent")];
                case 1:
                    utxos = (_a.sent()).data;
                    utxos = utxos.map(function (utxo) { return ({
                        txId: utxo.tx_hash,
                        outputIndex: utxo.tx_pos,
                        satoshis: utxo.value,
                        script: bsv.Script.buildPublicKeyHashOut(address).toHex(),
                    }); });
                    tx = new bsv.Transaction().from(utxos);
                    tx.addOutput(new bsv.Transaction.Output({
                        script: new bsv.Script(),
                        satoshis: amountInContract,
                    }));
                    tx.change(address).fee(fee || minFee);
                    return [2 /*return*/, tx];
            }
        });
    });
}
function createUnlockingTx(prevTxId, inputAmount, inputLockingScriptASM, outputAmount, outputLockingScriptASM) {
    var tx = new bsv.Transaction();
    tx.addInput(new bsv.Transaction.Input({
        prevTxId: prevTxId,
        outputIndex: inputIndex,
        script: new bsv.Script(),
    }), bsv.Script.fromASM(inputLockingScriptASM), inputAmount);
    tx.addOutput(new bsv.Transaction.Output({
        script: bsv.Script.fromASM(outputLockingScriptASM || inputLockingScriptASM),
        satoshis: outputAmount,
    }));
    tx.fee(inputAmount - outputAmount);
    return tx;
}
function unlockP2PKHInput(privateKey, tx, inputIndex, sigtype) {
    var sig = new bsv.Transaction.Signature({
        publicKey: privateKey.publicKey,
        prevTxId: tx.inputs[inputIndex].prevTxId,
        outputIndex: tx.inputs[inputIndex].outputIndex,
        inputIndex: inputIndex,
        signature: bsv.Transaction.Sighash.sign(tx, privateKey, sigtype, inputIndex, tx.inputs[inputIndex].output.script, tx.inputs[inputIndex].output.satoshisBN),
        sigtype: sigtype,
    });
    tx.inputs[inputIndex].setScript(bsv.Script.buildPublicKeyHashIn(sig.publicKey, sig.signature.toDER(), sig.sigtype));
}
function sendTx(tx) {
    return __awaiter(this, void 0, void 0, function () {
        var txid;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios.post(API_PREFIX + "/tx/raw", {
                        txhex: tx.serialize(true),
                    })];
                case 1:
                    txid = (_a.sent()).data;
                    return [2 /*return*/, txid];
            }
        });
    });
}
function sendTxHex(txhex) {
    return __awaiter(this, void 0, void 0, function () {
        var txid, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.post(API_PREFIX + "/tx/raw", {
                            txhex: txhex,
                        })];
                case 1:
                    txid = (_a.sent()).data;
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    showError(err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/, txid];
            }
        });
    });
}
function showError(error) {
    // Error
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("Failed - StatusCodeError: " +
            error.response.status +
            ' - "' +
            error.response.data +
            '"');
        // console.log(error.response.headers);
    }
    else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the
        // browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
    }
    else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error:", error.message);
        if (error.context) {
            console.log(error.context);
        }
    }
}
module.exports = {
    inputIndex: inputIndex,
    inputSatoshis: inputSatoshis,
    tx: tx,
    createLockingTx: createLockingTx,
    createUnlockingTx: createUnlockingTx,
    DataLen: DataLen,
    dummyTxId: dummyTxId,
    unlockP2PKHInput: unlockP2PKHInput,
    sendTx: sendTx,
    sendTxHex: sendTxHex,
    showError: showError,
};
//# sourceMappingURL=helper.js.map