import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Configuration keys from environment
const ACCESS_TOKEN_EXPIRY = '15m'; // Short-lived access token
const REFRESH_TOKEN_EXPIRY_DAYS = 7;
const REFRESH_COOKIE_NAME = 'jid';

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

// Cookie options configurator based on environment security requirements
const getRefreshCookieOptions = () => {
  return {
    httpOnly: true, // Prevents XSS scripting access to cookie
    secure: process.env.NODE_ENV === 'production', // Requires HTTPS link in production
    sameSite: 'strict', // Mitigates CSRF requests hijacking
    maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000 // 7 days in ms
  };
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, targetJobTitle, experienceLevel } = req.body;

    // 1. Sanitization & Payload Checks
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedName = name.trim();

    // 2. Strict Password Validation Criteria
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

    // 3. Email Conflict Check
    const userExists = await User.findOne({ email: sanitizedEmail });
    if (userExists) {
      return res.status(409).json({ message: 'An account is already registered with this email address' });
    }

    // 4. Password Encryption
    const salt = await bcrypt.genSalt(12); // Production-grade work factor
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Database registration
    const user = await User.create({
      name: sanitizedName,
      email: sanitizedEmail,
      password: hashedPassword,
      targetJobTitle: targetJobTitle ? targetJobTitle.trim() : '',
      experienceLevel: experienceLevel || ''
    });

    if (user) {
      const accessToken = generateAccessToken(user._id, 'candidate');
      const refreshToken = generateRefreshToken(user._id);

      // Save refresh token to database
      user.refreshTokens.push(refreshToken);
      await user.save();

      // Expose refresh token in secure HttpOnly cookie
      res.cookie(REFRESH_COOKIE_NAME, refreshToken, getRefreshCookieOptions());

      // Return sanitized user details + short-lived access token
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

    // Fetch user record
    const user = await User.findOne({ email: sanitizedEmail });

    // Timing-attack mitigation: if user does not exist, run a dummy bcrypt validation
    // to match execution path times and prevent account enumeration techniques.
    if (!user) {
      const dummyHash = '$2b$12$N9qo8uLOqpGC1234567890abcdefghijklmnopqrstuvwxyz12';
      await bcrypt.compare(password, dummyHash);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken(user._id, 'candidate');
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token in database for session tracking & revocation
    user.refreshTokens.push(refreshToken);
    await user.save();

    // Set HttpOnly refresh token cookie
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

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Session owner record not found' });
    }

    // Revocation check: verify if token exists in user database list
    if (!user.refreshTokens.includes(token)) {
      // Possible token reuse attack or invalid session. Clear cookie.
      res.clearCookie(REFRESH_COOKIE_NAME);
      return res.status(403).json({ message: 'Invalid or revoked session access' });
    }

    // Issue new access token
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
      // Decode user context to remove session token from database
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkeyforintervueai');
        const user = await User.findById(decoded.id);
        if (user) {
          user.refreshTokens = user.refreshTokens.filter(t => t !== token);
          await user.save();
        }
      } catch (err) {
        // Continue logout anyway to clear cookie
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
    const user = await User.findById(req.user.id).select('-password -refreshTokens');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
