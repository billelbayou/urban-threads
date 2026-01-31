import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

interface Config {
  PORT: number;
  NODE_ENV: string;
  JWT_SECRET: string;
  COOKIE_EXPIRES_IN: number;
  FRONTEND_URL: string;
}

const config: Config = {
  FRONTEND_URL: process.env.FRONTEND_URL!,
  PORT: parseInt(process.env.PORT!),
  NODE_ENV: process.env.NODE_ENV!,
  JWT_SECRET: process.env.JWT_SECRET!,
  COOKIE_EXPIRES_IN: parseInt(process.env.COOKIE_EXPIRES_IN || "86400"), // 1 day in seconds
};

export const cloud = cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default config;