import { ABICoder, ABIEntity, FunctionCall, Script } from "./abi";
export interface TxContext {
    inputSatoshis?: number;
    tx?: any;
    hex?: string;
    inputIndex?: number;
    sighashFlags?: number;
}
export interface ContractDescription {
    compilerVersion: string;
    contract: string;
    md5: string;
    abi: Array<ABIEntity>;
    asm: string;
}
export declare class AbstractContract {
    static contracName: string;
    static abi: ABIEntity[];
    static asm: string;
    static abiCoder: ABICoder;
    scriptedConstructor: FunctionCall;
    get lockingScript(): Script;
    private _txContext?;
    set txContext(txContext: TxContext);
    get txContext(): TxContext;
    run_verify(unlockingScriptASM: string, txContext?: TxContext): boolean;
    private _dataLoad?;
    set dataLoad(dataInHex: string | undefined | null);
    get dataLoad(): string;
    get codePart(): Script | undefined;
    get dataPart(): Script | undefined;
}
export declare function buildContractClass(desc: ContractDescription): any;
export declare class VerificationError extends Error {
    message: string;
    context: Record<string, any>;
    constructor(message: string, context: Record<string, any>);
    toString(): string;
}
