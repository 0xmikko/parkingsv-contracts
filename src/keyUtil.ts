import { PublicKey, HDPrivateKey, PrivateKey } from "bsv";
import * as Mnemonic from "bsv/mnemonic";
import { bsv, toHex } from "./scryptlib/utils";

export class KeyUtil {
  static generateMnemonic(): string {
    var mnemonic = Mnemonic.fromRandom();
    return mnemonic.toString();
  }

  static getPrivateKeyFromMnemonic(mnemonicStr: string): string {
    const mnemonic = Mnemonic.fromString(mnemonicStr);
    const hdPrivateKey = bsv.HDPrivateKey;
    const privateKey = hdPrivateKey.fromSeed(mnemonic.toSeed(), bsv.Networks.testnet).privateKey;
    return privateKey.toWIF();
  }

  static getAddress(wif: string): string {
    const privateKey = KeyUtil.getPrivateKeyFromWIF(wif);
    return toHex(KeyUtil.getPublicKey(privateKey));
  }

  static getWIF(wif: string): string {
    const privateKey = KeyUtil.getPrivateKeyFromWIF(wif);
    return privateKey.toAddress().toString();
  }

  static getPrivateKeyFromWIF(key: string): PrivateKey {
    return bsv.PrivateKey.fromWIF(key);
  }

  static getPublicKey(privateKey: PrivateKey): PublicKey {
    return bsv.PublicKey.fromPrivateKey(privateKey);
  }
}
