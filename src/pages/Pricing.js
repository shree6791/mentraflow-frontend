import React from 'react';
import { Link } from 'react-router-dom';
import { COLORS } from '../constants/theme';
import { Button } from '../components/ui/button';

const Pricing = () => {
  return (
    <>
      {/* Pricing Content */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Pricing</h1>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              Simple, transparent pricing for professionals who value knowledge retention
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Free Tier */}
              <div className="bg-white rounded-lg p-8 shadow-sm border-2 border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: COLORS.brand.deepTeal }}></span>
                    Up to 10 documents
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: COLORS.brand.deepTeal }}></span>
                    Basic flashcards
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: COLORS.brand.deepTeal }}></span>
                    Knowledge graph
                  </li>
                </ul>
                <Link to="/login">
                  <Button variant="outline" className="w-full">Get Started</Button>
                </Link>
              </div>
              
              {/* Professional Tier */}
              <div className="bg-white rounded-lg p-8 shadow-lg border-2 border-brand-deepTeal relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-brand-deepTeal text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 mt-4">Professional</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$29</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: COLORS.brand.deepTeal }}></span>
                    Unlimited documents
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: COLORS.brand.deepTeal }}></span>
                    Advanced adaptive recall
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: COLORS.brand.deepTeal }}></span>
                    Priority support
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: COLORS.brand.deepTeal }}></span>
                    Analytics & insights
                  </li>
                </ul>
                <Link to="/login">
                  <Button className="w-full" style={{ backgroundColor: COLORS.brand.deepTeal, color: 'white' }}>
                    Start Free Trial
                  </Button>
                </Link>
              </div>
              
              {/* Enterprise Tier */}
              <div className="bg-white rounded-lg p-8 shadow-sm border-2 border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">Custom</span>
                </div>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: COLORS.brand.deepTeal }}></span>
                    Everything in Professional
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: COLORS.brand.deepTeal }}></span>
                    Custom integrations
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: COLORS.brand.deepTeal }}></span>
                    Dedicated support
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: COLORS.brand.deepTeal }}></span>
                    Team management
                  </li>
                </ul>
                <Link to="/login">
                  <Button variant="outline" className="w-full">Contact Sales</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Pricing;

