import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { Contact } from '../models/Contact.js';
import { sendContactConfirmation } from '../services/emailService.js';

const router = Router();

const CreateContactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^(\+?254|0)?[17]\d{8}$/),
  subject: z.string().min(5),
  category: z.enum(['general', 'order', 'support', 'feedback', 'other']),
  message: z.string().min(10),
});

type CreateContactRequest = z.infer<typeof CreateContactSchema>;

// POST: Submit contact form
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = CreateContactSchema.parse(req.body);

    const contact = new Contact({
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      category: data.category,
      message: data.message,
      status: 'new',
    });

    await contact.save();

    // Send confirmation email
    try {
      await sendContactConfirmation(contact);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us! We will respond to your inquiry soon.',
      data: {
        id: contact._id,
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

    console.error('Error creating contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET: Get all contacts (admin only)
router.get('/', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { status = 'all', limit = 20, page = 1 } = req.query;

    const query: { [key: string]: any } = {};
    if (status !== 'all') {
      query.status = status;
    }

    const contacts = await Contact.find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await Contact.countDocuments(query);

    res.json({
      success: true,
      data: contacts,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// PUT: Update contact status (admin only)
router.put('/:id/status', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['new', 'read', 'responded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }

    res.json({
      success: true,
      message: 'Contact status updated',
      data: contact,
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
