import { bsv, toHex } from "scryptlib";
import { PublicKey, HDPrivateKey, PrivateKey } from "bsv";
import * as Mnemonic from "bsv/mnemonic";

export class KeyUtil {
  static generateMnemonic(): string {
    var mnemonic = Mnemonic.fromRandom();
    return mnemonic.toString();
  }

  static getPrivateKeyFromMnemonic(mnemonicStr: string): string {
    const mnemonic = Mnemonic.fromString(mnemonicStr);
    const hdPrivateKey = bsv.HDPrivateKey as HDPrivateKey;
    const privateKey = hdPrivateKey.fromSeed(mnemonic.toSeed(), bsv.Networks.TESTNET).privateKey;
    return privateKey.toWIF();
  }

  static getAddress(wif: string): string {
    const privateKey = KeyUtil.getPrivateKeyFromWIF(wif);
    return toHex(KeyUtil.getPublicKey(privateKey));
  }

  static getPrivateKeyFromWIF(key: string): PrivateKey {
    return bsv.PrivateKey.fromWIF(key);
  }

  static getPublicKey(privateKey: PrivateKey): PublicKey {
    return bsv.PublicKey.fromPrivateKey(privateKey);
  }
}
