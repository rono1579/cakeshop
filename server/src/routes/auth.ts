import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { User } from '../models/User.js';
import admin from '../config/firebase.js';

const router = Router();

const MAX_ADMINS = 3;

// Validation schema
const RegisterSchema = z.object({
  uid: z.string().min(1),
  email: z.string().email(),
  displayName: z.string().min(2),
  isAdmin: z.boolean().optional().default(false),
  photoURL: z.string().optional(),
});

type RegisterRequest = z.infer<typeof RegisterSchema>;

// POST: Check if admin registration is available
router.get('/check-admin-availability', async (_req: Request, res: Response) => {
  try {
    const adminCount = await User.countDocuments({ isAdmin: true });
    const canRegisterAsAdmin = adminCount < MAX_ADMINS;

    res.json({
      success: true,
      canRegisterAsAdmin,
      adminCount,
      maxAdmins: MAX_ADMINS,
    });
  } catch (error) {
    console.error('Error checking admin availability:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check admin availability',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// POST: Register a new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    const data = RegisterSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already registered',
      });
    }

    // If trying to register as admin, check the limit
    if (data.isAdmin) {
      const adminCount = await User.countDocuments({ isAdmin: true });
      if (adminCount >= MAX_ADMINS) {
        return res.status(400).json({
          success: false,
          message: 'Admin registration limit reached. Only customers can register at this time.',
          canRegisterAsAdmin: false,
        });
      }
    }

    // Create new user
    const user = new User({
      uid: data.uid,
      email: data.email,
      displayName: data.displayName,
      isAdmin: data.isAdmin,
      photoURL: data.photoURL || null,
    });

    await user.save();

    // If admin, set Firebase custom claim
    if (data.isAdmin) {
      try {
        await admin.auth().setCustomUserClaims(data.uid, { admin: true });
      } catch (claimError) {
        console.error('Failed to set Firebase custom claims:', claimError);
        // Continue even if Firebase claim fails, user is still created in MongoDB
      }
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }

    console.error('Error registering user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register user',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET: Get user by UID
router.get('/:uid', async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;

    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        isAdmin: user.isAdmin,
        photoURL: user.photoURL,
      },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
