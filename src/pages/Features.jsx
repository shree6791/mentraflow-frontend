import React, { useState } from 'react';
import { COLORS } from '../constants/theme';
import { Brain, TrendingUp, Clock, Target, ChevronLeft, ChevronRight } from 'lucide-react';

const Features = () => {
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  
  const features = [
    {
      icon: TrendingUp,
      title: 'Adaptive Reinforcement',
      description: 'Guided by your forgetting curve to strengthen retention at the right moments',
      color: COLORS.brand.deepTeal,
    },
    {
      icon: Brain,
      title: 'Knowledge Graph',
      description: 'Visualize concepts and relationships to build durable understanding',
      color: COLORS.brand.mindBlue,
    },
    {
      icon: Clock,
      title: 'Spaced Recall',
      description: 'AI-powered flashcards that adapt to your memory patterns for long-term retention',
      color: COLORS.brand.neuroYellow,
    },
    {
      icon: Target,
      title: 'Workflow Integration',
      description: 'Layers on top of your existing tools to reinforce learning without disruption',
      color: COLORS.brand.neuralCoral,
    },
  ];

  return (
    <>
      {/* Features Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
              Cognitive Infrastructure Features
            </h1>
            <p className="text-center text-gray-700 mb-4 text-lg max-w-3xl mx-auto font-medium">
              Rather than replacing your existing tools, MentraFlow layers on top to strengthen learning outcomes over time
            </p>
            <p className="text-center text-gray-600 mb-12 text-base max-w-2xl mx-auto">
              Guided by your forgetting curve, we reinforce knowledge at optimal intervals to ensure it sticks
            </p>
            
            {/* Desktop Grid */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-6 shadow-sm border-2 border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-300"
                  style={{
                    borderTopColor: feature.color,
                    borderTopWidth: '4px',
                  }}
                >
                  <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-4 bg-white" style={{ backgroundColor: `${feature.color}15` }}>
                    <feature.icon className="h-8 w-8" style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Mobile Carousel */}
            <div className="md:hidden relative">
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentFeatureIndex * 100}%)` }}
                >
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="min-w-full bg-gray-50 rounded-lg p-6 shadow-sm border-2 border-gray-200"
                      style={{
                        borderTopColor: feature.color,
                        borderTopWidth: '4px',
                      }}
                    >
                      <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-4 bg-white mx-auto" style={{ backgroundColor: `${feature.color}15` }}>
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
                  className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
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
                      aria-label={`Go to feature ${index + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setCurrentFeatureIndex((prev) => (prev < features.length - 1 ? prev + 1 : 0))}
                  className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
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

