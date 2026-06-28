import sharp from "sharp";

export interface ProcessedImage {
  buffer: Buffer;
  size: number;
  width?: number;
  height?: number;
}

export interface ProcessedImageSet {
  thumbnail: ProcessedImage;
  mobile: ProcessedImage;
  desktop: ProcessedImage;
  original: ProcessedImage;
}

class ImageProcessorService {
  /**
   * Process a single image buffer into multiple optimized WebP variants
   */
  async processImage(buffer: Buffer): Promise<ProcessedImageSet> {
    const sharpInstance = sharp(buffer);
    const metadata = await sharpInstance.metadata();

    const [thumbnail, mobile, desktop, original] = await Promise.all([
      // Thumbnail: 200px width, square if possible or just resized
      this.resizeAndOptimize(sharpInstance, 200, 200, "cover"),
      // Mobile: 600px width
      this.resizeAndOptimize(sharpInstance, 600),
      // Desktop: 1200px width
      this.resizeAndOptimize(sharpInstance, 1200),
      // Original-ish: Just optimize and convert to WebP
      this.optimizeOriginal(sharpInstance),
    ]);

    return { thumbnail, mobile, desktop, original };
  }

  private async resizeAndOptimize(
    instance: sharp.Sharp,
    width: number,
    height?: number,
    fit: keyof sharp.FitEnum = "inside",
  ): Promise<ProcessedImage> {
    const resized = instance.clone().resize(width, height, {
      fit,
      withoutEnlargement: true,
    });

    const optimized = await resized.webp({ quality: 80 }).toBuffer({
      resolveWithObject: true,
    });

    return {
      buffer: optimized.data,
      size: optimized.info.size,
      width: optimized.info.width,
      height: optimized.info.height,
    };
  }

  private async optimizeOriginal(
    instance: sharp.Sharp,
  ): Promise<ProcessedImage> {
    const optimized = await instance.clone().webp({ quality: 85 }).toBuffer({
      resolveWithObject: true,
    });

    return {
      buffer: optimized.data,
      size: optimized.info.size,
      width: optimized.info.width,
      height: optimized.info.height,
    };
  }
}

export const imageProcessorService = new ImageProcessorService();
