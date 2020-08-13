import { AxiosResponse } from "axios";
import axios from "axios";
import { bsv, toHex } from "./scryptlib/utils";
import { showError } from "./helper";

export class TxUtil {

  static SATOSHI_IN_BITCOIN = 100000000;
  static NETWORK = "test";
  static API = `https://api.whatsonchain.com/v1/bsv/${TxUtil.NETWORK}`;

  static cache: Map<string, string> = new Map<string, string>();

  // Returns localscript data in Hex format
  static async getTxData(txHash: string): Promise<string> {
    if (TxUtil.cache.has(txHash)) {
      return TxUtil.cache.get(txHash) || "";
    }
    const resp2 = await axios.get(
      `${TxUtil.API}/tx/hash/${txHash}`
    );
    const result = resp2.data.vout[0].scriptPubKey.hex;
    TxUtil.cache.set(txHash, result);
    return result;
  }

  // Returns unspent amount
  static async getTxUnspentAmount(txHash: string): Promise<number> {
    const resp = await axios.get(
      `${TxUtil.API}/test/tx/hash/${txHash}`
    );
    return Math.floor(resp.data.vout[0].value * TxUtil.SATOSHI_IN_BITCOIN);
  }

  // Finds last transaction
  static async getLastTransaction(fundingTransaction: string): Promise<string> {
    try {
      const txData = await TxUtil.getTxData(fundingTransaction);
      const s = bsv.crypto.Hash.sha256(Buffer.from(txData, "hex")).reverse();
      const scriptHash = toHex(s);

      let resp: AxiosResponse;
      do {
        resp = await axios.get(
          `${TxUtil.API}/script/${scriptHash}/history`
        );
        if (resp.data.length === 0) {
          await new Promise((r) => setTimeout(r, 100));
        }
      } while (resp.data.length === 0);

      console.log(resp.data);
      if (resp.data.length === 1 && resp.data[0].tx_hash === fundingTransaction)
        return fundingTransaction;

      for (let trans of resp.data) {
        const resp = await axios.get(
          `${TxUtil.API}/tx/hash/${trans.tx_hash}`
        );

        console.log(resp.data);
        if (resp.data.vin[0].txid === fundingTransaction) {
          return await TxUtil.getLastTransaction(trans.tx_hash);
        }
      }
    } catch (err) {
      showError(err);
    }

    throw new Error("Transaction not found")
  }
}
