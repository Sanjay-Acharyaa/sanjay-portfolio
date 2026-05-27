import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(
  fileBuffer: Buffer,
  mimeType: string,
  folder = 'portfolio/projects'
): Promise<{ url: string; publicId: string }> {
  const base64 = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;

  const result = await cloudinary.uploader.upload(base64, {
    folder,
    transformation: [{ width: 1600, height: 1000, crop: 'limit', quality: 'auto:good' }],
  });

  return { url: result.secure_url, publicId: result.public_id };
}

export async function deleteImage(publicId: string) {
  await cloudinary.uploader.destroy(publicId);
}

export default cloudinary;
