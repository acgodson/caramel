import { ec as EC } from "elliptic";
import crypto from "crypto";

const curve = new EC("p256");

function encryptAESGCM(msg: any, secretKey: any) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", secretKey, iv);
  const ciphertext = Buffer.concat([cipher.update(msg), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return { ciphertext, iv, authTag };
}

function eccPointTo256BitKey(point: any) {
  const xBytes = point.getX().toArrayLike(Buffer, "be", 32);
  const yBytes = point.getY().toArrayLike(Buffer, "be", 32);
  const hash = crypto.createHash("sha256");
  hash.update(xBytes);
  hash.update(yBytes);
  return hash.digest();
}

export function encryptMsg(msg: Buffer, pubKey: any) {
  const ciphertextPrivKey = curve.genKeyPair().getPrivate();
  const sharedECCKey = pubKey.mul(ciphertextPrivKey);
  const secretKey = eccPointTo256BitKey(sharedECCKey);
  const { ciphertext, iv, authTag } = encryptAESGCM(msg, secretKey);
  const ciphertextPubKey = curve.g.mul(ciphertextPrivKey);
  const ciphertextPubKeyHex = ciphertextPubKey.encode("hex", false);
  return { ciphertext, iv, authTag, ciphertextPubKeyHex };
}
