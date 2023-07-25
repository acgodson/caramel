// types/index.d.ts

import { encryptMsg as caramelEncrypt } from "../src/encrypt";
import { decryptMsg as caramelDecrypt } from "../src/decrypt";

declare module "caramel-js" {
  export { caramelEncrypt as encrypt, caramelDecrypt as decrypt };
}
