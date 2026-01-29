'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  getPaginatedSuccessStories,
  formatStoryDate,
  truncateText,
  type SuccessStory,
  type SuccessStoriesPagination
} from '@/lib/successStoriesApi';

const SuccessStories = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [pagination, setPagination] = useState<SuccessStoriesPagination>({
    current_page: 1,
    last_page: 1,
    per_page: 2,
    total: 0,
    from: null,
    to: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Load success stories from API
  const loadStories = async (page: number) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch 2 stories per page (to maintain 2 stories per slide)
      const response = await getPaginatedSuccessStories(page, 2);

      if (response.status === 'success') {
        setStories(response.data);
        setPagination(response.pagination);
      } else {
        setError(response.message || 'Failed to load success stories');
      }
    } catch (err) {
      console.error('Error loading success stories:', err);
      setError('Unable to load success stories. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Load stories on component mount
  useEffect(() => {
    loadStories(1);
  }, []);

  // Auto-advance slides (pages)
  useEffect(() => {
    if (!isAutoPlaying || loading || error || pagination.last_page <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentPage((prevPage) => {
        const nextPage = prevPage >= pagination.last_page ? 1 : prevPage + 1;
        loadStories(nextPage);
        return nextPage;
      });
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [isAutoPlaying, loading, error, pagination.last_page, currentPage]);

  const nextSlide = () => {
    const nextPage = currentPage >= pagination.last_page ? 1 : currentPage + 1;
    setCurrentPage(nextPage);
    loadStories(nextPage);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    const prevPage = currentPage <= 1 ? pagination.last_page : currentPage - 1;
    setCurrentPage(prevPage);
    loadStories(prevPage);
    setIsAutoPlaying(false);
  };

  const goToSlide = (page: number) => {
    setCurrentPage(page);
    loadStories(page);
    setIsAutoPlaying(false);
  };

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Success Stories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real couples, real love stories. See how vivahavedi helped thousands find their perfect match
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => loadStories(1)}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Slider Container */}
        {!loading && !error && stories.length > 0 && (
          <div className="relative">
            {/* Story Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {/* Quote Icon and Rating */}
                  <div className="flex justify-between items-start mb-6">
                    <Quote className="h-8 w-8 text-red-400" />
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>

                  {/* Story Content */}
                  <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 italic min-h-[120px]">
                    &ldquo;{story.desc || 'A beautiful love story brought together by vivahavedi.'}&rdquo;
                  </blockquote>

                  {/* Couple Info */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">
                        {story.name}
                      </h4>
                      <p className="text-sm text-red-600 font-medium">
                        Married: {formatStoryDate(story.date)}
                      </p>
                    </div>
                    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-4 ring-red-100 transition-all duration-300 hover:ring-red-200 relative bg-gray-200">
                      <Image
                        src={story.photo || '/placeholder-avatar.png'}
                        alt={story.name}
                        fill
                        sizes="64px"
                        className="object-cover transition-transform duration-300 hover:scale-110"
                        unoptimized={story.photo?.includes('vivahavedimatrimony.com')}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            {pagination.last_page > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  disabled={loading}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white hover:bg-red-50 text-red-500 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-10 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                </button>
                <button
                  onClick={nextSlide}
                  disabled={loading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white hover:bg-red-50 text-red-500 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-10 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                </button>
              </>
            )}
          </div>
        )}

        {/* No Stories State */}
        {!loading && !error && stories.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No success stories available at the moment.</p>
            <p className="text-gray-500 mt-2">Check back soon for inspiring love stories!</p>
          </div>
        )}

        {/* Statistics */}
        <div className="mt-16 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl p-8 text-white relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-12 translate-y-12 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-float"></div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-2 animate-slide-in-down">
                Our Success in Numbers
              </h3>
              <p className="text-red-100 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                Thousands of happy couples trust vivahavedi
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="animate-count-up hover:scale-110 transition-transform duration-300" style={{animationDelay: '0.5s'}}>
                <div className="text-3xl md:text-4xl font-bold mb-2 animate-bounce-in" style={{animationDelay: '0.5s'}}>
                  <span className="inline-block animate-number-roll">5</span>
                  <span className="inline-block animate-number-roll" style={{animationDelay: '0.1s'}}>0</span>
                  <span className="inline-block animate-number-roll" style={{animationDelay: '0.2s'}}>,</span>
                  <span className="inline-block animate-number-roll" style={{animationDelay: '0.3s'}}>0</span>
                  <span className="inline-block animate-number-roll" style={{animationDelay: '0.4s'}}>0</span>
                  <span className="inline-block animate-number-roll" style={{animationDelay: '0.5s'}}>0</span>
                  <span className="inline-block animate-number-roll" style={{animationDelay: '0.6s'}}>+</span>
                </div>
                <div className="text-red-100 animate-fade-in-up" style={{animationDelay: '0.8s'}}>Happy Marriages</div>
                <div className="w-8 h-1 bg-white/30 mx-auto mt-2 rounded-full animate-expand" style={{animationDelay: '1s'}}></div>
              </div>

              <div className="animate-count-up hover:scale-110 transition-transform duration-300" style={{animationDelay: '0.7s'}}>
                <div className="text-3xl md:text-4xl font-bold mb-2 animate-bounce-in" style={{animationDelay: '0.7s'}}>
                  <span className="inline-block animate-number-roll" style={{animationDelay: '0.7s'}}>2</span>
                  <span className="inline-block animate-number-roll" style={{animationDelay: '0.8s'}}>M</span>
                  <span className="inline-block animate-number-roll" style={{animationDelay: '0.9s'}}>+</span>
                </div>
                <div className="text-red-100 animate-fade-in-up" style={{animationDelay: '1s'}}>Registered Members</div>
                <div className="w-8 h-1 bg-white/30 mx-auto mt-2 rounded-full animate-expand" style={{animationDelay: '1.2s'}}></div>
              </div>

              <div className="animate-count-up hover:scale-110 transition-transform duration-300" style={{animationDelay: '0.9s'}}>
                <div className="text-3xl md:text-4xl font-bold mb-2 animate-bounce-in" style={{animationDelay: '0.9s'}}>
                  <span className="inline-block animate-number-roll" style={{animationDelay: '0.9s'}}>1</span>
                  <span className="inline-block animate-number-roll" style={{animationDelay: '1s'}}>5</span>
                  <span className="inline-block animate-number-roll" style={{animationDelay: '1.1s'}}>+</span>
                </div>
                <div className="text-red-100 animate-fade-in-up" style={{animationDelay: '1.2s'}}>Years of Trust</div>
                <div className="w-8 h-1 bg-white/30 mx-auto mt-2 rounded-full animate-expand" style={{animationDelay: '1.4s'}}></div>
              </div>

              <div className="animate-count-up hover:scale-110 transition-transform duration-300" style={{animationDelay: '1.1s'}}>
                <div className="text-3xl md:text-4xl font-bold mb-2 animate-bounce-in" style={{animationDelay: '1.1s'}}>
                  <span className="inline-block animate-number-roll" style={{animationDelay: '1.1s'}}>9</span>
                  <span className="inline-block animate-number-roll" style={{animationDelay: '1.2s'}}>8</span>
                  <span className="inline-block animate-number-roll" style={{animationDelay: '1.3s'}}>%</span>
                </div>
                <div className="text-red-100 animate-fade-in-up" style={{animationDelay: '1.4s'}}>Success Rate</div>
                <div className="w-8 h-1 bg-white/30 mx-auto mt-2 rounded-full animate-expand" style={{animationDelay: '1.6s'}}></div>
              </div>
            </div>
          </div>

          {/* Floating icons */}
          <div className="absolute top-4 right-8 text-white/20 animate-float" style={{animationDelay: '2s'}}>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="absolute bottom-8 left-8 text-white/20 animate-float" style={{animationDelay: '3s'}}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>

        <style jsx>{`
          @keyframes slide-in-down {
            0% {
              opacity: 0;
              transform: translateY(-30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fade-in-up {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes bounce-in {
            0% {
              opacity: 0;
              transform: scale(0.3);
            }
            50% {
              opacity: 1;
              transform: scale(1.1);
            }
            70% {
              transform: scale(0.9);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes number-roll {
            0% {
              opacity: 0;
              transform: rotateY(90deg) scale(0.8);
            }
            50% {
              opacity: 0.7;
              transform: rotateY(45deg) scale(1.1);
            }
            100% {
              opacity: 1;
              transform: rotateY(0deg) scale(1);
            }
          }

          @keyframes count-up {
            0% {
              opacity: 0;
              transform: translateY(30px) scale(0.8);
            }
            70% {
              opacity: 0.8;
              transform: translateY(-10px) scale(1.05);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes expand {
            0% {
              width: 0;
              opacity: 0;
            }
            100% {
              width: 2rem;
              opacity: 1;
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          .animate-slide-in-down {
            animation: slide-in-down 0.8s ease-out both;
          }

          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out both;
          }

          .animate-bounce-in {
            animation: bounce-in 1s ease-out both;
          }

          .animate-number-roll {
            animation: number-roll 0.6s ease-out both;
          }

          .animate-count-up {
            animation: count-up 0.8s ease-out both;
          }

          .animate-expand {
            animation: expand 0.6s ease-out both;
          }

          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>

        <div className="text-center mt-12">
          <a
            href="/success-stories"
            className="inline-block bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors duration-200 shadow-lg"
          >
            Read More Stories
          </a>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
