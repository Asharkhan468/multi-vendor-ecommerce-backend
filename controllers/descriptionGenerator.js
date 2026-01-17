const imageToTextController = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "Image upload failed" });
    }

    // Convert image to base64
    const base64Image = req.file.buffer.toString("base64");

    // Gemini API call using fetch
    const response = await fetch(
      "https://api.generativelanguage.googleapis.com/v1beta2/models/gemini-3-flash:generate",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: [
            {
              image: { imageBytes: base64Image },
              text: "Describe this image in one short, catchy caption"
            }
          ]
        })
      }
    );

    const data = await response.json();

    const caption = data.candidates[0].content;

    res.status(200).json({ caption });
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    res.status(500).json({ error: "Image caption failed" });
  }
};

module.exports = { imageToTextController };
