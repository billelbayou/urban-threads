/**
 * Supabase Storage Service
 * S3-compatible storage using presigned URLs for secure file access
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { supabaseConfig } from "../config/config.js";

// ============================================================================
// S3 Client
// ============================================================================

export const s3Client = new S3Client({
  region: supabaseConfig.region,
  endpoint: supabaseConfig.endpoint,
  credentials: {
    accessKeyId: supabaseConfig.accessKeyId,
    secretAccessKey: supabaseConfig.secretAccessKey,
  },
  forcePathStyle: true, // Required for Supabase S3
  // Supabase S3 doesn't support newer AWS checksum features
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

const BUCKET_NAME = supabaseConfig.bucketName;

// ============================================================================
// Types
// ============================================================================

export interface UploadResult {
  path: string;
  size: number;
  etag: string;
  width?: number;
  height?: number;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Sanitize filename to prevent security issues
 */
function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[\/\\]/g, "")
    .replace(/\.\./g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .substring(0, 255);
}

/**
 * Generate unique filename with timestamp and random string
 */
function generateUniqueFileName(originalName: string): string {
  const sanitized = sanitizeFileName(originalName);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);

  const ext =
    sanitized.lastIndexOf(".") > 0
      ? sanitized.substring(sanitized.lastIndexOf("."))
      : "";
  const nameWithoutExt = ext
    ? sanitized.substring(0, sanitized.lastIndexOf("."))
    : sanitized;

  return `${timestamp}-${random}-${nameWithoutExt}${ext}`;
}

/**
 * Normalize folder path (strip leading/trailing slashes, collapse duplicates)
 */
function normalizeFolderPath(folderPath: string): string {
  return folderPath
    .replace(/^\/+/, "")
    .replace(/\/+$/, "")
    .replace(/\/+/g, "/");
}

/**
 * Build full object path from folder + filename
 */
function buildObjectPath(folderPath: string, fileName: string): string {
  const normalized = normalizeFolderPath(folderPath);
  return normalized ? `${normalized}/${fileName}` : fileName;
}

// ============================================================================
// Storage Service
// ============================================================================

class StorageService {
  /**
   * Upload a file from Multer
   */
  async uploadFile(
    file: Express.Multer.File,
    folderPath: string,
  ): Promise<UploadResult> {
    const fileName = generateUniqueFileName(file.originalname);
    return this.uploadBuffer(
      file.buffer,
      fileName,
      folderPath,
      file.mimetype,
      file.size,
    );
  }

  /**
   * Upload a raw buffer
   */
  async uploadBuffer(
    buffer: Buffer,
    fileName: string,
    folderPath: string,
    contentType: string,
    size: number,
  ): Promise<UploadResult> {
    const objectPath = buildObjectPath(folderPath, fileName);

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: objectPath,
      Body: buffer,
      ContentType: contentType,
      ContentLength: size,
    });

    const response = await s3Client.send(command);

    return {
      path: objectPath,
      size: size,
      etag: response.ETag || "",
    };
  }

  /**
   * Get a presigned URL for file download (default: valid for 1 hour)
   */
  async getFileUrl(path: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: path,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  }

  /**
   * Delete a single file
   */
  async deleteFile(path: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: path,
    });

    await s3Client.send(command);
  }

  /**
   * Check if a file exists
   */
  async fileExists(path: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: BUCKET_NAME,
        Key: path,
      });

      await s3Client.send(command);
      return true;
    } catch (error: any) {
      if (error.name === "NotFound" || error.code === "NotFound") {
        return false;
      }
      throw error;
    }
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const storageService = new StorageService();

// ============================================================================
// Product-Specific Helper Functions
// ============================================================================

/**
 * Upload a product image
 */
export const uploadProductImage = async (
  file: Express.Multer.File,
): Promise<UploadResult> => {
  return storageService.uploadFile(file, "products");
};

/**
 * Get presigned URL for a product image
 */
export const getProductImageUrl = async (
  path: string,
  expiresIn: number = 3600,
): Promise<string> => {
  return storageService.getFileUrl(path, expiresIn);
};

/**
 * Delete a product image
 */
export const deleteProductImage = async (path: string): Promise<void> => {
  return storageService.deleteFile(path);
};
