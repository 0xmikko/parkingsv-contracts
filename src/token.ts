import {
  bsv,
  buildContractClass,
  getPreimage,
  toHex,
  num2bin,
  Bytes,
  signTx,
  PubKey,
  PrivKey,
} from "scryptlib";
import {
  DataLen,
  loadDesc,
  createUnlockingTx,
  createLockingTx,
  sendTx,
  showError,
  compileContract,
} from "./helper";

import axios from "axios";
import { Script, Transaction, PrivateKey, PublicKey, Sig } from "bsv";
import { privateKey } from "./privateKey";
import { AbstractContract } from "scryptlib/dist/contract";
// import { PrivateKey, PublicKey } from "./types";

// const script = bsv.Address.fromPublicKey(privateKey.toAddress().lockingScript);
// console.log(privateKey.toAddress().Transaction)

export interface TokenContract extends AbstractContract {

  addNewMember(sender: PubKey,
  sig:Sig,
  preimage: Bytes,
  newUserPubKey: PubKey,
  newAmount: number) : 
}

class ParkingToken {
  tokenContract: TokenContract;
  balances: Map<string, number>;

  ownerPrivateKey: PrivateKey;
  ownerPublicKey: PublicKey;

  amount: number = 10000;
  fee: number = 2000;
  lockingTx : Transaction;
  lockingTxid : string;

  private constructor() {
    const Token = buildContractClass(loadDesc("token_desc.json"));
    this.tokenContract = new Token();
    this.balances = new Map<string, number>();
    this.ownerPrivateKey = privateKey;
    this.ownerPublicKey = bsv.PublicKey.fromPrivateKey(this.ownerPrivateKey);
  }

  static async deployContract(): Promise<ParkingToken> {
    compileContract("token.scrypt");
    const instance = new ParkingToken();
    await instance.initContract();
    return instance;
  }

  async initContract(): Promise<void> {
    try {
      this.balances.set(toHex(this.ownerPublicKey), 100);

      this.tokenContract.dataLoad = this.getDataLoad();

      const scriptLengthF =
        this.tokenContract.lockingScript.toHex().length / 2 -
        this.tokenContract.dataLoad.length / 2;

      console.log("SCRIPTLENT:", scriptLengthF);

      this.lockingTx = await createLockingTx(
        this.ownerPrivateKey.toAddress(),
        this.amount,
        this.fee
      );
      this.lockingTx.outputs[0].setScript(
        this.tokenContract.lockingScript as Script
      );
      this.lockingTx.sign(this.ownerPrivateKey);
      console.log("fee:      ", this.fee);

      this.lockingTxid = await sendTx(this.lockingTx);

      console.log("funding txid:      ", this.lockingTxid);
    } catch (err) {
      console.log(err);
    }
  }

  async addNewUser(publicKey: string) {
     // Getting last contract instance
     const prevLockingScript = this.tokenContract.lockingScript;
     if (this.balances.has(publicKey)) throw new Error("User already exists");

     this.balances.set(publicKey, 100);
     // update data state [!]
     this.tokenContract.dataLoad = this.getDataLoad();

     const newLockingScriptASM = this.tokenContract.lockingScript.toASM();
     const newAmount = this.amount - this.fee

     const unlockScriptTx = await createUnlockingTx(
       this.lockingTxid,
       this.amount,
       prevLockingScript.toASM(),
       newAmount,
       newLockingScriptASM
     );

     // call contract method to get unlocking script
     const preimage = getPreimage(
       unlockScriptTx,
       prevLockingScript.toASM(),
       this.amount
     );

     const sig1 = signTx(
       unlockScriptTx,
       this.ownerPrivateKey,
       prevLockingScript.toASM(),
       this.amount
     );

     const unlockingScript = this.tokenContract
       .addNewMember(
         new PubKey(toHex(this.ownerPublicKey.toAddress())),
         new Sig(toHex(sig1)),
         new Bytes(toHex(preimage)),
         new PubKey(publicKey),
         newAmount
       )
       .toScript();

     // set unlocking script
     unlockScriptTx.inputs[0].setScript(unlockingScript);

     this.lockingTxid = await sendTx(unlockScriptTx);
     console.log("transfer txid2[NEW CELL]:    ", this.lockingTxid);

     this.amount = newAmount;
  }

  static fromAddress(): ParkingToken {
    compileContract("token.scrypt");
    const instance = new ParkingToken();
    instance.initContract();
    return instance;
  }

