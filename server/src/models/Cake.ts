import mongoose, { Schema, Document } from 'mongoose';

export interface ICake extends Document {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string[];
  flavors: string[];
  toppings: string[];
  sizes: string[];
  rating: number;
  reviews: number;
  bestseller?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CakeSchema = new Schema<ICake>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      required: true,
    },
    category: [
      {
        type: String,
        required: true,
      },
    ],
    flavors: [
      {
        type: String,
        required: true,
      },
    ],
    toppings: [
      {
        type: String,
        required: true,
      },
    ],
    sizes: [
      {
        type: String,
        required: true,
      },
    ],
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
    reviews: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    bestseller: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Cake = mongoose.model<ICake>('Cake', CakeSchema);
