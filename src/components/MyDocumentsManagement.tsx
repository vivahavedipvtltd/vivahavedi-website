'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, X, Loader2, CheckCircle2, AlertCircle, FileText, Eye, ArrowLeft } from 'lucide-react';
import { MyPhotos } from '@/types/dashboard';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface MyDocumentsManagementProps {
  myPhotos: MyPhotos;
  onRefresh: () => void;
}

const MyDocumentsManagement = ({ myPhotos, onRefresh }: MyDocumentsManagementProps) => {
  const router = useRouter();
  const { token } = useAuth();
  const [uploadingIdProof, setUploadingIdProof] = useState(false);
  const [deletingIdProof, setDeletingIdProof] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [viewingDocument, setViewingDocument] = useState<{ type: 'idproof'; url: string } | null>(null);

  const handleIdProofUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload JPG, PNG, GIF, BMP, or WEBP files.');
      return;
    }

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
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.status === 'success') {
        setSuccess('ID Proof uploaded successfully!');
        onRefresh();
      } else {
        setError(result.message || 'Failed to upload ID proof');
      }
    } catch (err) {
      console.error('ID proof upload error:', err);
      setError('An error occurred while uploading the ID proof');
    } finally {
      setUploadingIdProof(false);
      event.target.value = '';
    }
  };

  const handleIdProofDelete = async () => {
    if (!confirm('Are you sure you want to delete your ID proof?')) return;

    try {
      setDeletingIdProof(true);
      setError(null);
      setSuccess(null);

      const response = await fetch(`${API_BASE_URL}/delete-photo`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ photo: 'idproof' }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        setSuccess('ID Proof deleted successfully!');
        onRefresh();
      } else {
        setError(result.message || 'Failed to delete ID proof');
      }
    } catch (err) {
      console.error('ID proof delete error:', err);
      setError('An error occurred while deleting the ID proof');
    } finally {
      setDeletingIdProof(false);
    }
  };

  const hasIdProof = myPhotos.id_proof_status === 'yes' && myPhotos.id_proof !== 'no';

  return (
    <>
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
              <FileText className="h-6 w-6 mr-2 text-red-500" />
              My Documents
            </h1>
            <p className="text-gray-600 mt-1">
              Upload your ID proof for profile verification
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

      {/* ID Proof Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {hasIdProof ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-green-600 font-semibold flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                ID Proof Uploaded
              </span>
            </div>

            <div className="relative h-72 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
              <Image
                src={myPhotos.id_proof}
                alt="ID Proof document"
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                className="object-contain"
                unoptimized={myPhotos.id_proof?.includes('vivahavedimatrimony.com')}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setViewingDocument({ type: 'idproof', url: myPhotos.id_proof })}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Full Size
              </button>
              <button
                onClick={handleIdProofDelete}
                disabled={deletingIdProof}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {deletingIdProof ? (
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
              To replace, delete the current ID proof and upload a new one.
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No ID Proof Uploaded
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Upload your ID proof to verify your profile
            </p>

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
              className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer ${
                uploadingIdProof
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {uploadingIdProof ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 mr-2" />
                  Upload ID Proof
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
            • Keep your documents clear and readable for verification
          </p>
        </div>
      </div>

      {/* Full Size Viewer Modal */}
      {viewingDocument && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setViewingDocument(null)}
        >
          <div
            className="relative max-w-4xl max-h-full bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setViewingDocument(null)}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="relative min-h-96 min-w-96 w-full">
              <Image
                src={viewingDocument.url}
                alt="ID Proof full size"
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-contain"
                unoptimized={viewingDocument.url?.includes('vivahavedimatrimony.com')}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyDocumentsManagement;
