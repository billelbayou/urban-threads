import { vi, beforeEach } from "vitest";

vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashed-password"),
    compare: vi.fn().mockResolvedValue(true),
  },
  hash: vi.fn().mockResolvedValue("hashed-password"),
  compare: vi.fn().mockResolvedValue(true),
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn().mockReturnValue("test-jwt-token"),
    verify: vi.fn().mockReturnValue({ id: "test-user-id", role: "CLIENT" }),
  },
  sign: vi.fn().mockReturnValue("test-jwt-token"),
  verify: vi.fn().mockReturnValue({ id: "test-user-id", role: "CLIENT" }),
}));

vi.mock("../services/storage.service.js", () => ({
  storageService: {
    uploadBuffer: vi
      .fn()
      .mockResolvedValue({ path: "test-image-path", size: 100, etag: "test-etag" }),
    uploadFile: vi.fn(),
    getFileUrl: vi.fn().mockResolvedValue("https://test.url/image.webp"),
    deleteFile: vi.fn().mockResolvedValue(undefined),
    fileExists: vi.fn().mockResolvedValue(true),
  },
  getProductImageUrl: vi.fn().mockResolvedValue("https://test.url/image.webp"),
  uploadProductImage: vi.fn(),
  deleteProductImage: vi.fn(),
  s3Client: {},
}));

vi.mock("../services/image_processor.service.js", () => ({
  imageProcessorService: {
    processImage: vi.fn().mockResolvedValue({
      thumbnail: { buffer: Buffer.from(""), size: 100, width: 200, height: 200 },
      mobile: { buffer: Buffer.from(""), size: 200, width: 600, height: 400 },
      desktop: { buffer: Buffer.from(""), size: 300, width: 1200, height: 800 },
      original: { buffer: Buffer.from(""), size: 400, width: 1920, height: 1280 },
    }),
  },
}));

vi.mock("../utils/cookies.js", () => ({
  setAuthCookie: vi.fn(),
  clearAuthCookie: vi.fn(),
}));

import { prisma } from "../utils/prisma.js";
import jwt from "jsonwebtoken";

beforeEach(async () => {
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "User", "Category" CASCADE',
  );
  vi.clearAllMocks();
  (jwt.verify as any).mockReturnValue({ id: "test-user-id", role: "CLIENT" });
});
