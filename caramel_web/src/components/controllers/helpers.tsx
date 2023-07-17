
var Buffer = require("buffer").Buffer;
export const toHex = (str: any) => Buffer.from(str, "utf8").toString("hex");

export const fromHex = (str: any) => Buffer.from(str, "hex").toString("utf8");

export const prependUserDomainTag = (msg: any) => USER_DOMAIN_TAG + msg;

// UserDomainTag is the prefix of all signed user space payloads.
// A domain tag is encoded as UTF-8 bytes, right padded to a total length of 32 bytes.
const rightPaddedHexBuffer = (value: any, pad: any) =>
  Buffer.from(value.padEnd(pad * 2, "0"), "hex");
const USER_DOMAIN_TAG = rightPaddedHexBuffer(
  Buffer.from("FLOW-V0.0-user").toString("hex"),
  32
).toString("hex");


// Convert buffer to data URI
export const bufferToDataURI = (buffer: any) => {
  const bytes = Array.from(new Uint8Array(buffer));
  const base64 = btoa(bytes.map((byte) => String.fromCharCode(byte)).join(""));
  return `data:image/png;base64,${base64}`;
}



export class MyUserCredential {
  user: any;
  constructor({ user }: any) {
    this.user = user;
  }

  static fromJSON(json: {}) {
    const user  = json;
    const myUser = User.fromJSON(user);
    return new MyUserCredential({ user: myUser });
  }
}

class User {
  displayName: any | null;
  email: any;
  isEmailVerified: any;
  metadata: any;
  isAnonymous: any;
  phoneNumber: any;
  refreshToken: any;
  photoURL: any | null;
  providerData: any;
  tenantId: any;
  uid: any;
  constructor({  displayName, email, isEmailVerified, isAnonymous, metadata, phoneNumber, providerData, refreshToken, photoURL, tenantId, uid }: any) {
    this.displayName = displayName;
    this.email = email;
    this.isEmailVerified = isEmailVerified;
    this.isAnonymous = isAnonymous;
    this.metadata = metadata;
    this.phoneNumber = phoneNumber;
    this.photoURL = photoURL;
    this.providerData = providerData;
    this.refreshToken = refreshToken;
    this.tenantId = tenantId;
    this.uid = uid;
  }

  static fromJSON(json: any) {
    const {displayName,  email, isEmailVerified, isAnonymous, metadata, phoneNumber,photoURL,  providerData, refreshToken, tenantId, uid } = json;
    return new User({ displayName, email, isEmailVerified, isAnonymous, metadata, phoneNumber, photoURL, providerData, refreshToken, tenantId, uid });
  }
}
