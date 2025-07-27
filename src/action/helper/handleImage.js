"use server"
import cloudinary from './cloudinaryConfig';

// Replace the existing uploadAndTransform function with this:
export async function uploadAndTransform(file) {
  // Convert File to ArrayBuffer then to Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        transformation: [
          { width: 1000, crop: 'scale' },
          { quality: 'auto' },
          { fetch_format: 'webp' },
        ],
        folder: 'Blog-App-uploads',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve({ 
          imagePath: result.secure_url, 
          image_id: result.public_id 
        });
      }
    ).end(buffer); // Pass buffer directly
  });
}




export async function deleteImage(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Deleted:', result);
    return result;
  } catch (err) {
    console.error('Delete failed:', err);
    throw new Error('Unable to delete image');
  }
}