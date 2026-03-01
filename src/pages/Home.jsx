import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { COLORS } from '../constants/theme';
import { Brain, ArrowRight, TrendingUp, Clock, Target, ChevronLeft, ChevronRight } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  const features = [
    {
      icon: Target,
      title: 'Decision simulations',
      description: 'Compliance workflows and certification programs converted into real-world decision scenarios',
      color: COLORS.brand.deepTeal,
    },
    {
      icon: Brain,
      title: 'Evaluate & improve',
      description: 'Employees respond to prompts and justify reasoning; the system measures alignment with policy',
      color: COLORS.brand.deepTeal,
    },
    {
      icon: TrendingUp,
      title: 'Decision readiness dashboard',
      description: 'Live view of decision quality across individuals and teams—measurable capability, not completion',
      color: COLORS.brand.deepTeal,
    },
    {
      icon: Clock,
      title: 'Beyond retrieval',
      description: 'Complements AI by ensuring people can apply knowledge when it matters, with auditable evidence',
      color: COLORS.brand.deepTeal,
    },
  ];

  return (
    <>
      {/* Hero */}
      <section 
        className="relative py-24 md:py-28 px-4 overflow-hidden"
        style={{
          background: `linear-gradient(152deg, #052a35 0%, ${COLORS.brand.deepIndigo} 25%, ${COLORS.brand.deepTeal} 55%, #0a5f5e 85%, ${COLORS.brand.mindBlue} 100%)`,
        }}
      >
        {/* Soft center glow for depth */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
          <div 
            className="absolute inset-0 opacity-[0.12]" 
            style={{ background: 'radial-gradient(ellipse 90% 70% at 40% 50%, rgba(255,255,255,0.4) 0%, transparent 55%)' }} 
          />
        </div>
        {/* Very subtle dot texture */}
        <div className="absolute inset-0 opacity-[0.06]" aria-hidden>
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }} />
        </div>

        <div className="w-full max-w-7xl mx-auto relative z-10 px-6 sm:px-8 lg:px-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-8 xl:gap-12 lg:text-left min-h-[320px]">
            {/* Left column — full width of column */}
            <div className="flex-1 min-w-0 flex flex-col justify-center py-8 lg:py-0 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold text-white mb-5 leading-[1.15] tracking-tight">
                When the wrong decision has real consequences
              </h1>
              <p className="text-lg md:text-xl xl:text-2xl text-white/95 mb-10 lg:mb-12 font-medium leading-relaxed">
                From training completion to demonstrated capability.
              </p>
              {!isAuthenticated && (
                <div className="flex flex-col sm:flex-row w-full max-w-2xl gap-3 sm:gap-4 sm:max-w-none">
                  <Link to="/login" className="flex-1 w-full sm:min-w-0">
                    <Button
                      size="lg"
                      className="w-full text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 text-white font-semibold shadow-lg hover:shadow-xl hover:opacity-95 transition-all duration-300 hover:scale-[1.02] rounded-lg border-0"
                      style={{ backgroundColor: COLORS.brand.deepTeal }}
                    >
                      See how it works
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </Link>
                  <Link to="/faq" className="flex-1 w-full sm:min-w-0">
                    <Button
                      size="lg"
                      className="w-full text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 font-semibold rounded-lg border-2 border-white bg-white hover:bg-gray-100 transition-all duration-300"
                      style={{ color: COLORS.brand.deepTeal }}
                    >
                      Who it’s for
                    </Button>
                  </Link>
                </div>
              )}
            </div>
            {/* Right column — full width of column, illustration scales up */}
            <div className="flex-1 min-w-0 flex items-center justify-center lg:justify-end mt-8 lg:mt-0">
              <svg
                viewBox="0 0 320 280"
                className="w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[420px] xl:max-w-[480px] h-auto"
                aria-hidden
              >
                <defs>
                  <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="white" stopOpacity="0.15" />
                  </linearGradient>
                  <linearGradient id="heroGradWarm" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E8D5B7" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#E8D5B7" stopOpacity="0.15" />
                  </linearGradient>
                </defs>
                {/* Central node */}
                <circle cx="160" cy="140" r="32" fill="url(#heroGrad)" stroke="white" strokeWidth="2" strokeOpacity="0.6" />
                <circle cx="160" cy="140" r="20" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.7" />
                {/* Surrounding nodes */}
                <circle cx="80" cy="80" r="18" fill="url(#heroGrad)" stroke="white" strokeWidth="1.5" strokeOpacity="0.55" />
                <circle cx="240" cy="80" r="18" fill="url(#heroGrad)" stroke="white" strokeWidth="1.5" strokeOpacity="0.55" />
                <circle cx="80" cy="200" r="18" fill="url(#heroGrad)" stroke="white" strokeWidth="1.5" strokeOpacity="0.55" />
                <circle cx="240" cy="200" r="18" fill="url(#heroGradWarm)" stroke="#E8D5B7" strokeWidth="1.5" strokeOpacity="0.6" />
                {/* Connector lines */}
                <line x1="108" y1="108" x2="142" y2="128" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" />
                <line x1="212" y1="108" x2="178" y2="128" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" />
                <line x1="108" y1="172" x2="142" y2="152" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" />
                <line x1="212" y1="172" x2="178" y2="152" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" />
                {/* Flow arc — slightly warmer tone */}
                <path d="M 160 100 Q 220 140 160 180 Q 100 140 160 100" fill="none" stroke="white" strokeWidth="1.2" strokeOpacity="0.45" strokeDasharray="5 4" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Why MentraFlow — white, center-aligned */}
      <section id="about" className="py-10 sm:py-14 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Why MentraFlow</h2>
            <p className="text-base sm:text-lg font-bold mb-5" style={{ color: COLORS.brand.deepTeal }}>
              The failure point isn’t training. It’s the moment of decision.
            </p>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-4">
              Organizations can show training completion—but not that people will make the right decisions when it matters. A flagged wire, a borderline case, an auditor asking why: that’s when knowledge has to be usable.
            </p>
            <ul className="space-y-1.5 mb-4 text-gray-700 list-none text-sm sm:text-base">
              <li className="flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: COLORS.brand.deepTeal }} />
                Real scenarios → decision simulations
              </li>
              <li className="flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: COLORS.brand.deepTeal }} />
                Measure how people respond & improve over time
              </li>
              <li className="flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: COLORS.brand.deepTeal }} />
                <span className="font-semibold" style={{ color: COLORS.brand.deepTeal }}>Demonstrated capability</span>, not just completion
              </li>
            </ul>
            <p className="text-gray-600 leading-relaxed text-sm">
              MentraFlow turns compliance workflows and certification content into continuous decision practice—so you get auditable evidence of decision quality, not just training records.
            </p>
          </div>
        </div>
      </section>

      {/* Solution — off-gray for rhythm */}
      <section id="solution" className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: COLORS.brand.deepTeal }}>
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-4 tracking-tight">
            Decision-ready, not just trained
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            We convert workflows and real scenarios into continuous decision simulations—measure quality, improve over time.
          </p>
          {/* Desktop Grid — 2x2 for better card prominence */}
          <div className="hidden md:grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
              <div
                key={index}
                className="rounded-xl p-6 sm:p-7 shadow-sm transition-all duration-300 cursor-default bg-white border border-gray-200 hover:shadow-md hover:border-gray-300"
                style={{
                  borderTopColor: feature.color,
                  borderTopWidth: '4px',
                }}
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${feature.color}18` }}>
                  <Icon className="h-7 w-7" style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{feature.description}</p>
              </div>
            ); })}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentFeatureIndex * 100}%)` }}
                role="list"
                aria-label="Feature highlights"
              >
                {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                  <div
                    key={index}
                    role="listitem"
                    className="min-w-full rounded-xl p-6 shadow-sm mx-2 bg-white border border-gray-200"
                    style={{
                      borderTopColor: feature.color,
                      borderTopWidth: '4px',
                    }}
                  >
                    <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-4 bg-white mx-auto" style={{ backgroundColor: `${feature.color}18` }}>
                      <Icon className="h-8 w-8" style={{ color: feature.color }} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 text-center">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm text-center">{feature.description}</p>
                  </div>
                ); })}
              </div>
            </div>
            
            {/* Carousel Controls */}
            <div className="flex justify-center items-center mt-4 space-x-2" role="group" aria-label="Carousel navigation">
              <button
                onClick={() => setCurrentFeatureIndex((prev) => (prev > 0 ? prev - 1 : features.length - 1))}
                className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-deepTeal focus-visible:ring-offset-2"
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
                className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-deepTeal focus-visible:ring-offset-2"
                aria-label="Next feature"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes — white */}
      <section id="testimonials" className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: COLORS.brand.deepTeal }}>
            Results
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-3 tracking-tight">
            Outcomes that matter
          </h2>
          <p className="text-center text-gray-600 mb-10 max-w-xl mx-auto">
            Pilots in AML and transaction monitoring—where decisions are frequent and measurable.
          </p>
          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: COLORS.brand.deepTeal }}>
                  ✓
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">Improved decision accuracy</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Employees make better calls in real scenarios, with measurable alignment to policy and expected actions.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: COLORS.brand.mindBlue }}>
                  ✓
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">Reduced inconsistent actions</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Fewer errors, fewer re-work cycles, and higher confidence when handling edge cases and audit queries.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-gray-900 font-bold text-lg" style={{ backgroundColor: COLORS.brand.neuroYellow }}>
                  ✓
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">Audit readiness</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Auditable evidence of decision quality and reinforcement—turning compliance into a provable capability.
              </p>
            </div>
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden relative max-w-md mx-auto">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonialIndex * 100}%)` }}
              >
                <div className="min-w-full bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: COLORS.brand.deepTeal }}>
                      ✓
                    </div>
                    <div className="ml-4">
                      <p className="font-semibold text-gray-900">Improved decision accuracy</p>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Employees make better calls in real scenarios, with measurable alignment to policy and expected actions.
                  </p>
                </div>
                
                <div className="min-w-full bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: COLORS.brand.mindBlue }}>
                      ✓
                    </div>
                    <div className="ml-4">
                      <p className="font-semibold text-gray-900">Reduced inconsistent actions</p>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Fewer errors, fewer re-work cycles, and higher confidence when handling edge cases and audit queries.
                  </p>
                </div>
                
                <div className="min-w-full bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-gray-900 font-bold text-lg" style={{ backgroundColor: COLORS.brand.neuroYellow }}>
                      ✓
                    </div>
                    <div className="ml-4">
                      <p className="font-semibold text-gray-900">Audit readiness</p>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Auditable evidence of decision quality and reinforcement—turning compliance into a provable capability.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Carousel Controls */}
            <div className="flex justify-center items-center mt-4 space-x-2">
              <button
                onClick={() => setCurrentTestimonialIndex((prev) => (prev > 0 ? prev - 1 : 2))}
                className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
              <div className="flex space-x-1">
                {[0, 1, 2].map((index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonialIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentTestimonialIndex ? 'w-8 bg-brand-deepTeal' : 'w-2 bg-gray-300'
                    }`}
                    aria-label={`Go to outcome ${index + 1} of 3`}
                    aria-current={index === currentTestimonialIndex ? 'true' : undefined}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrentTestimonialIndex((prev) => (prev < 2 ? prev + 1 : 0))}
                className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </div>
          
        </div>
      </section>

    </>
  );
};

export default Home;

