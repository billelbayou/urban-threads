import { Router } from "express";
import multer from "multer";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import {
  uploadProductImage,
  deleteProductImage,
  getProductImageUrl,
} from "../services/storage.service.js";

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

/**
 * POST /api/upload
 * Upload a single image to Supabase Storage
 * Returns the stored path and a presigned URL for immediate preview
 */
router.post(
  "/",
  authenticate,
  authorize(["ADMIN"]),
  upload.single("image"),
  async (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: "Image file is required" });
      return;
    }

    const result = await uploadProductImage(req.file);

    // Generate a presigned URL so the admin can preview the image immediately
    const url = await getProductImageUrl(result.path);

    res.status(200).json({
      url,
      path: result.path,
    });
  },
);

/**
 * DELETE /api/upload
 * Delete a single image from Supabase Storage
 * Body: { path: string }
 */
router.delete("/", authenticate, authorize(["ADMIN"]), async (req, res) => {
  const { path } = req.body;

  if (!path || typeof path !== "string") {
    res.status(400).json({ error: "Image path is required" });
    return;
  }

  await deleteProductImage(path);

  res.status(200).json({ message: "Image deleted successfully" });
});

export default router;
