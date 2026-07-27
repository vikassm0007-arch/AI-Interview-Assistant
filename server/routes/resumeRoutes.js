import express from 'express';
import { analyzeResume } from '../controllers/resumeController.js';

const router = express.Router();

router.post('/analyze', analyzeResume);

export default router;
