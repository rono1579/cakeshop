import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { Flavor } from '../models/Flavor.js';
import { verifyAdminAuth } from '../middleware/adminAuth.js';
import { v4 as uuidv4 } from 'crypto';

const router = Router();

interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
    isAdmin: boolean;
  };
}

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Validation schema
const CreateFlavorSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  images: z.array(z.string()).min(1),
  isActive: z.boolean().optional().default(true),
});

type CreateFlavorRequest = z.infer<typeof CreateFlavorSchema>;

// GET: Get all active flavors
router.get('/', async (_req: Request, res: Response) => {
  try {
    const flavors = await Flavor.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: flavors,
    });
  } catch (error) {
    console.error('Error fetching flavors:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch flavors',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET: Get flavor by slug
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const flavor = await Flavor.findOne({ slug });

    if (!flavor) {
      return res.status(404).json({
        success: false,
        message: 'Flavor not found',
      });
    }

    res.json({
      success: true,
      data: flavor,
    });
  } catch (error) {
    console.error('Error fetching flavor:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch flavor',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// POST: Create new flavor (admin only)
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Check admin auth
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const data = CreateFlavorSchema.parse(req.body);
    const slug = slugify(data.name);

    // Check if slug already exists
    const existingFlavor = await Flavor.findOne({ slug });
    if (existingFlavor) {
      return res.status(400).json({
        success: false,
        message: 'A flavor with this name already exists',
      });
    }

    const flavor = new Flavor({
      id: uuidv4(),
      name: data.name,
      slug,
      description: data.description,
      images: data.images,
      isActive: data.isActive,
    });

    await flavor.save();

    res.status(201).json({
      success: true,
      message: 'Flavor created successfully',
      data: flavor,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }

    console.error('Error creating flavor:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create flavor',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// PUT: Update flavor (admin only)
router.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const { id } = req.params;
    const data = CreateFlavorSchema.parse(req.body);

    const flavor = await Flavor.findByIdAndUpdate(
      id,
      {
        name: data.name,
        description: data.description,
        images: data.images,
        isActive: data.isActive,
      },
      { new: true }
    );

    if (!flavor) {
      return res.status(404).json({
        success: false,
        message: 'Flavor not found',
      });
    }

    res.json({
      success: true,
      message: 'Flavor updated successfully',
      data: flavor,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }

    console.error('Error updating flavor:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update flavor',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// DELETE: Delete flavor (admin only)
router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const { id } = req.params;

    const flavor = await Flavor.findByIdAndDelete(id);

    if (!flavor) {
      return res.status(404).json({
        success: false,
        message: 'Flavor not found',
      });
    }

    res.json({
      success: true,
      message: 'Flavor deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting flavor:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete flavor',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
