'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqData: FAQItem[] = [
    {
      id: 1,
      question: "How can I register my profile on vivahavedi?",
      answer: "Registration is simple and free! Click on 'Register Free' button, fill in your basic details like name, email, phone number, and create a password. You'll receive a verification email or SMS to confirm your account. Once verified, you can complete your detailed profile with photos and preferences."
    },
    {
      id: 2,
      question: "What is a User ID? Is it important?",
      answer: "A User ID is your unique identifier on vivahavedi that allows other members to find and connect with you. It's automatically generated during registration but you can customize it later. Having a memorable User ID makes it easier for potential matches to search and remember your profile."
    },
    {
      id: 3,
      question: "What things should I consider when creating my profile?",
      answer: "Create an honest and complete profile with recent photos. Include details about your background, education, profession, family, and partner preferences. Be specific about your expectations and values. A well-crafted profile with genuine information attracts more compatible matches and builds trust."
    },
    {
      id: 4,
      question: "Who can view my profile information?",
      answer: "Your profile visibility depends on your privacy settings. Basic information is visible to all registered members, while contact details are shared only with premium members or those you've accepted. You can control photo visibility and choose who can contact you through privacy controls in your account settings."
    },
    {
      id: 5,
      question: "Is vivahavedi safe and secure?",
      answer: "Yes, we prioritize your safety with 100% verified profiles, secure payment systems, and advanced privacy controls. Our team manually reviews all profiles and photos. We use SSL encryption for data protection and provide tools to report suspicious activities. Your personal information is never shared without your consent."
    },
    {
      id: 6,
      question: "How does the matching system work?",
      answer: "Our AI-powered matching system analyzes your preferences, background, and behavior to suggest compatible profiles. Matches are based on factors like age, location, education, profession, religion, caste, and lifestyle preferences. You can also use advanced search filters to find specific criteria."
    },
    {
      id: 7,
      question: "What are the membership benefits?",
      answer: "Premium members get unlimited profile views, direct contact access, priority listing in search results, read receipts for messages, and advanced privacy controls. You also get personalized matchmaking assistance, profile promotion, and access to exclusive events and success stories."
    },
    {
      id: 8,
      question: "How can I upgrade my membership?",
      answer: "You can upgrade to premium membership anytime from your account dashboard. Choose from various plans based on duration and features. We accept all major payment methods including credit/debit cards, net banking, UPI, and mobile wallets. All transactions are secure and encrypted."
    }
  ];

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-50 rounded-full opacity-50"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-pink-50 rounded-full opacity-60"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-red-100 rounded-full opacity-40"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <HelpCircle className="h-4 w-4 mr-2" />
            Need Help?
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked
            <span className="text-red-600 block">Questions</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about vivahavedi. Can&apos;t find what you&apos;re looking for? Contact our support team.
          </p>
        </div>

        {/* Grid Layout: FAQ Items (2/3) + Contact Support (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Items - 2/3 width */}
          <div className="lg:col-span-2 space-y-4">
            {faqData.map((faq) => (
              <div
                key={faq.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-2xl"
                >
                  <span className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <div className="flex-shrink-0">
                    {openFAQ === faq.id ? (
                      <ChevronUp className="h-5 w-5 text-red-600 transition-transform duration-200" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400 transition-transform duration-200" />
                    )}
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFAQ === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-5">
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Support - 1/3 width */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-8 sticky top-8 h-fit">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Still have questions?
              </h3>
              <p className="text-gray-600 mb-6">
                Our support team is here to help you 24/7. Get in touch with us for personalized assistance.
              </p>
              <div className="flex flex-col gap-4">
                <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Contact Support
                </button>
                <button className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-6 py-3 rounded-full font-semibold transition-all duration-200">
                  Live Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;