import React from 'react';
import { COLORS } from '../constants/theme';
import { Award, Users, TrendingUp } from 'lucide-react';

const About = () => {
  return (
    <>
      {/* About Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-6">About MentraFlow</h1>
            
            <div className="bg-gray-50 rounded-lg p-8 shadow-sm border-t-4 mb-12" style={{ borderTopColor: COLORS.brand.deepTeal }}>
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
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="text-center p-6 rounded-lg bg-white border border-gray-200">
                <Award className="h-12 w-12 mx-auto mb-4" style={{ color: COLORS.brand.deepTeal }} />
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">Executive Education</h3>
                <p className="text-sm text-gray-600">Piloting with UChicago Booth</p>
              </div>
              <div className="text-center p-6 rounded-lg bg-white border border-gray-200">
                <Users className="h-12 w-12 mx-auto mb-4" style={{ color: COLORS.brand.mindBlue }} />
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">Professional Focus</h3>
                <p className="text-sm text-gray-600">Built for knowledge workers</p>
              </div>
              <div className="text-center p-6 rounded-lg bg-white border border-gray-200">
                <TrendingUp className="h-12 w-12 mx-auto mb-4" style={{ color: COLORS.brand.neuroYellow }} />
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">Long-Term Impact</h3>
                <p className="text-sm text-gray-600">Knowledge compounds, not decays</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To transform learning from a one-time activity into a lasting asset. We believe that knowledge should compound, 
                not decay, and that professionals deserve tools designed for long-term retention and recall.
              </p>
              <p className="text-gray-700 leading-relaxed">
                MentraFlow is currently in beta with Executive MBA students at the University of Chicago Booth, where we're 
                validating our approach to adaptive reinforcement and knowledge retention.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;

