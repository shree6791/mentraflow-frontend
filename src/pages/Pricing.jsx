import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { COLORS } from '../constants/theme';
import { Button } from '../components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pricing = () => {
  const [currentPricingIndex, setCurrentPricingIndex] = useState(0);

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      features: [
        'Up to 10 documents',
        'Basic flashcards',
        'Knowledge graph',
      ],
      buttonText: 'Get Started',
      buttonVariant: 'outline',
      isPopular: false,
    },
    {
      name: 'Professional',
      price: '$29',
      period: '/month',
      features: [
        'Unlimited documents',
        'Advanced adaptive recall',
        'Priority support',
        'Analytics & insights',
      ],
      buttonText: 'Start Free Trial',
      buttonVariant: 'primary',
      isPopular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      features: [
        'Everything in Professional',
        'Custom integrations',
        'Dedicated support',
        'Team management',
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline',
      isPopular: false,
    },
  ];

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
            
            {/* Desktop Grid */}
            <div className="hidden md:grid md:grid-cols-3 gap-6">
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-lg p-8 shadow-sm border-2 relative ${
                    plan.isPopular 
                      ? 'shadow-lg border-brand-deepTeal' 
                      : 'border-gray-200'
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <span className="bg-brand-deepTeal text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <h3 className={`text-2xl font-bold text-gray-900 mb-2 ${plan.isPopular ? 'mt-4' : ''}`}>
                    {plan.name}
                  </h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && <span className="text-gray-600">{plan.period}</span>}
                  </div>
                  <ul className="space-y-3 text-left mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: COLORS.brand.deepTeal }}></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to="/login">
                    <Button 
                      variant={plan.buttonVariant === 'primary' ? 'default' : 'outline'} 
                      className="w-full"
                      style={plan.buttonVariant === 'primary' ? { backgroundColor: COLORS.brand.deepTeal, color: 'white' } : {}}
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>

            {/* Mobile Carousel */}
            <div className="md:hidden relative">
              <div className="overflow-x-hidden overflow-y-visible">
                <div 
                  className="flex transition-transform duration-300 ease-in-out pt-8"
                  style={{ transform: `translateX(-${currentPricingIndex * 100}%)` }}
                >
                  {pricingPlans.map((plan, index) => (
                    <div key={index} className="min-w-full px-2">
                      <div
                        className={`bg-white rounded-lg p-8 shadow-sm border-2 relative ${
                          plan.isPopular 
                            ? 'shadow-lg border-brand-deepTeal' 
                            : 'border-gray-200'
                        }`}
                      >
                        {plan.isPopular && (
                          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                            <span className="bg-brand-deepTeal text-white px-4 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
                              Most Popular
                            </span>
                          </div>
                        )}
                      <h3 className={`text-2xl font-bold text-gray-900 mb-2 text-center ${plan.isPopular ? 'mt-4' : ''}`}>
                        {plan.name}
                      </h3>
                      <div className="mb-6 text-center">
                        <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                        {plan.period && <span className="text-gray-600">{plan.period}</span>}
                      </div>
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-gray-700">
                            <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: COLORS.brand.deepTeal }}></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Link to="/login">
                        <Button 
                          variant={plan.buttonVariant === 'primary' ? 'default' : 'outline'} 
                          className="w-full"
                          style={plan.buttonVariant === 'primary' ? { backgroundColor: COLORS.brand.deepTeal, color: 'white' } : {}}
                        >
                          {plan.buttonText}
                        </Button>
                      </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Carousel Controls */}
              <div className="flex justify-center items-center mt-4 space-x-2">
                <button
                  onClick={() => setCurrentPricingIndex((prev) => (prev > 0 ? prev - 1 : pricingPlans.length - 1))}
                  className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                  aria-label="Previous plan"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </button>
                <div className="flex space-x-1">
                  {pricingPlans.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPricingIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentPricingIndex ? 'w-8 bg-brand-deepTeal' : 'w-2 bg-gray-300'
                      }`}
                      aria-label={`Go to plan ${index + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPricingIndex((prev) => (prev < pricingPlans.length - 1 ? prev + 1 : 0))}
                  className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                  aria-label="Next plan"
                >
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Pricing;

