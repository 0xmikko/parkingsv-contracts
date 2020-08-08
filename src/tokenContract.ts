import { AbstractContract } from "./scryptlib/contract";
import { PubKey, Bytes } from "./scryptlib/scryptTypes";
import { Signature } from "bsv";
import { FunctionCall } from "./scryptlib/abi";

// --------- TOKEN CONTRACT INTERFACE ---------------------
export interface TokenContract extends AbstractContract {
    addNewMember(
      // Contract info
      sender: PubKey,
      sig: Signature,
      preimage: Bytes,
      newAmount: number,
      // 
      newUserPubKey: PubKey,
    ): FunctionCall;

    transfer(    
      // Contract info
      sender: PubKey,
      sig: Signature,
      preimage: Bytes,
      newAmount: number,

      // Function info
      fromIndex: number,
      toIndex: number,
      value: number,
    ) : FunctionCall;
  }