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
    const { email } = req.body;

    if (email) {
      try {
        const fetchUser = admin
          .firestore()
          .collection("users")
          .where("email", "==", email);
        const querySnapshot = await fetchUser.get();

        if (querySnapshot.empty) {
          console.log("User is new");
          return res.status(200).json({ keyExists: false });
        } else {
          // Document exists
          console.log("User already exists");
          const userData = querySnapshot.docs[0].data();
          return res.status(200).json({ keyExists: true, snapshot: userData });
        }
      } catch (e) {
        console.log(e);
        return res.status(401).json({ message: "not found" });
      }
    } else {
      return res.status(401).json({ message: "submit valid username" });
    }
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}
