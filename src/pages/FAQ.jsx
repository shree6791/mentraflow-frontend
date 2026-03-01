import React from 'react';
import { COLORS } from '../constants/theme';

const FAQ = () => {
  const groups = [
    {
      heading: 'What it is',
      faqs: [
        {
          question: 'What is MentraFlow?',
          answer: 'MentraFlow is a decision-readiness platform for regulated environments where getting decisions wrong has real consequences. We convert compliance workflows and certification programs into real-world decision simulations, continuously measuring and improving how employees make decisions over time—so organizations move from training completion to demonstrated decision capability.',
        },
      ],
    },
    {
      heading: "Who it's for",
      faqs: [
        {
          question: 'Who is MentraFlow for?',
          answer: 'MentraFlow is designed for environments where incorrect decisions have immediate regulatory, financial, or operational consequences. We focus initially on financial services compliance. That includes teams responsible for compliance, risk, audit, and operational decision-making—and extends into adjacent domains such as legal, healthcare, and professional certification.',
        },
      ],
    },
    {
      heading: 'How it works',
      faqs: [
        {
          question: 'What does "decision-ready" mean?',
          answer: 'Decision-ready means employees are not just trained but able to make the right decisions when it matters. MentraFlow focuses on the moment of decision: we recreate realistic scenarios based on company workflows and past cases, require employees to decide and explain their reasoning, and measure how decisions align with policy and expected actions—shifting from passive knowledge to applied judgment.',
        },
        {
          question: 'How does MentraFlow work?',
          answer: 'MentraFlow connects to your compliance materials, certification content, and real-world decision data (e.g. past cases, audit findings), converting them into structured, scenario-based simulations. Employees respond to short decision prompts (what would you do, and why); the system evaluates alignment with policy. A dashboard gives a live view of decision readiness across individuals and teams.',
        },
        {
          question: 'Why not just use an LLM?',
          answer: 'LLMs make it easier to retrieve information, but they do not ensure correct decision-making. In compliance environments, the risk is not whether someone can find an answer—it is whether they can make the right call quickly and justify it. MentraFlow complements AI by ensuring employees can independently apply knowledge in real scenarios, with measurable and auditable evidence of decision quality.',
        },
      ],
    },
    {
      heading: 'Pricing & pilots',
      faqs: [
        {
          question: 'What are typical outcomes?',
          answer: 'Pilots focus on financial services workflows such as AML and transaction monitoring, where decisions are frequent and measurable. Key outcomes include improved decision accuracy, reduced inconsistent actions, increased confidence in handling real scenarios, and improved audit readiness—creating a direct link between training, decision behavior, and measurable business outcomes.',
        },
        {
          question: 'How is MentraFlow priced?',
          answer: 'We follow a phased go-to-market: Phase 1 (Pilot) at $75–$100 per learner for 8–12 weeks to demonstrate improvement in decision readiness; Phase 2 (Enterprise) with $50K–$250K+ annual contracts driven by risk reduction and audit readiness; Phase 3 (Platform) as an API layer integrating with LMS, AI tools, and internal systems.',
        },
      ],
    },
  ];

  return (
    <>
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-3">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-center text-gray-600 mb-4">
              Decision-readiness, who it's for, and how it works
            </p>
            <p className="text-center text-gray-700 mb-12 max-w-xl mx-auto">
              For compliance and risk teams, leadership, and implementation partners.
            </p>

            <div className="space-y-12">
              {groups.map((group, groupIndex) => (
                <div key={groupIndex}>
                  <h2
                    className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2"
                    style={{ borderColor: COLORS.brand.deepTeal }}
                  >
                    {group.heading}
                  </h2>
                  <div className="space-y-6">
                    {group.faqs.map((faq, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-xl p-6 border border-gray-100"
                      >
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {faq.question}
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
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
