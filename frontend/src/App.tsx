import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from 'react-redux';
import { store } from './store/store';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';
import { setUser, clearUser } from './store/authSlice';
import Index from "./pages/Index";
import Customize from "./pages/Customize";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Auth from "./pages/auth";
const queryClient = new QueryClient();
const AppContent = () => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Try to get custom claims from ID token
          const idTokenResult = await user.getIdTokenResult();
          const isAdmin = idTokenResult.claims?.admin === true;

          store.dispatch(setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            isAdmin: isAdmin,
            photoURL: user.photoURL
          }));
        } catch (error) {
          console.error('Failed to get user claims:', error);
          // Fall back to setting user without admin status
          store.dispatch(setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            isAdmin: false,
            photoURL: user.photoURL
          }));
        }
      } else {
        store.dispatch(clearUser());
      }
    });
    return () => unsubscribe();
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/customize" element={<Customize />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
