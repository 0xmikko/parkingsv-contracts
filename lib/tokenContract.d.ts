import { AbstractContract } from "./scryptlib/contract";
import { PubKey, Bytes } from "./scryptlib/scryptTypes";
import { Signature } from "bsv";
import { FunctionCall } from "./scryptlib/abi";
export interface TokenContract extends AbstractContract {
    addNewMember(sender: PubKey, sig: Signature, preimage: Bytes, newAmount: number, newUserPubKey: PubKey): FunctionCall;
    transfer(sender: PubKey, sig: Signature, preimage: Bytes, newAmount: number, fromIndex: number, toIndex: number, value: number): FunctionCall;
}
