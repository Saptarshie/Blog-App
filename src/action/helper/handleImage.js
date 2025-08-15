"use server"
import cloudinary from './cloudinaryConfig';
import { createHash } from 'node:crypto';
import { v2 as cloudinaryV2 } from 'cloudinary';
import { Buffer } from 'node:buffer';
// Replace the existing uploadAndTransform function with this:
// export async function uploadAndTransform(file) {
//   // Convert File to ArrayBuffer then to Buffer
//   const arrayBuffer = await file.arrayBuffer();
//   // const buffer = Buffer.from(arrayBuffer);
//   const buffer = new Uint8Array(arrayBuffer);
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.upload_stream(
//       {
//         transformation: [
//           { width: 1000, crop: 'scale' },
//           { quality: 'auto' },
//           { fetch_format: 'webp' },
//         ],
//         folder: 'Blog-App-uploads',
//       },
//       (error, result) => {
//         if (error) reject(error);
//         else resolve({ 
//           imagePath: result.secure_url, 
//           image_id: result.public_id 
//         });
//       }
//     ).end(buffer); // Pass buffer directly
//   });
// }
//--------------------------------------------------------
// handleImage.js

export async function uploadAndTransform(file) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const timestamp = Math.floor(Date.now() / 1000);

  const paramsToSign = {
    folder: 'Blog-App-uploads',
    timestamp,
    transformation: 'c_scale,w_1000/q_auto/f_webp', // exactly as you'll send it
  };

  // ✅ Use SDK util — avoids ordering/encoding mistakes
  const signature = cloudinaryV2.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET
  );

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        ...paramsToSign,
        signature,
        api_key: process.env.CLOUDINARY_API_KEY,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          imagePath: result.secure_url,
          image_id: result.public_id,
        });
      }
    ).end(buffer);
  });
}

//--------------------------------------------------------



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