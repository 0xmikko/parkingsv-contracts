/// <reference path="types.d.ts" />
export const inputIndex: 0;
export const inputSatoshis: 1000000;
export const tx: import("bsv").Transaction;
export function createLockingTx(address: any, amountInContract: any, fee: any): Promise<import("bsv").Transaction>;
export function createUnlockingTx(prevTxId: any, inputAmount: any, inputLockingScriptASM: any, outputAmount: any, outputLockingScriptASM: any): import("bsv").Transaction;
export const DataLen: 1;
export const dummyTxId: "a477af6b2667c29670467e4e0728b685ee07b240235771862318e29ddbe58458";
export function unlockP2PKHInput(privateKey: any, tx: any, inputIndex: any, sigtype: any): void;
export function sendTx(tx: any): Promise<any>;
export function sendTxHex(txhex: any): Promise<any>;
export function showError(error: any): void;
