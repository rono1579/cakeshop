
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CakeSlice, Heart, Star, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative bg-cake-50 py-16">
          <div className="container text-center">
            <h1 className="section-title mb-4">About Sweet Treats</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're passionate about creating the most delicious and beautiful custom cakes for all your special occasions.
            </p>
          </div>
        </div>
        
        {/* Our Story Section */}
        <section className="py-16">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif text-3xl font-bold mb-4">Our Story</h2>
                <p className="mb-4 text-muted-foreground">
                  Sweet Treats began in 2015 as a small home bakery with a big dream: to create custom cakes that taste as amazing as they look. Our founder, Emma Davis, started baking as a child alongside her grandmother and turned that passion into a thriving business.
                </p>
                <p className="mb-4 text-muted-foreground">
                  What sets us apart is our commitment to quality ingredients, artistic designs, and personalized service. Each cake is handcrafted with attention to detail and made fresh to order.
                </p>
                <p className="text-muted-foreground">
                  Today, we've grown into a beloved local bakery, creating custom cakes for birthdays, weddings, anniversaries, and every special occasion in between. Our online cake customizer brings that same personalized experience to you, wherever you are.
                </p>
                <div className="flex items-center mt-6">
                  <div className="flex -space-x-4">
                    <img
                      className="w-12 h-12 rounded-full border-2 border-white"
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop"
                      alt="Emma Davis"
                    />
                    <img
                      className="w-12 h-12 rounded-full border-2 border-white"
                      src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop"
                      alt="James Smith"
                    />
                    <img
                      className="w-12 h-12 rounded-full border-2 border-white"
                      src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&auto=format&fit=crop"
                      alt="Sarah Johnson"
                    />
                  </div>
                  <span className="ml-4 text-muted-foreground">Meet our talented team of pastry chefs</span>
                </div>
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1464195244916-405fa0a82545?w=800&auto=format&fit=crop" 
                  alt="Our bakery" 
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Values Section */}
        <section className="py-16 bg-secondary/20">
          <div className="container">
            <h2 className="section-title text-center mb-12">Our Values</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-cake-100 flex items-center justify-center mb-4">
                  <CakeSlice className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-2">Quality Ingredients</h3>
                <p className="text-muted-foreground">
                  We use only the finest ingredients, sourcing locally whenever possible. No artificial flavors, colors, or preservatives.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-cake-100 flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-2">Made With Love</h3>
                <p className="text-muted-foreground">
                  Each cake is handcrafted with care and attention to detail. We love what we do, and it shows in every bite.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-cake-100 flex items-center justify-center mb-4">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-2">Customer First</h3>
                <p className="text-muted-foreground">
                  Your satisfaction is our priority. We work closely with you to create the cake of your dreams for any occasion.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Achievements Section */}
        <section className="py-16">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&auto=format&fit=crop" 
                  alt="Award winning cake" 
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
              <div>
                <h2 className="font-serif text-3xl font-bold mb-4">Our Achievements</h2>
                <p className="mb-6 text-muted-foreground">
                  We're proud to be recognized for our creative designs and delicious flavors. Our dedication to quality and innovation has earned us several accolades.
                </p>
                
                <div className="space-y-6">
                  <div className="flex">
                    <div className="mr-4 mt-1">
                      <Award className="h-8 w-8 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg font-medium">Best Bakery Award</h4>
                      <p className="text-muted-foreground">City Food & Drink Association, 2023</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="mr-4 mt-1">
                      <Award className="h-8 w-8 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg font-medium">Master Cake Designer</h4>
                      <p className="text-muted-foreground">International Cake Competition, 2022</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="mr-4 mt-1">
                      <Award className="h-8 w-8 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg font-medium">Customer Choice Award</h4>
                      <p className="text-muted-foreground">Regional Bakery Excellence, 2021</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
