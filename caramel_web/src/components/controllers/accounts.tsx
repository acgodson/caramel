import FlowAccount from "../../lib/flowAccount";
import * as fcl from "@onflow/fcl";
import { sign } from "./signatures";
import { toHex, prependUserDomainTag } from "./helpers";


export const validateFlowAccountInfo = async (
  accountAddress: any,
  privKey: any,
  keyID: any
) => {
  accountAddress = fcl.withPrefix(accountAddress);
  if (!accountAddress || accountAddress.length !== 18) {
    throw new Error("Invalid account provided");
  }
  if (!privKey || privKey.length === 0) {
    throw new Error("Invalid private key provided");
  }
  if (!keyID || Number.isNaN(keyID)) {
    throw new Error("Invalid Key ID provided");
  }

  const accountInfo = await fcl
    //@ts-ignore
    .send([fcl.getAccount(accountAddress)])
    .then(fcl.decode);
  const keys = accountInfo.keys;
  const selectedKey = keys[keyID];
  if (!selectedKey) {
    throw new Error("Given key ID does not exist on given account.");
  }
  if (selectedKey.weight !== 1000) {
    throw new Error("Key with weight of 1000 required for import.");
  }
  if (selectedKey.revoked) {
    throw new Error("Provided Key ID is revoked");
  }
  // Create (but don't save) an ephemeral account with this key. This will be used to make signatures
  const account = new FlowAccount({
    address: accountAddress,
  });

  await account.addKey(
    keyID,
    accountInfo,
    selectedKey.weight,
    selectedKey.signAlgo,
    selectedKey.hashAlgo
  );

  const msg = toHex(`${accountAddress}`);
  const sig = await sign(account, keyID, privKey, prependUserDomainTag(msg));

  const compSig = new fcl.WalletUtils.CompositeSignature(
    accountAddress,
    keyID,
    sig
  );

  const verification = fcl.AppUtils.verifyUserSignatures(msg, [compSig]);

  if (!verification) {
    throw new Error("Private key not valid for this account");
  }
};

export const derivePrivKey = async (seedPhrase: any) => {
  throw new Error(
    "Seed phrases not yet supported - raw private keys only for now!"
  );
};

export const rotateFlowAccountKey = async (accountAddress: any) => {
  throw new Error("Key rotation not yet supported");
};

export const pinataKeys = {
  pinataKey: "f8b7d0fec21f9b33568a",
  Secret: "eb9b98c4bc5cd40d4463c39f61ee74d58b42ebfe12986e2f1007ae0189f9e6bd",
  JWT: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzNmZmMzUyNS1hNmJmLTQ4ODktYTBkMC0xNTQ3NjhjNDM2YmMiLCJlbWFpbCI6ImFuaWdvZHNvbjIwQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJmOGI3ZDBmZWMyMWY5YjMzNTY4YSIsInNjb3BlZEtleVNlY3JldCI6ImViOWI5OGM0YmM1Y2Q0MGQ0NDYzYzM5ZjYxZWU3NGQ1OGI0MmViZmUxMjk4NmUyZjEwMDdhZTAxODlmOWU2YmQiLCJpYXQiOjE2ODkzMzIwMjR9.vAz_PKKzvW3XAYXhdGEnoyaoQsQXXauH7uKfrfIQ7_s"
}