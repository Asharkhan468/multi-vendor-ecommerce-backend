import fs from "fs";

export const imageToText = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "Image is required" });
    }

    const imageUrl = req.file.path; // Cloudinary URL

    const response = await fetch(
      "https://router.huggingface.co/models/Salesforce/blip-image-captioning-base",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: imageUrl }),
      }
    );

    const data = await response.json();
    console.log("HuggingFace Router Response:", data);

    if (!data || data.error) {
      return res.status(500).json({ error: data.error || "No AI response" });
    }

    const caption = data[0]?.generated_text || "No description generated";

    res.status(200).json({
      success: true,
      title: caption.split(" ").slice(0, 4).join(" "),
      description: caption,
    });

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "AI processing failed" });
  }
};
