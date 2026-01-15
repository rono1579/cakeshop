import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { cakeCustomizationOptions, cakes } from '@/data/cakes';
import { CustomizerProvider, useCustomizer } from '@/context/CustomizerContext';
import { CakePreview } from '@/components/CakePreview';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cartSlice';

const CustomizerContent = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('size');
  const {
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
  } = useCustomizer();
  const dispatch = useDispatch();

  // Check if we have a base cake from query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const baseCakeId = params.get('base');
    
    if (baseCakeId) {
      setBaseCake(baseCakeId);
    }
  }, [location.search, setBaseCake]);

const handleAddToCart = () => {
  const basePrice = state.baseCake?.price || 0;
  const sizeModifier = cakeCustomizationOptions.sizes.find(s => s.id === state.size)?.priceModifier || 0;
  const flavorModifier = cakeCustomizationOptions.flavors.find(f => f.id === state.flavor)?.priceModifier || 0;
  const frostingModifier = cakeCustomizationOptions.frostings.find(f => f.id === state.frosting)?.priceModifier || 0;
  const fillingModifier = cakeCustomizationOptions.fillings.find(f => f.id === state.filling)?.priceModifier || 0;
  const toppingModifier = cakeCustomizationOptions.toppings.find(t => t.id === state.topping)?.priceModifier || 0;
  const decorationModifier = cakeCustomizationOptions.decorations.find(d => d.id === state.decoration)?.priceModifier || 0;

  const totalPrice =
    basePrice +
    sizeModifier +
    flavorModifier +
    frostingModifier +
    fillingModifier +
    toppingModifier +
    decorationModifier;

  // Build customization description
  const flavorName = cakeCustomizationOptions.flavors.find(f => f.id === state.flavor)?.name || 'Vanilla';
  const frostingName = cakeCustomizationOptions.frostings.find(f => f.id === state.frosting)?.name || 'Buttercream';
  const toppingName = cakeCustomizationOptions.toppings.find(t => t.id === state.topping)?.name || 'No toppings';
  const sizeName = cakeCustomizationOptions.sizes.find(s => s.id === state.size)?.name || '8" Round';

  const customizedCake = {
    id: `custom-${state.baseCake?.id}-${Date.now()}`,
    name: `Custom ${state.baseCake?.name || 'Cake'} - ${sizeName}`,
    description: `${flavorName} flavor with ${frostingName} and ${toppingName}`,
    price: totalPrice,
    image: state.baseCake?.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop',
    category: state.baseCake?.category || ['custom'],
    flavors: state.baseCake?.flavors || [],
    toppings: state.baseCake?.toppings || [],
    sizes: state.baseCake?.sizes || [],
    rating: state.baseCake?.rating || 4.5,
    reviews: state.baseCake?.reviews || 0,
    // Customization details
    baseCake: state.baseCake,
    size: cakeCustomizationOptions.sizes.find(s => s.id === state.size),
    flavor: cakeCustomizationOptions.flavors.find(f => f.id === state.flavor),
    frosting: cakeCustomizationOptions.frostings.find(f => f.id === state.frosting),
    filling: cakeCustomizationOptions.fillings.find(f => f.id === state.filling),
    topping: cakeCustomizationOptions.toppings.find(t => t.id === state.topping),
    decoration: cakeCustomizationOptions.decorations.find(d => d.id === state.decoration),
    message: state.message,
  };

  dispatch(addToCart(customizedCake));

  toast({
    title: "Added to cart!",
    description: `Your custom ${state.baseCake?.name || 'cake'} has been added to your cart.`,
  });
};


  return (
    <div className="container py-8">
      <h1 className="section-title text-center mb-2">Customize Your Cake</h1>
      <p className="text-center text-muted-foreground mb-8">
        Design your perfect cake by selecting options for each category below.
      </p>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Options Panel */}
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="size" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 lg:grid-cols-6 mb-6">
              <TabsTrigger value="size">Size</TabsTrigger>
              <TabsTrigger value="flavor">Flavor</TabsTrigger>
              <TabsTrigger value="frosting">Frosting</TabsTrigger>
              <TabsTrigger value="filling">Filling</TabsTrigger>
              <TabsTrigger value="toppings">Toppings</TabsTrigger>
              <TabsTrigger value="decorations">Decorations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="size" className="space-y-4">
              <h3 className="font-serif text-xl font-medium">Choose Your Cake Size</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {cakeCustomizationOptions.sizes.map((sizeOption) => (
                  <Card 
                    key={sizeOption.id}
                    onClick={() => setSize(sizeOption.id)}
                    className={`cursor-pointer transition-all p-4 ${
                      state.size === sizeOption.id 
                        ? 'ring-2 ring-primary shadow-md' 
                        : 'hover:shadow-md'
                    }`}
                  >
                    <div className="aspect-square mb-3 bg-secondary/20 rounded-md flex items-center justify-center overflow-hidden">
                      <div 
                        className="w-1/2 h-1/2 rounded-full bg-primary/20 flex items-center justify-center"
                        style={{ width: `${sizeOption.name.includes('6"') ? '60%' : sizeOption.name.includes('8"') ? '75%' : '90%'}` }}
                      >
                        <span className="font-serif text-lg font-medium">
                          {sizeOption.name.split(' ')[0]}
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <h4 className="font-medium">{sizeOption.name}</h4>
                      <p className="text-sm text-muted-foreground">{sizeOption.serves}</p>
                      {sizeOption.priceModifier > 0 && (
                        <p className="text-sm font-medium mt-1">+ksh{sizeOption.priceModifier.toFixed(2)}</p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
              <Button onClick={() => setActiveTab('flavor')} className="mt-4 w-full md:w-auto">
                Next: Choose Flavor
              </Button>
            </TabsContent>
            
            <TabsContent value="flavor" className="space-y-4">
              <h3 className="font-serif text-xl font-medium">Choose Your Cake Flavor</h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                {cakeCustomizationOptions.flavors.map((flavorOption) => (
                  <Card 
                    key={flavorOption.id}
                    onClick={() => setFlavor(flavorOption.id)}
                    className={`cursor-pointer transition-all p-4 ${
                      state.flavor === flavorOption.id 
                        ? 'ring-2 ring-primary shadow-md' 
                        : 'hover:shadow-md'
                    }`}
                  >
                    <div className="aspect-square mb-3 rounded-md overflow-hidden">
                      <img 
                        src={flavorOption.image} 
                        alt={flavorOption.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <h4 className="font-medium">{flavorOption.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{flavorOption.description}</p>
                      {flavorOption.priceModifier > 0 && (
                        <p className="text-sm font-medium mt-1">+ksh{flavorOption.priceModifier.toFixed(2)}</p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab('size')}>
                  Back
                </Button>
                <Button onClick={() => setActiveTab('frosting')}>
                  Next: Choose Frosting
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="frosting" className="space-y-4">
              <h3 className="font-serif text-xl font-medium">Choose Your Frosting</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {cakeCustomizationOptions.frostings.map((frostingOption) => (
                  <Card 
                    key={frostingOption.id}
                    onClick={() => setFrosting(frostingOption.id)}
                    className={`cursor-pointer transition-all p-4 ${
                      state.frosting === frostingOption.id 
                        ? 'ring-2 ring-primary shadow-md' 
                        : 'hover:shadow-md'
                    }`}
                  >
                    <div 
                      className="aspect-square mb-3 rounded-md"
                      style={{ 
                        backgroundColor: frostingOption.color || '#f8f8f8',
                        backgroundImage: `url(${frostingOption.image})`,
                        backgroundSize: 'cover',
                        backgroundBlendMode: 'overlay'
                      }}
                    />
                    <div className="text-center">
                      <h4 className="font-medium">{frostingOption.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{frostingOption.description}</p>
                      {frostingOption.priceModifier > 0 && (
                        <p className="text-sm font-medium mt-1">+${frostingOption.priceModifier.toFixed(2)}</p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab('flavor')}>
                  Back
                </Button>
                <Button onClick={() => setActiveTab('filling')}>
                  Next: Choose Filling
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="filling" className="space-y-4">
              <h3 className="font-serif text-xl font-medium">Choose Your Filling</h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                {cakeCustomizationOptions.fillings.map((fillingOption) => (
                  <Card 
                    key={fillingOption.id}
                    onClick={() => setFilling(fillingOption.id)}
                    className={`cursor-pointer transition-all p-4 ${
                      state.filling === fillingOption.id 
                        ? 'ring-2 ring-primary shadow-md' 
                        : 'hover:shadow-md'
                    }`}
                  >
                    <div className="aspect-square mb-3 rounded-md overflow-hidden">
                      <img 
                        src={fillingOption.image} 
                        alt={fillingOption.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <h4 className="font-medium">{fillingOption.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{fillingOption.description}</p>
                      {fillingOption.priceModifier > 0 && (
                        <p className="text-sm font-medium mt-1">+ksh{fillingOption.priceModifier.toFixed(2)}</p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab('frosting')}>
                  Back
                </Button>
                <Button onClick={() => setActiveTab('toppings')}>
                  Next: Choose Toppings
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="toppings" className="space-y-4">
              <h3 className="font-serif text-xl font-medium">Choose Your Toppings</h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                {cakeCustomizationOptions.toppings.map((toppingOption) => (
                  <Card 
                    key={toppingOption.id}
                    onClick={() => setTopping(toppingOption.id)}
                    className={`cursor-pointer transition-all p-4 ${
                      state.topping === toppingOption.id 
                        ? 'ring-2 ring-primary shadow-md' 
                        : 'hover:shadow-md'
                    }`}
                  >
                    <div className="aspect-square mb-3 rounded-md overflow-hidden">
                      <img 
                        src={toppingOption.image} 
                        alt={toppingOption.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <h4 className="font-medium">{toppingOption.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{toppingOption.description}</p>
                      {toppingOption.priceModifier > 0 && (
                        <p className="text-sm font-medium mt-1">+ksh{toppingOption.priceModifier.toFixed(2)}</p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab('filling')}>
                  Back
                </Button>
                <Button onClick={() => setActiveTab('decorations')}>
                  Next: Choose Decorations
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="decorations" className="space-y-4">
              <h3 className="font-serif text-xl font-medium">Choose Your Decorations</h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                {cakeCustomizationOptions.decorations.map((decorationOption) => (
                  <Card 
                    key={decorationOption.id}
                    onClick={() => setDecoration(decorationOption.id)}
                    className={`cursor-pointer transition-all p-4 ${
                      state.decoration === decorationOption.id 
                        ? 'ring-2 ring-primary shadow-md' 
                        : 'hover:shadow-md'
                    }`}
                  >
                    <div className="aspect-square mb-3 rounded-md overflow-hidden">
                      <img 
                        src={decorationOption.image} 
                        alt={decorationOption.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <h4 className="font-medium">{decorationOption.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{decorationOption.description}</p>
                      {decorationOption.priceModifier > 0 && (
                        <p className="text-sm font-medium mt-1">+ksh{decorationOption.priceModifier.toFixed(2)}</p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
              
              {state.decoration === 'deco-message' && (
                <div className="mt-4">
                  <label htmlFor="message" className="block mb-2 text-sm font-medium">
                    Custom Message (Up to 30 characters)
                  </label>
                  <Input 
                    id="message"
                    value={state.message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={30}
                    placeholder="Happy Birthday, Sarah!"
                  />
                </div>
              )}
              
              <Button variant="outline" onClick={() => setActiveTab('toppings')}>
                Back
              </Button>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Summary Card */}
        <div>
          <Card className="p-6 sticky top-24">
            <h3 className="font-serif text-xl font-semibold mb-4">Your Custom Cake</h3>
            
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-secondary/20 flex items-center justify-center">
                <CakePreview
                  size={state.size}
                  flavor={state.flavor}
                  frosting={state.frosting}
                  filling={state.filling}
                  topping={state.topping}
                  decoration={state.decoration}
                  message={state.message}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Cake:</span>
                  <span className="font-medium">{state.baseCake?.name || 'Custom Cake'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Size:</span>
                  <span className="font-medium">
                    {cakeCustomizationOptions.sizes.find(s => s.id === state.size)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Flavor:</span>
                  <span className="font-medium">
                    {cakeCustomizationOptions.flavors.find(f => f.id === state.flavor)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frosting:</span>
                  <span className="font-medium">
                    {cakeCustomizationOptions.frostings.find(f => f.id === state.frosting)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Filling:</span>
                  <span className="font-medium">
                    {cakeCustomizationOptions.fillings.find(f => f.id === state.filling)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Topping:</span>
                  <span className="font-medium">
                    {cakeCustomizationOptions.toppings.find(t => t.id === state.topping)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Decoration:</span>
                  <span className="font-medium">
                    {cakeCustomizationOptions.decorations.find(d => d.id === state.decoration)?.name}
                  </span>
                </div>
                {state.decoration === 'deco-message' && state.message && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Message:</span>
                    <span className="font-medium">{state.message}</span>
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium">Quantity:</span>
                  <div className="flex items-center">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setQuantity(state.quantity - 1)}
                      disabled={state.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="mx-3 w-8 text-center">{state.quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setQuantity(state.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-lg font-semibold mb-6">
                  <span>Total:</span>
                  <span>ksh{state.totalPrice}</span>
                </div>
                
                <Button onClick={handleAddToCart} className="w-full">
                  <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const Customize = () => {
  return (
    <CustomizerProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <CustomizerContent />
        </main>
        <Footer />
      </div>
    </CustomizerProvider>
  );
};

export default Customize;
