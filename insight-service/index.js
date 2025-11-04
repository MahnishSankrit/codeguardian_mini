import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import insightRoutes from "./routes/insight.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: "*",  // for quick test; restrict later
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Routes
app.use("/api", insightRoutes);

// Health check endpoints
app.get("/", (req, res) => res.send("📊 Insight Service running..."));
app.get("/health", (req, res) =>
  res.json({ status: "healthy", service: "insight-service" })
);

// Start server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`📈 Insight Service running on port ${PORT}`));
