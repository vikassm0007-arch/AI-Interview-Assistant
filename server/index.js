import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';

// Load routes
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB database
connectDB();

const app = express();

// Secure CORS configuration allowing HttpOnly credentials cookies exchange
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', // Explicit source
  credentials: true, // Required to permit access cookie header passing
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middlewares
app.use(express.json());
app.use(cookieParser()); // Extracts cookies from header payload
app.use(morgan('dev'));

// Rate Limiting Config: Mitigate Brute Force & DoS attacks
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
  message: { message: 'Too many requests from this IP, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Stricter limit of 10 login/register requests per IP per 15 mins
  message: { message: 'Too many authentication attempts. Please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply global rate limiting to all API routes
app.use('/api/', apiLimiter);

// Route mapping with strict rate limiter on auth
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api', aiRoutes);

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
    dbState: mongooseState()
  });
});

// Helper function to check Mongoose connection status
import mongoose from 'mongoose';
const mongooseState = () => {
  const states = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
  };
  return states[mongoose.connection.readyState] || 'Unknown';
};

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ message: `API Route Not Found - ${req.originalUrl}` });
});

// Global Error middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  // Never expose sensitive stack details in production logs/responses
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/api/health`);
});
