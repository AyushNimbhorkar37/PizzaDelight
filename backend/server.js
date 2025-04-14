const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000", 
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// MongoDB Connection
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/pizza-app";
const DB_NAME = process.env.DB_NAME || "pizza-app";

mongoose.set("strictQuery", false);

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URL, {
      dbName: DB_NAME,
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ MongoDB Connected Successfully!");
    console.log("📌 Connected to Database:", mongoose.connection.db.databaseName);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
}
connectDB();

const pizzaRoutes = require("./routes/pizzaRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");

app.use("/api/pizzas", pizzaRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/inventory", inventoryRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("🚀 Pizza Delivery API is running...");
});

// MongoDB Runtime Error Handler
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB Runtime Error:", err);
});

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

// erver Error Handling
server.on("error", (err) => {
  console.error("❌ Server Error:", err);
});

// Graceful shutdown on uncaught exceptions/rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  server.close(() => process.exit(1));
});
