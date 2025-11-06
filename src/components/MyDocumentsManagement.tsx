'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, X, Loader2, CheckCircle2, AlertCircle, FileText, Star, Eye } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface MyPhotos {
  photos: {
    [key: string]: string;
  };
  photo_status: string;
  photo_all_status: string;
  lock_status: string;
  id_proof: string;
  id_proof_status: string;
  horoscope: string;
  horoscope_status: string;
}

interface MyDocumentsManagementProps {
  myPhotos: MyPhotos;
  onRefresh: () => void;
}

const MyDocumentsManagement = ({ myPhotos, onRefresh }: MyDocumentsManagementProps) => {
  const { token } = useAuth();
  const [uploadingHoroscope, setUploadingHoroscope] = useState(false);
  const [uploadingIdProof, setUploadingIdProof] = useState(false);
  const [deletingHoroscope, setDeletingHoroscope] = useState(false);
  const [deletingIdProof, setDeletingIdProof] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [viewingDocument, setViewingDocument] = useState<{ type: 'horoscope' | 'idproof'; url: string } | null>(null);

  const handleHoroscopeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload JPG, PNG, GIF, BMP, or WEBP files.');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB. Please upload a smaller file.');
      return;
    }

    try {
      setUploadingHoroscope(true);
      setError(null);
      setSuccess(null);

      const formData = new FormData();
      formData.append('horoscope', file);

      const response = await fetch(`${API_BASE_URL}/upload-horoscope`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.status === 'success') {
        setSuccess('Horoscope uploaded successfully!');
        setTimeout(() => {
          onRefresh();
          setSuccess(null);
        }, 1500);
      } else {
        setError(result.message || 'Failed to upload horoscope');
      }
    } catch (error) {
      console.error('Horoscope upload error:', error);
      setError('An error occurred while uploading the horoscope');
    } finally {
      setUploadingHoroscope(false);
      event.target.value = '';
    }
  };

  const handleIdProofUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload JPG, PNG, GIF, BMP, or WEBP files.');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB. Please upload a smaller file.');
      return;
    }

    try {
      setUploadingIdProof(true);
      setError(null);
      setSuccess(null);

      const formData = new FormData();
      formData.append('id_proof', file);

      const response = await fetch(`${API_BASE_URL}/upload-id-proof`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.status === 'success') {
        setSuccess('ID Proof uploaded successfully!');
        setTimeout(() => {
          onRefresh();
          setSuccess(null);
        }, 1500);
      } else {
        setError(result.message || 'Failed to upload ID proof');
      }
    } catch (error) {
      console.error('ID proof upload error:', error);
      setError('An error occurred while uploading the ID proof');
    } finally {
      setUploadingIdProof(false);
      event.target.value = '';
    }
  };

  const handleHoroscopeDelete = async () => {
    if (!confirm('Are you sure you want to delete your horoscope?')) {
      return;
    }

    try {
      setDeletingHoroscope(true);
      setError(null);
      setSuccess(null);

      const response = await fetch(`${API_BASE_URL}/delete-photo`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ photo: 'horoscope' }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        setSuccess('Horoscope deleted successfully!');
        setTimeout(() => {
          onRefresh();
          setSuccess(null);
        }, 1000);
      } else {
        setError(result.message || 'Failed to delete horoscope');
      }
    } catch (error) {
      console.error('Horoscope delete error:', error);
      setError('An error occurred while deleting the horoscope');
    } finally {
      setDeletingHoroscope(false);
    }
  };

  const handleIdProofDelete = async () => {
    if (!confirm('Are you sure you want to delete your ID proof?')) {
      return;
    }

    try {
      setDeletingIdProof(true);
      setError(null);
      setSuccess(null);

      const response = await fetch(`${API_BASE_URL}/delete-photo`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ photo: 'idproof' }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        setSuccess('ID Proof deleted successfully!');
        setTimeout(() => {
          onRefresh();
          setSuccess(null);
        }, 1000);
      } else {
        setError(result.message || 'Failed to delete ID proof');
      }
    } catch (error) {
      console.error('ID proof delete error:', error);
      setError('An error occurred while deleting the ID proof');
    } finally {
      setDeletingIdProof(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-red-500" />
          My Documents
        </h2>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-800">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start">
          <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-green-800">{success}</p>
          </div>
        </div>
      )}

      {/* Two columns grid for documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Horoscope Section */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Horoscope</h3>
            </div>
            {myPhotos.horoscope_status === 'yes' ? (
              <span className="text-green-600 font-semibold flex items-center text-sm">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Uploaded
              </span>
            ) : (
              <span className="text-gray-500 font-semibold text-sm">Not Uploaded</span>
            )}
          </div>

          {myPhotos.horoscope_status === 'yes' && myPhotos.horoscope !== 'no' ? (
            <div className="space-y-3">
              <div className="relative h-48 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src={myPhotos.horoscope}
                  alt="Horoscope"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/images/avathar/male_l.png';
                  }}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewingDocument({ type: 'horoscope', url: myPhotos.horoscope })}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </button>
                <button
                  onClick={handleHoroscopeDelete}
                  disabled={deletingHoroscope}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {deletingHoroscope ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-1" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <input
                type="file"
                id="horoscope-upload"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp,image/webp"
                onChange={handleHoroscopeUpload}
                disabled={uploadingHoroscope}
                className="hidden"
              />
              <label
                htmlFor="horoscope-upload"
                className={`block w-full text-center px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer ${
                  uploadingHoroscope
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                }`}
              >
                {uploadingHoroscope ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Uploading...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Upload className="h-5 w-5 mr-2" />
                    Upload Horoscope
                  </span>
                )}
              </label>
            </div>
          )}
        </div>

        {/* ID Proof Section */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-gray-900">ID Proof</h3>
            </div>
            {myPhotos.id_proof_status === 'yes' ? (
              <span className="text-green-600 font-semibold flex items-center text-sm">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Uploaded
              </span>
            ) : (
              <span className="text-gray-500 font-semibold text-sm">Not Uploaded</span>
            )}
          </div>

          {myPhotos.id_proof_status === 'yes' && myPhotos.id_proof !== 'no' ? (
            <div className="space-y-3">
              <div className="relative h-48 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src={myPhotos.id_proof}
                  alt="ID Proof"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/images/avathar/male_l.png';
                  }}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewingDocument({ type: 'idproof', url: myPhotos.id_proof })}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </button>
                <button
                  onClick={handleIdProofDelete}
                  disabled={deletingIdProof}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {deletingIdProof ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-1" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <input
                type="file"
                id="idproof-upload"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp,image/webp"
                onChange={handleIdProofUpload}
                disabled={uploadingIdProof}
                className="hidden"
              />
              <label
                htmlFor="idproof-upload"
                className={`block w-full text-center px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer ${
                  uploadingIdProof
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {uploadingIdProof ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Uploading...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Upload className="h-5 w-5 mr-2" />
                    Upload ID Proof
                  </span>
                )}
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Upload Info */}
      <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500 space-y-1">
        <p>• Supported formats: JPG, PNG, GIF, BMP, WEBP</p>
        <p>• Maximum file size: 10MB per document</p>
        <p>• Documents are automatically converted to JPG format</p>
        <p className="text-yellow-600 font-medium">• Keep your documents clear and readable for verification</p>
      </div>

      {/* Document Viewer Modal */}
      {viewingDocument && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setViewingDocument(null)}
        >
          <div className="relative max-w-4xl max-h-full bg-white rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setViewingDocument(null)}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <img
              src={viewingDocument.url}
              alt={viewingDocument.type === 'horoscope' ? 'Horoscope' : 'ID Proof'}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDocumentsManagement;
