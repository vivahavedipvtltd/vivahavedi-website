'use client';

// import { Shield, Users, Heart, Award, CheckCircle, Clock } from 'lucide-react';

const AboutSection = () => {

  const communities = [
    'Punjabi', 'Tamil', 'Telugu', 'Marathi', 'Gujarati', 'Bengali',
    'Malayalam', 'Kannada', 'Hindi', 'Rajasthani', 'Assamese', 'Oriya'
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Browse by Community */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Browse by Community
            </h3>
            <p className="text-lg text-gray-600">
              Find matches from your preferred community and cultural background
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {communities.map((community, index) => (
              <button
                key={index}
                className="relative border-2 border-gray-300 hover:border-red-500 text-gray-600 hover:text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 text-sm group overflow-hidden shadow-md hover:shadow-lg"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-md"></span>
                <span className="relative z-10">{community} Matrimony</span>
              </button>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
              View All Communities
            </button>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 animate-fade-in">
              How It Works
            </h3>
            <p className="text-lg text-gray-600 animate-fade-in-delay">
              Simple steps to find your perfect match
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">

            {/* Step 1 */}
            <div className="text-center group hover:scale-105 transition-all duration-300 animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="relative mb-6">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto text-2xl font-bold shadow-lg group-hover:shadow-xl transition-all duration-300 animate-bounce-in">
                  1
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-pulse opacity-80"></div>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300">
                Register Free
              </h4>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                Create your profile with basic information and preferences. It&apos;s completely free to start.
              </p>

              {/* Floating Icons */}
              <div className="absolute -top-4 -left-4 text-red-300 animate-float">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center group hover:scale-105 transition-all duration-300 animate-slide-up" style={{animationDelay: '0.4s'}}>
              <div className="relative mb-6">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto text-2xl font-bold shadow-lg group-hover:shadow-xl transition-all duration-300 animate-bounce-in" style={{animationDelay: '0.2s'}}>
                  2
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse opacity-80" style={{animationDelay: '0.5s'}}></div>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300">
                Browse & Connect
              </h4>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                Search through verified profiles and connect with potential matches that interest you.
              </p>

              {/* Floating Icons */}
              <div className="absolute -top-4 -right-4 text-red-300 animate-float" style={{animationDelay: '1s'}}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center group hover:scale-105 transition-all duration-300 animate-slide-up" style={{animationDelay: '0.6s'}}>
              <div className="relative mb-6">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto text-2xl font-bold shadow-lg group-hover:shadow-xl transition-all duration-300 animate-bounce-in" style={{animationDelay: '0.4s'}}>
                  3
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-400 rounded-full animate-pulse opacity-80" style={{animationDelay: '1s'}}></div>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300">
                Find Your Match
              </h4>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                Interact, meet, and find your perfect life partner with the support of our platform.
              </p>

              {/* Floating Icons */}
              <div className="absolute -top-4 -left-4 text-red-300 animate-float" style={{animationDelay: '1.5s'}}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>

              {/* Success Sparkles */}
              <div className="absolute top-0 right-0 text-yellow-400 animate-twinkle">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>

          </div>
        </div>

        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes slide-up {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes bounce-in {
            0% { opacity: 0; transform: scale(0.3); }
            50% { opacity: 1; transform: scale(1.1); }
            70% { transform: scale(0.9); }
            100% { opacity: 1; transform: scale(1); }
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }

          @keyframes twinkle {
            0%, 100% { opacity: 0.4; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
          }

          .animate-fade-in {
            animation: fade-in 0.8s ease-out;
          }

          .animate-fade-in-delay {
            animation: fade-in 0.8s ease-out 0.3s both;
          }

          .animate-slide-up {
            animation: slide-up 0.8s ease-out both;
          }

          .animate-bounce-in {
            animation: bounce-in 1s ease-out both;
          }

          .animate-float {
            animation: float 3s ease-in-out infinite;
          }

          .animate-twinkle {
            animation: twinkle 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    </section>
  );
};

export default AboutSection;