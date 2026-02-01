import {cloud as cloudinary} from '../config/config.js';

/**
 * Upload base64 image to Cloudinary
 * @param {string} base64String - Base64 encoded image
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadBase64Image = async (base64String: string, folder: string = 'products'): Promise<{ url: string; publicId: string; }> => {
  try {
    const result = await cloudinary.uploader.upload(base64String, {
      folder: folder,
      resource_type: 'auto',
      transformation: [
        { width: 1000, height: 1000, crop: 'limit' }, // Limit max size
        { quality: 'auto' }, // Auto quality optimization
        { fetch_format: 'auto' } // Auto format (WebP when supported)
      ]
    });

    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image');
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public_id
 */
export const deleteImage = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image');
  }
};

/**
 * Delete multiple images from Cloudinary
 * @param {string[]} publicIds - Array of Cloudinary public_ids
 */
export const deleteMultipleImages = async (publicIds: string[]) => {
  try {
    await cloudinary.api.delete_resources(publicIds);
  } catch (error) {
    console.error('Cloudinary bulk delete error:', error);
    throw new Error('Failed to delete images');
  }
};