// const express = require("express");
// const mongoose = require("mongoose");
// const authRoutes = require("./routes/authRoute.js");
// const loginRoutes = require("./routes/loginRoute.js");
// const productRoutes = require("./routes/productsRoute.js")
// const categoriesRoutes = require("./routes/categoriesRoutes.js")
// const cors = require("cors");

// require("dotenv").config();

// const app = express();

// // Middleware
// app.use(express.json());

// app.use(
//   cors({
//     origin: ["http://localhost:3000"],
//     methods: "GET,POST,PUT,DELETE",
//     credentials: true
//   })
// );

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/auth" , loginRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/categories" , categoriesRoutes);


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
const authRoutes = require("./routes/authRoute.js");
const loginRoutes = require("./routes/loginRoute.js");
const productRoutes = require("./routes/productsRoute.js");
const categoriesRoutes = require("./routes/categoriesRoutes.js");
const cors = require("cors");

require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());

// CORS fix for Vercel + localhost
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      
    ],
    methods: "GET,POST,PUT,DELETE",
    credentials: true
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", loginRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoriesRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // important for Vercel
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB ERROR:", err.message));

// ✅ Export app instead of app.listen() for Vercel
module.exports = app;
