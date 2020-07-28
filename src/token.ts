import {
  bsv,
  buildContractClass,
  getPreimage,
  toHex,
  num2bin,
  Bytes,
  signTx,
  PubKey,
  PrivKey,
  Sig,
  Sha256,
} from "scryptlib";
import {
  DataLen,
  loadDesc,
  createUnlockingTx,
  createLockingTx,
  sendTx,
  showError,
  compileContract,
} from "./helper";

import axios, { AxiosResponse } from "axios";
import { Script, Transaction, PrivateKey, PublicKey, Signature } from "bsv";
import { privateKey } from "./privateKey";

import { ContractCallHelper } from "./contractHelper";
import { TokenContract } from "./tokenContract";
import { Ledger } from "./ledger";
import { exit } from "process";
import { TxUtil } from "./txUtil";
import { KeyUtil } from "./keyUtil";

export class ParkingToken {
  tokenContract: TokenContract;
  ledger: Ledger;

  ownerPrivateKey: PrivateKey;
  ownerPublicKey: PublicKey;

  amount: number = 8500;
  fee: number = 2000;
  lockingTx: Transaction;
  lockingTxid: string;

  private constructor(privateKey: PrivateKey) {
    const Token = buildContractClass(loadDesc("token_desc.json"));
    this.tokenContract = new Token();
    this.ledger = new Ledger();
    this.ownerPrivateKey = privateKey;
    this.ownerPublicKey = bsv.PublicKey.fromPrivateKey(this.ownerPrivateKey);
  }

  static async deployContract(privateKey: PrivateKey): Promise<ParkingToken> {
    compileContract("token.scrypt");
    const instance = new ParkingToken(privateKey);
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

  // Restore contract from address
  static async fromTransaction(
    privateKey: PrivateKey,
    lastKnownTransaction: string
  ): Promise<ParkingToken> {
    compileContract("token.scrypt");
    console.log("Compilation finished")
    const instance = new ParkingToken(privateKey);
    const lastTransaction = await TxUtil.getLastTransaction(
      lastKnownTransaction
    );
    const txData = await TxUtil.getTxData(lastTransaction);
    instance.initFromTxData(txData);
    return instance;
  }

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
