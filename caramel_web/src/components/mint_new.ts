import * as fcl from "@onflow/fcl";
//@ts-ignore
import * as t from "@onflow/types";
import { mintNFT } from "@/cadence/transactions/mint_nft";

import { config } from "@onflow/fcl";
import FlowAccount from "@/lib/flowAccount";
import { sign } from "@/components/controllers/signatures";
import { prependUserDomainTag, toHex } from "./controllers/helpers";
import { transaction } from "@onflow/fcl/types/transaction";
import { init_collection } from "@/cadence/transactions/create_collection";
import { store_share_pool } from "@/cadence/transactions/store_share_pool";

export const authorizationFunction = async (account: any) => {
  // authorization function need to return an account
  const { address, keys } = account;
  const tempId = `${address}-${keys[0].publicKey}`;
  const keyId = Number(0);
  let signingFunction = async (signable: { message: any }) => {
    return {
      keyId,
      addr: fcl.withPrefix(address),
      signature: await sign(
        "0868ce1252fd4ad59b96c9e1f44caa0b01731dd871319b0b65e0e4cf54dba30b",
        signable.message
      ), // signing function, read below
    };
  };
  return {
    ...account,
    address,
    keyId,
    tempId,
    signingFunction,
  };
};

export const MintNewNFT = async (addr: string, hash: string) => {
  let transactionId;
  const CODE = mintNFT;
  // console.log(hash);
  // console.log(CODE);
  const name = "test images";
  //  imageHash: string,

  try {
    transactionId = await fcl
      .send([
        fcl.transaction(CODE),
        fcl.args([
          fcl.arg(addr, t.Address),
          fcl.arg(name, t.String),
          fcl.arg("https://caramel-pi.vercel.app/logo.svg", t.String),
          fcl.arg("confidential ", t.String),
          fcl.arg(hash, t.String),
        ]),
        fcl.payer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.proposer(fcl.authz),
        fcl.limit(9999),
      ])
      .then(fcl.decode);

    console.log(transactionId);
    return fcl.tx(transactionId).onceSealed();
  } catch (e) {
    console.error(e);
    return 0.0;
  }
};

export const StoreCollection = async () => {
  let transactionId;
  const CODE = init_collection;

  const args = { bbb: "hhhfh" };

  try {
    transactionId = await fcl
      .send([
        fcl.transaction(CODE),
        fcl.payer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.proposer(fcl.authz),
        fcl.limit(9999),
      ])
      .then(fcl.decode);

    console.log(transactionId);
    return fcl.tx(transactionId).onceSealed();
  } catch (e) {
    console.error(e);
    return 0.0;
  }
};

export const CreatSharePool = async () => {
  let transactionId;
  const CODE = store_share_pool;

  const args = { bbb: "hhhfh" };

  try {
    transactionId = await fcl
      .send([
        fcl.transaction(CODE),
        fcl.payer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.proposer(fcl.authz),
        fcl.limit(9999),
      ])
      .then(fcl.decode);

    console.log(transactionId);
    return fcl.tx(transactionId).onceSealed();
  } catch (e) {
    console.error(e);
    return 0.0;
  }
};
