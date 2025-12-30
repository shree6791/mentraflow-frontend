import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/theme';
import { Brain, ChevronDown, Clock, Instagram, Facebook, MapPin, Menu, X } from 'lucide-react';
import { Button } from './ui/button';

const PublicLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

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
              <Brain className="h-8 w-8" style={{ color: COLORS.brand.deepTeal }} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">MentraFlow</h1>
                <p className="text-xs text-gray-600 hidden sm:block">Cognitive Infrastructure</p>
              </div>
            </Link>
            
            {/* Desktop Navigation Links - Right Aligned */}
            <div className="hidden md:flex items-center space-x-8 ml-auto mr-8">
              <Link to="/about" className="text-gray-700 hover:text-brand-deepTeal transition-colors font-medium">
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
                  className="flex items-center text-gray-700 hover:text-brand-deepTeal transition-colors font-medium"
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
              
              <Link to="/contact" className="text-gray-700 hover:text-brand-deepTeal transition-colors font-medium">
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
                  <Button style={{ backgroundColor: COLORS.brand.deepTeal, color: 'white' }}>
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
                        className="w-full text-white font-semibold"
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

      {/* Footer */}
      <footer className="py-8 border-t-4" style={{ backgroundColor: COLORS.brand.deepIndigo, borderTopColor: COLORS.brand.deepTeal }}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="h-5 w-5" style={{ color: COLORS.brand.neuroYellow }} />
                <h3 className="text-lg font-bold text-white">MentraFlow</h3>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed mb-4">
                Make learning compound, not decay.<br />
                Retain, recall, and reuse what you learn.
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
              &copy; 2025 MentraFlow. All rights reserved. | Cognitive Infrastructure Platform
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;

