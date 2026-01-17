require("dotenv").config();

const imageToTextController = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "Image upload failed" });
    }

    // Use path from Cloudinary
    const imageUrl = req.file.path;

    // Fetch image bytes from Cloudinary URL
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      return res.status(400).json({ error: "Failed to fetch image from Cloudinary" });
    }

    const arrayBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    // Gemini API call
    const geminiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta2/models/gemini-3-flash-preview:generateContent",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: [
            {
              image: { imageBytes: base64Image },
              text: "Describe this image in one short, catchy caption",
            },
          ],
          temperature: 0.5,
          candidateCount: 1,
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      return res.status(500).json({ error: "Gemini API error", details: errText });
    }

    const data = await geminiResponse.json();
    const caption = data.candidates[0].content;

    res.status(200).json({ caption });
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
