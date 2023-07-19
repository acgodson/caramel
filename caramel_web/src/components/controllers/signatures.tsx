import { ec as EC } from "elliptic";
import { SHA3 } from "sha3";
import forge from "node-forge";
import * as fcl from "@onflow/fcl";
//@ts-ignore
import * as t from "@onflow/types";
import FlowAccount from "@/lib/flowAccount";
import { result } from "lodash";
var Buffer = require("buffer").Buffer;
const p256 = new EC("p256");
const secp256 = new EC("secp256k1");

// Takes in a msg that is already in hex form, and a
// hashAlg in flow's key format for hash algorithms
// Return binary digest
const hashMsgHex = (msgHex: any) => {
  try {
    const sha = new SHA3(256);
    sha.update(Buffer.from(msgHex, "hex"));
    return sha.digest();
  } catch (e) {
    throw new Error("Unsupported hash alg provided");
  }
};

export const sign = async (privateKey: any, msgHex: any) => {
  const ec: any = p256;
  const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"));
  const sig = key.sign(hashMsgHex(msgHex));
  const n = 32;
  const r = sig.r.toArrayLike(Buffer, "be", n);
  const s = sig.s.toArrayLike(Buffer, "be", n);
  const result = Buffer.concat([r, s]).toString("hex");
  return result
};

export const verifyUserSignature = async (
  rawPublicKey: { toString: () => any; },
  weight: { toFixed: (arg0: number) => { (): any; new(): any; toString: { (): any; new(): any; }; }; },
  signature: { toString: () => any; },
  signedData: { toString: () => any; }
) => {
  // TODO: This cadence code should come from a cadence-to-json generated package
  // dedicated to this wallet and all cadence needed for it.
  const CODE = `
    import Crypto

    pub fun main(rawPublicKeys: [String], weights: [UFix64], signatures: [String], signedData: String): Bool {
      let keyList = Crypto.KeyList()
      var i = 0
      for rawPublicKey in rawPublicKeys {
        keyList.add(
          PublicKey(
            publicKey: rawPublicKey.decodeHex(),
            signatureAlgorithm: SignatureAlgorithm.ECDSA_P256 // or SignatureAlgorithm.ECDSA_Secp256k1
          ),
          hashAlgorithm: HashAlgorithm.SHA3_256,
          weight: weights[i],
        )
        i = i + 1
      }
    
      let signatureSet: [Crypto.KeyListSignature] = []
      var j = 0
      for signature in signatures {
        signatureSet.append(
          Crypto.KeyListSignature(
            keyIndex: j,
            signature: signature.decodeHex()
          )
        )
        j = j + 1
      }
    
      return keyList.verify(
        signatureSet: signatureSet,
        signedData: signedData.decodeHex(),
      )
    }
    `;

  let result;
  try {
    result = await fcl
      .send([
        fcl.script(CODE),
        fcl.args([
          fcl.arg([rawPublicKey.toString()], t.Array(t.String)),
          fcl.arg([weight.toFixed(1).toString()], t.Array(t.UFix64)),
          fcl.arg([signature.toString()], t.Array(t.String)),
          fcl.arg(signedData.toString(), t.String),
        ]),
        fcl.limit(9999),
      ])
      .then(fcl.decode);
  } catch (e) {
    console.error(e);
    throw new Error("Poorly formed private key entered");
  }
  return result;
};
