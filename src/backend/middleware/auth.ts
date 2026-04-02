import { Request, Response, NextFunction } from 'express';
import { authUtils } from '../utils/auth.js';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn(`Auth failed: No token provided for ${req.method} ${req.path}`);
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = authUtils.verifyToken(token);

  if (!decoded) {
    console.warn(`Auth failed: Invalid or expired token for ${req.method} ${req.path}`);
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }

  (req as any).user = decoded;
  next();
};
