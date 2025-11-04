import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import repoRoutes from "./routes/repo.routes.js";
import { initDB } from "./services/db.js";

dotenv.config();
const app = express();
app.use(cors({
  origin: "*",  // for quick test; restrict later
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

initDB();
app.use("/api", repoRoutes);

app.get("/", (_, res) => res.send("Repo Service running..."));
app.get("/health", (_, res) => res.json({ status: "healthy", service: "repo-service" }));

app.listen(process.env.PORT || 5001, () => console.log(`🚀 Repo Service on ${process.env.PORT || 5001}`));
 