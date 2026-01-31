'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, X, Loader2, CheckCircle2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { MyPhotos } from '@/types/dashboard';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface MyPhotosManagementProps {
  myPhotos: MyPhotos;
  onRefresh: () => void;
}

const MyPhotosManagement = ({ myPhotos, onRefresh }: MyPhotosManagementProps) => {
  const { token } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handle placeholder click - trigger file input
  const handlePlaceholderClick = () => {
    if (!uploading && canUpload) {
      document.getElementById('photo-upload')?.click();
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
      setUploading(true);
      setError(null);
      setSuccess(null);
      setUploadProgress('Uploading photo...');

      // Note: The backend automatically finds the first available slot (photo1-photo5)
      // Regardless of which placeholder is clicked, photos are uploaded in sequential order
      const formData = new FormData();
      formData.append('photo', file);

      const response = await fetch(`${API_BASE_URL}/upload-photo`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.status === 'success') {
        setSuccess('Photo uploaded successfully!');
        setUploadProgress(null);
        // Refresh photos after a short delay to allow backend processing
        setTimeout(() => {
          onRefresh();
          setSuccess(null);
        }, 1500);
      } else {
        setError(result.message || 'Failed to upload photo');
        setUploadProgress(null);
      }
    } catch (error) {
      console.error('Photo upload error:', error);
      setError('An error occurred while uploading the photo');
      setUploadProgress(null);
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handlePhotoDelete = async (photoNumber: number) => {
    if (!confirm(`Are you sure you want to delete photo ${photoNumber}?`)) {
      return;
    }

    try {
      setDeleting(`photo${photoNumber}`);
      setError(null);
      setSuccess(null);

      const response = await fetch(`${API_BASE_URL}/delete-photo`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ photo: photoNumber.toString() }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        setSuccess('Photo deleted successfully!');
        // Refresh photos after a short delay
        setTimeout(() => {
          onRefresh();
          setSuccess(null);
        }, 1000);
      } else {
        setError(result.message || 'Failed to delete photo');
      }
    } catch (error) {
      console.error('Photo delete error:', error);
      setError('An error occurred while deleting the photo');
    } finally {
      setDeleting(null);
    }
  };

  const getPhotoForSlot = (slotNumber: number): string | null => {
    // Map to the correct photo index
    // Slot 1 = photos['1'] (photo1)
    // Slot 2 = photos['2'] (photo2)
    // Slot 3 = photos['3'] (photo3)
    // Slot 4 = photos['4'] (photo4)
    // Slot 5 = photos['5'] (photo5)
    const photoKey = slotNumber.toString();
    const photoUrl = myPhotos.photos[photoKey];

    if (photoUrl && photoUrl !== 'no') {
      return photoUrl;
    }
    return null;
  };

  const canUpload = myPhotos.photo_all_status !== 'yes';

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <ImageIcon className="h-5 w-5 mr-2 text-red-500" />
          My Photos
        </h2>
        {myPhotos.lock_status === 'yes' && (
          <div className="flex items-center text-sm text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>Photos Locked</span>
          </div>
        )}
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

      {uploadProgress && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center">
          <Loader2 className="h-5 w-5 text-blue-600 mr-2 animate-spin" />
          <p className="text-sm text-blue-800">{uploadProgress}</p>
        </div>
      )}

      {/* Photo Grid - Showing slots 1-5 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
        {[1, 2, 3, 4, 5].map((slotNumber) => {
          const photoUrl = getPhotoForSlot(slotNumber);
          const isDeleting = deleting === `photo${slotNumber}`;

          return (
            <div key={slotNumber} className="relative">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200 hover:border-red-500 transition-colors relative group">
                {photoUrl ? (
                  <>
                    <Image
                      src={photoUrl || '/placeholder-avatar.png'}
                      alt={`Your matrimonial profile photo ${slotNumber} - Vivahavedi wedding profile picture`}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="object-cover"
                      unoptimized={photoUrl?.includes('vivahavedimatrimony.com')}
                    />
                    {/* Delete button overlay - only visible on hover */}
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-200 pointer-events-none"></div>
                    <button
                      onClick={() => handlePhotoDelete(slotNumber)}
                      disabled={isDeleting}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-opacity duration-200 disabled:opacity-50 shadow-lg z-10"
                      title="Delete photo"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <X className="h-5 w-5" />
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handlePlaceholderClick}
                    disabled={uploading || !canUpload}
                    className="w-full h-full flex flex-col items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed disabled:hover:text-gray-400 disabled:hover:bg-gray-100"
                    title={canUpload ? "Click to upload photo" : "All photo slots are full"}
                  >
                    <Upload className="h-8 w-8 mb-2" />
                    <span className="text-xs">Slot {slotNumber}</span>
                    {canUpload && (
                      <span className="text-xs mt-1 text-red-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to upload
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between text-sm mb-4 pb-4 border-b border-gray-200">
        <span className="text-gray-600">Upload Status</span>
        {(() => {
          // Count actual uploaded photos (slots 1-5)
          const uploadedCount = [1, 2, 3, 4, 5].filter(slot => getPhotoForSlot(slot) !== null).length;

          if (uploadedCount === 5) {
            return (
              <span className="text-green-600 font-semibold flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Complete (5/5 Photos)
              </span>
            );
          } else if (uploadedCount > 0) {
            return (
              <span className="text-yellow-600 font-semibold">
                {uploadedCount}/5 Uploaded
              </span>
            );
          } else {
            return <span className="text-red-600 font-semibold">No Photos Uploaded</span>;
          }
        })()}
      </div>

      {/* Upload Button */}
      <div className="relative">
        <input
          type="file"
          id="photo-upload"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp,image/webp"
          onChange={handlePhotoUpload}
          disabled={uploading || !canUpload}
          className="hidden"
        />
        <label
          htmlFor="photo-upload"
          className={`block w-full text-center px-4 py-3 rounded-lg font-medium transition-colors duration-200 cursor-pointer ${
            canUpload && !uploading
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {uploading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Uploading...
            </span>
          ) : canUpload ? (
            <span className="flex items-center justify-center">
              <Upload className="h-5 w-5 mr-2" />
              Upload Photo
            </span>
          ) : (
            'All Slots Full (5/5)'
          )}
        </label>
      </div>

      {/* Upload Info */}
      <div className="mt-4 text-xs text-gray-500 space-y-1">
        <p>• Supported formats: JPG, PNG, GIF, BMP, WEBP</p>
        <p>• Maximum file size: 10MB</p>
        <p>• Photos are automatically converted to JPG format</p>
        <p>• Click any empty slot to upload - photos fill in sequential order</p>
        {myPhotos.photo_all_status === 'yes' && (
          <p className="text-yellow-600 font-medium">• Delete a photo to upload a new one</p>
        )}
      </div>
    </div>
  );
};

export default MyPhotosManagement;
