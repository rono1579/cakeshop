
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CakeCard from '@/components/CakeCard';

const Wishlist = () => {
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto py-8">
        <h1 className="text-3xl font-serif font-bold mb-6">My Wishlist</h1>
        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-muted-foreground">Your wishlist is empty.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((cake) => (
              <CakeCard key={cake.id} cake={cake} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;
