import fs from "fs";

export const imageToText = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Image is required" });

    const base64Image = req.file.buffer.toString("base64");

    const response = await fetch(
      "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: base64Image }),
      }
    );

    const data = await response.json();
    const caption = data[0]?.generated_text || "No caption generated";

    res.status(200).json({ success: true, caption });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI processing failed" });
  }
};
