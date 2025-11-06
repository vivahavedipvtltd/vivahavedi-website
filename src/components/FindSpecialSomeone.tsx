'use client';

import { useEffect, useRef, useState } from 'react';
import { UserPlus, Heart, Shield, Sparkles, CheckCircle } from 'lucide-react';

interface Step {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  delay: number;
  color: string;
  bgColor: string;
}

const FindSpecialSomeone = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const steps: Step[] = [
    {
      id: 1,
      icon: UserPlus,
      title: "Sign Up",
      description: "Get Started for Free. Build Your Profile in Seconds!",
      delay: 0,
      color: "text-blue-600",
      bgColor: "from-blue-500 to-blue-600"
    },
    {
      id: 2,
      icon: Heart,
      title: "Connect",
      description: "Select your perfect partner & Connect with Matches you like",
      delay: 300,
      color: "text-red-600",
      bgColor: "from-red-500 to-pink-500"
    },
    {
      id: 3,
      icon: Shield,
      title: "100% Secured",
      description: "The data you choose to share with us is safe and secure.",
      delay: 600,
      color: "text-green-600",
      bgColor: "from-green-500 to-emerald-500"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Auto-cycle through steps for demo effect
          const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % steps.length);
          }, 2000);

          setTimeout(() => clearInterval(interval), 8000); // Stop after 4 cycles
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [steps.length]);

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-white via-red-50 to-pink-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-40 h-40 bg-red-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-100 rounded-full opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-blue-100 rounded-full opacity-25 animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 left-1/4 w-20 h-20 bg-purple-100 rounded-full opacity-20 animate-pulse delay-700"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className={`inline-flex items-center bg-gradient-to-r from-red-100 to-pink-100 text-red-800 px-6 py-3 rounded-full text-sm font-medium mb-8 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <Sparkles className="h-4 w-4 mr-2 animate-spin" />
            Your Journey to Love
          </div>

          <h2 className={`text-5xl lg:text-6xl font-bold text-gray-900 mb-6 transform transition-all duration-1000 delay-200 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            Find Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600 block">
              Special Someone
            </span>
          </h2>

          <p className={`text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed transform transition-all duration-1000 delay-400 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            Start your beautiful journey to find your perfect life partner in just three simple steps.
            Join thousands of couples who found their happily ever after with vivahavedi.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-16">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isActive = activeStep === index;

            return (
              <div
                key={step.id}
                className={`relative group transform transition-all duration-700 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                }`}
                style={{
                  transitionDelay: isVisible ? `${step.delay + 600}ms` : '0ms'
                }}
              >
                {/* Connection Line (hidden on mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent transform translate-x-6 z-0">
                    <div
                      className={`h-full bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-1000 ${
                        isVisible ? 'w-3/4' : 'w-0'
                      }`}
                      style={{
                        transitionDelay: `${step.delay + 1000}ms`
                      }}
                    />
                  </div>
                )}

                <div className={`relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 ${
                  isActive ? 'border-red-500 scale-105' : 'border-gray-100 hover:border-red-200'
                } group-hover:-translate-y-2`}>

                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">{step.id}</span>
                  </div>

                  {/* Icon */}
                  <div className="mb-6 relative">
                    <div className={`w-20 h-20 bg-gradient-to-br ${step.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg mx-auto ${
                      isActive ? 'animate-pulse' : ''
                    }`}>
                      <IconComponent className="h-10 w-10 text-white" />
                    </div>

                    {/* Floating particles */}
                    {isActive && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                        <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping delay-300"></div>
                        <div className="absolute top-1/2 right-0 w-1 h-1 bg-green-400 rounded-full animate-ping delay-700"></div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                      isActive ? 'text-red-600' : 'text-gray-900 group-hover:text-red-600'
                    }`}>
                      {step.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed text-lg">
                      {step.description}
                    </p>

                    {/* Success indicator */}
                    {isActive && (
                      <div className="mt-4 inline-flex items-center text-green-600 text-sm font-medium">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Ready to proceed
                      </div>
                    )}
                  </div>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FindSpecialSomeone;