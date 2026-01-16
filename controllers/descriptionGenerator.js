import { pipeline } from "@xenova/transformers";
import fs from "fs";

let captioner;

async function loadModel() {
  if (!captioner) {
    captioner = await pipeline(
      "image-to-text",
      "Xenova/vit-gpt2-image-captioning"
    );
  }
}

export const imageToTextController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image required" });
    }

    await loadModel();

    const imageBuffer = fs.readFileSync(req.file.path);

    const result = await captioner(imageBuffer);

    res.json({
      success: true,
      caption: result[0].generated_text,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI failed" });
  }
};
