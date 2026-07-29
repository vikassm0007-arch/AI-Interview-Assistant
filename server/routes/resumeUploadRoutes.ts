import express from 'express';
import multer from 'multer';
import { uploadResume, getUserResumes } from '../controllers/resumeUploadController.js';
import { protect } from '../middleware/authMiddleware.js'; // Importing JWT context verifier

const router = express.Router();

// Configure Multer to intercept multipart files in memory buffer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Hard limit 5 MB
  },
  fileFilter: (req, file, cb) => {
    // Basic extension check
    const isPdf = file.mimetype === 'application/pdf';
    if (isPdf) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are supported!') as any, false);
    }
  }
});

// Route mapping
router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/', protect, getUserResumes);

export default router;
