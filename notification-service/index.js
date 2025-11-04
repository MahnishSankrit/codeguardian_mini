import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import notifyRoutes from "./routes/notify.routes.js";

const app = express();
const PORT = process.env.PORT || 5004;

app.use(cors({
  origin: "*",  // for quick test; restrict later
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.use("/notify", notifyRoutes);

app.get("/", (req, res) => res.send("Notification Service running"));
app.get("/health", (_, res) => res.json({ status: "healthy", service: "notification-service" }));

app.listen(PORT, () => console.log(`📧 Notification Service on ${PORT}`));
