'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Star, Quote, Heart, Calendar, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  getPaginatedSuccessStories,
  formatStoryDate,
  type SuccessStory,
  type SuccessStoriesPagination
} from '@/lib/successStoriesApi';

export default function SuccessStoriesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [pagination, setPagination] = useState<SuccessStoriesPagination>({
    current_page: 1,
    last_page: 1,
    per_page: 9,
    total: 0,
    from: null,
    to: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Load success stories from API
  const loadStories = async (page: number) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch 9 stories per page for grid layout
      const response = await getPaginatedSuccessStories(page, 9);

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

  // Filter stories based on search term
  const filteredStories = stories.filter(story =>
    story.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadStories(page);
    // Scroll to top of stories section
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const endPage = Math.min(pagination.last_page, startPage + maxButtons - 1);

    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
    );

    // First page
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(<span key="ellipsis1" className="px-2">...</span>);
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          disabled={loading}
          className={`px-4 py-2 border rounded-lg transition-colors ${
            currentPage === i
              ? 'bg-red-500 text-white border-red-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < pagination.last_page) {
      if (endPage < pagination.last_page - 1) {
        buttons.push(<span key="ellipsis2" className="px-2">...</span>);
      }
      buttons.push(
        <button
          key={pagination.last_page}
          onClick={() => handlePageChange(pagination.last_page)}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {pagination.last_page}
        </button>
      );
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === pagination.last_page || loading}
        className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    );

    return buttons;
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Heart className="h-16 w-16 mx-auto mb-6 animate-pulse" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Success Stories
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-4">
                Real couples, real love stories - Discover how vivahavedi helped thousands find their perfect match
              </p>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                Every love story is unique and special. Read inspiring stories of couples who found their soulmates through our platform
              </p>
            </div>
          </div>
        </section>

        {/* Search and Stats Section */}
        <section className="bg-white py-8 shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Search Bar */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search stories by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Statistics */}
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span className="font-semibold">{pagination.total}+</span>
                  <span>Happy Couples</span>
                </div>
                <div className="hidden md:block h-6 w-px bg-gray-300"></div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="font-semibold">50,000+</span>
                  <span>Successful Marriages</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => loadStories(1)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Stories Grid */}
          {!loading && !error && filteredStories.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {filteredStories.map((story) => (
                  <article
                    key={story.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                  >
                    {/* Image Section */}
                    <div className="relative h-64 bg-gradient-to-br from-red-100 to-pink-100">
                      <Image
                        src={story.photo || '/placeholder-avatar.png'}
                        alt={story.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                        unoptimized={story.photo?.includes('vivahavedimatrimony.com')}
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium text-gray-700">
                          {formatStoryDate(story.date)}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                      {/* Quote Icon and Rating */}
                      <div className="flex justify-between items-start mb-4">
                        <Quote className="h-8 w-8 text-red-400 flex-shrink-0" />
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>

                      {/* Couple Name */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {story.name}
                      </h3>

                      {/* Story Description */}
                      <p className="text-gray-700 leading-relaxed line-clamp-4 mb-4">
                        {story.desc || 'A beautiful love story brought together by vivahavedi.'}
                      </p>

                      {/* Read More Badge */}
                      <div className="flex items-center text-red-500 font-medium text-sm">
                        <Heart className="h-4 w-4 mr-1" />
                        <span>Love Story</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {pagination.last_page > 1 && !searchTerm && (
                <div className="flex justify-center items-center gap-2 flex-wrap">
                  {renderPaginationButtons()}
                </div>
              )}

              {/* Showing results info */}
              <div className="text-center mt-8 text-gray-600">
                Showing {pagination.from || 0} to {pagination.to || 0} of {pagination.total} success stories
              </div>
            </>
          )}

          {/* No Stories State */}
          {!loading && !error && filteredStories.length === 0 && !searchTerm && (
            <div className="text-center py-20">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No success stories available at the moment.</p>
              <p className="text-gray-500 mt-2">Check back soon for inspiring love stories!</p>
            </div>
          )}

          {/* No Search Results */}
          {!loading && !error && filteredStories.length === 0 && searchTerm && (
            <div className="text-center py-20">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No stories found matching &quot;{searchTerm}&quot;</p>
              <p className="text-gray-500 mt-2">Try a different search term</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-red-500 hover:text-red-600 font-semibold"
              >
                Clear search
              </button>
            </div>
          )}
        </section>

        {/* Statistics Section */}
        <section className="bg-gradient-to-r from-red-600 to-pink-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Our Success in Numbers
              </h2>
              <p className="text-xl text-white/90">
                Join thousands of happy couples who found their perfect match
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
              <div className="transform hover:scale-110 transition-transform duration-300">
                <div className="text-4xl md:text-5xl font-bold mb-2">50,000+</div>
                <div className="text-lg text-white/90">Happy Marriages</div>
              </div>
              <div className="transform hover:scale-110 transition-transform duration-300">
                <div className="text-4xl md:text-5xl font-bold mb-2">2M+</div>
                <div className="text-lg text-white/90">Registered Members</div>
              </div>
              <div className="transform hover:scale-110 transition-transform duration-300">
                <div className="text-4xl md:text-5xl font-bold mb-2">15+</div>
                <div className="text-lg text-white/90">Years of Trust</div>
              </div>
              <div className="transform hover:scale-110 transition-transform duration-300">
                <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
                <div className="text-lg text-white/90">Success Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Write Your Own Success Story?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join vivahavedi today and start your journey to finding your perfect life partner
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block shadow-lg"
              >
                Register Free Now
              </a>
              <a
                href="/login"
                className="bg-transparent border-2 border-red-500 text-red-500 hover:bg-red-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block"
              >
                Sign In
              </a>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
