import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { COLORS } from '../constants/theme';
import { Brain, ArrowRight, TrendingUp, Clock, Target, Users, Award } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  // Debug log
  console.log('Home component rendering, isAuthenticated:', isAuthenticated);

  const features = [
    {
      icon: TrendingUp,
      title: 'Adaptive Reinforcement',
      description: 'Guided by your forgetting curve to strengthen retention at the right moments',
      color: COLORS.brand.deepTeal,
      bgColor: 'bg-brand-deepTeal/5',
      borderColor: 'border-brand-deepTeal/20',
    },
    {
      icon: Brain,
      title: 'Knowledge Graph',
      description: 'Visualize concepts and relationships to build durable understanding',
      color: COLORS.brand.mindBlue,
      bgColor: 'bg-brand-mindBlue/5',
      borderColor: 'border-brand-mindBlue/20',
    },
    {
      icon: Clock,
      title: 'Spaced Recall',
      description: 'AI-powered flashcards that adapt to your memory patterns for long-term retention',
      color: COLORS.brand.neuroYellow,
      bgColor: 'bg-brand-neuroYellow/5',
      borderColor: 'border-brand-neuroYellow/20',
    },
    {
      icon: Target,
      title: 'Workflow Integration',
      description: 'Layers on top of your existing tools to reinforce learning without disruption',
      color: COLORS.brand.neuralCoral,
      bgColor: 'bg-brand-neuralCoral/5',
      borderColor: 'border-brand-neuralCoral/20',
    },
  ];

  return (
    <>
      {/* Hero Section with Background */}
      <section 
        className="relative py-32 px-4 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${COLORS.brand.deepIndigo} 0%, ${COLORS.brand.deepTeal} 50%, ${COLORS.brand.mindBlue} 100%)`,
        }}
      >
        {/* Background Pattern/Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}></div>
        </div>
        
        {/* Cognitive/Memory Visual Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Brain/Network Pattern */}
          <div className="absolute top-20 right-10 w-64 h-64 opacity-20">
            <Brain className="w-full h-full text-white" strokeWidth={1} />
          </div>
          <div className="absolute bottom-20 left-10 w-48 h-48 opacity-15">
            <TrendingUp className="w-full h-full text-white" strokeWidth={1} />
          </div>
        </div>

        <div className="container mx-auto relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Retain, Recall, Reuse
          </h1>
          <p className="text-xl md:text-2xl text-white/95 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
            Make learning compound, not decay.<br />
            Adaptive recall and reinforcement for lasting knowledge.
          </p>
          {!isAuthenticated && (
            <Link to="/login">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 bg-white text-brand-deepTeal hover:bg-gray-50 font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Start Retaining Knowledge
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* About Section - White Background */}
      <section id="about" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-6">About MentraFlow</h2>
            <div className="bg-gray-50 rounded-lg p-8 shadow-sm border-t-4" style={{ borderTopColor: COLORS.brand.deepTeal }}>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              MentraFlow is a <span className="font-semibold" style={{ color: COLORS.brand.deepTeal }}>cognitive infrastructure platform</span> that helps professionals 
              retain, recall, and reuse what they learn over time. We transform notes, documents, and AI interactions into 
              adaptive recall and reinforcement, enabling learning to compound rather than decay.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Unlike traditional learning tools that focus on content delivery, MentraFlow addresses the structural gap in 
              knowledge retention. We layer on top of your existing workflows to strengthen learning outcomes over time, 
              guided by each user's forgetting curve.
            </p>
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-lg bg-white">
                <Award className="h-10 w-10 mx-auto mb-3" style={{ color: COLORS.brand.deepTeal }} />
                <p className="font-semibold text-gray-900 mb-1">Executive Education</p>
                <p className="text-sm text-gray-600">Piloting with UChicago Booth</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-white">
                <Users className="h-10 w-10 mx-auto mb-3" style={{ color: COLORS.brand.mindBlue }} />
                <p className="font-semibold text-gray-900 mb-1">Professional Focus</p>
                <p className="text-sm text-gray-600">Built for knowledge workers</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-white">
                <TrendingUp className="h-10 w-10 mx-auto mb-3" style={{ color: COLORS.brand.neuroYellow }} />
                <p className="font-semibold text-gray-900 mb-1">Long-Term Impact</p>
                <p className="text-sm text-gray-600">Knowledge compounds, not decays</p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Problem Statement Section - Gray Background */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg p-10 max-w-4xl mx-auto shadow-sm border-t-4" style={{ borderTopColor: COLORS.brand.neuralCoral }}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              The Problem: Knowledge Decay
            </h2>
            <p className="text-gray-700 text-center text-lg leading-relaxed mb-4">
              Modern professionals spend significant time learning, yet most knowledge fades within weeks. 
              This creates a costly cycle of re-learning, reduced productivity, and poor return on educational investment.
            </p>
            <p className="text-gray-900 text-center text-lg leading-relaxed font-semibold mb-8">
              The core problem isn't access to knowledge—it's the absence of systems designed for memory, recall, and long-term understanding.
            </p>
            <div className="mt-8 grid md:grid-cols-3 gap-6 text-center">
              <div className="p-6 bg-gray-50 rounded-lg">
                <p className="text-4xl font-bold mb-2" style={{ color: COLORS.brand.neuralCoral }}>Weeks</p>
                <p className="text-gray-600">Most knowledge fades</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <p className="text-4xl font-bold mb-2" style={{ color: COLORS.brand.deepTeal }}>$350B+</p>
                <p className="text-gray-600">Annual corporate L&D spend</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <p className="text-4xl font-bold mb-2" style={{ color: COLORS.brand.mindBlue }}>High</p>
                <p className="text-gray-600">Cost of re-learning</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section - White Background */}
      <section id="solution" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            The Solution: Cognitive Infrastructure
          </h2>
          <p className="text-center text-gray-700 mb-4 text-lg max-w-3xl mx-auto font-medium">
            Rather than replacing your existing tools, MentraFlow layers on top to strengthen learning outcomes over time
          </p>
          <p className="text-center text-gray-600 mb-12 text-base max-w-2xl mx-auto">
            Guided by your forgetting curve, we reinforce knowledge at optimal intervals to ensure it sticks
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-6 shadow-sm border-2 border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-300 cursor-pointer"
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
        </div>
      </section>

      {/* Testimonials Section - Gray Background */}
      <section id="testimonials" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Trusted by Professionals
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: COLORS.brand.deepTeal }}>
                  JD
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">John Doe</p>
                  <p className="text-sm text-gray-600">Executive MBA, UChicago Booth</p>
                </div>
              </div>
              <p className="text-gray-700 italic leading-relaxed">
                "MentraFlow transformed how I retain finance concepts. The adaptive reinforcement 
                ensures I remember what matters for my career, not just for the exam."
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: COLORS.brand.mindBlue }}>
                  SM
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">Sarah Miller</p>
                  <p className="text-sm text-gray-600">Finance Professional</p>
                </div>
              </div>
              <p className="text-gray-700 italic leading-relaxed">
                "Finally, a tool that understands knowledge decay. My learning now compounds instead 
                of fading away. Game changer for continuous upskilling."
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-gray-900 font-bold text-lg" style={{ backgroundColor: COLORS.brand.neuroYellow }}>
                  RK
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">Robert Kim</p>
                  <p className="text-sm text-gray-600">Knowledge Worker</p>
                </div>
              </div>
              <p className="text-gray-700 italic leading-relaxed">
                "The workflow integration is seamless. It reinforces what I learn without disrupting 
                my existing tools. Knowledge retention has improved significantly."
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-600 text-sm">
              Currently in beta with Executive MBA students at University of Chicago Booth
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section - White Background */}
      {!isAuthenticated && (
        <section className="bg-white py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="bg-white rounded-lg p-12 max-w-2xl mx-auto shadow-sm border-t-4" style={{ borderTopColor: COLORS.brand.neuroYellow }}>
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Stop Knowledge Decay</h2>
              <p className="text-gray-600 mb-2 text-lg">
                Transform your learning into a durable asset with adaptive reinforcement.
              </p>
              <p className="text-gray-500 mb-8 text-sm">
                Currently in beta with Executive MBA students at University of Chicago Booth
              </p>
              <Link to="/login">
                <Button 
                  size="lg" 
                  className="text-white font-semibold px-8 py-6 text-lg transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                  style={{ backgroundColor: COLORS.brand.deepTeal }}
                >
                  Start Retaining Knowledge
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

    </>
  );
};

export default Home;

