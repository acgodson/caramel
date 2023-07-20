import { NextApiRequest, NextApiResponse } from "next";
import pinataSDK, { PinataPinOptions } from "@pinata/sdk";
import { pinataKeys } from "@/components/controllers/accounts";

//for testing, move to env in production
const PINATA_API_KEY = pinataKeys.pinataKey;
const PINATA_API_SECRET = pinataKeys.Secret;

// Create pinata object
const pinata = new pinataSDK(PINATA_API_KEY, PINATA_API_SECRET);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { object, name, mimeType } = req.body;

    const fileOptions: PinataPinOptions = {
      pinataMetadata: {
        name: name,
      },
      pinataOptions: {
        cidVersion: 0,
      },
    };

    const data = { data: JSON.stringify(object) };

    const pinned = await pinata.pinJSONToIPFS(data, fileOptions);
    if (pinned) {
      const ipfsCid = pinned.IpfsHash;
      return res.status(200).json({ hash: ipfsCid });
    } else {
      return res.status(500).json({ message: "Failed to upload to IPFS" });
    }
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
}
