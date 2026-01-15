import fs from "fs";

export const imageToText = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const imageBuffer = fs.readFileSync(req.file.path);

    const response = await fetch(
      "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/octet-stream",
        },
        body: imageBuffer,
      }
    );

    const data = await response.json();

    if (!data || !data[0]?.generated_text) {
      return res.status(500).json({ error: "No AI response" });
    }

    const caption = data[0].generated_text;

    res.status(200).json({
      success: true,
      title: caption.split(" ").slice(0, 4).join(" "),
      description: caption,
    });

  } catch (error) {
    res.status(500).json({ error: "AI processing failed" });
  }
};
