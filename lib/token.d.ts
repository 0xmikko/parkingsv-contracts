import { PrivateKey, PublicKey, Transaction } from "bsv";
import { ContractDescription } from "./scryptlib/contract";
import { Ledger } from "./ledger";
import { TokenContract } from "./tokenContract";
export declare class ParkingToken {
    tokenContract: TokenContract;
    ledger: Ledger;
    ownerPrivateKey: PrivateKey;
    ownerPublicKey: PublicKey;
    amount: number;
    fee: number;
    lockingTx: Transaction;
    lockingTxid: string;
    private constructor();
    static deployContract(privateKey: PrivateKey, desc: ContractDescription): Promise<ParkingToken>;
    initContract(): Promise<void>;
    initFromTxData(txData: string): Promise<void>;
    addNewUser(publicKey: string): Promise<string>;
    static fromTransaction(privateKey: PrivateKey, lastKnownTransaction: string, desc: ContractDescription): Promise<ParkingToken>;
    transferTokens(toAddress: string, amount: number): Promise<void>;
    transferTokensJSON(toAddress: string, amount: number): Promise<string>;
    payByJSON(txHex: string): Promise<void>;
    private prepareCall;
}
