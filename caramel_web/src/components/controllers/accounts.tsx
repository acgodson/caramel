import FlowAccount from "../../lib/flowAccount";
import * as fcl from "@onflow/fcl";
import { sign } from "./signatures";
import { toHex, prependUserDomainTag } from "./helpers";




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