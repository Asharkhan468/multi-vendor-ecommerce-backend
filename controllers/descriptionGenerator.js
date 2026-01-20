const imageToTextController = async (req, res) => {
  try {
    const imageUrl = req.file.path;

    console.log("Fetching image from Cloudinary...");
    const imgRes = await fetch(imageUrl);

    if (!imgRes.ok) {
      throw new Error("Cloudinary image fetch failed");
    }

    const arrayBuffer = await imgRes.arrayBuffer();
    const blob = new Blob([arrayBuffer], {
      type: imgRes.headers.get("content-type") || "image/jpeg",
    });

    const formData = new FormData();
    formData.append("file", blob, "image.jpg");

    console.log("Sending image to FastAPI...");

    const aiRes = await fetch("http://127.0.0.1:8000/upload-image", {
      method: "POST",
      body: formData,
    });

    console.log("FastAPI response received");

    if (!aiRes.ok) {
      const text = await aiRes.text();
      throw new Error(text);
    }

    const data = await aiRes.json();

    res.json({
      success: true,
      title: data.title,
      description: data.description,
    });

  } catch (err) {
    console.error("FULL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