  private getDataLoad(): string {
    const balances = Array.from(this.balances)
      .map((balance) => balance[0] + num2bin(balance[1], DataLen))
      .join("");
    return balances + num2bin(this.balances.size, DataLen);
  }
}

(async () => {
  const pt = await ParkingToken.deployContract();
  process.exit(1);

  const privateKey1 = bsv.PrivateKey.fromRandom("testnet");
  const publicKey1 = bsv.PublicKey.fromPrivateKey(privateKey1);

  const privateKey2 = bsv.PrivateKey.fromRandom("testnet");
  const publicKey2 = bsv.PublicKey.fromPrivateKey(privateKey2);

  const privateKey3 = bsv.PrivateKey.fromRandom("testnet");
  const publicKey3 = bsv.PublicKey.fromPrivateKey(privateKey3);

  try {
    const Token = buildContractClass(loadDesc("token_desc.json"));

    // Creating temporary instance to calulatte code size
    // const tokenTmp = new Token()

    // const scriptLength =  tokenTmp.lockingScript.toHex().length/2 + 2;

    // console.log("SCRIPTLENT:", scriptLength)
    const token = new Token();

    ////////////////// ---- Initialization ------- //////////////////////////
    // append state as passive data part
    // initial token supply 100: publicKey1 has 100, publicKey2 0
    token.dataLoad =
      toHex(publicKey1) +
      num2bin(100, DataLen) +
      toHex(publicKey2) +
      num2bin(0, DataLen) +
      num2bin(2, DataLen);

    const scriptLengthF =
      token.lockingScript.toHex().length / 2 - token.dataLoad.length / 2;

    console.log("SCRIPTLENT:", scriptLengthF);

    let amount = 10000;
    const FEE = 2000;
    const fee = FEE;

    // for(let fee=0; fee < 100000; fee += 1000) {

    //   try {
    // lock fund to the script
    const lockingTx = await createLockingTx(
      privateKey.toAddress(),
      amount,
      fee || FEE
    );
    lockingTx.outputs[0].setScript(token.lockingScript);
    lockingTx.sign(privateKey);
    console.log("fee:      ", fee || FEE);
    let lockingTxid = await sendTx(lockingTx);

    console.log("funding txid:      ", lockingTxid);
    //     break;
    //   } catch (err) {
    //     console.log('err')
    //   }
    // }

    // transfer 40 tokens from publicKey1 to publicKey2
    ////////////////// ---- Transfer 40 tokens ------- //////////////////////////

    {
      // Getting last contract instance
      const prevLockingScript = token.lockingScript;

      // update data state [!]
      token.dataLoad =
        toHex(publicKey1) +
        num2bin(60, DataLen) +
        toHex(publicKey2) +
        num2bin(40, DataLen) +
        num2bin(2, DataLen);

      // console.log(token.lockingScript.toHex())
      // console.log(bsv.Script.fromASM(token.dataLoad))

      const newLockingScriptASM = token.lockingScript.toASM();
      const newAmount = amount - FEE;

      const unlockScriptTx = await createUnlockingTx(
        lockingTxid,
        amount,
        prevLockingScript.toASM(),
        newAmount,
        newLockingScriptASM
      );

      // call contract method to get unlocking script
      const preimage = getPreimage(
        unlockScriptTx,
        prevLockingScript.toASM(),
        amount
      );

      // SIGN CONTRACT BY SIGNATURE 1
      const sig1 = signTx(
        unlockScriptTx,
        privateKey1,
        prevLockingScript.toASM(),
        amount
      );
      const unlockingScript = token
        .transfer(
          new PubKey(toHex(publicKey1)),
          new Sig(toHex(sig1)),
          40,
          new Bytes(toHex(preimage)),
          newAmount,
          0,
          1
        )
        .toScript();

      // set unlocking script
      unlockScriptTx.inputs[0].setScript(unlockingScript);

      lockingTxid = await sendTx(unlockScriptTx);
      console.log("transfer txid1:    ", lockingTxid);

      amount = newAmount;
    }

    ////////////////// ---- Adding new array cell ------- //////////////////////////
    {
      // Getting last contract instance
      const prevLockingScript = token.lockingScript;

      // update data state [!]
      token.dataLoad =
        toHex(publicKey1) +
        num2bin(60, DataLen) +
        toHex(publicKey2) +
        num2bin(40, DataLen) +
        toHex(publicKey3) +
        num2bin(0, DataLen) +
        num2bin(3, DataLen);

      // console.log(token.lockingScript.toHex())
      console.log(toHex(publicKey1));
      console.log(bsv.Script.fromASM(token.dataLoad));
      const s1 = token.lockingScript.toHex();
      const s2 = bsv.Script.fromASM(token.dataLoad).toHex();
      console.log(s1);
      console.log(s2);
      const dataEnd = s1.indexOf(s2) / 2;
      console.log(dataEnd);
      console.log(s1.substr(dataEnd * 2));

      console.log(s2.length);

      const newLockingScriptASM = token.lockingScript.toASM();
      const newAmount = amount - FEE;

      const unlockScriptTx = await createUnlockingTx(
        lockingTxid,
        amount,
        prevLockingScript.toASM(),
        newAmount,
        newLockingScriptASM
      );

      // call contract method to get unlocking script
      const preimage = getPreimage(
        unlockScriptTx,
        prevLockingScript.toASM(),
        amount
      );

      const sig1 = signTx(
        unlockScriptTx,
        privateKey1,
        prevLockingScript.toASM(),
        amount
      );

      const unlockingScript = token
        .addNewMember(
          new PubKey(toHex(publicKey1)),
          new Sig(toHex(sig1)),
          new Bytes(toHex(preimage)),
          new PubKey(toHex(publicKey3)),
          newAmount
        )
        .toScript();

      // set unlocking script
      unlockScriptTx.inputs[0].setScript(unlockingScript);

      lockingTxid = await sendTx(unlockScriptTx);
      console.log("transfer txid2[NEW CELL]:    ", lockingTxid);

      amount = newAmount;
    }

    ////////////////// ---- Transfer 10  ------- //////////////////////////
    // transfer 10 tokens from publicKey2 [User:1] to publicKey1 [User:0]
    {
      const prevLockingScript = token.lockingScript;

      // update data state
      token.dataLoad =
        toHex(publicKey1) +
        num2bin(70, DataLen) +
        toHex(publicKey2) +
        num2bin(30, DataLen) +
        toHex(publicKey3) +
        num2bin(0, DataLen) +
        num2bin(3, DataLen);

      const newLockingScriptASM = token.lockingScript.toASM();
      const newAmount = amount - FEE;

      const unlockScriptTx = await createUnlockingTx(
        lockingTxid,
        amount,
        prevLockingScript.toASM(),
        newAmount,
        newLockingScriptASM
      );

      // call contract method to get unlocking script
      const preimage = getPreimage(
        unlockScriptTx,
        prevLockingScript.toASM(),
        amount
      );
      const sig2 = signTx(
        unlockScriptTx,
        privateKey2,
        prevLockingScript.toASM(),
        amount
      );
      const unlockingScript = token
        .transfer(
          new PubKey(toHex(publicKey2)),
          new Sig(toHex(sig2)),
          10,
          new Bytes(toHex(preimage)),
          newAmount,
          1,
          0
        )
        .toScript();

      // set unlocking script
      unlockScriptTx.inputs[0].setScript(unlockingScript);

      lockingTxid = await sendTx(unlockScriptTx);
      console.log("transfer txid3:    ", lockingTxid);
    }

    console.log("Succeeded on testnet");
    console.log(publicKey1.toHex());
    console.log(publicKey2.toHex());
    console.log(publicKey3.toHex());

    try {
      const API_PREFIX = "https://api.whatsonchain.com/v1/bsv/test";
      const res = await axios.get(`${API_PREFIX}/tx/hash/${lockingTxid}`);
      const contractData = res.data.vout[0].scriptPubKey.hex;

      const len = contractData.length;

      const DataLen = 2;
      const PubKeyLen = 33 * 2;

      const qty = parseInt(contractData.substr(len - DataLen, DataLen));

      const arrayEnd = len - DataLen;

      for (let i = 0; i < qty; i++) {
        const part = contractData.substr(
          arrayEnd - (i + 1) * (DataLen + PubKeyLen),
          PubKeyLen + DataLen
        );
        const addr = part.substr(0, PubKeyLen);
        const value = parseInt(part.substr(PubKeyLen, DataLen), 16);
        console.log(addr, value);
      }

      console.log(qty);
    } catch (err) {
      console.log(err);
    }
  } catch (error) {
    console.log("Failed on testnet");
    showError(error);
  }
})();
