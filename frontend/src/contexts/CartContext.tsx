import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Cake } from '@/types/cake';

interface CartContextType {
  cartItems: Cake[];
  addToCart: (cake: Cake) => void;
  removeFromCart: (cakeId: string) => void;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<Cake[]>([]);
  const [itemCount, setItemCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Update item count and total price when cart changes
  useEffect(() => {
    const count = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
    const total = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    setItemCount(count);
    setTotalPrice(total);
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (cake: Cake) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === cake.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === cake.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prevItems, { ...cake, quantity: 1 }];
    });
  };

  const removeFromCart = (cakeId: string) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === cakeId);
      if (existingItem && (existingItem.quantity || 1) > 1) {
        return prevItems.map(item =>
          item.id === cakeId
            ? { ...item, quantity: (item.quantity || 2) - 1 }
            : item
        );
      }
      return prevItems.filter(item => item.id !== cakeId);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        itemCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
