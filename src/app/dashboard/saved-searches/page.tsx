'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from '@/components/DashboardSidebar';
import {
  Search,
  Loader2,
  Trash2,
  Eye,
  Bookmark,
  AlertCircle,
} from 'lucide-react';
import { getSavedSearches, deleteSavedSearch } from '@/lib/searchApi';

interface SavedSearch {
  id: number;
  name: string;
}

const SavedSearchesPage = () => {
  const router = useRouter();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (token && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadSavedSearches();
    }
  }, [token]);

  const loadSavedSearches = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      const result = await getSavedSearches(token);
      if (result.status === 'success') {
        setSavedSearches(result.data);
      } else {
        setError('Failed to load saved searches');
      }
    } catch (error: any) {
      console.error('Failed to load saved searches:', error);
      if (error.message?.includes('429')) {
        setError('Too many requests. Please wait a moment and try again.');
      } else {
        setError('Failed to load saved searches. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewSearch = (searchId: number) => {
    router.push(`/search-results?type=saved&id=${searchId}`);
  };

  const handleDeleteSearch = async (searchId: number) => {
    if (!token) return;

    if (!confirm('Are you sure you want to delete this saved search?')) {
      return;
    }

    setDeleting(searchId);
    try {
      const result = await deleteSavedSearch(token, searchId);
      if (result.status === 'success') {
        setSavedSearches((prev) => prev.filter((search) => search.id !== searchId));
      }
    } catch (error) {
      console.error('Failed to delete saved search:', error);
      alert('Failed to delete saved search. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <AuthGuard requireAuth={true} redirectTo="/login">
      <div className="min-h-screen flex flex-col">
        <Header />

        <div className="flex-grow flex bg-gray-50">
          <DashboardSidebar
            activeSection="saved-searches"
            onSectionChange={(section) => {
              // Navigate to dashboard for sections handled there
              router.push('/dashboard');
            }}
          />

          <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              {/* Page Header */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Bookmark className="h-6 w-6 mr-2 text-red-500" />
                  Saved Searches
                </h1>
                <p className="text-gray-600 mt-2">
                  Access your saved search filters for quick profile searches
                </p>
              </div>

              {/* Error State */}
              {error && !loading && (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Error Loading Saved Searches
                  </h3>
                  <p className="text-gray-600 mb-6">{error}</p>
                  <button
                    onClick={() => {
                      hasLoadedRef.current = false;
                      loadSavedSearches();
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 inline-flex items-center"
                  >
                    <Loader2 className="h-5 w-5 mr-2" />
                    Retry
                  </button>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <Loader2 className="h-16 w-16 text-red-500 animate-spin mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Loading...
                  </h3>
                  <p className="text-gray-600">
                    Please wait while we load your saved searches
                  </p>
                </div>
              )}

              {/* Saved Searches List */}
              {!loading && !error && savedSearches.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedSearches.map((search) => (
                    <div
                      key={search.id}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center">
                              <Bookmark className="h-5 w-5 mr-2 text-red-500" />
                              {search.name}
                            </h3>
                            <p className="text-sm text-gray-600">Saved Search #{search.id}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewSearch(search.id)}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Results
                          </button>
                          <button
                            onClick={() => handleDeleteSearch(search.id)}
                            disabled={deleting === search.id}
                            className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deleting === search.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && savedSearches.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No Saved Searches
                  </h3>
                  <p className="text-gray-600 mb-6">
                    You haven't saved any searches yet. Start searching for profiles and save your favorite filters for quick access.
                  </p>
                  <button
                    onClick={() => router.push('/search')}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 inline-flex items-center"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Start Searching
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </AuthGuard>
  );
};

export default SavedSearchesPage;
