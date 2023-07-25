import { ec as EC } from "elliptic";
import crypto from "crypto";

function eccPointTo256BitKey(point: {
  getX: () => {
    (): any;
    new (): any;
    toArrayLike: {
      (arg0: BufferConstructor, arg1: string, arg2: number): any;
      new (): any;
    };
  };
  getY: () => {
    (): any;
    new (): any;
    toArrayLike: {
      (arg0: BufferConstructor, arg1: string, arg2: number): any;
      new (): any;
    };
  };
}) {
  const xBytes = point.getX().toArrayLike(Buffer, "be", 32);
  const yBytes = point.getY().toArrayLike(Buffer, "be", 32);
  const hash = crypto.createHash("sha256");
  hash.update(xBytes);
  hash.update(yBytes);
  return hash.digest();
}

function decryptAESGCM(
  ciphertext: any,
  iv: crypto.BinaryLike,
  authTag: NodeJS.ArrayBufferView,
  secretKey: Buffer | crypto.CipherKey
) {
  const decipher = crypto.createDecipheriv("aes-256-gcm", secretKey, iv);
  decipher.setAuthTag(authTag);
  const plaintext = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);
  return plaintext;
}

async function decryptECC(encryptedMsg: any, privKey: any) {
  const { ciphertext, iv, authTag, ciphertextPubKey } = encryptedMsg;
  const sharedECCKey = ciphertextPubKey.mul(privKey);
  const secretKey = eccPointTo256BitKey(sharedECCKey);
  const plaintext = decryptAESGCM(ciphertext, iv, authTag, secretKey);
  return plaintext;
}

export async function decryptMsg(encrytionObject: any, privTKey: string) {
  const curve = new EC("p256");
  const publicKeyPoint = curve
    .keyFromPublic(encrytionObject.ciphertextPubKeyHex, "hex")
    .getPublic();

  const newEncrytionObject = {
    ciphertext: new Uint8Array(encrytionObject.ciphertext.data),
    iv: new Uint8Array(encrytionObject.iv.data),
    authTag: new Uint8Array(encrytionObject.authTag.data),
    ciphertextPubKey: publicKeyPoint,
  };

  const decryptedMsg = await decryptECC(newEncrytionObject, privTKey);
  
  return decryptedMsg;
}
