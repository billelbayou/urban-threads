import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  FRONTEND_URL: z.string().url(),
  PORT: z.coerce.number().default(5001),
  NODE_ENV: z.string().default("development"),
  JWT_SECRET: z.string().min(1),
  COOKIE_EXPIRES_IN: z.coerce.number().default(86400),
  BCRYPT_ROUNDS: z.coerce.number().default(10),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_KEY: z.string().min(1),
  SUPABASE_BUCKET_NAME: z.string().default("products"),
  SUPABASE_REGION: z.string(),
  SUPABASE_ACCESS_KEY_ID: z.string().min(1),
  SUPABASE_SECRET_ACCESS_KEY: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(1),
  ADMIN_FIRST_NAME: z.string().min(1),
  ADMIN_LAST_NAME: z.string().min(1),
});

const env = envSchema.parse(process.env);

interface Config {
  PORT: number;
  NODE_ENV: string;
  JWT_SECRET: string;
  COOKIE_EXPIRES_IN: number;
  BCRYPT_ROUNDS: number;
  FRONTEND_URL: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  ADMIN_FIRST_NAME: string;
  ADMIN_LAST_NAME: string;
}

const config: Config = {
  FRONTEND_URL: env.FRONTEND_URL,
  PORT: env.PORT,
  NODE_ENV: env.NODE_ENV,
  JWT_SECRET: env.JWT_SECRET,
  COOKIE_EXPIRES_IN: env.COOKIE_EXPIRES_IN,
  BCRYPT_ROUNDS: env.BCRYPT_ROUNDS,
  ADMIN_EMAIL: env.ADMIN_EMAIL,
  ADMIN_PASSWORD: env.ADMIN_PASSWORD,
  ADMIN_FIRST_NAME: env.ADMIN_FIRST_NAME,
  ADMIN_LAST_NAME: env.ADMIN_LAST_NAME,
};

// Supabase S3-compatible Storage Configuration
export const supabaseConfig = {
  supabaseUrl: env.SUPABASE_URL,
  supabaseKey: env.SUPABASE_SERVICE_KEY,
  bucketName: env.SUPABASE_BUCKET_NAME,
  region: env.SUPABASE_REGION,
  // AWS S3 credentials for Supabase Storage (S3-compatible)
  accessKeyId: env.SUPABASE_ACCESS_KEY_ID,
  secretAccessKey: env.SUPABASE_SECRET_ACCESS_KEY,
  endpoint: env.SUPABASE_URL,
};

export default config;
