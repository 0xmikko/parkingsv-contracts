import { PublicKey, PrivateKey } from "bsv";
export declare class KeyUtil {
    static generateMnemonic(): string;
    static getPrivateKeyFromMnemonic(mnemonicStr: string): string;
    static getAddress(wif: string): string;
    static getWIF(wif: string): string;
    static getPrivateKeyFromWIF(key: string): PrivateKey;
    static getPublicKey(privateKey: PrivateKey): PublicKey;
}
