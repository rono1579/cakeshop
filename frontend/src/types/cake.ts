export interface Cake {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
  quantity?: number;
  ingredients?: string[];
  allergens?: string[];
  isFeatured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
