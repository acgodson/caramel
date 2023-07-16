
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
