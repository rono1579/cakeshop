import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { Order } from '../models/Order.js';
import { sendOrderConfirmation, sendOrderStatusUpdate } from '../services/emailService.js';

const router = Router();

// Validation schemas
const OrderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  customization: z
    .object({
      size: z.string().optional(),
      flavor: z.string().optional(),
      frosting: z.string().optional(),
      filling: z.string().optional(),
      topping: z.string().optional(),
      decoration: z.string().optional(),
      message: z.string().optional(),
    })
    .optional(),
});

const CreateOrderSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().regex(/^(\+?254|0)?[17]\d{8}$/),
  shippingAddress: z.object({
    street: z.string().min(5),
    city: z.string().min(2),
    zipCode: z.string().min(2),
  }),
  items: z.array(OrderItemSchema).min(1),
  totalAmount: z.number().positive(),
  paymentStatus: z.enum(['pending', 'completed', 'failed']).default('pending'),
  paymentMethod: z.string().default('m-pesa'),
  notes: z.string().optional(),
});

type CreateOrderRequest = z.infer<typeof CreateOrderSchema>;

// POST: Create a new order
router.post('/create', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const data = CreateOrderSchema.parse(req.body);

    // Generate unique order number
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    const orderNumber = `ORD-${timestamp}-${random}`;

    // Create new order
    const order = new Order({
      orderNumber,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      shippingAddress: data.shippingAddress,
      items: data.items,
      totalAmount: data.totalAmount,
      paymentStatus: data.paymentStatus,
      paymentMethod: data.paymentMethod,
      notes: data.notes || '',
      orderStatus: 'pending',
    });

    // Save order to database
    await order.save();

    // Send confirmation email
    try {
      await sendOrderConfirmation(order);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the entire request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderNumber: order.orderNumber,
        id: order._id,
        totalAmount: order.totalAmount,
        orderStatus: order.orderStatus,
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

    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET: Retrieve order by order number
router.get('/:orderNumber', async (req: Request, res: Response) => {
  try {
    const { orderNumber } = req.params;

    const order = await Order.findOne({ orderNumber });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// PUT: Update order status
router.put('/:orderNumber/status', async (req: Request, res: Response) => {
  try {
    const { orderNumber } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];
    const validPaymentStatuses = ['pending', 'completed', 'failed'];

    if (orderStatus && !validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status',
      });
    }

    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status',
      });
    }

    const order = await Order.findOneAndUpdate(
      { orderNumber },
      {
        ...(orderStatus && { orderStatus }),
        ...(paymentStatus && { paymentStatus }),
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Send status update email if order status changed
    if (orderStatus && orderStatus !== 'pending') {
      try {
        await sendOrderStatusUpdate(order.customerEmail, order.orderNumber, orderStatus);
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError);
      }
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET: List all orders (admin)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { limit = 20, page = 1, status } = req.query;

    const query: { [key: string]: any } = {};
    if (status) {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
