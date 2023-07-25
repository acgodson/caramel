"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptMsg = void 0;
const elliptic_1 = require("elliptic");
const crypto_1 = __importDefault(require("crypto"));
function eccPointTo256BitKey(point) {
    const xBytes = point.getX().toArrayLike(Buffer, "be", 32);
    const yBytes = point.getY().toArrayLike(Buffer, "be", 32);
    const hash = crypto_1.default.createHash("sha256");
    hash.update(xBytes);
    hash.update(yBytes);
    return hash.digest();
}
function decryptAESGCM(ciphertext, iv, authTag, secretKey) {
    const decipher = crypto_1.default.createDecipheriv("aes-256-gcm", secretKey, iv);
    decipher.setAuthTag(authTag);
    const plaintext = Buffer.concat([
        decipher.update(ciphertext),
        decipher.final(),
    ]);
    return plaintext;
}
function decryptECC(encryptedMsg, privKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const { ciphertext, iv, authTag, ciphertextPubKey } = encryptedMsg;
        const sharedECCKey = ciphertextPubKey.mul(privKey);
        const secretKey = eccPointTo256BitKey(sharedECCKey);
        const plaintext = decryptAESGCM(ciphertext, iv, authTag, secretKey);
        return plaintext;
    });
}
function decryptMsg(encrytionObject, privTKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const curve = new elliptic_1.ec("p256");
        const publicKeyPoint = curve
            .keyFromPublic(encrytionObject.ciphertextPubKeyHex, "hex")
            .getPublic();
        const newEncrytionObject = {
            ciphertext: new Uint8Array(encrytionObject.ciphertext.data),
            iv: new Uint8Array(encrytionObject.iv.data),
            authTag: new Uint8Array(encrytionObject.authTag.data),
            ciphertextPubKey: publicKeyPoint,
        };
        const decryptedMsg = yield decryptECC(newEncrytionObject, privTKey);
        return decryptedMsg;
    });
}
exports.decryptMsg = decryptMsg;
