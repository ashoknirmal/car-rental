import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Clock, MapPin, Car, Star, Users } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCars } from '@/hooks/useCars';
import CarCard from '@/components/cars/CarCard';

const Index = () => {
  const { data: featuredCars, isLoading } = useCars();

  const stats = [
    { label: 'Happy Customers', value: '10,000+', icon: Users },
    { label: 'Premium Cars', value: '500+', icon: Car },
    { label: 'Cities', value: '50+', icon: MapPin },
    { label: 'Customer Rating', value: '4.9', icon: Star },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Fully Insured',
      description: 'All our vehicles come with comprehensive insurance coverage for peace of mind.',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock customer support to assist you anytime, anywhere.',
    },
    {
      icon: MapPin,
      title: 'Flexible Pickup',
      description: 'Multiple pickup locations across the city for your convenience.',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center bg-gradient-hero overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-primary-foreground animate-fade-in">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 text-accent text-sm font-medium mb-6">
                <Star className="h-4 w-4 fill-current" />
                Premium Car Rental Service
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Drive Your Dreams
                <span className="block text-accent">Today</span>
              </h1>
              <p className="text-lg text-primary-foreground/80 mb-8 max-w-lg">
                Experience luxury and comfort with our premium fleet. From sleek sedans to powerful SUVs, find the perfect car for every journey.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2" asChild>
                  <Link to="/cars">
                    Browse Cars
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground/20 text-black hover:bg-primary-foreground/10" asChild>
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 lg:gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="glass-dark rounded-2xl p-6 text-center hover-lift"
                >
                  <stat.icon className="h-8 w-8 text-accent mx-auto mb-3" />
                  <div className="font-display text-3xl font-bold text-primary-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-primary-foreground/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose DriveEase?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're committed to providing you with the best car rental experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-card rounded-2xl p-8 border border-border card-hover text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent/10 text-accent mb-6">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Featured Vehicles
              </h2>
              <p className="text-lg text-muted-foreground">
                Explore our most popular cars available for rent
              </p>
            </div>
            <Button variant="outline" className="hidden md:flex gap-2" asChild>
              <Link to="/cars">
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-muted" />
                  <div className="p-5 space-y-3">
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-10 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredCars && featuredCars.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCars.slice(0, 6).map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Car className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                No Cars Available Yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Our fleet is being prepared. Check back soon!
              </p>
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" className="gap-2" asChild>
              <Link to="/cars">
                View All Cars
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to Hit the Road?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Book your perfect car today and experience the freedom of the open road.
          </p>
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2" asChild>
            <Link to="/cars">
              Start Booking Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
