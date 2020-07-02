const { expect } = require('chai');
const { bsv, buildContractClass, getPreimage, toHex, num2bin, Bytes, Ripemd160 } = require('scryptlib');
const {
  inputIndex,
  inputSatoshis,
  tx,
  DataLen,
  compileContract
} = require('../../helper');

// make a copy since it will be mutated
const tx_ = bsv.Transaction.shallowCopy(tx)

// Test keys
const privateKey = new bsv.PrivateKey.fromRandom('testnet')
const publicKey = privateKey.publicKey
const pkh = bsv.crypto.Hash.sha256ripemd160(publicKey.toBuffer())

const Signature = bsv.crypto.Signature
// Note: ANYONECANPAY
const sighashType = Signature.SIGHASH_ANYONECANPAY | Signature.SIGHASH_ALL | Signature.SIGHASH_FORKID
const outputAmount = 222222
const changeAmount = 111111

describe('Test sCrypt contract Counter In Javascript', () => {
  let counter
  let preimage

  before(() => {
    const Counter = buildContractClass(compileContract('advancedCounter.scrypt'))
    counter = new Counter()

    // append state as passive data
    counter.dataLoad = num2bin(0, DataLen)

    const newLockingScript = counter.codePart.toASM() + ' OP_RETURN ' + num2bin(1, DataLen)
    // counter output
    tx_.addOutput(new bsv.Transaction.Output({
      script: bsv.Script.fromASM(newLockingScript),
      satoshis: outputAmount
    }))

    // change output
    tx_.addOutput(new bsv.Transaction.Output({
      script: bsv.Script.buildPublicKeyHashOut(privateKey.toAddress()),
      satoshis: changeAmount
    }))

    preimage = getPreimage(tx_, counter.lockingScript.toASM(), inputSatoshis, 0, sighashType)
  });

  it('should succeed when pushing right preimage & amount', () => {
    expect(counter.increment(new Bytes(toHex(preimage)), outputAmount, new Ripemd160(toHex(pkh)), changeAmount).verify( { tx: tx_, inputIndex, inputSatoshis } )).to.equal(true);
  });
});
