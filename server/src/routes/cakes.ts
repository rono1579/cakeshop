import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { Cake } from '../models/Cake.js';
import { verifyAdminAuth } from '../middleware/adminAuth.js';

const router = Router();

interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
    isAdmin: boolean;
  };
}

// Validation schemas
const CreateCakeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.number().positive(),
  image: z.string().url(),
  category: z.array(z.string()).min(1),
  flavors: z.array(z.string()).min(1),
  toppings: z.array(z.string()).min(1),
  sizes: z.array(z.string()).min(1),
  rating: z.number().min(0).max(5).optional().default(0),
  reviews: z.number().min(0).optional().default(0),
  bestseller: z.boolean().optional().default(false),
});

const UpdateCakeSchema = CreateCakeSchema.partial();

type CreateCakeRequest = z.infer<typeof CreateCakeSchema>;
type UpdateCakeRequest = z.infer<typeof UpdateCakeSchema>;

// GET: Get all cakes
router.get('/', async (req: Request, res: Response) => {
  try {
    const cakes = await Cake.find().sort({ createdAt: -1 });
    res.json(cakes);
  } catch (error) {
    console.error('Error fetching cakes:', error);
    res.status(500).json({ error: 'Failed to fetch cakes' });
  }
});

// GET: Get single cake by id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const cake = await Cake.findOne({ id: req.params.id });

    if (!cake) {
      return res.status(404).json({ error: 'Cake not found' });
    }

    res.json(cake);
  } catch (error) {
    console.error('Error fetching cake:', error);
    res.status(500).json({ error: 'Failed to fetch cake' });
  }
});

// POST: Create new cake (admin only)
router.post('/', verifyAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = CreateCakeSchema.parse(req.body);

    // Check if cake with this id already exists
    const existingCake = await Cake.findOne({ id: data.id });
    if (existingCake) {
      return res.status(400).json({ error: 'Cake with this ID already exists' });
    }

    const cake = new Cake(data);
    await cake.save();

    res.status(201).json(cake);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Error creating cake:', error);
    res.status(500).json({ error: 'Failed to create cake' });
  }
});

// PUT: Update cake (admin only)
router.put('/:id', verifyAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = UpdateCakeSchema.parse(req.body);

    const cake = await Cake.findOneAndUpdate(
      { id: req.params.id },
      data,
      { new: true, runValidators: true }
    );

    if (!cake) {
      return res.status(404).json({ error: 'Cake not found' });
    }

    res.json(cake);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Error updating cake:', error);
    res.status(500).json({ error: 'Failed to update cake' });
  }
});

// DELETE: Delete cake (admin only)
router.delete('/:id', verifyAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const cake = await Cake.findOneAndDelete({ id: req.params.id });

    if (!cake) {
      return res.status(404).json({ error: 'Cake not found' });
    }

    res.json({ message: 'Cake deleted successfully', cake });
  } catch (error) {
    console.error('Error deleting cake:', error);
    res.status(500).json({ error: 'Failed to delete cake' });
  }
});

export default router;
