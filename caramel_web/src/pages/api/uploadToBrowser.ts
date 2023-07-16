import { use, Middleware } from "next-api-route-middleware";
import multer from "multer";
import fs from "fs";

const upload: any = multer({ dest: "public/uploads" });

export const handler: any = async (req: any, res: any) => {
  try {
    const file = req.file;
    if (!file) {
      console.log("No file");
      return res.status(400).json({ error: "No file provided" });
    }
    const { path } = req.file;
    const buffer = fs.readFileSync(path);
    const bufferString = buffer.toString("base64");
    res.status(200).json({
      buffer: bufferString,
      mimeType: file.mimetype,
      filename: file.filename,
    });
  } catch (e) {
    console.error("Error processing file:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};
export default use(upload.single("img"), handler);
