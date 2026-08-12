// ── Cloudinary config (optional — for cloud image storage) ───────────────────
// Install: npm install cloudinary
// Add to .env: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

let cloudinary = null;

export const initCloudinary = async () => {
      if (!process.env.CLOUDINARY_CLOUD_NAME) {
            console.log('ℹ️  Cloudinary not configured — using local file storage');
            return null;
      }
      try {
            const { v2 } = await import('cloudinary');
            v2.config({
                  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                  api_key: process.env.CLOUDINARY_API_KEY,
                  api_secret: process.env.CLOUDINARY_API_SECRET,
            });
            cloudinary = v2;
            console.log('✅ Cloudinary connected');
            return v2;
      } catch {
            console.warn('⚠️  Cloudinary package not installed — using local storage');
            return null;
      }
};

export const uploadToCloud = async (filePath, folder = 'esamadhan') => {
      if (!cloudinary) return null;
      const result = await cloudinary.uploader.upload(filePath, {
            folder,
            resource_type: 'auto',
      });
      return result.secure_url;
};

export const deleteFromCloud = async (publicId) => {
      if (!cloudinary) return;
      await cloudinary.uploader.destroy(publicId);
};

export default cloudinary;
