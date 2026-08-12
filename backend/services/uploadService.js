import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Ensure upload directories exist ──────────────────────────────────────────
const ensureDir = (dir) => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); };

const UPLOAD_BASE = path.join(__dirname, '..', 'uploads');
ensureDir(path.join(UPLOAD_BASE, 'profiles'));
ensureDir(path.join(UPLOAD_BASE, 'complaints'));
ensureDir(path.join(UPLOAD_BASE, 'govt-ids'));

// ── Storage config factory ────────────────────────────────────────────────────
const makeStorage = (subfolder) =>
      multer.diskStorage({
            destination: (req, file, cb) => cb(null, path.join(UPLOAD_BASE, subfolder)),
            filename: (req, file, cb) => {
                  const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                  cb(null, `${subfolder.replace('/', '-')}-${unique}${path.extname(file.originalname)}`);
            },
      });

// ── File filter ───────────────────────────────────────────────────────────────
const imageFilter = (req, file, cb) => {
      const allowed = /jpeg|jpg|png|webp/;
      if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)) {
            cb(null, true);
      } else {
            cb(new Error('Only image files (JPEG, JPG, PNG, WebP) are allowed'), false);
      }
};

// ── Multer instances ──────────────────────────────────────────────────────────
export const profileUpload = multer({
      storage: makeStorage('profiles'),
      limits: { fileSize: 2 * 1024 * 1024 },  // 2MB
      fileFilter: imageFilter,
});

export const complaintUpload = multer({
      storage: makeStorage('complaints'),
      limits: { fileSize: 5 * 1024 * 1024 },  // 5MB
      fileFilter: imageFilter,
});

export const govtIdUpload = multer({
      storage: makeStorage('govt-ids'),
      limits: { fileSize: 2 * 1024 * 1024 },
      fileFilter: imageFilter,
});

// ── Multi-field upload for registration ───────────────────────────────────────
export const registrationUpload = multer({
      storage: makeStorage('profiles'),
      limits: { fileSize: 3 * 1024 * 1024 },
      fileFilter: imageFilter,
}).fields([
      { name: 'profileImage', maxCount: 1 },
      { name: 'govtIdImage', maxCount: 1 },
      { name: 'liveImage', maxCount: 1 },
]);

// ── Delete a file ─────────────────────────────────────────────────────────────
export const deleteFile = (filePath) => {
      try {
            const full = path.join(__dirname, '..', filePath);
            if (fs.existsSync(full)) fs.unlinkSync(full);
      } catch (err) {
            console.error('File delete error:', err.message);
      }
};
