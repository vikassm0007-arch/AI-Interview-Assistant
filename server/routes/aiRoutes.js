import express from 'express';
import multer from 'multer';
import { parseResume, generateQuestions } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure Multer to intercept multipart files in memory buffer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB Limit
  },
  fileFilter: (req, file, cb) => {
    const isPdf = file.mimetype === 'application/pdf';
    if (isPdf) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF documents are allowed!') as any, false);
    }
  }
});

// Route mapping with JWT checkpoints
router.post('/parse-resume', protect, upload.single('resume'), parseResume);
router.post('/generate-questions', protect, generateQuestions);

export default router;
