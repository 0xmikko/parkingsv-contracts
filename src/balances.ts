import { num2bin } from "scryptlib/dist";
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

export class Ledger {
  private balances: Map<string, number> = new Map<string, number>();
  private balancesArray: Array<Balance> = new Array<Balance>();

  public addHolder(pubkey: string): number {
    if (this.balances.has(pubkey)) throw new Error("User already exists");

    const index = this.balancesArray.length;
    this.balancesArray.push({ pubkey, value: 0 });
    this.balances.set(pubkey, index);
    return index;
  }

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

  public getBalance(pubkey: string): number {
    const index = this.getIndex(pubkey);
    return this.balancesArray[index].value;
  }

  public setBalance(pubkey: string, value: number): void {
    const index = this.getIndex(pubkey);
    this.setBalanceByIndex(index, value);
  }

  public getDataLoad(): string {
    const balancesToString = this.balancesArray
      .map((balance) => balance.pubkey + num2bin(balance.value, DataLen))
      .join("");
    return balancesToString + num2bin(this.balances.size, DataLen);
  }

  public toString(): string {
    return this.balancesArray.map((balance, index) => `${index} : ${balance.pubkey} => ${balance.value}`).join("\n")
  }

  private getIndex(pubkey: string): number {
    const index = this.balances.get(pubkey);
    if (index === undefined) {
      throw new Error(`From public key balance not found!: ${pubkey}`);
    }
    return index;
  }

  private setBalanceByIndex(index: number, value: number) {
    this.balancesArray[index].value = value;
  }
}
