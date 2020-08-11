const { exit } = require('process')
const { bsv } = require('./scryptlib/utils');

// fill in private key on testnet in WIF here
// const key = 'cVrehMv8Z6cnda3g6WT4nYREoYWX6KLwCEQKsX4V3A4HPMqat587'
const key = 'cUcQoY7yM7LYdUodyXgmdVCys5sh6FKoWVgPK2Atv4LJ6UNJELSD'
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