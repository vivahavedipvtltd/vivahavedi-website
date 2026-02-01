'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropModalProps {
  imageFile: File;
  onCropComplete: (croppedImageBlob: Blob) => void;
  onCancel: () => void;
}

export default function ImageCropModal({
  imageFile,
  onCropComplete,
  onCancel,
}: ImageCropModalProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 75,
    height: 100,
    x: 12.5,
    y: 0,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Load image when component mounts
  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  // Called when image is loaded
  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;

    // Calculate crop to maintain 3:4 aspect ratio (width:height)
    const aspectRatio = 3 / 4;
    let cropWidth = width;
    let cropHeight = width / aspectRatio;

    // If calculated height exceeds image height, recalculate based on height
    if (cropHeight > height) {
      cropHeight = height;
      cropWidth = height * aspectRatio;
    }

    // Center the crop
    const x = (width - cropWidth) / 2;
    const y = (height - cropHeight) / 2;

    const crop: Crop = {
      unit: 'px',
      width: cropWidth,
      height: cropHeight,
      x,
      y,
    };

    setCrop(crop);
    setCompletedCrop(crop as PixelCrop);
  }, []);

  // Generate cropped image blob
  const getCroppedImg = useCallback(
    async (image: HTMLImageElement, crop: PixelCrop): Promise<Blob> => {
      const canvas = document.createElement('canvas');
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = crop.width * scaleX;
      canvas.height = crop.height * scaleY;

      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('No 2d context');
      }

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );

      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas is empty'));
              return;
            }
            resolve(blob);
          },
          'image/jpeg',
          0.9
        );
      });
    },
    []
  );

  const handleCropConfirm = async () => {
    if (!imgRef.current || !completedCrop) {
      return;
    }

    try {
      setIsProcessing(true);
      const croppedImageBlob = await getCroppedImg(imgRef.current, completedCrop);
      onCropComplete(croppedImageBlob);
    } catch (error) {
      console.error('Error cropping image:', error);
      alert('Failed to crop image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-6xl w-full my-4 flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-800">
            Crop Your Photo
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
            disabled={isProcessing}
          >
            ×
          </button>
        </div>

        {/* Image Crop Area - Scrollable if needed */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-50">
          <div className="flex justify-center items-center w-full h-full">
            {imageSrc && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={3 / 4}
                locked={false}
                className="max-w-full max-h-full"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="Crop preview"
                  onLoad={onImageLoad}
                  style={{
                    maxWidth: '100%',
                    maxHeight: 'calc(95vh - 140px)',
                    width: 'auto',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </ReactCrop>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 flex-shrink-0 bg-white">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleCropConfirm}
            disabled={isProcessing || !completedCrop}
            className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Crop & Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}
