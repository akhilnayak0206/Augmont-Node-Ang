import { Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors';

// Add JWT_SECRET to your .env file

export interface AuthRequest extends Request {
  userId?: string;
}

export function authenticate(
  req: AuthRequest,
  _res: any,
  next: NextFunction
): void {
  try {
    const authHeader: string | undefined = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token: string = authHeader.substring(7);
    const secret: string =
      process.env.JWT_SECRET || 'your-secret-key-change-in-production';

    const decoded = jwt.verify(token, secret) as { userId: string };
    req.userId = decoded.userId;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token', 401));
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('Token expired', 401));
      return;
    }

    next(error);
  }
}

export function generateToken(userId: string): string {
  const secret: string =
    process.env.JWT_SECRET || 'your-secret-key-change-in-production';

  const expiresIn: string = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(
    { userId },
    secret,
    { expiresIn: expiresIn as any }
  );
}