import React, { useState } from 'react';
import { COLORS } from '../constants/theme';
import { Brain, TrendingUp, Target, ChevronLeft, ChevronRight } from 'lucide-react';

const Features = () => {
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  
  const features = [
    {
      icon: Target,
      title: 'Real-world decision simulations',
      description: 'Compliance workflows, certification programs, and real company scenarios converted into continuous decision simulations. Employees are evaluated on how they respond.',
      color: COLORS.brand.deepTeal,
    },
    {
      icon: Brain,
      title: 'Evaluate decisions & reasoning',
      description: 'Employees respond to short decision prompts (what would you do, and why). The system evaluates how decisions align with policy and expected actions.',
      color: COLORS.brand.mindBlue,
    },
    {
      icon: TrendingUp,
      title: 'Live decision readiness dashboard',
      description: 'A dashboard provides a live view of decision readiness across individuals and teams—replacing static training records with measurable capability.',
      color: COLORS.brand.neuroYellow,
    },
  ];

  return (
    <>
      {/* Features */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-3 tracking-tight">
              How MentraFlow works
            </h1>
            <p className="text-center text-gray-600 mb-12 text-lg max-w-2xl mx-auto">
              From compliance materials and real-world decision data to scenario-based simulations and measurable decision quality.
            </p>
            
            {/* Desktop Grid — 3 cards */}
            <div className="hidden md:grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="rounded-xl p-6 shadow-sm bg-white border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-300"
                  style={{
                    borderTopColor: feature.color,
                    borderTopWidth: '4px',
                  }}
                >
                  <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: `${feature.color}18` }}>
                    <feature.icon className="h-7 w-7" style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Mobile Carousel */}
            <div className="md:hidden relative" role="group" aria-label="Feature carousel">
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentFeatureIndex * 100}%)` }}
                  role="list"
                  aria-label="Features"
                >
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      role="listitem"
                      className="min-w-full rounded-xl p-6 shadow-sm mx-2 bg-white border border-gray-200"
                      style={{
                        borderTopColor: feature.color,
                        borderTopWidth: '4px',
                      }}
                    >
                      <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-4 mx-auto" style={{ backgroundColor: `${feature.color}18` }}>
                        <feature.icon className="h-8 w-8" style={{ color: feature.color }} />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-900 text-center">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-sm text-center">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Carousel Controls */}
              <div className="flex justify-center items-center mt-4 space-x-2">
                <button
                  onClick={() => setCurrentFeatureIndex((prev) => (prev > 0 ? prev - 1 : features.length - 1))}
                  className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0E7C7B]"
                  aria-label="Previous feature"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </button>
                <div className="flex space-x-1">
                  {features.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentFeatureIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentFeatureIndex ? 'w-8 bg-brand-deepTeal' : 'w-2 bg-gray-300'
                      }`}
                      aria-label={`Go to feature ${index + 1} of ${features.length}`}
                      aria-current={index === currentFeatureIndex ? 'true' : undefined}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setCurrentFeatureIndex((prev) => (prev < features.length - 1 ? prev + 1 : 0))}
                  className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0E7C7B]"
                  aria-label="Next feature"
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

export default Features;

