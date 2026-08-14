import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

// ── SECURITY: Configure multer for secure file uploads ────────────────────────

// ── File destination and naming ─────────────────────────────────────────────────
const storage = multer.diskStorage({
      destination: (req, file, cb) => {
            // Determine destination based on field name
            let dir = 'uploads/profiles/';
            if (file.fieldname === 'complaintImage' || file.fieldname === 'file') {
                  dir = 'uploads/complaints/';
            } else if (file.fieldname === 'govtIdImage') {
                  dir = 'uploads/govt-ids/';
            } else if (file.fieldname === 'livenessImage') {
                  dir = 'uploads/liveness/';
            }
            cb(null, dir);
      },
      filename: (req, file, cb) => {
            // SECURITY: Generate secure random filename; ignore user-supplied name
            const uniqueSuffix = crypto.randomBytes(8).toString('hex') + Date.now();
            const ext = path.extname(file.originalname).toLowerCase();
            cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
});

// ── MIME type validation ────────────────────────────────────────────────────────
const fileFilter = (req, file, cb) => {
      // Whitelist: only image files allowed
      const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const allowedExts = /\.(jpeg|jpg|png|webp)$/i;

      const ext = path.extname(file.originalname).toLowerCase();
      const validExt = allowedExts.test(ext);
      const validMime = allowedMimes.includes(file.mimetype);

      // SECURITY: Validate both MIME type and extension; reject if either fails
      if (validExt && validMime) {
            cb(null, true);
      } else {
            // SECURITY: Log rejected uploads for security monitoring
            console.warn(`[SECURITY] Rejected file upload: field=${file.fieldname}, mime=${file.mimetype}, ext=${ext}`);
            cb(new Error('Only image files (JPEG, PNG, WebP) are allowed'), false);
      }
};

// ── Multer configuration ────────────────────────────────────────────────────────
const upload = multer({
      storage,
      limits: {
            fileSize: 2 * 1024 * 1024, // 2MB max per file
            files: 5,                   // Max 5 files per request
      },
      fileFilter,
});

export default upload;
