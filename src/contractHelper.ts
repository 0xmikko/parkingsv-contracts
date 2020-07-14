import { Bytes, PubKey } from "scryptlib";
import { sendTx, showError } from "./helper";

import { Script, Transaction, Signature } from "bsv";

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

  private _unlockingScript: Script;

  set unlockingScript(script: Script) {
    this._unlockingScript = script;
    this.unlockScriptTx.inputs[0].setScript(this._unlockingScript);
  }

  async sendTX(): Promise<string> {
    try {
      const lockingTxid = await sendTx(this.unlockScriptTx);
      console.log("transfer txid2[NEW CELL]:    ", lockingTxid);
      return lockingTxid;
    } catch (err) {
      showError(err);
    }
    return "";
  }
}
