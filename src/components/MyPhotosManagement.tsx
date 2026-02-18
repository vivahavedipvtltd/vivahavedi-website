'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, X, Loader2, CheckCircle2, AlertCircle, Image as ImageIcon, Crop } from 'lucide-react';
import { MyPhotos } from '@/types/dashboard';
import dynamic from 'next/dynamic';

const ImageCropModal = dynamic(() => import('./ImageCropModal'), { ssr: false });

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const VALID_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface MyPhotosManagementProps {
  myPhotos: MyPhotos;
  onRefresh: () => void;
}

const MyPhotosManagement = ({ myPhotos, onRefresh }: MyPhotosManagementProps) => {
  const { token } = useAuth();

  // Direct upload state
  const [uploading, setUploading] = useState(false);
  const [uploadingToSlot, setUploadingToSlot] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Crop flow state
  const [cropTargetSlot, setCropTargetSlot] = useState<number | null>(null);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropLoading, setCropLoading] = useState(false);   // fetching image for modal
  const [cropUploading, setCropUploading] = useState(false); // uploading cropped result

  const canUpload = myPhotos.photo_all_status !== 'yes';
  const isProcessing = uploading || cropUploading || cropLoading;

  const validateFile = (file: File): string | null => {
    if (!VALID_IMAGE_TYPES.includes(file.type)) {
      return 'Invalid file type. Please upload JPG, PNG, GIF, BMP, or WEBP files.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 10MB. Please upload a smaller file.';
    }
    return null;
  };

  const getPhotoForSlot = (slotNumber: number): string | null => {
    const photoUrl = myPhotos.photos[slotNumber.toString()];
    return photoUrl && photoUrl !== 'no' ? photoUrl : null;
  };

  const isPhotoApproved = (slotNumber: number): boolean => {
    return myPhotos.photo_approvals?.[slotNumber.toString()] === 'yes';
  };

  const getFirstEmptySlot = (): number | null => {
    for (let i = 1; i <= 5; i++) {
      if (!getPhotoForSlot(i)) return i;
    }
    return null;
  };

  // Handle placeholder click - trigger file input
  const handlePlaceholderClick = () => {
    if (!isProcessing && canUpload) {
      document.getElementById('photo-upload')?.click();
    }
  };

  // Direct upload (no crop modal)
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      event.target.value = '';
      return;
    }

    event.target.value = '';
    const targetSlot = getFirstEmptySlot();

    try {
      setUploading(true);
      setUploadingToSlot(targetSlot);
      setError(null);
      setSuccess(null);
      setUploadProgress('Uploading photo...');

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
        setTimeout(() => {
          onRefresh();
          setSuccess(null);
        }, 1500);
      } else {
        setError(result.message || 'Failed to upload photo');
        setUploadProgress(null);
      }
    } catch (err) {
      console.error('Photo upload error:', err);
      setError('An error occurred while uploading the photo');
      setUploadProgress(null);
    } finally {
      setUploading(false);
      setUploadingToSlot(null);
    }
  };

  // Crop button: fetch the existing photo through proxy → open crop modal
  const handleCropButtonClick = async (slotNumber: number, photoUrl: string) => {
    setCropTargetSlot(slotNumber);
    setCropLoading(true);
    setError(null);

    try {
      // Proxy the image server-side to avoid CORS canvas tainting
      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(photoUrl)}`;
      const response = await fetch(proxyUrl);

      if (!response.ok) {
        throw new Error('Failed to load photo');
      }

      const blob = await response.blob();
      const fileName = photoUrl.split('/').pop() || 'photo.jpg';
      const file = new File([blob], fileName, { type: 'image/jpeg' });

      setCropFile(file);
      setShowCropModal(true);
    } catch (err) {
      console.error('Error loading photo for crop:', err);
      setError('Failed to load photo for cropping. Please try again.');
      setCropTargetSlot(null);
    } finally {
      setCropLoading(false);
    }
  };

  // After crop confirmed — replace the photo in the target slot
  const handleCropComplete = async (croppedBlob: Blob) => {
    setShowCropModal(false);
    if (!cropTargetSlot) return;

    try {
      setCropUploading(true);
      setError(null);
      setSuccess(null);
      setUploadProgress('Uploading cropped photo...');

      const croppedFile = new File(
        [croppedBlob],
        cropFile?.name || 'cropped-photo.jpg',
        { type: 'image/jpeg' }
      );

      const formData = new FormData();
      formData.append('photo', croppedFile);
      formData.append('slot', cropTargetSlot.toString());

      const response = await fetch(`${API_BASE_URL}/replace-photo`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.status === 'success') {
        setSuccess('Photo cropped and updated successfully!');
        setUploadProgress(null);
        setTimeout(() => {
          onRefresh();
          setSuccess(null);
        }, 1500);
      } else {
        setError(result.message || 'Failed to update photo');
        setUploadProgress(null);
      }
    } catch (err) {
      console.error('Photo crop upload error:', err);
      setError('An error occurred while uploading the cropped photo');
      setUploadProgress(null);
    } finally {
      setCropUploading(false);
      setCropTargetSlot(null);
      setCropFile(null);
    }
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setCropTargetSlot(null);
    setCropFile(null);
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
        setTimeout(() => {
          onRefresh();
          setSuccess(null);
        }, 1000);
      } else {
        setError(result.message || 'Failed to delete photo');
      }
    } catch (err) {
      console.error('Photo delete error:', err);
      setError('An error occurred while deleting the photo');
    } finally {
      setDeleting(null);
    }
  };

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
          const isUploadingToThisSlot = uploadingToSlot === slotNumber;
          const approved = isPhotoApproved(slotNumber);
          const isLoadingCropForSlot = cropTargetSlot === slotNumber && cropLoading;
          const isUploadingCropForSlot = cropTargetSlot === slotNumber && cropUploading;

          return (
            <div key={slotNumber} className="flex flex-col gap-1">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200 hover:border-red-500 transition-colors relative group">
                {photoUrl ? (
                  <>
                    <Image
                      src={photoUrl}
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
                      disabled={isDeleting || isProcessing}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-opacity duration-200 disabled:opacity-50 shadow-lg z-10"
                      title="Delete photo"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <X className="h-5 w-5" />
                      )}
                    </button>
                    {/* Approval status badge */}
                    {approved ? (
                      <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center gap-0.5 pointer-events-none">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Approved</span>
                      </div>
                    ) : (
                      <div className="absolute bottom-1 left-1 bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded-full pointer-events-none">
                        Pending
                      </div>
                    )}
                  </>
                ) : isUploadingToThisSlot ? (
                  // Show loading indicator in the target slot during upload
                  <div className="w-full h-full flex flex-col items-center justify-center bg-blue-50 border-2 border-blue-300">
                    <Loader2 className="h-10 w-10 text-blue-600 mb-2 animate-spin" />
                    <span className="text-xs text-blue-700 font-medium">Uploading...</span>
                  </div>
                ) : (
                  <button
                    onClick={handlePlaceholderClick}
                    disabled={isProcessing || !canUpload}
                    className="w-full h-full flex flex-col items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed disabled:hover:text-gray-400 disabled:hover:bg-gray-100"
                    title={canUpload ? 'Click to upload photo' : 'All photo slots are full'}
                  >
                    <Upload className="h-8 w-8 mb-2" />
                    <span className="text-xs">Slot {slotNumber}</span>
                    {canUpload && !isProcessing && (
                      <span className="text-xs mt-1 text-red-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to upload
                      </span>
                    )}
                  </button>
                )}
              </div>

              {/* Crop button — only for existing unapproved photos */}
              {photoUrl && !approved && (
                <button
                  onClick={() => handleCropButtonClick(slotNumber, photoUrl)}
                  disabled={isProcessing || isDeleting}
                  className="w-full flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Crop this photo"
                >
                  {isLoadingCropForSlot ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : isUploadingCropForSlot ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Crop className="h-3 w-3" />
                      <span>Crop</span>
                    </>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between text-sm mb-4 pb-4 border-b border-gray-200">
        <span className="text-gray-600">Upload Status</span>
        {(() => {
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
          disabled={isProcessing || !canUpload}
          className="hidden"
        />
        <label
          htmlFor="photo-upload"
          className={`block w-full text-center px-4 py-3 rounded-lg font-medium transition-colors duration-200 cursor-pointer ${
            canUpload && !isProcessing
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
        <p>• Click any empty slot or the upload button to add a photo</p>
        <p>• Use the <strong>Crop</strong> button below a pending photo to crop and replace it</p>
        {myPhotos.photo_all_status === 'yes' && (
          <p className="text-yellow-600 font-medium">• Delete a photo to upload a new one</p>
        )}
      </div>

      {/* Crop Modal */}
      {showCropModal && cropFile && (
        <ImageCropModal
          imageFile={cropFile}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
};

export default MyPhotosManagement;
