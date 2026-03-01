import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/theme';
import { ChevronDown, Clock, Instagram, Facebook, MapPin, Menu, X, ArrowRight } from 'lucide-react';
import MentraFlowLogo from './MentraFlowLogo';
import { Button } from './ui/button';

const CTA_BY_PATH = {
  '/': {
    heading: 'Ready to move from training to capability?',
    subtitle: 'Talk to us about a pilot for compliance, risk, and audit teams.',
    primaryLabel: 'Talk to us',
    primaryTo: '/contact',
    secondaryLabel: 'Sign in',
    secondaryTo: '/login',
  },
  '/about': {
    heading: 'Want to see how it works?',
    subtitle: 'Get in touch for a demo or pilot for your team.',
    primaryLabel: 'Talk to us',
    primaryTo: '/contact',
    secondaryLabel: 'Sign in',
    secondaryTo: '/login',
  },
  '/features': {
    heading: 'Ready to see it in action?',
    subtitle: 'Talk to us about a pilot for your compliance or audit team.',
    primaryLabel: 'Talk to us',
    primaryTo: '/contact',
    secondaryLabel: 'Sign in',
    secondaryTo: '/login',
  },
  '/pricing': {
    heading: 'Questions about pricing?',
    subtitle: 'Pilots, enterprise, or custom—we can help.',
    primaryLabel: 'Talk to us',
    primaryTo: '/contact',
    secondaryLabel: 'Sign in',
    secondaryTo: '/login',
  },
  '/faq': {
    heading: 'Ready to talk about a pilot?',
    subtitle: 'Contact us to get started or sign in to your account.',
    primaryLabel: 'Talk to us',
    primaryTo: '/contact',
    secondaryLabel: 'Sign in',
    secondaryTo: '/login',
  },
  '/contact': {
    heading: "We're here to help.",
    subtitle: 'Use the form above or sign in to your account.',
    primaryLabel: 'Sign in',
    primaryTo: '/login',
    secondaryLabel: 'Talk to us',
    secondaryTo: '/contact',
  },
  '/login': {
    heading: 'New to MentraFlow?',
    subtitle: 'Talk to us about a pilot for your team.',
    primaryLabel: 'Talk to us',
    primaryTo: '/contact',
    secondaryLabel: 'Sign in',
    secondaryTo: '/login',
  },
};

const PublicLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  const cta = CTA_BY_PATH[location.pathname] || CTA_BY_PATH['/'];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <MentraFlowLogo className="h-[60px] w-[60px]" color={COLORS.brand.deepTeal} />
              <h1 className="text-2xl font-bold text-gray-900">MentraFlow</h1>
            </Link>
            
            {/* Desktop Navigation Links - Right Aligned */}
            <div className="hidden md:flex items-center space-x-8 ml-auto mr-8">
              <Link to="/about" className="text-gray-700 hover:text-brand-deepTeal transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-deepTeal focus-visible:ring-offset-2 rounded px-1">
                About
              </Link>
              
              {/* Services Dropdown */}
              <div 
                ref={dropdownRef}
                className="relative"
                onMouseEnter={() => {
                  if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                  }
                  setDropdownOpen(true);
                }}
                onMouseLeave={() => {
                  timeoutRef.current = setTimeout(() => {
                    setDropdownOpen(false);
                  }, 200);
                }}
              >
                <button 
                  className="flex items-center text-gray-700 hover:text-brand-deepTeal transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-deepTeal focus-visible:ring-offset-2 rounded px-1"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  Services
                  <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropdownOpen && (
                  <div 
                    className="absolute top-full right-0 mt-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  >
                    <Link 
                      to="/features" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-deepTeal transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Features
                    </Link>
                    <Link 
                      to="/pricing" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-deepTeal transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Pricing
                    </Link>
                    <Link 
                      to="/faq" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-deepTeal transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      FAQ
                    </Link>
                  </div>
                )}
              </div>
              
              <Link to="/contact" className="text-gray-700 hover:text-brand-deepTeal transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-deepTeal focus-visible:ring-offset-2 rounded px-1">
                Contact
              </Link>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-brand-deepTeal transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            
            {/* Desktop Auth Button */}
            <div className="hidden md:flex items-center">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button className="text-white hover:opacity-90" style={{ backgroundColor: COLORS.brand.deepTeal }}>
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 bg-white">
              <div className="px-4 py-4 space-y-3">
                <Link 
                  to="/about" 
                  className="block py-2 text-gray-700 hover:text-brand-deepTeal transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                
                <div className="border-t border-gray-200 pt-3">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Services</p>
                  <div className="pl-4 space-y-2">
                    <Link 
                      to="/features" 
                      className="block py-2 text-gray-600 hover:text-brand-deepTeal transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Features
                    </Link>
                    <Link 
                      to="/pricing" 
                      className="block py-2 text-gray-600 hover:text-brand-deepTeal transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Pricing
                    </Link>
                    <Link 
                      to="/faq" 
                      className="block py-2 text-gray-600 hover:text-brand-deepTeal transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      FAQ
                    </Link>
                  </div>
                </div>
                
                <Link 
                  to="/contact" 
                  className="block py-2 text-gray-700 hover:text-brand-deepTeal transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                
                <div className="border-t border-gray-200 pt-3">
                  {isAuthenticated ? (
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Dashboard</Button>
                    </Link>
                  ) : (
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button 
                        className="w-full text-white font-semibold hover:opacity-90"
                        style={{ backgroundColor: COLORS.brand.deepTeal }}
                      >
                        Sign In
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Shared CTA — copy varies by page; skip on contact and login */}
      {!isAuthenticated && location.pathname !== '/contact' && location.pathname !== '/login' && (
        <section
          className="py-14 bg-white border-t-2"
          style={{ borderTopColor: COLORS.brand.deepTeal }}
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{cta.heading}</h2>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto text-lg">
              {cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to={cta.primaryTo}>
                <Button
                  size="lg"
                  className="w-full sm:w-auto font-semibold px-6 py-5 text-white hover:opacity-90"
                  style={{ backgroundColor: COLORS.brand.deepTeal }}
                >
                  {cta.primaryLabel}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to={cta.secondaryTo}>
                <Button variant="outline" size="lg" className="w-full sm:w-auto font-semibold px-6 py-5">
                  {cta.secondaryLabel}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t-4 py-8" style={{ backgroundColor: COLORS.brand.deepIndigo, borderTopColor: COLORS.brand.deepTeal }}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <MentraFlowLogo className="h-[60px] w-[60px]" color={COLORS.brand.neuroYellow} />
                <h3 className="text-lg font-bold text-white">MentraFlow</h3>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed mb-4">
                From training to demonstrated capability.
              </p>
              
              <div className="flex items-center justify-start space-x-3">
                <a 
                  href="https://instagram.com/mentraflow" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-brand-neuroYellow transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a 
                  href="https://facebook.com/mentraflow" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-brand-neuroYellow transition-colors duration-200"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Company</h4>
              <ul className="space-y-1.5 text-gray-400 text-xs">
                <li><Link to="/about" className="hover:text-brand-neuroYellow transition-colors duration-200">About</Link></li>
                <li><Link to="/pricing" className="hover:text-brand-neuroYellow transition-colors duration-200">Pricing</Link></li>
                <li><Link to="/faq" className="hover:text-brand-neuroYellow transition-colors duration-200">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Business Hours</h4>
              <div className="space-y-1.5 text-gray-400 text-xs">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-2" style={{ color: COLORS.brand.neuroYellow }} />
                  <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-2" style={{ color: COLORS.brand.neuroYellow }} />
                  <span>Sat - Sun: Closed</span>
                </div>
                <div className="flex items-start mt-2">
                  <MapPin className="h-3 w-3 mr-2 mt-0.5" style={{ color: COLORS.brand.neuroYellow }} />
                  <span>Mountain View, CA 94040</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-4 text-center">
            <p className="text-gray-400 text-xs">
              &copy; 2025 MentraFlow. All rights reserved. | Decision-Readiness Platform
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;

