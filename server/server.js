import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns";

// ✅ FIX: import local file with .js extension
import taskRoutes from "./routes/tasks.js";

// Fix for MongoDB connection issues
dns.setServers(["8.8.8.8"]);
dns.setDefaultResultOrder("ipv4first");

// Load environment variables
dotenv.config();

if (!process.env.MONGO_URI) {
  console.error("ERROR: MONGO_URI is not defined in environment variables.");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/tasks", taskRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running!" });
});

// Error handler
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// 404
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// DB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
    process.exit(1);
  });

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await mongoose.connection.close();
  process.exit(0);
});