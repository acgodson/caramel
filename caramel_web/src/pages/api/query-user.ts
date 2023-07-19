import admin from "firebase-admin";
import type { NextApiRequest, NextApiResponse } from "next";

// Load Firebase service account JSON file from environment variable
const serviceAccount = require("./caramelplugin.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { addr } = req.body;

    if (addr) {
      try {
        const fetchUser = admin
          .firestore()
          .collection("users")
          .where("account", "==", addr);
        const querySnapshot = await fetchUser.get();

        if (querySnapshot.empty) {
            return res.status(200).json({ exists: false });
         
        } else {
          console.log("User already exists");
          return res.status(200).json({ exists: true });
        }
      } catch (e) {
        console.log(e);
        return res.status(401).json({ message: "not found" });
      }
    }
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}
