import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/products.routes";
import orderRoutes from "./routes/order.routes";
import categoryRoutes from "./routes/category.routes";
import cartRoutes from "./routes/cart.routes";
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
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/cart", cartRoutes);

// Start server
app.listen(8080, () => console.log("Server running"));
