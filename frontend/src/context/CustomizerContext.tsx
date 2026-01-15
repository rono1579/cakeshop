import React, { createContext, useContext, useState, ReactNode } from 'react';
import { cakeCustomizationOptions, Cake, cakes } from '@/data/cakes';

interface CustomizerState {
  baseCake: Cake | null;
  size: string;
  flavor: string;
  frosting: string;
  filling: string;
  topping: string;
  decoration: string;
  message: string;
  quantity: number;
  totalPrice: number;
}

interface CustomizerContextType {
  state: CustomizerState;
  setBaseCake: (id: string | null) => void;
  setSize: (id: string) => void;
  setFlavor: (id: string) => void;
  setFrosting: (id: string) => void;
  setFilling: (id: string) => void;
  setTopping: (id: string) => void;
  setDecoration: (id: string) => void;
  setMessage: (text: string) => void;
  setQuantity: (quantity: number) => void;
  calculateTotalPrice: () => number;
  resetCustomizer: () => void;
}

const CustomizerContext = createContext<CustomizerContextType | undefined>(undefined);

export const useCustomizer = () => {
  const context = useContext(CustomizerContext);
  if (context === undefined) {
    throw new Error('useCustomizer must be used within a CustomizerProvider');
  }
  return context;
};

interface CustomizerProviderProps {
  children: ReactNode;
}

export const CustomizerProvider: React.FC<CustomizerProviderProps> = ({ children }) => {
  const [state, setState] = useState<CustomizerState>({
    baseCake: null,
    size: cakeCustomizationOptions.sizes[0].id,
    flavor: cakeCustomizationOptions.flavors[0].id,
    frosting: cakeCustomizationOptions.frostings[0].id,
    filling: cakeCustomizationOptions.fillings[0].id,
    topping: cakeCustomizationOptions.toppings[0].id,
    decoration: cakeCustomizationOptions.decorations[0].id,
    message: '',
    quantity: 1,
    totalPrice: 2500,
  });

  const calculateTotalPrice = () => {
    let basePrice = state.baseCake?.price || 2500;

    // Add price modifiers for each selection
    const sizeModifier = cakeCustomizationOptions.sizes.find(s => s.id === state.size)?.priceModifier || 0;
    const flavorModifier = cakeCustomizationOptions.flavors.find(f => f.id === state.flavor)?.priceModifier || 0;
    const frostingModifier = cakeCustomizationOptions.frostings.find(f => f.id === state.frosting)?.priceModifier || 0;
    const fillingModifier = cakeCustomizationOptions.fillings.find(f => f.id === state.filling)?.priceModifier || 0;
    const toppingModifier = cakeCustomizationOptions.toppings.find(t => t.id === state.topping)?.priceModifier || 0;
    const decorationModifier = cakeCustomizationOptions.decorations.find(d => d.id === state.decoration)?.priceModifier || 0;

    // Calculate total with modifiers
    const total = (
      basePrice +
      sizeModifier +
      flavorModifier +
      frostingModifier +
      fillingModifier +
      toppingModifier +
      decorationModifier
    ) * state.quantity;

    return parseFloat(total.toFixed(2));
  };

  const setBaseCake = (id: string | null) => {
    const cake = id ? cakes.find(c => c.id === id) || null : null;
    setState(prev => ({ ...prev, baseCake: cake }));
  };

  const setSize = (id: string) => setState(prev => ({ ...prev, size: id }));
  const setFlavor = (id: string) => setState(prev => ({ ...prev, flavor: id }));
  const setFrosting = (id: string) => setState(prev => ({ ...prev, frosting: id }));
  const setFilling = (id: string) => setState(prev => ({ ...prev, filling: id }));
  const setTopping = (id: string) => setState(prev => ({ ...prev, topping: id }));
  const setDecoration = (id: string) => setState(prev => ({ ...prev, decoration: id }));
  const setMessage = (text: string) => setState(prev => ({ ...prev, message: text }));
  const setQuantity = (quantity: number) => setState(prev => ({ ...prev, quantity: Math.max(1, quantity) }));

  const resetCustomizer = () => {
    setState({
      baseCake: null,
      size: cakeCustomizationOptions.sizes[0].id,
      flavor: cakeCustomizationOptions.flavors[0].id,
      frosting: cakeCustomizationOptions.frostings[0].id,
      filling: cakeCustomizationOptions.fillings[0].id,
      topping: cakeCustomizationOptions.toppings[0].id,
      decoration: cakeCustomizationOptions.decorations[0].id,
      message: '',
      quantity: 1,
      totalPrice: 2500,
    });
  };

  // Update total price whenever state changes
  React.useEffect(() => {
    const newTotal = calculateTotalPrice();
    setState(prev => ({ ...prev, totalPrice: newTotal }));
  }, [
    state.baseCake, 
    state.size, 
    state.flavor, 
    state.frosting, 
    state.filling, 
    state.topping, 
    state.decoration, 
    state.quantity
  ]);

  const value = {
    state,
    setBaseCake,
    setSize,
    setFlavor,
    setFrosting,
    setFilling,
    setTopping,
    setDecoration,
    setMessage,
    setQuantity,
    calculateTotalPrice,
    resetCustomizer
  };

  return (
    <CustomizerContext.Provider value={value}>
      {children}
    </CustomizerContext.Provider>
  );
};
