// const express = require("express");
// const mongoose = require("mongoose");
// const authRoutes = require("./routes/authRoute.js");
// const loginRoutes = require("./routes/loginRoute.js");
// const productRoutes = require("./routes/productsRoute.js");
// const categoriesRoutes = require("./routes/categoriesRoutes.js");
// const createOrder = require("./routes/orderRoutes.js");
// const logout =require("./routes/logoutRoute.js");
// const cors = require("cors");

// require("dotenv").config();

// const app = express();

// // Middleware
// app.use(express.json());

// app.use(
//   cors({
//     origin: ["http://localhost:3000"],
//     methods: "GET,POST,PUT,DELETE",
//     credentials: true,
//   })
// );

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/auth", loginRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/categories", categoriesRoutes);
// app.use("/api/order", createOrder);
// app.use("/api/auth" , logout)

// // MongoDB connection
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.log(err));

// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoute");
const loginRoutes = require("./routes/loginRoute");
const productRoutes = require("./routes/productsRoute");
const categoriesRoutes = require("./routes/categoriesRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// 🔥 CORS MUST BE ON TOP
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", loginRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/order", orderRoutes);

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
