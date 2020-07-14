import { AbstractContract } from "scryptlib/dist/contract";
import { PubKey, Bytes } from "scryptlib/dist";
import { Signature } from "bsv";
import { FunctionCall } from "scryptlib/dist/abi";

// --------- TOKEN CONTRACT INTERFACE ---------------------
export interface TokenContract extends AbstractContract {
    addNewMember(
      sender: PubKey,
      sig: Signature,
      preimage: Bytes,
      newUserPubKey: PubKey,
      newAmount: number
    ): FunctionCall;
  }