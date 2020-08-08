import { Script, Transaction, Signature } from "bsv";
import { PubKey, Bytes } from "./scryptlib/scryptTypes";
export declare class ContractCallHelper {
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
    });
    set unlockingScript(script: Script);
    sendTX(): Promise<string>;
    getTxJSON(): string;
}
