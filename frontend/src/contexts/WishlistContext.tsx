import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Cake } from '@/types/cake';

interface WishlistContextType {
  wishlist: Cake[];
  addToWishlist: (cake: Cake) => void;
  removeFromWishlist: (cakeId: string) => void;
  isInWishlist: (cakeId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<Cake[]>([]);

  // Load wishlist from localStorage on initial render
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  // Save wishlist to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (cake: Cake) => {
    setWishlist(prevWishlist => {
      if (!prevWishlist.some(item => item.id === cake.id)) {
        return [...prevWishlist, cake];
      }
      return prevWishlist;
    });
  };

  const removeFromWishlist = (cakeId: string) => {
    setWishlist(prevWishlist => 
      prevWishlist.filter(item => item.id !== cakeId)
    );
  };

  const isInWishlist = (cakeId: string) => {
    return wishlist.some(item => item.id === cakeId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
