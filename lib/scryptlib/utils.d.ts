import bsv = require('bsv');
export { bsv };
export declare const DEFAULT_FLAGS: number;
export declare const DEFAULT_SIGHASH_TYPE: number;
export declare function bool2Asm(str: string): string;
/**
 * decimal int to little-endian signed magnitude
 */
export declare function int2Asm(str: string): string;
/**
 * convert literals to script ASM format
 */
export declare function literal2Asm(l: string): [string, string];
export declare function bytes2Literal(bytearray: number[], type: string): string;
export declare function bytesToHexString(bytearray: number[]): string;
export declare function hexStringToBytes(hex: string): number[];
export declare function getValidatedHexString(hex: string, allowEmpty?: boolean): string;
export declare function signTx(tx: any, privateKey: any, lockingScriptASM: string, inputAmount: number, inputIndex?: number, sighashType?: number, flags?: number): any;
export declare function toHex(x: {
    toString(format: 'hex'): string;
}): string;
export declare function getPreimage(tx: any, inputLockingScriptASM: string, inputAmount: number, inputIndex?: number, sighashType?: number, flags?: number): any;
export declare function num2bin(n: number, dataLen: number): string;
