export const imageToTextController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

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

    if (data.error) {
      return res.status(503).json({
        success: false,
        message: data.error,
        wait: data.estimated_time || 10,
      });
    }

    return res.status(200).json({
      success: true,
      caption: data[0]?.generated_text || "No caption generated",
    });
  } catch (err) {
    console.error("HF ERROR:", err);
    return res.status(500).json({ error: "AI processing failed" });
  }
};
