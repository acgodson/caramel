import { ec as EC } from 'elliptic';
import crypto from 'crypto';

const curve = new EC('p256');

function encryptAESGCM(msg: any, secretKey: any) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', secretKey, iv);
    const ciphertext = Buffer.concat([cipher.update(msg), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return { ciphertext, iv, authTag };
}

function decryptAESGCM(ciphertext: any, iv: crypto.BinaryLike, authTag: NodeJS.ArrayBufferView, secretKey: Buffer | crypto.CipherKey) {
    const decipher = crypto.createDecipheriv('aes-256-gcm', secretKey, iv);
    decipher.setAuthTag(authTag);
    const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return plaintext;
}

function eccPointTo256BitKey(point: { getX: () => { (): any; new(): any; toArrayLike: { (arg0: BufferConstructor, arg1: string, arg2: number): any; new(): any; }; }; getY: () => { (): any; new(): any; toArrayLike: { (arg0: BufferConstructor, arg1: string, arg2: number): any; new(): any; }; }; }) {
    const xBytes = point.getX().toArrayLike(Buffer, 'be', 32);
    const yBytes = point.getY().toArrayLike(Buffer, 'be', 32);
    const hash = crypto.createHash('sha256');
    hash.update(xBytes);
    hash.update(yBytes);
    return hash.digest();
}

export function encryptECC(msg: Buffer, pubKey: any) {
    const ciphertextPrivKey = curve.genKeyPair().getPrivate();
    const sharedECCKey = pubKey.mul(ciphertextPrivKey);
    const secretKey = eccPointTo256BitKey(sharedECCKey);
    const { ciphertext, iv, authTag } = encryptAESGCM(msg, secretKey);
    const ciphertextPubKey = curve.g.mul(ciphertextPrivKey);
    // console.log(ciphertextPubKey);
    const hex = ciphertextPubKey.encode("hex", false)
    return { ciphertext, iv, authTag, ciphertextPubKey, hex };
}

export function decryptECC(encryptedMsg: any, privKey: any) {
    const { ciphertext, iv, authTag, ciphertextPubKey } = encryptedMsg;
    const sharedECCKey = ciphertextPubKey.mul(privKey);
    const secretKey = eccPointTo256BitKey(sharedECCKey);
    const plaintext = decryptAESGCM(ciphertext, iv, authTag, secretKey);
    return plaintext;
}

