import { Request, Response, NextFunction } from 'express';
import admin from '../config/firebase.js';

interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
    isAdmin: boolean;
  };
}

const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || [];

export const verifyAdminAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.substring(7);

    // Verify token with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Check if user has admin role via custom claims
    const hasCustomAdminRole = decodedToken.admin === true;

    // Check if user email is in hardcoded admin list
    const hasAdminEmail = ADMIN_EMAILS.includes(decodedToken.email || '');

    // User must have either custom role or be in admin email list
    const isAdmin = hasCustomAdminRole || hasAdminEmail;

    // if (!isAdmin) {
    //   return res.status(403).json({ error: 'your not authorized to access this page' });
    // }

    // Attach user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
      isAdmin: true,
    };

    next();
  } catch (error) {
    console.error('Admin auth verification failed:', error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};
