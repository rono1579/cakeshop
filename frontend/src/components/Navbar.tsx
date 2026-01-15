
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, Heart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { auth } from '../firebase/config'
import { onAuthStateChanged } from 'firebase/auth'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const cartCount = cartItems.length;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    
    return () => unsubscribe();
  }, []);

  const categories = [
    { name: 'All Cakes', path: '/gallery?category=all' },
    { name: 'Birthday Cakes', path: '/gallery?category=birthday' },
    { name: 'Cupcakes', path: '/gallery?category=cupcakes' },
    { name: 'Fruit Cakes', path: '/gallery?category=fruit' },
    { name: 'Gift', path: '/gallery?category=gift' },
    { name: 'Metropolitan Cakes', path: '/gallery?category=metropolitan' },
    { name: 'Themed Cakes', path: '/gallery?category=themed' },
    { name: 'Wedding Cakes', path: '/gallery?category=wedding' }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b py-4">
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-cake-600 text-2xl">
            <CakeIcon />
          </span>
          <span className="font-serif font-bold text-2xl">Sweet Treats</span>
        </Link>

        <button 
          className="md:hidden text-foreground" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="hidden md:flex items-center">
          <div className="flex items-center mr-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/" className="font-medium hover:text-primary transition-colors px-3 py-2">
                    Home
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="font-medium bg-transparent hover:bg-transparent hover:text-primary">
                    Categories
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {categories.map((category) => (
                        <li key={category.name}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={category.path}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">{category.name}</div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/customize" className="font-medium hover:text-primary transition-colors px-3 py-2">
                    Customize
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/about" className="font-medium hover:text-primary transition-colors px-3 py-2">
                    About Us
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="rounded-full" asChild>
              <Link to="/wishlist">
                <Heart size={20} />
                <span className="ml-1">{wishlistItems.length}</span>
              </Link>
            </Button>
            <Button variant="ghost" className="rounded-full" asChild>
              <Link to="/cart">
                <ShoppingBag size={20} />
                <span className="ml-1">{cartCount}</span>
              </Link>
            </Button>
            {isLoggedIn ? (
                <Link 
                  to="/profile" 
                  className="flex items-center font-medium hover:text-primary transition-colors"
                >
                  <User size={20} />
                  <span className="ml-2">Profile</span>
                </Link>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/auth?mode=login" 
                    className="font-medium hover:text-primary transition-colors py-2 px-4 border rounded-md bg-secondary text-secondary-foreground"
                  >
                    Login
                  </Link>
                  {/* <span className="text-gray-400">/</span> */}
                  <Link 
                    to="/auth?mode=register" 
                    className="font-medium hover:text-secondary-foreground transition-colors border py-2 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Register
                  </Link>
                </div>
              )}
          </div>
        </div>

        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-background border-b p-4 md:hidden">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              <div className="py-2">
                <div className="font-medium mb-1">Categories</div>
                <div className="ml-3 flex flex-col space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      to={category.path}
                      className="text-sm font-medium hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              <Link 
                to="/customize" 
                className="font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Customize
              </Link>
              <Link 
                to="/about" 
                className="font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                to="/wishlist" 
                className="flex items-center font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart size={20} />
                <span className="ml-2">Wishlist ({wishlistItems.length})</span>
              </Link>
              <Link 
                to="/cart" 
                className="flex items-center font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingBag size={20} />
                <span className="ml-2">Cart ({cartCount})</span>
              </Link>
              {isLoggedIn ? (
                <Link 
                  to="/profile" 
                  className="flex items-center font-medium hover:text-primary transition-colors"
                >
                  <User size={20} />
                  <span className="ml-2">Profile</span>
                </Link>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/auth?mode=login" 
                    className="font-medium hover:text-primary transition-colors"
                  >
                    Login
                  </Link>
                  <span className="text-gray-400">/</span>
                  <Link 
                    to="/auth?mode=register" 
                    className="font-medium hover:text-primary transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const CakeIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
    <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" />
    <path d="M2 21h20" />
    <path d="M7 8v2" />
    <path d="M12 8v2" />
    <path d="M17 8v2" />
    <path d="M7 4h.01" />
    <path d="M12 4h.01" />
    <path d="M17 4h.01" />
  </svg>
);

export default Navbar;
