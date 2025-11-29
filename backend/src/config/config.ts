import dotenv from "dotenv";

dotenv.config();

interface Config {
  PORT: number;
  NODE_ENV: string;
  JWT_SECRET: string;
  COOKIE_EXPIRES_IN: number;
}

const config: Config = {
  PORT: parseInt(process.env.PORT!),
  NODE_ENV: process.env.NODE_ENV!,
  JWT_SECRET: process.env.JWT_SECRET!,
  COOKIE_EXPIRES_IN: parseInt(process.env.COOKIE_EXPIRES_IN || "86400"), // 1 day in seconds
};

export default config;
