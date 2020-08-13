import { PrivateKey, PublicKey, Script, Signature, Transaction } from "bsv";
import {
  buildContractClass,
  ContractDescription,
} from "./scryptlib/contract";
import { Bytes, PubKey, Sig } from "./scryptlib/scryptTypes";
import { bsv, getPreimage, signTx, toHex } from "./scryptlib/utils";

import { ContractCallHelper } from "./contractHelper";
import { createLockingTx, createUnlockingTx, sendTx, sendTxHex } from "./helper";
import { Ledger } from "./ledger";
import { TokenContract } from "./tokenContract";
import { TxUtil } from "./txUtil";

export class ParkingToken {
  tokenContract: TokenContract;
  ledger: Ledger;

  ownerPrivateKey: PrivateKey;
  ownerPublicKey: PublicKey;

  amount: number = 30000;
  fee: number = 2000;
  lockingTx: Transaction;
  lockingTxid: string;

  private constructor(privateKey: PrivateKey, desc: ContractDescription) {
    const Token = buildContractClass(desc);
    this.tokenContract = new Token();
    this.ledger = new Ledger();
    this.ownerPrivateKey = privateKey;
    this.ownerPublicKey = bsv.PublicKey.fromPrivateKey(this.ownerPrivateKey);
  }

  // Deploy new contract and returns ParkingToken class
  static async deployContract(
    privateKey: PrivateKey,
    desc: ContractDescription
  ): Promise<ParkingToken> {
    const instance = new ParkingToken(privateKey, desc);
    await instance.initContract();
    return instance;
  }

  async initContract(): Promise<void> {
    try {
      this.ledger.addHolder(toHex(this.ownerPublicKey));
      this.ledger.setBalance(toHex(this.ownerPublicKey), 100);

      this.tokenContract.dataLoad = this.ledger.getDataLoad();

      const scriptLengthF =
        this.tokenContract.lockingScript.toHex().length / 2 -
        this.tokenContract.dataLoad.length / 2;

      console.log(`Script length: ${scriptLengthF} bytes`);

      this.lockingTx = await createLockingTx(
        this.ownerPrivateKey.toAddress(),
        this.amount,
        this.fee
      );
      this.lockingTx.outputs[0].setScript(
        this.tokenContract.lockingScript as Script
      );
      this.lockingTx.sign(this.ownerPrivateKey);
      console.log("fee:      ", this.fee);

      this.lockingTxid = await sendTx(this.lockingTx);

      console.log("funding txid:      ", this.lockingTxid);
    } catch (err) {
      console.log(err);
    }
  }

  public async initFromTxData(txData: string) {
    this.ledger = Ledger.fromTxData(txData);
  }

  // Adds balance holder for token balance array on contract
  async addNewUser(publicKey: string): Promise<string> {
    // Getting last contract instance
    console.log(`[TOKEN CONTRACT]: Adding ${publicKey}`);

    this.ledger.addHolder(publicKey);

    // update data state [!]

    const cch = await this.prepareCall();
    cch.unlockingScript = this.tokenContract
      .addNewMember(
        cch.sender,
        cch.signature,
        cch.preimage,
        cch.newAmount,
        new PubKey(publicKey)
      )
      .toScript() as Script;

    this.lockingTxid = await cch.sendTX();
    this.amount = cch.newAmount;
    return this.lockingTxid;
  }

  // Create Parking Token Class based on info found with last known transactions
  // It found the last transaction and set ledger with last known state
  static async fromTransaction(
    privateKey: PrivateKey,
    lastKnownTransaction: string,
    desc: ContractDescription
  ): Promise<ParkingToken> {
    const instance = new ParkingToken(privateKey, desc);
    const lastTransaction = await TxUtil.getLastTransaction(
      lastKnownTransaction
    );

    const txData = await TxUtil.getTxData(lastTransaction);
    instance.initFromTxData(txData);

    instance.lockingTxid = lastTransaction;
    instance.amount = await TxUtil.getTxUnspentAmount(lastTransaction);
    console.log(instance.amount)
    return instance;
  }

  // Transfer tokens from contract owner (a person who runs this code) to pubkey
  async transferTokens(toAddress: string, amount: number): Promise<void> {
    const transferData = this.ledger.transfer(
      toHex(this.ownerPublicKey),
      toAddress,
      amount
    );
    console.log(this.ledger.toString());
    console.log(transferData);

    const cch = await this.prepareCall();
    cch.unlockingScript = this.tokenContract
      .transfer(
        cch.sender,
        cch.signature,
        cch.preimage,
        cch.newAmount,
        transferData.fromIndex,
        transferData.toIndex,
        transferData.amount
      )
      .toScript() as Script;

    this.lockingTxid = await cch.sendTX();
    this.amount = cch.newAmount;
  }

  // Serialize TX for Hex format to be able to transfer from mobile app to node
  async transferTokensJSON(toAddress: string, amount: number): Promise<string> {
    const transferData = this.ledger.transfer(
      toHex(this.ownerPublicKey),
      toAddress,
      amount
    );
    console.log(this.ledger.toString());
    console.log(transferData);

    const cch = await this.prepareCall();
    cch.unlockingScript = this.tokenContract
      .transfer(
        cch.sender,
        cch.signature,
        cch.preimage,
        cch.newAmount,
        transferData.fromIndex,
        transferData.toIndex,
        transferData.amount
      )
      .toScript() as Script;

    return cch.getTxJSON();
  }


  // Make a payment by serialised TX
  async payByJSON(txHex: string) {
    const buffer = Buffer.from(txHex);
    const tx = new Transaction(buffer);
    console.log(tx);
    const lockingTxid = await sendTxHex(txHex);
    const txData = await TxUtil.getTxData(lockingTxid);
    this.initFromTxData(txData);

    this.lockingTxid = lockingTxid ;
    this.amount = await TxUtil.getTxUnspentAmount(lockingTxid );
    console.log(this.amount)

  }

  // Prepare ContractCallHelpser for contract call based on Parking Token data
  private async prepareCall(): Promise<ContractCallHelper> {
    const prevLockingScript = this.tokenContract.lockingScript;
    this.tokenContract.dataLoad = this.ledger.getDataLoad();

    const newLockingScriptASM = this.tokenContract.lockingScript.toASM();
    const newAmount = this.amount - this.fee;

    if (newAmount < 0) throw new Error("Not enough money on contract!");

    const unlockScriptTx = createUnlockingTx(
      this.lockingTxid,
      this.amount,
      prevLockingScript.toASM(),
      newAmount,
      newLockingScriptASM
    ) as Transaction; // here was AWAIT(!)

    // call contract method to get unlocking script
    const preimage = getPreimage(
      unlockScriptTx,
      prevLockingScript.toASM(),
      this.amount
    );

    const sig1 = signTx(
      unlockScriptTx,
      this.ownerPrivateKey,
      prevLockingScript.toASM(),
      this.amount
    );

    // Generating Contract Call Helper structure
    return new ContractCallHelper({
      sender: new PubKey(toHex(this.ownerPublicKey)),
      signature: new Sig(toHex(sig1)) as Signature,
      preimage: new Bytes(toHex(preimage)),
      newAmount,
      unlockScriptTx,
    });
  }
}
