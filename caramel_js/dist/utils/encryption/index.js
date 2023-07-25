"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptMsg = void 0;
const elliptic_1 = require("elliptic");
const crypto_1 = __importDefault(require("crypto"));
const curve = new elliptic_1.ec("p256");
function encryptAESGCM(msg, secretKey) {
    const iv = crypto_1.default.randomBytes(12);
    const cipher = crypto_1.default.createCipheriv("aes-256-gcm", secretKey, iv);
    const ciphertext = Buffer.concat([cipher.update(msg), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return { ciphertext, iv, authTag };
}
function eccPointTo256BitKey(point) {
    const xBytes = point.getX().toArrayLike(Buffer, "be", 32);
    const yBytes = point.getY().toArrayLike(Buffer, "be", 32);
    const hash = crypto_1.default.createHash("sha256");
    hash.update(xBytes);
    hash.update(yBytes);
    return hash.digest();
}
function encryptMsg(msg, pubKey) {
    const ciphertextPrivKey = curve.genKeyPair().getPrivate();
    const sharedECCKey = pubKey.mul(ciphertextPrivKey);
    const secretKey = eccPointTo256BitKey(sharedECCKey);
    const { ciphertext, iv, authTag } = encryptAESGCM(msg, secretKey);
    const ciphertextPubKey = curve.g.mul(ciphertextPrivKey);
    const ciphertextPubKeyHex = ciphertextPubKey.encode("hex", false);
    return { ciphertext, iv, authTag, ciphertextPubKeyHex };
}
exports.encryptMsg = encryptMsg;
