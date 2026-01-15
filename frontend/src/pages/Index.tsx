import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import CakeCard from '@/components/CakeCard';
import { useCakes } from '@/hooks/use-cakes';
import { ArrowRight, Star, CakeSlice, Heart } from 'lucide-react';

const Index = () => {
  const { cakes } = useCakes();

  // Get featured cakes (first 3)
  const featuredCakes = cakes.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-cake-50 py-16 md:py-24">
        <div className="container grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 text-center md:text-left">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Create Your <span className="text-primary">Perfect</span> Cake
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Customize every detail of your dream cake - from flavors and fillings to decorations and toppings.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/customize">Start Customizing</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link to="/gallery">Explore Gallery</Link>
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop" 
              alt="Beautifully decorated cake" 
              className="rounded-lg shadow-xl mx-auto"
            />
            <div className="absolute -bottom-5 -left-5 bg-white p-4 rounded-lg shadow-lg animate-float hidden md:flex">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="ml-1 font-semibold">4.9</span>
                <span className="ml-1 text-sm text-muted-foreground">(500+ reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="hidden md:block absolute top-20 left-10 animate-float-slow">
          <CakeSlice className="h-8 w-8 text-primary/20" />
        </div>
        <div className="hidden md:block absolute bottom-20 right-10 animate-float">
          <Heart className="h-6 w-6 text-primary/30" />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="section-title text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-cake-100 flex items-center justify-center">
                <span className="font-serif text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-serif text-xl font-semibold">Choose Your Base</h3>
              <p className="text-muted-foreground">
                Select from our delicious cake flavors, from classic vanilla to rich chocolate and more.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-cake-100 flex items-center justify-center">
                <span className="font-serif text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-serif text-xl font-semibold">Customize Details</h3>
              <p className="text-muted-foreground">
                Add fillings, frostings, toppings, and decorations to create your unique cake.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-cake-100 flex items-center justify-center">
                <span className="font-serif text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-serif text-xl font-semibold">Order & Enjoy</h3>
              <p className="text-muted-foreground">
                Place your order, and we'll bake your custom creation with care. Then enjoy every bite!
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/customize">Start Creating Your Cake</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Cakes Section */}
      <section className="py-16 bg-secondary/20">
        <div className="container">
          <div className="flex justify-between items-center mb-12">
            <h2 className="section-title">Featured Cakes</h2>
            <Button asChild variant="ghost" className="group">
              <Link to="/gallery" className="flex items-center">
                View All 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCakes.map((cake) => (
              <CakeCard key={cake.id} cake={cake} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="section-title text-center mb-12">What Our Customers Say</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* First testimonial - slide in from left */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              whileHover={{ y: -8 }}
              className="bg-cake-50 p-6 rounded-lg transition-shadow hover:shadow-lg"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "The cake customization process was so fun, and the final result was even better than I imagined. Everyone at my daughter's birthday party loved it!"
              </p>
              <p className="font-semibold">- Sarah M.</p>
            </motion.div>

            {/* Second testimonial - slide in from right */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-cake-50 p-6 rounded-lg transition-shadow hover:shadow-lg"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "I ordered a custom cake for my wedding anniversary and it was absolutely perfect. The flavors were amazing and the decoration was exactly what I wanted."
              </p>
              <p className="font-semibold">- Michael T.</p>
            </motion.div>

            {/* Third testimonial - slide in from left */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
              whileHover={{ y: -8 }}
              className="bg-cake-50 p-6 rounded-lg transition-shadow hover:shadow-lg"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "Not only was the cake gorgeous, but it was absolutely delicious! The online customization tool made it easy to create exactly what I wanted."
              </p>
              <p className="font-semibold">- Emily R.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/10">
        <div className="container text-center space-y-6">
          <h2 className="section-title">Ready to Create Your Dream Cake?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're celebrating a birthday, anniversary, or just want something sweet, our custom cakes are perfect for any occasion.
          </p>
          <Button asChild size="lg" className="rounded-full">
            <Link to="/customize">Start Customizing Now</Link>
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
