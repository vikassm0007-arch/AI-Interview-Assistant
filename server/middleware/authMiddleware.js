import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkeyforintervueai');

      // Attach user details (excluding hashed credentials) to the request context
      req.user = await User.findById(decoded.id).select('-password -refreshTokens');

      if (!req.user) {
        return res.status(401).json({ message: 'Authorization revoked, owner profile no longer exists' });
      }

      next();
    } catch (error) {
      console.error(`JWT Verification Failed: ${error.message}`);
      
      // Expired access token response
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          message: 'Access token has expired', 
          code: 'TOKEN_EXPIRED' 
        });
      }
      
      // Malformed / tampered token response
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          message: 'Malformed or invalid access token', 
          code: 'TOKEN_INVALID' 
        });
      }

      return res.status(401).json({ message: 'Not authorized, token validation failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};
