import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
      destination: (req, file, cb) => {
            cb(null, 'uploads/profiles/');
      },
      filename: (req, file, cb) => {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            cb(null, `profile-${uniqueSuffix}${path.extname(file.originalname)}`);
      },
});

const fileFilter = (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|webp/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      if (extname && mimetype) {
            cb(null, true);
      } else {
            cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed'), false);
      }
};

const upload = multer({
      storage,
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
      fileFilter,
});

export default upload;
