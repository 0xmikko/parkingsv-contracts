"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ledger = void 0;
var utils_1 = require("./scryptlib/utils");
var helper_1 = require("./helper");
var Ledger = /** @class */ (function () {
    function Ledger() {
        this.balances = new Map();
        this.balancesArray = new Array();
    }
    // Creates Ledger from raw contract data
    Ledger.fromTxData = function (txData) {
        var ledger = new Ledger();
        var len = txData.length;
        var DataLen = 2;
        var PubKeyLen = 33 * 2;
        var qty = parseInt(txData.substr(len - DataLen, DataLen));
        var arrayEnd = len - DataLen;
        for (var i = 0; i < qty; i++) {
            var part = txData.substr(arrayEnd - (i + 1) * (DataLen + PubKeyLen), PubKeyLen + DataLen);
            var addr = part.substr(0, PubKeyLen);
            var value = parseInt(part.substr(PubKeyLen, DataLen), 16);
            ledger.addHolder(addr);
            ledger.setBalance(addr, value);
        }
        return ledger;
    };
    Ledger.prototype.addHolder = function (pubkey) {
        if (this.balances.has(pubkey))
            throw new Error("User already exists");
        var index = this.balancesArray.length;
        this.balancesArray.push({ pubkey: pubkey, value: 0 });
        this.balances.set(pubkey, index);
        return index;
    };
    Ledger.prototype.transfer = function (fromPublicKey, toPublicKey, value) {
        var senderIndex = this.getIndex(fromPublicKey);
        var senderBalance = this.getBalance(fromPublicKey);
        var receiverIndex = this.getIndex(toPublicKey);
        var receiverBalance = this.getBalance(toPublicKey);
        if (senderBalance < value) {
            throw new Error("Not enought money on account");
        }
        this.setBalanceByIndex(senderIndex, senderBalance - value);
        this.setBalanceByIndex(receiverIndex, receiverBalance + value);
        return {
            fromIndex: senderIndex,
            toIndex: receiverIndex,
            amount: value,
        };
    };
    Ledger.prototype.getBalance = function (pubkey) {
        var index = this.getIndex(pubkey);
        return this.balancesArray[index].value;
    };
    Ledger.prototype.setBalance = function (pubkey, value) {
        var index = this.getIndex(pubkey);
        this.setBalanceByIndex(index, value);
    };
    Ledger.prototype.getDataLoad = function () {
        var balancesToString = this.balancesArray
            .map(function (balance) { return balance.pubkey + utils_1.num2bin(balance.value, helper_1.DataLen); })
            .join("");
        return balancesToString + utils_1.num2bin(this.balances.size, helper_1.DataLen);
    };
    Ledger.prototype.toString = function () {
        return this.balancesArray
            .map(function (balance, index) { return index + " : " + balance.pubkey + " => " + balance.value; })
            .join("\n");
    };
    Ledger.prototype.getIndex = function (pubkey) {
        var index = this.balances.get(pubkey);
        if (index === undefined) {
            throw new Error("From public key balance not found!: " + pubkey);
        }
        return index;
    };
    Ledger.prototype.setBalanceByIndex = function (index, value) {
        this.balancesArray[index].value = value;
    };
    return Ledger;
}());
exports.Ledger = Ledger;
//# sourceMappingURL=ledger.js.map