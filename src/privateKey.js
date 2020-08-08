const { exit } = require('process')
const { bsv } = require('./scryptlib/utils');

// fill in private key on testnet in WIF here
const key = 'cTmL8VmSeqduXjC5YRXX15voph4r5PuP6jUj6Z2rv2FpWwqdhh32'

if (!key) {
  genPrivKey()
}

function genPrivKey() {
  const newPrivKey = new bsv.PrivateKey.fromRandom('testnet')
  console.log(`Missing private key, generating a new one ...
Private key generated: '${newPrivKey.toWIF()}'
You can fund its address '${newPrivKey.toAddress()}' from some faucet and use it to complete the test
Example faucets are https://faucet.bitcoincloud.net and https://testnet.satoshisvision.network`)
  exit(0)
}

const privateKey = new bsv.PrivateKey.fromWIF(key)

console.log(`
Private key '${privateKey.toWIF()}'
You can fund its address '${privateKey.toAddress()}' from some faucet and use it to complete the test
Example faucets are https://faucet.bitcoincloud.net and https://testnet.satoshisvision.network`)

module.exports = {
  privateKey,
  genPrivKey
}