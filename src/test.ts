import { KeyUtil } from "./keyUtil";
import { toHex, bsv } from "./scryptlib";
import { ParkingToken } from ".";
import { privateKey } from "./privateKey";
import { loadDesc, compileContract } from "./loadContract";
import { PrivateKey } from "bsv";

// console.log(
//   KeyUtil.getWIF("cUcQoY7yM7LYdUodyXgmdVCys5sh6FKoWVgPK2Atv4LJ6UNJELSD")
// );
// process.exit(0);

(async () => {
  const privateKey1 = bsv.PrivateKey.fromRandom("testnet");
  const publicKey1 = bsv.PublicKey.fromPrivateKey(privateKey1);

  const privateKey2 = bsv.PrivateKey.fromRandom("testnet");
  const publicKey2 = bsv.PublicKey.fromPrivateKey(privateKey2);

  compileContract("token.scrypt");
  const desc = loadDesc("token_desc.json");

  const user =
    "024eab4b47a563b47f04b9b68c3c2786c36c2c9861e65daacadcce310170109594";

  const pt = await ParkingToken.deployContract(privateKey, desc);
  await pt.addNewUser(user);
  await pt.transferTokens(user, 20);

  // const pt = await ParkingToken.fromTransaction(
  //   privateKey,
  //   '90b94fb974515b84207cb7af18e50772cc597e88f53bf9bace7392d9874d6755',
  //   desc
  // );

  // await pt.addNewUser(user);
  // await pt.transferTokens(user, 20);

  console.log(pt.ledger.toString());
  // console.log(await pt.transferTokens('025f1963ca1a57974efab80da3e6c6f8ea0430349401677bd6b84da52ea39422ae', 20))
  // console.log(await pt.transferTokensJSON(`030394da7fad1273924c889fbc76894217b27487061a5930f061fc696d0b17498c`, 10))
  // const mnemonic = KeyUtil.generateMnemonic();
  // console.log(mnemonic);
  // const prikey = KeyUtil.getPrivateKeyFromMnemonic(mnemonic);
  // console.log(prikey);
  // const prKey = KeyUtil.getPrivateKeyFromWIF(prikey);
  // const pub = KeyUtil.getPublicKey(prKey);
  // console.log(toHex(pub));
})();
