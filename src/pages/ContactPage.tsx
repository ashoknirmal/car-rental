import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSending(true);
    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSending(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'ashoknirmal2004@gmail.com',
      description: 'Send us an email anytime',
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+91 6383297756',
      description: 'Mon - Fri, 8am - 6pm EST',
    },
    {
      icon: MapPin,
      title: 'Office',
      value: 'Sathi Main Road, Erode, Tamil Nadu, India',
      description: 'Visit our headquarters',
    },
    {
      icon: Clock,
      title: 'Working Hours',
      value: 'Mon - Sun, 24/7',
      description: 'We\'re always available',
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-hero py-20">
        <div className="container mx-auto px-4 text-center text-primary-foreground">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Have a question or need help? We'd love to hear from you. Get in touch with our team.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="How can we help?"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    required
                  />
                </div>
                <Button type="submit" size="lg" className="gap-2" disabled={isSending}>
                  <Send className="h-4 w-4" />
                  {isSending ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">Get in Touch</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {contactInfo.map((item) => (
                  <div key={item.title} className="bg-card rounded-xl border border-border p-6 card-hover">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 text-accent mb-4">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-foreground font-medium text-sm">{item.value}</p>
                    <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
                  </div>
                ))}
              </div>

              {/* FAQ Teaser */}
              <div className="mt-8 bg-secondary/50 rounded-xl p-8 text-center">
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  Frequently Asked Questions
                </h3>
                <p className="text-muted-foreground mb-4">
                  Find quick answers to common questions about our services, booking process, and policies.
                </p>
                <div className="text-left space-y-4 mt-6">
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">What documents do I need to rent a car?</h4>
                    <p className="text-muted-foreground text-sm mt-1">You'll need a valid driver's license, a credit card, and a government-issued ID.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Can I cancel my booking?</h4>
                    <p className="text-muted-foreground text-sm mt-1">Yes, you can cancel pending bookings free of charge from your bookings page.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Is insurance included?</h4>
                    <p className="text-muted-foreground text-sm mt-1">All our rentals come with comprehensive insurance coverage at no extra cost.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;