import React, { useState } from 'react';
import { COLORS } from '../constants/theme';
import { Award, Users, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';

const About = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  return (
    <>
      {/* About Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-8 tracking-tight">About MentraFlow</h1>

            <div className="bg-gray-50 rounded-xl p-8 shadow-sm border border-gray-100 mb-8" style={{ borderTopWidth: '4px', borderTopColor: COLORS.brand.deepTeal }}>
              <p className="text-center text-lg font-medium mb-4" style={{ color: COLORS.brand.deepTeal }}>
                A flagged wire. A borderline case. An auditor asking why.
              </p>
              <h2 className="text-xl font-semibold text-gray-900 mb-3" style={{ color: COLORS.brand.deepTeal }}>Overview</h2>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                MentraFlow is a <span className="font-semibold" style={{ color: COLORS.brand.deepTeal }}>decision-readiness platform</span> for regulated environments 
                where getting decisions wrong has real consequences. Organizations can show that employees have completed compliance training—but not that they will 
                make the right decisions in real situations. MentraFlow converts compliance workflows and certification programs into real-world decision simulations, 
                continuously measuring and improving how employees make decisions over time.
              </p>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 mt-6" style={{ color: COLORS.brand.deepTeal }}>The moment that matters</h2>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                The failure point isn’t during learning—it’s at the moment of decision. When faced with real scenarios (flagged transactions, edge cases, audit queries), 
                employees often rely on searching or checking documents, which signals that knowledge isn’t reliably usable when it matters. MentraFlow focuses on this 
                moment by recreating realistic scenarios based on company workflows and past cases, requiring employees to decide and explain their reasoning.
              </p>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 mt-6" style={{ color: COLORS.brand.deepTeal }}>How it works</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                MentraFlow connects to compliance materials, certification content, and real-world decision data (e.g. past cases, audit findings), converting them into 
                structured, scenario-based simulations. Employees respond to short decision prompts (what would you do, and why); the system evaluates how decisions 
                align with policy and expected actions. A dashboard provides a live view of decision readiness across individuals and teams.
              </p>
            </div>

            {/* Desktop Grid - Who this is for */}
            <div className="hidden md:grid md:grid-cols-3 gap-6 mb-12">
              <div className="text-center p-6 rounded-lg bg-white border border-gray-200">
                <Award className="h-12 w-12 mx-auto mb-4" style={{ color: COLORS.brand.deepTeal }} />
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">Compliance & risk</h3>
                <p className="text-sm text-gray-600">Financial services, audit, operational decision-making</p>
              </div>
              <div className="text-center p-6 rounded-lg bg-white border border-gray-200">
                <Users className="h-12 w-12 mx-auto mb-4" style={{ color: COLORS.brand.mindBlue }} />
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">Regulated environments</h3>
                <p className="text-sm text-gray-600">Where incorrect decisions have immediate consequences</p>
              </div>
              <div className="text-center p-6 rounded-lg bg-white border border-gray-200">
                <TrendingUp className="h-12 w-12 mx-auto mb-4" style={{ color: COLORS.brand.neuroYellow }} />
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">Adjacent domains</h3>
                <p className="text-sm text-gray-600">Legal, healthcare, professional certification</p>
              </div>
            </div>

            {/* Mobile Carousel */}
            <div className="md:hidden mb-12 relative">
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentCardIndex * 100}%)` }}
                >
                  <div className="min-w-full text-center p-6 rounded-lg bg-white border border-gray-200">
                    <Award className="h-12 w-12 mx-auto mb-4" style={{ color: COLORS.brand.deepTeal }} />
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg">Compliance & risk</h3>
                    <p className="text-sm text-gray-600">Financial services, audit, operational decision-making</p>
                  </div>
                  <div className="min-w-full text-center p-6 rounded-lg bg-white border border-gray-200">
                    <Users className="h-12 w-12 mx-auto mb-4" style={{ color: COLORS.brand.mindBlue }} />
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg">Regulated environments</h3>
                    <p className="text-sm text-gray-600">Where incorrect decisions have immediate consequences</p>
                  </div>
                  <div className="min-w-full text-center p-6 rounded-lg bg-white border border-gray-200">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4" style={{ color: COLORS.brand.neuroYellow }} />
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg">Adjacent domains</h3>
                    <p className="text-sm text-gray-600">Legal, healthcare, professional certification</p>
                  </div>
                </div>
              </div>
              
              {/* Carousel Controls */}
              <div className="flex justify-center items-center mt-4 space-x-2">
                <button
                  onClick={() => setCurrentCardIndex((prev) => (prev > 0 ? prev - 1 : 2))}
                  className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                  aria-label="Previous card"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </button>
                <div className="flex space-x-1">
                  {[0, 1, 2].map((index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentCardIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentCardIndex ? 'w-8 bg-brand-deepTeal' : 'w-2 bg-gray-300'
                      }`}
                      aria-label={`Go to card ${index + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setCurrentCardIndex((prev) => (prev < 2 ? prev + 1 : 0))}
                  className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                  aria-label="Next card"
                >
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Vision</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                In an AI-driven world, access to information is no longer the advantage—the advantage lies in applying the right knowledge at the right moment.
              </p>
              <p className="text-gray-700 leading-relaxed">
                MentraFlow is building the infrastructure that allows organizations to continuously measure and improve how decisions are made, 
                turning compliance into a provable and operational capability.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;

