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



import Replicate from "replicate";
import dotenv from "dotenv";


dotenv.config();


// Init Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export const imageToTextController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    // Cloudinary URL mil rahi hai
    const imageUrl = req.file.path || req.file.secure_url;

    // Run the BLIP model
    const output = await replicate.run(
      "salesforce/blip:2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746",
      {
        input: {
          task: "image_captioning",
          image: imageUrl,  // Cloudinary URL use karo
        },
      }
    );

    // Send generated caption
    res.status(200).json({ caption: output });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};
