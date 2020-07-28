import { KeyUtil } from "./keyUtil";
import { toHex } from "scryptlib/dist";

(async () => {
    // const privateKey1 = bsv.PrivateKey.fromRandom("testnet");
    // const publicKey1 = bsv.PublicKey.fromPrivateKey(privateKey1);
  
    // const privateKey2 = bsv.PrivateKey.fromRandom("testnet");
    // const publicKey2 = bsv.PublicKey.fromPrivateKey(privateKey2);
  
    // const pt = await ParkingToken.fromTransaction(
    //   privateKey,
    //   `b4479d3b5441fc7cbfe87886cfa1d4f936245092c417f5dc67d7a98b07b9c0fb`
    // );
  
    // console.log(pt.ledger.toString());
  
    const mnemonic = KeyUtil.generateMnemonic();
    console.log(mnemonic);
    const prikey = KeyUtil.getPrivateKeyFromMnemonic(mnemonic);
    console.log(prikey);
    const prKey = KeyUtil.getPrivateKeyFromWIF(prikey);
    const pub = KeyUtil.getPublicKey(prKey);
    console.log(toHex(pub));
  
  })();
  