import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import config from "./config/config";

dotenv.config();

const app = express();
const PORT = config.PORT;

// Middlewares
app.use(express.json()); // Parses JSON request bodies
app.use(cookieParser()); // Parses cookies

// CORS config — allow frontend origin & send credentials
app.use(
  cors({
    origin: ["http://localhost:3000", "https://urban-threads-tau.vercel.app"],
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler (optional)
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Error:", err);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// Start server
app.listen(PORT, () => console.log("Server running"));
