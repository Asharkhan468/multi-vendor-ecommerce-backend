const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoute.js");
const loginRoutes = require("./routes/loginRoute.js");
const productRoutes = require("./routes/productsRoute.js")
const categoriesRoutes = require("./routes/categoriesRoutes.js")
const cors = require("cors");

require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: "GET,POST,PUT,DELETE",
    credentials: true
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth" , loginRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories" , categoriesRoutes);


// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));
  
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
