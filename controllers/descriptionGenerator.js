require("dotenv").config();

const imageToTextController = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "Image upload failed" });
    }

    // ✅ Cloudinary URL
    const imageUrl = req.file.path;

    // 🔥 Step 1: fetch image from Cloudinary
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error("Failed to fetch image from Cloudinary");
    }

    // 🔥 Step 2: image → buffer
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 🔥 Step 3: buffer → blob
    const blob = new Blob([buffer], {
      type: imageResponse.headers.get("content-type"),
    });

    // 🔥 Step 4: FormData
    const formData = new FormData();
    formData.append("file", blob, "image.jpg");

    // 🔥 Step 5: send to FastAPI
    const response = await fetch("http://127.0.0.1:8000/upload-image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`FastAPI error: ${response.status}`);
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      title: data.title,
      description: data.description,
    });

  } catch (error) {
    console.error("Image To Text Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { imageToTextController };
