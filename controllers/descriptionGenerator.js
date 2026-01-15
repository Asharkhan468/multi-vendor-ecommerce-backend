import fs from "fs";

export const imageToText = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "Image is required" });
    }

    // Local image ko read karke Base64 string me convert kar do
    const imageBuffer = fs.readFileSync(req.file.path);
    const imageBase64 = imageBuffer.toString("base64");

    // HF API call
    const response = await fetch(
      "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `data:image/jpeg;base64,${imageBase64}`, // yahi important hai
        }),
      }
    );

    const data = await response.json();
    console.log("HuggingFace Response:", data);

    // Error handling
    if (!data || data.error) {
      return res.status(500).json({ error: data.error || "AI response failed" });
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
