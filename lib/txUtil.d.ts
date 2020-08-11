export declare class TxUtil {
    static cache: Map<string, string>;
    static getTxData(txHash: string): Promise<string>;
    static getTxUnspentAmount(txHash: string): Promise<number>;
    static getLastTransaction(fundingTransaction: string): Promise<string>;
}
