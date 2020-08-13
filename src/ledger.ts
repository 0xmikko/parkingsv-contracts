import { num2bin } from "./scryptlib/utils";
import { DataLen } from "./helper";

interface Balance {
  pubkey: string;
  value: number;
}

export interface BalanceContractOp {
  fromIndex: number;
  toIndex: number;
  amount: number;
}

// Contract data storage
// Stores balances
export class Ledger {
  private balances: Map<string, number> = new Map<string, number>();
  private balancesArray: Array<Balance> = new Array<Balance>();

  // Creates Ledger from raw contract data
  static fromTxData(txData: string): Ledger {
    const ledger = new Ledger();

    const len = txData.length;

    // Datalen in 2 Hex digits symbols
    const DataLen = 1 * 2;

    // PublicKey in Hex digits symbols
    const PubKeyLen = 33 * 2;

    const qty = parseInt(txData.substr(len - DataLen, DataLen));

    const arrayEnd = len - DataLen;

    for (let i = 0; i < qty; i++) {
      // extract a string contains balance and holder
      const part = txData.substr(
        arrayEnd - (i + 1) * (DataLen + PubKeyLen),
        PubKeyLen + DataLen
      );

      // getting pubkey
      const addr = part.substr(0, PubKeyLen);

      // getting value
      const value = parseInt(part.substr(PubKeyLen, DataLen), 16);

      // adding holder and setting value
      ledger.addHolder(addr);
      ledger.setBalance(addr, value);
    }
    return ledger;
  }

  // Adds new balance holder
  public addHolder(pubkey: string): number {
    if (this.balances.has(pubkey)) throw new Error("User already exists");

    const index = this.balancesArray.length;
    this.balancesArray.push({ pubkey, value: 0 });
    this.balances.set(pubkey, index);
    return index;
  }

  // Transfer money from one to another balance holders
  public transfer(
    fromPublicKey: string,
    toPublicKey: string,
    value: number
  ): BalanceContractOp {
    const senderIndex = this.getIndex(fromPublicKey);
    const senderBalance = this.getBalance(fromPublicKey);

    const receiverIndex = this.getIndex(toPublicKey);
    const receiverBalance = this.getBalance(toPublicKey);

    if (senderBalance < value) {
      throw new Error("Not enought money on account");
    }

    this.setBalanceByIndex(senderIndex, senderBalance - value);
    this.setBalanceByIndex(receiverIndex, receiverBalance + value);

    return {
      fromIndex: senderIndex,
      toIndex: receiverIndex,
      amount: value,
    };
  }

  // Get balance for holer 
  public getBalance(pubkey: string): number {
    const index = this.getIndex(pubkey);
    return this.balancesArray[index].value;
  }

  // Set balance for holder
  public setBalance(pubkey: string, value: number): void {
    const index = this.getIndex(pubkey);
    this.setBalanceByIndex(index, value);
  }

  // Generated data load for tx
  public getDataLoad(): string {
    const balancesToString = this.balancesArray
      .map((balance) => balance.pubkey + num2bin(balance.value, DataLen))
      .join("");
    return balancesToString + num2bin(this.balances.size, DataLen);
  }

  public toString(): string {
    return this.balancesArray
      .map(
        (balance, index) => `${index} : ${balance.pubkey} => ${balance.value}`
      )
      .join("\n");
  }

  // Find index by public key. If not found throws an error
  private getIndex(pubkey: string): number {
    const index = this.balances.get(pubkey);
    if (index === undefined) {
      throw new Error(`From public key balance not found!: ${pubkey}`);
    }
    return index;
  }

  private setBalanceByIndex(index: number, value: number) {
    if (index >= this.balancesArray.length) throw new Error("Incorrect index")
    this.balancesArray[index].value = value;
  }
}
