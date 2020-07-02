import { expect } from 'chai';
import { buildContractClass, signTx, toHex, bsv, Ripemd160, PubKey, Sig } from 'scryptlib';
import { loadDesc } from "../../helper";

/**
 * an example test for contract containing signature verification
 */
import { inputIndex, inputSatoshis, tx } from '../../helper';

const privateKey = new bsv.PrivateKey.fromRandom('testnet')
const publicKey = privateKey.publicKey
const pkh = bsv.crypto.Hash.sha256ripemd160(publicKey.toBuffer())
const privateKey2 = new bsv.PrivateKey.fromRandom('testnet')

describe('Test sCrypt contract DemoP2PKH In Typescript', () => {
  let demo: any;
  let sig: any;

  before(() => {
    const DemoP2PKH = buildContractClass(loadDesc('p2pkh_desc.json'))
    demo = new DemoP2PKH(new Ripemd160(toHex(pkh)))
    demo.txContext = {
      tx,
      inputIndex,
      inputSatoshis
    }
  });

  it('signature check should succeed when right private key signs', () => {
    sig = signTx(tx, privateKey, demo.lockingScript.toASM(), inputSatoshis)
    expect(demo.unlock(new Sig(toHex(sig)), new PubKey(toHex(publicKey))).verify()).to.equal(true);
  });

  it('signature check should fail when wrong private key signs', () => {
    sig = signTx(tx, privateKey2, demo.lockingScript.toASM(), inputSatoshis)
    expect(() => { demo.unlock(new Sig(toHex(sig)), new PubKey(toHex(publicKey))).verify() }).to.throws(/failed to verify/);
  });
});
