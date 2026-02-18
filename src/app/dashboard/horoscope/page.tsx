'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { mutate } from 'swr';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardSidebar from '@/components/DashboardSidebar';
import Image from 'next/image';
import {
  Star,
  Loader2,
  Upload,
  X,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface HoroscopeData {
  horoscope: string;
  horoscope_status: string;
}

const HoroscopePage = () => {
  const router = useRouter();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [horoscopeData, setHoroscopeData] = useState<HoroscopeData>({
    horoscope: 'no',
    horoscope_status: '',
  });
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [viewing, setViewing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/my-photos`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.status === 'success') {
        setHoroscopeData({
          horoscope: result.data.horoscope || 'no',
          horoscope_status: result.data.horoscope_status || '',
        });
      }
    } catch (err) {
      console.error('Error fetching horoscope data:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, fetchData]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
    ];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload JPG, PNG, GIF, BMP, or WEBP files.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB. Please upload a smaller file.');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setSuccess(null);

      const formData = new FormData();
      formData.append('horoscope', file);

      const response = await fetch(`${API_BASE_URL}/upload-horoscope`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.status === 'success') {
        setSuccess('Horoscope uploaded successfully!');
        mutate((key: unknown) => Array.isArray(key) && typeof key[0] === 'string' && (key[0].endsWith('/my-details') || key[0].endsWith('/my-photos')));
        fetchData();
      } else {
        setError(result.message || 'Failed to upload horoscope');
      }
    } catch (err) {
      console.error('Horoscope upload error:', err);
      setError('An error occurred while uploading the horoscope');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your horoscope?')) return;

    try {
      setDeleting(true);
      setError(null);
      setSuccess(null);

      const response = await fetch(`${API_BASE_URL}/delete-photo`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ photo: 'horoscope' }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        setSuccess('Horoscope deleted successfully!');
        mutate((key: unknown) => Array.isArray(key) && typeof key[0] === 'string' && (key[0].endsWith('/my-details') || key[0].endsWith('/my-photos')));
        fetchData();
      } else {
        setError(result.message || 'Failed to delete horoscope');
      }
    } catch (err) {
      console.error('Horoscope delete error:', err);
      setError('An error occurred while deleting the horoscope');
    } finally {
      setDeleting(false);
    }
  };

  const hasHoroscope =
    horoscopeData.horoscope_status === 'yes' && horoscopeData.horoscope !== 'no';

  if (loading) {
    return (
      <DashboardLayout centered showFooter={false}>
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading horoscope...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout showFooter={false}>
      <div className="flex-1 flex bg-gray-50 overflow-hidden">
        <DashboardSidebar
          activeSection="my-documents"
          onSectionChange={(section) => {
            router.push(`/dashboard?section=${section}`);
          }}
        />

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Star className="h-6 w-6 mr-2 text-yellow-500" />
                    Horoscope
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Upload your horoscope for better match compatibility
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  {error}
                </div>
                <button onClick={() => setError(null)}>
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" />
                {success}
              </div>
            )}

            {/* Horoscope Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              {hasHoroscope ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 font-semibold flex items-center">
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      Horoscope Uploaded
                    </span>
                  </div>

                  <div className="relative h-72 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    <Image
                      src={horoscopeData.horoscope}
                      alt="Horoscope document"
                      fill
                      sizes="(max-width: 768px) 100vw, 672px"
                      className="object-contain"
                      unoptimized={horoscopeData.horoscope?.includes('vivahavedimatrimony.com')}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setViewing(true)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Full Size
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
                    >
                      {deleting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4 mr-2" />
                          Delete
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 text-center">
                    To replace, delete the current horoscope and upload a new one.
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-yellow-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Horoscope Uploaded
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Upload your horoscope to improve match compatibility
                  </p>

                  <input
                    type="file"
                    id="horoscope-upload"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp,image/webp"
                    onChange={handleUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  <label
                    htmlFor="horoscope-upload"
                    className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer ${
                      uploading
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                    }`}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-5 w-5 mr-2" />
                        Upload Horoscope
                      </>
                    )}
                  </label>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500 space-y-1">
                <p>• Supported formats: JPG, PNG, GIF, BMP, WEBP</p>
                <p>• Maximum file size: 10MB</p>
                <p>• Images are automatically converted to JPG format</p>
                <p className="text-yellow-600 font-medium">
                  • Keep your horoscope clear and readable for verification
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Full Size Viewer Modal */}
      {viewing && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setViewing(false)}
        >
          <div
            className="relative max-w-4xl max-h-full bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setViewing(false)}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="relative min-h-96 min-w-96 w-full">
              <Image
                src={horoscopeData.horoscope}
                alt="Horoscope full size"
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-contain"
                unoptimized={horoscopeData.horoscope?.includes('vivahavedimatrimony.com')}
              />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default HoroscopePage;
