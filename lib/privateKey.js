"use strict";
var exit = require('process').exit;
var bsv = require('./scryptlib/utils').bsv;
// fill in private key on testnet in WIF here
var key = 'cTmL8VmSeqduXjC5YRXX15voph4r5PuP6jUj6Z2rv2FpWwqdhh32';
if (!key) {
    genPrivKey();
}
function genPrivKey() {
    var newPrivKey = new bsv.PrivateKey.fromRandom('testnet');
    console.log("Missing private key, generating a new one ...\nPrivate key generated: '" + newPrivKey.toWIF() + "'\nYou can fund its address '" + newPrivKey.toAddress() + "' from some faucet and use it to complete the test\nExample faucets are https://faucet.bitcoincloud.net and https://testnet.satoshisvision.network");
    exit(0);
}
var privateKey = new bsv.PrivateKey.fromWIF(key);
console.log("\nPrivate key '" + privateKey.toWIF() + "'\nYou can fund its address '" + privateKey.toAddress() + "' from some faucet and use it to complete the test\nExample faucets are https://faucet.bitcoincloud.net and https://testnet.satoshisvision.network");
module.exports = {
    privateKey: privateKey,
    genPrivKey: genPrivKey
};
//# sourceMappingURL=privateKey.js.map