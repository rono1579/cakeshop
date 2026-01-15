import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cake, Search, Filter, Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Navbar from '@/components/Navbar';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCart } from '../store/cartSlice';
import { addToWishlist } from '../store/wishlistSlice';

interface CakeType {
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
  bestseller: boolean;
}

export default function Gallery() {
  const [cakes, setCakes] = useState<CakeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  
  const isInWishlist = (id: string) => {
    return wishlistItems.some(item => item.id === id);
  };

  // Fetch cakes from backend
  useEffect(() => {
    const fetchCakes = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/cakes');
        if (!response.ok) {
          throw new Error('Failed to fetch cakes');
        }
        const data = await response.json();
        setCakes(data);
      } catch (err) {
        console.error('Error fetching cakes:', err);
        setError('Failed to load cakes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCakes();
  }, []);

  // Available filters - now includes categories from both hardcoded and backend
  const filters = useMemo(() => {
    const allCategories = new Set<string>();
    
    // Add hardcoded categories
    const hardcodedCategories = [
      'all', 'chocolate', 'fruit', 'vanilla', 'birthday', 
      'wedding', 'cupcakes', 'metropolitan', 'themed', 'gift', 'celebration'
    ];
    
    hardcodedCategories.forEach(cat => allCategories.add(cat));
    
    // Add categories from fetched cakes
    cakes.forEach(cake => {
      cake.category?.forEach((cat: string) => 
        allCategories.add(cat.toLowerCase())
      );
    });
    
    return Array.from(allCategories).map(cat => ({
      id: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1)
    }));
  }, [cakes]);

  // Filter cakes based on search and active filter
  const filteredCakes = useMemo(() => {
    return cakes.filter(cake => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        cake.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cake.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cake.category && cake.category.some(
          cat => cat.toLowerCase().includes(searchTerm.toLowerCase())
        ));
      
      // Category filter
      const matchesCategory = activeFilter === 'all' || 
        (cake.category && cake.category.some(
          cat => cat.toLowerCase() === activeFilter.toLowerCase()
        ));
      
      return matchesSearch && matchesCategory;
    });
  }, [cakes, searchTerm, activeFilter]);

  if (loading) {
    return (
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12 text-center">
        <p className="text-red-500">{error}</p>
        <Button 
          onClick={() => window.location.reload()} 
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-cake-50 py-12">
          <div className="container text-center">
            <h1 className="section-title mb-4">Cake Gallery</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse our selection of delicious cakes or use them as a starting point for your custom creation.
            </p>
          </div>
        </div>
        
        <div className="container py-12">
          <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
            {/* Search bar */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search cakes..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Category filter */}
            <div className="flex-1 overflow-x-auto pb-2">
              <div className="flex space-x-2">
                {filters.map((filter) => (
                  <Button
                    key={filter.id}
                    variant={activeFilter === filter.id ? 'default' : 'outline'}
                    size="sm"
                    className="whitespace-nowrap"
                    onClick={() => setActiveFilter(filter.id)}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Cake grid */}
          {filteredCakes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCakes.map((cake) => (
                <Card key={cake.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative group">
                    <img
                      src={cake.image}
                      alt={cake.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-full w-10 h-10 mr-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(addToWishlist(cake));
                        }}
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            isInWishlist(cake.id) ? 'fill-red-500 text-red-500' : ''
                          }`}
                        />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-full w-10 h-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(addToCart(cake));
                        }}
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </Button>
                    </div>
                    {cake.bestseller && (
                      <Badge className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-600">
                        Bestseller
                      </Badge>
                    )}
                  </div>
                  <CardHeader>
                    <h3 className="font-semibold text-lg">{cake.name}</h3>
                    <p className="text-muted-foreground line-clamp-2">
                      {cake.description}
                    </p>
                  </CardHeader>
                  <CardFooter className="flex justify-between items-center">
                    <span className="font-bold">KSh {cake.price.toLocaleString()}</span>
                    <div className="flex items-center space-x-1">
                      <Cake className="h-4 w-4 text-amber-500" />
                      <span className="text-sm text-muted-foreground">
                        {cake.rating} ({cake.reviews})
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No cakes found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}