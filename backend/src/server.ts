import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/products.routes.js";
import orderRoutes from "./routes/order.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import config from "./config/config.js";
import morgan from "morgan";

dotenv.config();

const app = express();
const PORT = config.PORT;
const FRONTEND_URL = config.FRONTEND_URL;

// Middlewares
app.use(express.json()); // Parses JSON request bodies
app.use(cookieParser()); // Parses cookies
app.use(morgan("dev")); // HTTP traffic logging

// CORS config — allow frontend origin & send credentials
app.use(
  cors({
    origin: [FRONTEND_URL],
    credentials: true,
  }),
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});
// Global error handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error("Error:", err.message);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  },
);

// Start server
app.listen(PORT, () => console.log("Server running"));
