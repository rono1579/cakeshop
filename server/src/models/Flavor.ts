import mongoose, { Schema, Document } from 'mongoose';

export interface IFlavor extends Document {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FlavorSchema = new Schema<IFlavor>(
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
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Flavor = mongoose.model<IFlavor>('Flavor', FlavorSchema);
