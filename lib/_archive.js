"use strict";
// const pt = await ParkingToken.deployContract(privateKey);
// const fundingTransaction = await pt.addNewUser(toHex(publicKey1));
// await pt.transferTokens(toHex(publicKey1), 20);
// await pt.addNewUser(toHex(publicKey2));
// await pt.transferTokens(toHex(publicKey2), 20);
// await new Promise((r) => setTimeout(r, 2000));
// const fundingTransaction = '093a8c569dc7c8743662056277f59d79e288f40f6d60a9699ba95211eac8a3cb';
//
// console.log(resp.data.vout[0].scriptPubKey.hex)
// const pubkey = privateKey.toAddress();
// // const resp = await axios.get(`https://api.whatsonchain.com/v1/bsv/test/address/${pubkey}/history`);
// // console.log(resp.data)
// // }
// console.log(await TxUtil.getLastTransaction(fundingTransaction));
// // for(let output of resp.data.vout) {
//   if (output.scriptPubKey.type === 'nonstandard') {
//     console.log(output.scriptPubKey.hex)
//
//   }
// }
// const {scriptPubKey} = resp.data;
// if (scriptPubKey !== undefined) {
//   const resp2 = await axios.get(`https://api.whatsonchain.com/v1/bsv/test/script/${scriptPubKey}/unspent`);
//   console.log(resp2.data)
// }
process.exit(1);
// const privateKey3 = bsv.PrivateKey.fromRandom("testnet");
// const publicKey3 = bsv.PublicKey.fromPrivateKey(privateKey3);
// try {
//   const Token = buildContractClass(loadDesc("token_desc.json"));
//   // Creating temporary instance to calulatte code size
//   // const tokenTmp = new Token()
//   // const scriptLength =  tokenTmp.lockingScript.toHex().length/2 + 2;
//   // console.log("SCRIPTLENT:", scriptLength)
//   const token = new Token();
//   ////////////////// ---- Initialization ------- //////////////////////////
//   // append state as passive data part
//   // initial token supply 100: publicKey1 has 100, publicKey2 0
//   token.dataLoad =
//     toHex(publicKey1) +
//     num2bin(100, DataLen) +
//     toHex(publicKey2) +
//     num2bin(0, DataLen) +
//     num2bin(2, DataLen);
//   const scriptLengthF =
//     token.lockingScript.toHex().length / 2 - token.dataLoad.length / 2;
//   console.log("SCRIPTLENT:", scriptLengthF);
//   let amount = 10000;
//   const FEE = 2000;
//   const fee = FEE;
//   // for(let fee=0; fee < 100000; fee += 1000) {
//   //   try {
//   // lock fund to the script
//   const lockingTx = await createLockingTx(
//     privateKey.toAddress(),
//     amount,
//     fee || FEE
//   );
//   lockingTx.outputs[0].setScript(token.lockingScript);
//   lockingTx.sign(privateKey);
//   console.log("fee:      ", fee || FEE);
//   let lockingTxid = await sendTx(lockingTx);
//   console.log("funding txid:      ", lockingTxid);
//   //     break;
//   //   } catch (err) {
//   //     console.log('err')
//   //   }
//   // }
//   // transfer 40 tokens from publicKey1 to publicKey2
//   ////////////////// ---- Transfer 40 tokens ------- //////////////////////////
//   {
//     // Getting last contract instance
//     const prevLockingScript = token.lockingScript;
//     // update data state [!]
//     token.dataLoad =
//       toHex(publicKey1) +
//       num2bin(60, DataLen) +
//       toHex(publicKey2) +
//       num2bin(40, DataLen) +
//       num2bin(2, DataLen);
//     // console.log(token.lockingScript.toHex())
//     // console.log(bsv.Script.fromASM(token.dataLoad))
//     const newLockingScriptASM = token.lockingScript.toASM();
//     const newAmount = amount - FEE;
//     const unlockScriptTx = await createUnlockingTx(
//       lockingTxid,
//       amount,
//       prevLockingScript.toASM(),
//       newAmount,
//       newLockingScriptASM
//     );
//     // call contract method to get unlocking script
//     const preimage = getPreimage(
//       unlockScriptTx,
//       prevLockingScript.toASM(),
//       amount
//     );
//     // SIGN CONTRACT BY SIGNATURE 1
//     const sig1 = signTx(
//       unlockScriptTx,
//       privateKey1,
//       prevLockingScript.toASM(),
//       amount
//     );
//     const unlockingScript = token
//       .transfer(
//         new PubKey(toHex(publicKey1)),
//         new Sig(toHex(sig1)),
//         40,
//         new Bytes(toHex(preimage)),
//         newAmount,
//         0,
//         1
//       )
//       .toScript();
//     // set unlocking script
//     unlockScriptTx.inputs[0].setScript(unlockingScript);
//     lockingTxid = await sendTx(unlockScriptTx);
//     console.log("transfer txid1:    ", lockingTxid);
//     amount = newAmount;
//   }
//   ////////////////// ---- Adding new array cell ------- //////////////////////////
//   {
//     // Getting last contract instance
//     const prevLockingScript = token.lockingScript;
//     // update data state [!]
//     token.dataLoad =
//       toHex(publicKey1) +
//       num2bin(60, DataLen) +
//       toHex(publicKey2) +
//       num2bin(40, DataLen) +
//       toHex(publicKey3) +
//       num2bin(0, DataLen) +
//       num2bin(3, DataLen);
//     // console.log(token.lockingScript.toHex())
//     console.log(toHex(publicKey1));
//     console.log(bsv.Script.fromASM(token.dataLoad));
//     const s1 = token.lockingScript.toHex();
//     const s2 = bsv.Script.fromASM(token.dataLoad).toHex();
//     console.log(s1);
//     console.log(s2);
//     const dataEnd = s1.indexOf(s2) / 2;
//     console.log(dataEnd);
//     console.log(s1.substr(dataEnd * 2));
//     console.log(s2.length);
//     const newLockingScriptASM = token.lockingScript.toASM();
//     const newAmount = amount - FEE;
//     const unlockScriptTx = await createUnlockingTx(
//       lockingTxid,
//       amount,
//       prevLockingScript.toASM(),
//       newAmount,
//       newLockingScriptASM
//     );
//     // call contract method to get unlocking script
//     const preimage = getPreimage(
//       unlockScriptTx,
//       prevLockingScript.toASM(),
//       amount
//     );
//     const sig1 = signTx(
//       unlockScriptTx,
//       privateKey1,
//       prevLockingScript.toASM(),
//       amount
//     );
//     const unlockingScript = token
//       .addNewMember(
//         new PubKey(toHex(publicKey1)),
//         new Sig(toHex(sig1)),
//         new Bytes(toHex(preimage)),
//         new PubKey(toHex(publicKey3)),
//         newAmount
//       )
//       .toScript();
//     // set unlocking script
//     unlockScriptTx.inputs[0].setScript(unlockingScript);
//     lockingTxid = await sendTx(unlockScriptTx);
//     console.log("transfer txid2[NEW CELL]:    ", lockingTxid);
//     amount = newAmount;
//   }
//   ////////////////// ---- Transfer 10  ------- //////////////////////////
//   // transfer 10 tokens from publicKey2 [User:1] to publicKey1 [User:0]
//   {
//     const prevLockingScript = token.lockingScript;
//     // update data state
//     token.dataLoad =
//       toHex(publicKey1) +
//       num2bin(70, DataLen) +
//       toHex(publicKey2) +
//       num2bin(30, DataLen) +
//       toHex(publicKey3) +
//       num2bin(0, DataLen) +
//       num2bin(3, DataLen);
//     const newLockingScriptASM = token.lockingScript.toASM();
//     const newAmount = amount - FEE;
//     const unlockScriptTx = await createUnlockingTx(
//       lockingTxid,
//       amount,
//       prevLockingScript.toASM(),
//       newAmount,
//       newLockingScriptASM
//     );
//     // call contract method to get unlocking script
//     const preimage = getPreimage(
//       unlockScriptTx,
//       prevLockingScript.toASM(),
//       amount
//     );
//     const sig2 = signTx(
//       unlockScriptTx,
//       privateKey2,
//       prevLockingScript.toASM(),
//       amount
//     );
//     const unlockingScript = token
//       .transfer(
//         new PubKey(toHex(publicKey2)),
//         new Sig(toHex(sig2)),
//         10,
//         new Bytes(toHex(preimage)),
//         newAmount,
//         1,
//         0
//       )
//       .toScript();
//     // set unlocking script
//     unlockScriptTx.inputs[0].setScript(unlockingScript);
//     lockingTxid = await sendTx(unlockScriptTx);
//     console.log("transfer txid3:    ", lockingTxid);
//   }
//   console.log("Succeeded on testnet");
//   console.log(publicKey1.toHex());
//   console.log(publicKey2.toHex());
//   console.log(publicKey3.toHex());
//   try {
//     const API_PREFIX = "https://api.whatsonchain.com/v1/bsv/test";
//     const res = await axios.get(`${API_PREFIX}/tx/hash/${lockingTxid}`);
//     const contractData = res.data.vout[0].scriptPubKey.hex;
//     const len = contractData.length;
//     const DataLen = 2;
//     const PubKeyLen = 33 * 2;
//     const qty = parseInt(contractData.substr(len - DataLen, DataLen));
//     const arrayEnd = len - DataLen;
//     for (let i = 0; i < qty; i++) {
//       const part = contractData.substr(
//         arrayEnd - (i + 1) * (DataLen + PubKeyLen),
//         PubKeyLen + DataLen
//       );
//       const addr = part.substr(0, PubKeyLen);
//       const value = parseInt(part.substr(PubKeyLen, DataLen), 16);
//       console.log(addr, value);
//     }
//     console.log(qty);
//   } catch (err) {
//     console.log(err);
//   }
// } catch (error) {
//   console.log("Failed on testnet");
//   showError(error);
// }
//# sourceMappingURL=_archive.js.map