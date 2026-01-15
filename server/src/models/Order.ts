import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  customization?: {
    size?: string;
    flavor?: string;
    frosting?: string;
    filling?: string;
    topping?: string;
    decoration?: string;
    message?: string;
  };
}

export interface IOrder extends Document {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    zipCode: string;
  };
  items: IOrderItem[];
  totalAmount: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  orderStatus: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
      lowercase: true,
    },
    customerPhone: {
      type: String,
      required: true,
    },
    shippingAddress: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
    },
    items: [
      {
        id: String,
        name: String,
        description: String,
        price: Number,
        quantity: Number,
        customization: {
          size: String,
          flavor: String,
          frosting: String,
          filling: String,
          topping: String,
          decoration: String,
          message: String,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      default: 'm-pesa',
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered'],
      default: 'pending',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
