
const imageToTextController = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "Image upload failed" });
    }

    const imageUrl = req.file.path;

    const response = await fetch(
      "https://devashar235-image-caption-generator.hf.space/run/predict",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: [imageUrl],
        }),
      }
    );

    const result = await response.json();

    res.status(200).json({
      caption: result.data[0],
    });
  } catch (error) {
    console.error("HF Gradio Error:", error);
    res.status(500).json({ error: "Image caption failed" });
  }
};

module.exports = { imageToTextController };
