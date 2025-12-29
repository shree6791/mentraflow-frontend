import React from 'react';
import { COLORS } from '../constants/theme';

const FAQ = () => {
  const faqs = [
    {
      question: 'How does adaptive recall work?',
      answer: 'MentraFlow uses your forgetting curve to determine the optimal time to reinforce knowledge. The system adapts to your memory patterns, showing you content right before you\'re likely to forget it.',
    },
    {
      question: 'What file types are supported?',
      answer: 'We support PDFs, Word documents, text files, and markdown. Our AI processes your documents to extract key concepts and create flashcards automatically.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes. All documents are encrypted at rest and in transit. We use industry-standard security practices and never share your data with third parties.',
    },
    {
      question: 'Can I use MentraFlow with my existing tools?',
      answer: 'Absolutely. MentraFlow is designed to layer on top of your existing workflow. You can continue using your current note-taking and learning tools while MentraFlow reinforces your knowledge.',
    },
    {
      question: 'What\'s the difference between Free and Professional?',
      answer: 'The Free tier includes basic features for up to 10 documents. Professional offers unlimited documents, advanced adaptive recall algorithms, priority support, and detailed analytics to track your retention progress.',
    },
  ];

  return (
    <>
      {/* FAQ Content */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-center text-gray-600 mb-12">
              Everything you need to know about MentraFlow
            </p>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQ;

