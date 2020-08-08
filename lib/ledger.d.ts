export interface BalanceContractOp {
    fromIndex: number;
    toIndex: number;
    amount: number;
}
export declare class Ledger {
    private balances;
    private balancesArray;
    static fromTxData(txData: string): Ledger;
    addHolder(pubkey: string): number;
    transfer(fromPublicKey: string, toPublicKey: string, value: number): BalanceContractOp;
    getBalance(pubkey: string): number;
    setBalance(pubkey: string, value: number): void;
    getDataLoad(): string;
    toString(): string;
    private getIndex;
    private setBalanceByIndex;
}
