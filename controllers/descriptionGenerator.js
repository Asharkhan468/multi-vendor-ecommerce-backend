// // controllers/descriptionGenerator.js
// const fetch = require("node-fetch"); // Node 22+ me optional, install if needed

// // Controller function
// const imageToTextController = async (req, res) => {
//   try {
//     if (!req.file)
//       return res.status(400).json({ success: false, error: "Image is required" });

//     // Cloudinary URL of uploaded image
//     const imageUrl = req.file.path || req.file.url;
//     if (!imageUrl) return res.status(400).json({ success: false, error: "Cloudinary URL not found" });

//     // Hugging Face Router API call
//     const response = await fetch("https://router.huggingface.co/inference", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.HF_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: "Salesforce/blip-image-captioning-base",
//         inputs: imageUrl,
//         options: { wait_for_model: true },
//       }),
//     });

//     const data = await response.json();
//     console.log("HF Router Response:", data);

//     if (data.error) {
//       return res.status(503).json({
//         success: false,
//         message: data.error,
//         wait: data.estimated_time || 10,
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       caption: data[0]?.generated_text || "No caption generated",
//       imageUrl,
//     });
//   } catch (err) {
//     console.error("HF ERROR:", err);
//     return res.status(500).json({ success: false, error: "AI processing failed" });
//   }
// };

// module.exports = { imageToTextController };


const imageToTextController = async (req, res) => {
  try {
    if (!req.file?.path) {
      return res.status(400).json({ error: "Image upload failed" });
    }

    // 1️⃣ Download image from Cloudinary
    const imgRes = await fetch(req.file.path);
    const buffer = Buffer.from(await imgRes.arrayBuffer());

    // 2️⃣ HuggingFace request
    const hfRes = await fetch(
      "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "image/jpeg",
          "x-wait-for-model": "true", // 🔥 MOST IMPORTANT
        },
        body: buffer,
      }
    );

    const data = await hfRes.json();

    if (!hfRes.ok) {
      console.log("HF ERROR 👉", data);
      return res.status(500).json({ error: data });
    }

    res.status(200).json({
      caption: data[0]?.generated_text,
    });
  } catch (error) {
    console.error("SERVER ERROR 👉", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { imageToTextController };
