export declare class TxUtil {
    static cache: Map<string, string>;
    static getTxData(txHash: string): Promise<string>;
    static getLastTransaction(fundingTransaction: string): Promise<string>;
}
