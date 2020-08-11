import { sendTx, showError } from "./helper";

import { Script, Transaction, Signature } from "bsv";
import { PubKey, Bytes } from "./scryptlib/scryptTypes";

export class ContractCallHelper {
  sender: PubKey;
  signature: Signature;
  preimage: Bytes;
  newAmount: number;
  unlockScriptTx: Transaction;

  constructor(data: {
    sender: PubKey;
    signature: Signature;
    preimage: Bytes;
    newAmount: number;
    unlockScriptTx: Transaction;
  }) {
    this.sender = data.sender;
    this.signature = data.signature;
    this.preimage = data.preimage;
    this.newAmount = data.newAmount;
    this.unlockScriptTx = data.unlockScriptTx;
  }


  set unlockingScript(script: Script) {
    this.unlockScriptTx.inputs[0].setScript(script);
  }

  async sendTX(): Promise<string> {
    try {
      const lockingTxid = await sendTx(this.unlockScriptTx);
      console.log("tx id:    ", lockingTxid);
      return lockingTxid;
    } catch (err) {
      showError(err);
    }
    return "";
  }

  getTxJSON() : string {
    return this.unlockScriptTx.serialize();
  }
}
