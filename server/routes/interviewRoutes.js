import express from 'express';
import { 
  startInterviewSession, 
  submitInterviewSession, 
  getInterviewSession, 
  getInterviewHistory 
} from '../controllers/interviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Allow optional protect or specify routes
router.post('/start', startInterviewSession);
router.post('/:id/submit', submitInterviewSession);
router.get('/history', getInterviewHistory);
router.get('/:id', getInterviewSession);

export default router;
