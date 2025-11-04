import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import reviewRoutes from "./routes/review.routes.js";

dotenv.config();
const app = express();
app.use(cors({
  origin: "*",  // for quick test; restrict later
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use("/api", reviewRoutes);
app.use("/api/ai", reviewRoutes);


app.get("/", (_, res) => res.send("AI Review Service running..."));
app.get("/health", (_, res) => res.json({ status: "healthy", service: "ai-review-service" }));

app.listen(process.env.PORT || 5002, () => console.log(`🧠 AI Review Service on ${process.env.PORT || 5002}`));
