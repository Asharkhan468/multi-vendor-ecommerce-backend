import fs from "fs";

export const imageToText = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Image is required" });

    const imageBuffer = fs.readFileSync(req.file.path);
    const imageBase64 = imageBuffer.toString("base64");

    const response = await fetch(
      "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `data:image/jpeg;base64,${imageBase64}`,
        }),
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


