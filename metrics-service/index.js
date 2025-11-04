import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import metricsRoutes from "./routes/metrics.routes.js";

dotenv.config();
const app = express();

app.use(cors({
  origin: "*",  // for quick test; restrict later
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.use("/api", metricsRoutes);

app.get("/", (_, res) => res.send("📊 Metrics Service running..."));
app.get("/health", (_, res) =>
  res.json({ status: "healthy", service: "metrics-service" })
);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`✅ Metrics Service running on port ${PORT}`));
