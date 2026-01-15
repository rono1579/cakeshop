import { useEffect, useState } from 'react';
import { Cake } from '@/data/cakes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { useCakesApi } from '@/hooks/use-cakes-api';

interface CakeFormProps {
  cake?: Cake | null;
  onClose: () => void;
  onSuccess: () => void;
}

const DEFAULT_CAKE: Omit<Cake, '_id' | 'createdAt' | 'updatedAt'> = {
  id: '',
  name: '',
  description: '',
  price: 0,
  image: '',
  category: [],
  flavors: [],
  toppings: [],
  sizes: ['6"', '8"', '10"'],
  rating: 0,
  reviews: 0,
  bestseller: false,
};

const CakeForm = ({ cake, onClose, onSuccess }: CakeFormProps) => {
  const { createCake, updateCake, loading } = useCakesApi();
  const [formData, setFormData] = useState<typeof DEFAULT_CAKE>(cake || DEFAULT_CAKE);
  const [categoryInput, setCategoryInput] = useState(cake?.category.join(', ') || '');
  const [flavorInput, setFlavorInput] = useState(cake?.flavors.join(', ') || '');
  const [toppingInput, setToppingInput] = useState(cake?.toppings.join(', ') || '');
  const [sizeInput, setSizeInput] = useState(cake?.sizes.join(', ') || '6", 8", 10"');
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checkboxInput = e.target as HTMLInputElement;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: checkboxInput.checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'price' || name === 'rating' || name === 'reviews' ? parseFloat(value) : value,
      }));
    }
  };

  const parseArrayInput = (input: string): string[] => {
    return input
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  };

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData((prev) => ({
          ...prev,
          image: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      category: parseArrayInput(categoryInput),
      flavors: parseArrayInput(flavorInput),
      toppings: parseArrayInput(toppingInput),
      sizes: parseArrayInput(sizeInput),
    };

    if (cake) {
      const success = await updateCake(cake.id, submitData);
      if (success) onSuccess();
    } else {
      const success = await createCake(submitData);
      if (success) onSuccess();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onClose} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h2 className="text-2xl font-semibold">{cake ? 'Edit Cake' : 'Add New Cake'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* ID */}
          <div>
            <Label htmlFor="id">ID *</Label>
            <Input
              id="id"
              name="id"
              value={formData.id}
              onChange={handleChange}
              placeholder="e.g., 1"
              disabled={!!cake}
              required
              className="mt-2"
            />
          </div>

          {/* Name */}
          <div>
            <Label htmlFor="name">Cake Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Classic Vanilla Dream"
              required
              className="mt-2"
            />
          </div>

          {/* Price */}
          <div>
            <Label htmlFor="price">Price (Ksh) *</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g., 2500"
              step="100"
              min="0"
              required
              className="mt-2"
            />
          </div>

          {/* Rating */}
          <div>
            <Label htmlFor="rating">Rating (0-5)</Label>
            <Input
              id="rating"
              name="rating"
              type="number"
              value={formData.rating}
              onChange={handleChange}
              min="0"
              max="5"
              step="0.1"
              className="mt-2"
            />
          </div>

          {/* Reviews */}
          <div>
            <Label htmlFor="reviews">Number of Reviews</Label>
            <Input
              id="reviews"
              name="reviews"
              type="number"
              value={formData.reviews}
              onChange={handleChange}
              min="0"
              className="mt-2"
            />
          </div>

          {/* Bestseller */}
          <div className="flex items-end">
            <div className="flex items-center gap-2">
              <Checkbox
                id="bestseller"
                name="bestseller"
                checked={formData.bestseller}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, bestseller: !!checked }))
                }
              />
              <Label htmlFor="bestseller" className="cursor-pointer">
                Mark as Bestseller
              </Label>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your cake..."
            rows={4}
            required
            className="mt-2"
          />
        </div>

        {/* Image Upload */}
        <div className="space-y-4">
          <Label htmlFor="image">Cake Image</Label>

          {/* Drag and Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-gray-300 bg-gray-50 hover:border-primary/50'
            }`}
          >
            <input
              id="image-file"
              name="image-file"
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <label
              htmlFor="image-file"
              className="flex flex-col items-center justify-center gap-3 cursor-pointer"
            >
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div className="text-center">
                <p className="font-medium text-sm">Drag and drop your image here</p>
                <p className="text-xs text-muted-foreground">or click to browse</p>
              </div>
            </label>
          </div>

          {/* OR Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-gray-300" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          {/* URL Input */}
          <div>
            <Label htmlFor="image-url" className="text-sm">Image URL (optional)</Label>
            <Input
              id="image-url"
              name="image"
              type="url"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="mt-2"
            />
          </div>

          {/* Image Preview */}
          {formData.image && (
            <div className="relative">
              <img
                src={formData.image}
                alt="Preview"
                className="h-48 w-full object-cover rounded-lg border border-gray-300"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => setFormData((prev) => ({ ...prev, image: '' }))}
                className="absolute top-2 right-2 gap-2"
              >
                <X className="h-4 w-4" />
                Remove
              </Button>
            </div>
          )}
        </div>

        {/* Categories */}
        <div>
          <Label htmlFor="category">Categories (comma-separated) *</Label>
          <Input
            id="category"
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
            placeholder="e.g., classic, vanilla, birthday"
            required
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {categoryInput && `Categories: ${parseArrayInput(categoryInput).join(', ')}`}
          </p>
        </div>

        {/* Flavors */}
        <div>
          <Label htmlFor="flavors">Flavors (comma-separated) *</Label>
          <Input
            id="flavors"
            value={flavorInput}
            onChange={(e) => setFlavorInput(e.target.value)}
            placeholder="e.g., vanilla, buttercream"
            required
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {flavorInput && `Flavors: ${parseArrayInput(flavorInput).join(', ')}`}
          </p>
        </div>

        {/* Toppings */}
        <div>
          <Label htmlFor="toppings">Toppings (comma-separated) *</Label>
          <Input
            id="toppings"
            value={toppingInput}
            onChange={(e) => setToppingInput(e.target.value)}
            placeholder="e.g., sprinkles, berries, chocolate shavings"
            required
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {toppingInput && `Toppings: ${parseArrayInput(toppingInput).join(', ')}`}
          </p>
        </div>

        {/* Sizes */}
        <div>
          <Label htmlFor="sizes">Sizes (comma-separated) *</Label>
          <Input
            id="sizes"
            value={sizeInput}
            onChange={(e) => setSizeInput(e.target.value)}
            placeholder='e.g., 6", 8", 10"'
            required
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {sizeInput && `Sizes: ${parseArrayInput(sizeInput).join(', ')}`}
          </p>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="gap-2">
            {loading ? 'Saving...' : cake ? 'Update Cake' : 'Create Cake'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CakeForm;
