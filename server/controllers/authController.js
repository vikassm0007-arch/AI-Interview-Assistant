import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

// Configuration keys from environment
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY_DAYS = 7;
const REFRESH_COOKIE_NAME = 'jid';

// In-Memory fallback database for testing without active local MongoDB daemon
const mockUsers = [
  {
    _id: 'mock-user-123',
    name: 'Candidate User',
    email: 'user@example.com',
    password: '', // Initialized at startup
    credits: 8,
    targetJobTitle: 'Frontend Developer',
    experienceLevel: 'mid',
    refreshTokens: []
  }
];

// Hash mock user credentials at server boot
bcrypt.hash('Password@123', 12).then(hash => {
  mockUsers[0].password = hash;
  console.log('[Auth] In-memory mock user password pre-hashed successfully');
});

// Token generation helpers
const generateAccessToken = (id, role = 'candidate') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'supersecretjwtkeyforintervueai', {
    expiresIn: ACCESS_TOKEN_EXPIRY
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkeyforintervueai', {
    expiresIn: `${REFRESH_TOKEN_EXPIRY_DAYS}d`
  });
};

const getRefreshCookieOptions = () => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000 // 7 days
  };
};

// Check if database connection is fully active
const isDBConnected = () => mongoose.connection.readyState === 1;

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, targetJobTitle, experienceLevel } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedName = name.trim();

    // Password validation rules
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one uppercase letter' });
    }
    if (!/[a-z]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one lowercase letter' });
    }
    if (!/[0-9]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one number' });
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one special character' });
    }

    // Email Conflict Check
    let emailConflict = false;
    if (isDBConnected()) {
      const userExists = await User.findOne({ email: sanitizedEmail });
      if (userExists) emailConflict = true;
    } else {
      const userExists = mockUsers.find(u => u.email === sanitizedEmail);
      if (userExists) emailConflict = true;
    }

    if (emailConflict) {
      return res.status(409).json({ message: 'An account is already registered with this email address' });
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user;
    if (isDBConnected()) {
      user = await User.create({
        name: sanitizedName,
        email: sanitizedEmail,
        password: hashedPassword,
        targetJobTitle: targetJobTitle ? targetJobTitle.trim() : '',
        experienceLevel: experienceLevel || ''
      });
    } else {
      // Offline fallback registration
      user = {
        _id: 'mock-user-' + Math.random().toString(36).substr(2, 9),
        name: sanitizedName,
        email: sanitizedEmail,
        password: hashedPassword,
        credits: 8,
        targetJobTitle: targetJobTitle ? targetJobTitle.trim() : '',
        experienceLevel: experienceLevel || '',
        refreshTokens: []
      };
      mockUsers.push(user);
      console.log(`[Auth] MongoDB offline: registered ${sanitizedEmail} in-memory`);
    }

    if (user) {
      const accessToken = generateAccessToken(user._id, 'candidate');
      const refreshToken = generateRefreshToken(user._id);

      // Save token to session list
      if (isDBConnected()) {
        user.refreshTokens.push(refreshToken);
        await user.save();
      } else {
        user.refreshTokens.push(refreshToken);
      }

      res.cookie(REFRESH_COOKIE_NAME, refreshToken, getRefreshCookieOptions());

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        credits: user.credits,
        targetJobTitle: user.targetJobTitle,
        experienceLevel: user.experienceLevel,
        accessToken
      });
    } else {
      res.status(400).json({ message: 'Failed to create user record' });
    }
  } catch (error) {
    res.status(500).json({ message: 'An internal server error occurred during registration' });
  }
};

// @desc    Authenticate user, set cookie, and issue access token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const sanitizedEmail = email.trim().toLowerCase();
    let user;

    // Fetch user record depending on DB availability state
    if (isDBConnected()) {
      user = await User.findOne({ email: sanitizedEmail });
    } else {
      user = mockUsers.find(u => u.email === sanitizedEmail);
    }

    // Timing-attack mitigation
    if (!user) {
      const dummyHash = '$2b$12$N9qo8uLOqpGC1234567890abcdefghijklmnopqrstuvwxyz12';
      await bcrypt.compare(password, dummyHash);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken(user._id, 'candidate');
    const refreshToken = generateRefreshToken(user._id);

    // Track active token rotation
    if (isDBConnected()) {
      user.refreshTokens.push(refreshToken);
      await user.save();
    } else {
      user.refreshTokens.push(refreshToken);
    }

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, getRefreshCookieOptions());

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      credits: user.credits,
      targetJobTitle: user.targetJobTitle,
      experienceLevel: user.experienceLevel,
      accessToken
    });
  } catch (error) {
    res.status(500).json({ message: 'An internal server error occurred during login' });
  }
};

// @desc    Refresh Access Token
// @route   POST /api/auth/refresh
export const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies[REFRESH_COOKIE_NAME];

    if (!token) {
      return res.status(401).json({ message: 'Refresh token session not found' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkeyforintervueai');
    } catch (err) {
      return res.status(401).json({ message: 'Expired or invalid session token' });
    }

    let user;
    if (isDBConnected()) {
      user = await User.findById(decoded.id);
    } else {
      user = mockUsers.find(u => u._id === decoded.id);
    }

    if (!user) {
      return res.status(401).json({ message: 'Session owner record not found' });
    }

    if (!user.refreshTokens.includes(token)) {
      res.clearCookie(REFRESH_COOKIE_NAME);
      return res.status(403).json({ message: 'Invalid or revoked session access' });
    }

    const newAccessToken = generateAccessToken(user._id, 'candidate');
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(500).json({ message: 'Failed to rotate session access' });
  }
};

// @desc    Logout candidate session & clear cookie
// @route   POST /api/auth/logout
export const logoutUser = async (req, res) => {
  try {
    const token = req.cookies[REFRESH_COOKIE_NAME];
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkeyforintervueai');
        if (isDBConnected()) {
          const user = await User.findById(decoded.id);
          if (user) {
            user.refreshTokens = user.refreshTokens.filter(t => t !== token);
            await user.save();
          }
        } else {
          const user = mockUsers.find(u => u._id === decoded.id);
          if (user) {
            user.refreshTokens = user.refreshTokens.filter(t => t !== token);
          }
        }
      } catch (err) {
        // Clear locally anyway
      }
    }

    res.clearCookie(REFRESH_COOKIE_NAME);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred during logout' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
export const getUserProfile = async (req, res) => {
  try {
    let user;
    if (isDBConnected()) {
      user = await User.findById(req.user.id).select('-password -refreshTokens');
    } else {
      const u = mockUsers.find(x => x._id === req.user.id);
      if (u) {
        const { password, refreshTokens, ...sanitized } = u;
        user = sanitized;
      }
    }

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
