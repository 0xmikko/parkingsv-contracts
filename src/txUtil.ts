import { bsv, toHex } from "scryptlib/dist";
import { AxiosResponse } from "axios";
import axios from "axios";

export class TxUtil {

  static cache : Map<string, string> = new Map<string, string>();

  static async getTxData(txHash: string): Promise<string> {
    if (TxUtil.cache.has(txHash)) {
      return TxUtil.cache.get(txHash) || "";
    }
    const resp2 = await axios.get(
      `https://api.whatsonchain.com/v1/bsv/test/tx/hash/${txHash}`
    );
    const result = resp2.data.vout[0].scriptPubKey.hex;
    TxUtil.cache.set(txHash, result);
    return result;
  }

  static async getLastTransaction(fundingTransaction: string): Promise<string> {

  
    const txData = await TxUtil.getTxData(fundingTransaction);
    const s = bsv.crypto.Hash.sha256(Buffer.from(txData, "hex")).reverse();
    const scriptHash = toHex(s);

    let resp: AxiosResponse;
    do {
      resp = await axios.get(
        `https://api.whatsonchain.com/v1/bsv/test/script/${scriptHash}/history`
      );
      if (resp.data.length === 0) {
        await new Promise((r) => setTimeout(r, 100));
      }
    } while (resp.data.length === 0);

    if (resp.data.length === 1 && resp.data[0].tx_hash === fundingTransaction)
      return fundingTransaction;

    for (let trans of resp.data) {
      const resp2 = await axios.get(
        `https://api.whatsonchain.com/v1/bsv/test/tx/hash/${trans.tx_hash}`
      );
      if (resp2.data.vin[0].txid === fundingTransaction) {
        return await TxUtil.getLastTransaction(trans.tx_hash);
      }
    }

    return "";
  }
}
