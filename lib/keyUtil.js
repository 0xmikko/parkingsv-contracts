"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyUtil = void 0;
var Mnemonic = require("bsv/mnemonic");
var utils_1 = require("./scryptlib/utils");
var KeyUtil = /** @class */ (function () {
    function KeyUtil() {
    }
    KeyUtil.generateMnemonic = function () {
        var mnemonic = Mnemonic.fromRandom();
        return mnemonic.toString();
    };
    KeyUtil.getPrivateKeyFromMnemonic = function (mnemonicStr) {
        var mnemonic = Mnemonic.fromString(mnemonicStr);
        var hdPrivateKey = utils_1.bsv.HDPrivateKey;
        var privateKey = hdPrivateKey.fromSeed(mnemonic.toSeed(), utils_1.bsv.Networks.testnet).privateKey;
        return privateKey.toWIF();
    };
    KeyUtil.getAddress = function (wif) {
        var privateKey = KeyUtil.getPrivateKeyFromWIF(wif);
        return utils_1.toHex(KeyUtil.getPublicKey(privateKey));
    };
    KeyUtil.getWIF = function (wif) {
        var privateKey = KeyUtil.getPrivateKeyFromWIF(wif);
        return privateKey.toAddress().toString();
    };
    KeyUtil.getPrivateKeyFromWIF = function (key) {
        return utils_1.bsv.PrivateKey.fromWIF(key);
    };
    KeyUtil.getPublicKey = function (privateKey) {
        return utils_1.bsv.PublicKey.fromPrivateKey(privateKey);
    };
    return KeyUtil;
}());
exports.KeyUtil = KeyUtil;
//# sourceMappingURL=keyUtil.js.map