import { AbstractContract, TxContext } from './contract';
import { ScryptType } from './scryptTypes';
export declare enum ABIEntityType {
    FUNCTION = "function",
    CONSTRUCTOR = "constructor"
}
export interface ABIEntity {
    type: ABIEntityType;
    name: string;
    params: Array<{
        name: string;
        type: string;
    }>;
    index?: number;
}
export interface Script {
    toASM(): string;
    toHex(): string;
}
export declare type SupportedParamType = ScryptType | boolean | number | BigInt;
export declare class FunctionCall {
    methodName: string;
    params: SupportedParamType[];
    readonly contract: AbstractContract;
    readonly lockingScript?: Script;
    readonly unlockingScript?: Script;
    constructor(methodName: string, params: SupportedParamType[], binding: {
        contract: AbstractContract;
        lockingScriptASM?: string;
        unlockingScriptASM?: string;
    });
    toASM(): string;
    toString(): string;
    toScript(): Script;
    toHex(): string;
    verify(txContext?: TxContext): boolean;
}
export declare class ABICoder {
    abi: ABIEntity[];
    constructor(abi: ABIEntity[]);
    encodeConstructorCall(contract: AbstractContract, asmTemplate: string, ...args: SupportedParamType[]): FunctionCall;
    encodePubFunctionCall(contract: AbstractContract, name: string, args: SupportedParamType[]): FunctionCall;
    encodeParams(args: SupportedParamType[], scryptTypeNames: string[]): string;
    encodeParam(arg: SupportedParamType, scryptTypeName: string): string;
}
