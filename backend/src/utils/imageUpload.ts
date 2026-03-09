import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { supabaseConfig } from "../config/config.js";

/**
 * Initialize S3 client for Supabase Storage (S3-compatible)
 */
const getS3Client = () => {
  return new S3Client({
    region: supabaseConfig.region || "us-east-1",
    credentials: {
      accessKeyId: supabaseConfig.accessKeyId,
      secretAccessKey: supabaseConfig.secretAccessKey,
    },
    endpoint: supabaseConfig.endpoint,
    forcePathStyle: true, // Required for S3-compatible services
  });
};

/**
 * Upload base64 image to Supabase Storage (S3-compatible)
 * @param {string} base64String - Base64 encoded image
 * @param {string} folder - Folder name in the bucket
 * @returns {Promise<{url: string, path: string}>}
 */
export const uploadBase64Image = async (
  base64String: string,
  folder: string = "products",
): Promise<{ url: string; path: string }> => {
  try {
    // Extract the base64 data (remove data URL prefix if present)
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Determine content type from base64 string
    const mimeMatch = base64String.match(/^data:image\/(\w+);base64,/);
    const mimeType = mimeMatch ? `image/${mimeMatch[1]}` : "image/jpeg";
    const extension = mimeMatch ? mimeMatch[1] : "jpg";

    // Generate a unique filename
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 15);
    const fileName = `${folder}/${timestamp}-${randomSuffix}.${extension}`;

    const s3Client = getS3Client();

    // Upload the file to S3
    const command = new PutObjectCommand({
      Bucket: supabaseConfig.bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: mimeType,
    });

    await s3Client.send(command);

    // Construct the public URL
    const url = `${supabaseConfig.endpoint}/${supabaseConfig.bucketName}/${fileName}`;

    return {
      url,
      path: fileName,
    };
  } catch (error) {
    console.error("S3 upload error:", error);
    throw new Error("Failed to upload image");
  }
};

/**
 * Upload multiple base64 images to Supabase Storage
 * @param {string[]} base64Strings - Array of base64 encoded images
 * @param {string} folder - Folder name in the bucket
 * @returns {Promise<{url: string, path: string}[]>}
 */
export const uploadMultipleImages = async (
  base64Strings: string[],
  folder: string = "products",
): Promise<{ url: string; path: string }[]> => {
  const uploadPromises = base64Strings.map((base64) =>
    uploadBase64Image(base64, folder),
  );
  return Promise.all(uploadPromises);
};

/**
 * Delete image from Supabase Storage
 * @param {string} path - The path/key of the image in the bucket
 */
export const deleteImage = async (path: string) => {
  try {
    const s3Client = getS3Client();

    const command = new DeleteObjectCommand({
      Bucket: supabaseConfig.bucketName,
      Key: path,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error("S3 delete error:", error);
    throw new Error("Failed to delete image");
  }
};

/**
 * Delete multiple images from Supabase Storage
 * @param {string[]} paths - Array of paths to delete
 */
export const deleteMultipleImages = async (paths: string[]) => {
  try {
    const s3Client = getS3Client();

    const command = new DeleteObjectsCommand({
      Bucket: supabaseConfig.bucketName,
      Delete: {
        Objects: paths.map((Key) => ({ Key })),
      },
    });

    await s3Client.send(command);
  } catch (error) {
    console.error("S3 bulk delete error:", error);
    throw new Error("Failed to delete images");
  }
};
