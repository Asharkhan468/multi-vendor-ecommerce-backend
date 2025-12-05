const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoute.js");
const loginRoutes = require("./routes/loginRoute.js");
const productRoutes = require("./routes/productsRoute.js")
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth" , loginRoutes);
app.use("/api/products", productRoutes);


// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));
  
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
