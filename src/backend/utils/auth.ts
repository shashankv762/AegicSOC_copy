import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'cyber-soc-secret-key-2026';

export const authUtils = {
  hashPassword: async (password: string) => {
    return await bcrypt.hash(password, 10);
  },
  comparePassword: async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
  },
  generateToken: (user: any) => {
    return jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
  },
  verifyToken: (token: string) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return null;
    }
  }
};
