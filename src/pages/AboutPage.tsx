import React from 'react';
import { Shield, Clock, MapPin, Users, Award, Heart, Car, Star } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const AboutPage = () => {
  const values = [
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Every vehicle in our fleet undergoes rigorous safety inspections and comes with comprehensive insurance coverage.',
    },
    {
      icon: Heart,
      title: 'Customer Care',
      description: 'We go above and beyond to ensure every rental experience exceeds your expectations.',
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Our fleet features only top-tier vehicles from the world\'s most trusted automotive brands.',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Our dedicated support team is available around the clock to assist you with any needs.',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Happy Customers' },
    { value: '500+', label: 'Premium Vehicles' },
    { value: '50+', label: 'Cities Covered' },
    { value: '4.9/5', label: 'Customer Rating' },
  ];

  const team = [
    { name: 'James Wilson', role: 'Founder & CEO', icon: Users },
    { name: 'Sarah Chen', role: 'Head of Operations', icon: Users },
    { name: 'Michael Brown', role: 'Fleet Manager', icon: Car },
    { name: 'Emily Davis', role: 'Customer Success Lead', icon: Star },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-hero py-20">
        <div className="container mx-auto px-4 text-center text-primary-foreground">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">About DriveEase</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            We're on a mission to make premium car rental accessible, convenient, and enjoyable for everyone.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">Our Story</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Founded in 2020, DriveEase started with a simple idea: renting a car should be as easy as booking a ride. 
              We noticed that traditional car rental services were often complicated, expensive, and lacked transparency. 
              So we set out to build something better — a platform that puts the customer first, offering premium vehicles 
              at competitive prices with a seamless digital experience.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mt-4">
              Today, DriveEase serves thousands of customers across 50+ cities, providing access to a diverse fleet 
              of over 500 premium vehicles. From fuel-efficient sedans to luxury SUVs and thrilling sports cars, 
              we have the perfect ride for every occasion.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-3xl md:text-4xl font-bold text-accent mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything we do is guided by our core values that put you in the driver's seat.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="bg-card rounded-2xl p-8 border border-border card-hover text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent/10 text-accent mb-6">
                  <value.icon className="h-7 w-7" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The passionate people behind DriveEase who make it all happen.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="bg-card rounded-2xl p-6 border border-border text-center card-hover">
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                  <member.icon className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="font-display font-semibold text-foreground text-lg">{member.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;