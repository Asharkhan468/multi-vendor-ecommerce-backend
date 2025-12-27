const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoute");
const loginRoutes = require("./routes/loginRoute");
const logoutRoutes = require("./routes/logoutRoute");
const productRoutes = require("./routes/productsRoute");
const categoriesRoutes = require("./routes/categoriesRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// app.use(
//   cors({
//     origin: ["http://localhost:3000"],
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.options("*", cors());

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", loginRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/auth", logoutRoutes);

// 🔥 MongoDB connection (safe for serverless)
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log("MongoDB connected");
};

connectDB();

module.exports = app;
