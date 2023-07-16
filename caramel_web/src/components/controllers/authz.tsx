import { sign } from "./signatures";
import * as fcl from "@onflow/fcl";

export async function createSignature(signable: any, address: string, keyID: any) {
  address = fcl.withPrefix(address);
  const account: any = fcl.getAccount(address);

  // the privateKey is stored plainly in local storage for now
  const storage = localStorage.getItem("");
  return await sign(account, keyID, JSON.parse(storage!), signable);
}


export async function checkUserExists(email: string) {
  const headersList = {
    "Content-Type": "application/json"
  };

  const bodyContent = JSON.stringify({ email });

  const response = await fetch("api/check-user", {
    method: "POST",
    body: bodyContent,
    headers: headersList
  });

  const data = await response.json();
  return data;
}

