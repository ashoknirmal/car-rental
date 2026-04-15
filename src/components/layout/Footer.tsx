import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Car className="h-5 w-5" />
              </div>
              <span className="font-display text-xl font-bold">
                Drive<span className="text-accent">Ease</span>
              </span>
            </Link>
            <p className="text-sm text-primary-foreground/70">
              Premium car rental service with the best vehicles at competitive prices. Your journey starts here.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/cars" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Browse Cars
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Car Categories */}
          <div>
            <h4 className="font-display font-semibold mb-4">Car Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/cars?category=sedan" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Sedan
                </Link>
              </li>
              <li>
                <Link to="/cars?category=suv" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  SUV
                </Link>
              </li>
              <li>
                <Link to="/cars?category=luxury" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Luxury
                </Link>
              </li>
              <li>
                <Link to="/cars?category=sports" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Sports
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>Sathi Main Road</li>
              <li>Erode, Tamil Nadu, India</li>
              <li>Phone: +91 6383297756</li>
              <li>Email: ashoknirmal2004@gmail.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} DriveEase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
