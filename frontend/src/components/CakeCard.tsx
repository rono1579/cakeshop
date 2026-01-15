import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ShoppingBag, Heart } from 'lucide-react';
import { Cake } from '@/data/cakes';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '@/store/wishlistSlice';
import { addToCart } from '@/store/cartSlice';
import type { RootState } from '@/store/store';
import { toast } from 'sonner';

interface CakeCardProps {
  cake: Cake;
  customizeButton?: boolean;
}

const CakeCard: React.FC<CakeCardProps> = ({ cake, customizeButton = true }) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const isInWishlist = wishlistItems.some(item => item.id === cake.id);

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(cake.id));
      toast.success('Removed from wishlist');
    } else {
      dispatch(addToWishlist(cake));
      toast.success('Added to wishlist');
    }
  };

  const handleAddToCart = () => {
    dispatch(addToCart(cake));
    toast.success('Added to cart');
  };

  const { id, name, description, price, image, rating, reviews, bestseller } = cake;

  const customPrice = price.toLocaleString('en-US');

  return (
    <Card className="cake-card group h-full flex flex-col overflow-hidden">
      <div className="relative overflow-hidden pb-[60%]">
        <img 
          src={image} 
          alt={name} 
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {bestseller && (
          <span className="absolute top-4 left-4 bg-primary px-3 py-1 rounded-full text-xs font-medium text-white">
            Bestseller
          </span>
        )}
        <button 
          onClick={handleWishlistToggle}
          className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/70 flex items-center justify-center backdrop-blur-sm transition-all hover:bg-white"
        >
          <Heart 
            size={18} 
            className={`text-cake-600 transition-colors ${isInWishlist ? 'fill-cake-600' : 'hover:fill-cake-500'}`} 
          />
        </button>
      </div>
      
      <div className="flex flex-col flex-grow p-5 space-y-4">
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={16} 
              className={i < Math.floor(rating) ? "fill-cream-400 text-cream-400" : "text-gray-300"}
            />
          ))}
          <span className="ml-2 text-sm text-muted-foreground">{rating.toFixed(1)} ({reviews})</span>
        </div>
        
        <div>
          <h3 className="font-serif font-medium text-lg">{name}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{description}</p>
        </div>
        
        <div className="flex-grow"></div>
        
        <div className="flex items-center justify-between">
          <span className="font-semibold text-lg">ksh{customPrice}</span>
          <div className="space-x-1 flex">
            {customizeButton && (
              <Button asChild variant="outline" size="sm" className="rounded-full hidden md:flex">
                <Link to={`/customize?base=${id}`}>Customize</Link>
              </Button>
            )}
            <Button size="sm" className="rounded-full" onClick={handleAddToCart}>
              <ShoppingBag size={16} className="mr-2" /> Add
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CakeCard;
