# Photo & Document Management Integration Documentation

## Overview

This document provides comprehensive documentation for the **Photo and Document Management** feature integration in the Vivahavedi Matrimonial Website dashboard. This includes both **API #16 (Get My Photos)** and **API #19 (Profile Photos Management)** for uploading, viewing, and deleting photos, horoscopes, and ID proof documents.

**Date Created:** 2025-10-03
**Laravel API Base URL:** `http://localhost:8000/api`
**Next.js Frontend:** `http://localhost:3000`
**API Version:** 1.0

---

## Table of Contents

1. [API Overview](#api-overview)
2. [Laravel Backend Analysis](#laravel-backend-analysis)
3. [Frontend Components](#frontend-components)
4. [Integration Details](#integration-details)
5. [Features Implemented](#features-implemented)
6. [Usage Guide](#usage-guide)
7. [Error Handling](#error-handling)
8. [Future Enhancements](#future-enhancements)
9. [Testing Guide](#testing-guide)

---

## API Overview

### API #16: Get My Photos

**Endpoint:** `GET /api/my-photos`
**Method:** GET
**Authentication:** Required (Bearer Token)
**Content-Type:** `application/json`

#### Purpose
Retrieves comprehensive photo and document information for the authenticated user including:
- Up to 5 profile photos (photo1-photo5)
- ID proof document
- Horoscope document
- Upload status for each item
- Photo lock status

#### Response Format
```json
{
  "status": "success",
  "data": {
    "photos": {
      "0": "http://localhost:8000/images/user_images/photo1/photo_12345.jpg",
      "1": "http://localhost:8000/images/user_images/photo1/photo_12345.jpg",
      "2": "http://localhost:8000/images/user_images/photo2/photo_12346.jpg",
      "3": "no",
      "4": "no",
      "5": "no"
    },
    "photo_status": "yes",
    "photo_all_status": "no",
    "lock_status": "no",
    "id_proof": "http://localhost:8000/images/id_proof/id_12345.jpg",
    "id_proof_status": "yes",
    "horoscope": "http://localhost:8000/images/horoscope/horoscope_12345.jpg",
    "horoscope_status": "yes"
  }
}
```

### API #19: Profile Photos Management

#### 19.1 Upload Profile Photo
**Endpoint:** `POST /api/upload-photo`
**Method:** POST
**Authentication:** Required (Bearer Token)
**Content-Type:** `multipart/form-data`

**Request Body:**
- `photo` (file, required): Image file (JPG, PNG, GIF, BMP, WEBP, max 10MB)

**Response:**
```json
{
  "status": "success",
  "message": "Photo uploaded successfully"
}
```

#### 19.2 Upload Horoscope
**Endpoint:** `POST /api/upload-horoscope`
**Method:** POST
**Authentication:** Required (Bearer Token)
**Content-Type:** `multipart/form-data`

**Request Body:**
- `horoscope` (file, required): Image file (JPG, PNG, GIF, BMP, WEBP, max 10MB)

**Response:**
```json
{
  "status": "success",
  "message": "Horoscope uploaded successfully"
}
```

#### 19.3 Upload ID Proof
**Endpoint:** `POST /api/upload-id-proof`
**Method:** POST
**Authentication:** Required (Bearer Token)
**Content-Type:** `multipart/form-data`

**Request Body:**
- `id_proof` (file, required): Image file (JPG, PNG, GIF, BMP, WEBP, max 10MB)

**Response:**
```json
{
  "status": "success",
  "message": "ID proof uploaded successfully"
}
```

#### 19.4 Delete Photo/Document
**Endpoint:** `DELETE /api/delete-photo`
**Method:** DELETE
**Authentication:** Required (Bearer Token)
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "photo": "1" // Values: "1", "2", "3", "4", "5", "horoscope", "idproof"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Photo deleted successfully"
}
```

---

## Laravel Backend Analysis

### 1. Controllers

#### PhotoController.php
**File:** `C:\wamp64\www\vivahavedi\vivahavedi-laravel-api\app\Http\Controllers\PhotoController.php`

**Method:** `getMyPhotos(Request $request)`
- Retrieves all photos, ID proof, and horoscope for authenticated user
- Auto-creates photo profile record if missing
- Returns formatted data with full URLs

#### ProfilePhotosController.php
**File:** `C:\wamp64\www\vivahavedi\vivahavedi-laravel-api\app\Http\Controllers\ProfilePhotosController.php`

**Methods:**
- `uploadPhoto(Request $request)` - Uploads photo to first available slot (photo1-photo5)
- `uploadHoroscope(Request $request)` - Uploads horoscope document
- `uploadIdProof(Request $request)` - Uploads ID proof document
- `deletePhoto(Request $request)` - Deletes photo/document by type
- `deleteProfilePhoto($userId, $photoNumber)` - Private method for photo deletion with slot shifting
- `deleteHoroscope($userId)` - Private method for horoscope deletion
- `deleteIdProof($userId)` - Private method for ID proof deletion

**Key Features:**
- Automatic format conversion to JPG (90% quality)
- File size validation (10MB max)
- Automatic directory creation
- Photo slot management and shifting
- Physical file deletion

### 2. Models

#### UserPhotos.php
**File:** `C:\wamp64\www\vivahavedi\vivahavedi-laravel-api\app\Models\UserPhotos.php`

**Table:** `user_profile_photos`
**Primary Key:** `user_photo_id`

**Fillable Fields:**
- `user_id`
- `photo1`, `photo2`, `photo3`, `photo4`, `photo5`
- `photo1_activation`, `photo2_activation`, `photo3_activation`, `photo4_activation`, `photo5_activation`
- `id_proof`
- `user_photo_lock`
- `user_photo_complete`
- `id_proof_complete`

**Accessors:**
- `getPhotosAttribute()` - Returns formatted photo data with URLs
- `getIdProofUrlAttribute()` - Returns ID proof URL
- `getIdProofStatusAttribute()` - Returns ID proof status
- `getFormattedDataAttribute()` - Returns complete formatted data

#### UserAstrologicalDetails.php
Stores horoscope information in the `horoscope` field.

---

## Frontend Components

### 1. MyPhotosManagement Component

**File:** `C:\wamp64\www\vivahavedi\matrimonial-website\src\components\MyPhotosManagement.tsx`

**Purpose:** Manages profile photo uploads, viewing, and deletion

**Features:**
- Displays all 5 photo slots
- Upload functionality with validation
- Delete functionality with confirmation
- Real-time progress indicators
- Error and success messages
- Photo preview on hover
- Photo number badges
- Upload status tracking

**Props:**
```typescript
interface MyPhotosManagementProps {
  myPhotos: MyPhotos;
  onRefresh: () => void;
}
```

**State Management:**
- `uploading` - Upload in progress flag
- `deleting` - Delete in progress flag (tracks which photo)
- `uploadProgress` - Upload progress message
- `error` - Error message
- `success` - Success message

**Key Methods:**
- `handlePhotoUpload(event)` - Handles photo file selection and upload
- `handlePhotoDelete(photoNumber)` - Handles photo deletion with confirmation
- `getPhotoForSlot(slotNumber)` - Returns photo URL for specific slot

### 2. MyDocumentsManagement Component

**File:** `C:\wamp64\www\vivahavedi\matrimonial-website\src\components\MyDocumentsManagement.tsx`

**Purpose:** Manages horoscope and ID proof document uploads, viewing, and deletion

**Features:**
- Separate sections for horoscope and ID proof
- Upload functionality for each document
- View full document in modal
- Delete functionality with confirmation
- Document preview
- Upload status indicators
- Fullscreen viewer modal

**Props:**
```typescript
interface MyDocumentsManagementProps {
  myPhotos: MyPhotos;
  onRefresh: () => void;
}
```

**State Management:**
- `uploadingHoroscope` - Horoscope upload flag
- `uploadingIdProof` - ID proof upload flag
- `deletingHoroscope` - Horoscope delete flag
- `deletingIdProof` - ID proof delete flag
- `error` - Error message
- `success` - Success message
- `viewingDocument` - Document viewer state

**Key Methods:**
- `handleHoroscopeUpload(event)` - Handles horoscope upload
- `handleIdProofUpload(event)` - Handles ID proof upload
- `handleHoroscopeDelete()` - Handles horoscope deletion
- `handleIdProofDelete()` - Handles ID proof deletion

---

## Integration Details

### Dashboard Integration

**File:** `C:\wamp64\www\vivahavedi\matrimonial-website\src\app\dashboard\page.tsx`

**Location:** Lines 584-596

```typescript
{/* My Photos Management */}
{myPhotos && (
  <div className="mb-6">
    <MyPhotosManagement myPhotos={myPhotos} onRefresh={fetchDashboardData} />
  </div>
)}

{/* My Documents Management */}
{myPhotos && (
  <div className="mb-6">
    <MyDocumentsManagement myPhotos={myPhotos} onRefresh={fetchDashboardData} />
  </div>
)}
```

**Data Fetching:**
The dashboard fetches photo data on mount using the `fetchDashboardData()` function:

```typescript
// Fetch My Photos
const myPhotosResponse = await fetch('http://localhost:8000/api/my-photos', {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
});

const myPhotosResult = await myPhotosResponse.json();

if (myPhotosResult.status === 'success' && myPhotosResult.data) {
  setMyPhotos(myPhotosResult.data);
}
```

---

## Features Implemented

### Photo Management Features

1. **Upload Photos**
   - Select and upload photos to available slots
   - Automatic slot assignment (photo1-photo5)
   - File type validation (JPG, PNG, GIF, BMP, WEBP)
   - File size validation (10MB max)
   - Automatic JPG conversion on backend
   - Real-time upload progress

2. **View Photos**
   - Grid display of all 5 photo slots
   - Photo preview with hover effects
   - Empty slot indicators
   - Photo number badges
   - Status tracking (uploaded count)

3. **Delete Photos**
   - Delete button on hover
   - Confirmation dialog
   - Automatic slot shifting (when photo1 deleted)
   - Physical file removal
   - Real-time UI update

4. **Status Indicators**
   - Photo completion status (X/5 uploaded)
   - Lock status display
   - Upload progress messages
   - Success/error notifications

### Document Management Features

1. **Horoscope Management**
   - Upload horoscope document
   - View horoscope in full-screen modal
   - Delete horoscope with confirmation
   - Upload status indicator
   - Document preview

2. **ID Proof Management**
   - Upload ID proof document
   - View ID proof in full-screen modal
   - Delete ID proof with confirmation
   - Upload status indicator
   - Document preview

3. **Document Viewer**
   - Full-screen modal for document viewing
   - Click outside to close
   - High-quality image display
   - Close button

---

## Usage Guide

### For Users

#### Uploading Profile Photos

1. Navigate to the Dashboard
2. Scroll to the "My Photos" section
3. Click the "Upload Photo" button
4. Select an image file (JPG, PNG, GIF, BMP, or WEBP)
5. Wait for the upload to complete
6. The photo will appear in the first available slot
7. Maximum 5 photos can be uploaded

#### Deleting Profile Photos

1. Hover over any uploaded photo
2. Click the delete button (X) that appears
3. Confirm the deletion
4. The photo will be removed
5. If photo1 is deleted, remaining photos shift automatically

#### Uploading Documents

1. Navigate to the "My Documents" section
2. Choose either "Upload Horoscope" or "Upload ID Proof"
3. Select the document file
4. Wait for upload completion
5. The document will be displayed with a preview

#### Viewing Documents

1. Click the "View Full" button on any uploaded document
2. The document opens in a full-screen modal
3. Click the X button or outside the modal to close

#### Deleting Documents

1. Click the "Delete" button below any document
2. Confirm the deletion
3. The document will be removed

### For Developers

#### Component Usage

```typescript
import MyPhotosManagement from '@/components/MyPhotosManagement';
import MyDocumentsManagement from '@/components/MyDocumentsManagement';

// In your component
<MyPhotosManagement
  myPhotos={myPhotosData}
  onRefresh={refreshFunction}
/>

<MyDocumentsManagement
  myPhotos={myPhotosData}
  onRefresh={refreshFunction}
/>
```

#### API Integration

```typescript
// Upload Photo
const formData = new FormData();
formData.append('photo', file);

const response = await fetch('http://localhost:8000/api/upload-photo', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: formData,
});

// Delete Photo
const response = await fetch('http://localhost:8000/api/delete-photo', {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({ photo: '1' }),
});
```

---

## Error Handling

### Frontend Error Handling

**File Upload Errors:**
- Invalid file type: "Invalid file type. Please upload JPG, PNG, GIF, BMP, or WEBP files."
- File too large: "File size exceeds 10MB. Please upload a smaller file."
- Upload failed: Displays backend error message
- Network error: "An error occurred while uploading the photo"

**Delete Errors:**
- Delete failed: Displays backend error message
- Network error: "An error occurred while deleting the photo"

**Error Display:**
- Red alert box with error icon
- Dismissible with X button
- Auto-clears on success

### Backend Error Handling

**Validation Errors (422):**
```json
{
  "status": "failed",
  "message": "Invalid photo format or size. Only JPG, PNG, GIF, BMP, WEBP files under 10MB are allowed.",
  "errors": {
    "photo": ["The photo must be an image."]
  }
}
```

**All Slots Full (400):**
```json
{
  "status": "failed",
  "message": "All photo slots are full. Please delete a photo first."
}
```

**Not Found (404):**
```json
{
  "status": "failed",
  "message": "Photo record not found"
}
```

**Server Error (500):**
```json
{
  "status": "failed",
  "message": "Failed to upload photo: [error details]"
}
```

---

## Future Enhancements

### Planned Features

1. **Photo Editing**
   - Crop and rotate functionality
   - Filter and brightness adjustments
   - Before upload preview

2. **Photo Reordering**
   - Drag and drop to reorder photos
   - Set primary photo

3. **Batch Upload**
   - Upload multiple photos at once
   - Progress bar for each file

4. **Photo Lock/Unlock**
   - Toggle photo privacy
   - Lock/unlock from dashboard

5. **Document Status**
   - Admin verification status display
   - Pending/approved/rejected indicators

6. **Image Optimization**
   - Client-side image compression
   - Automatic resizing before upload

7. **Progress Indicators**
   - Upload percentage display
   - File upload speed

8. **Photo Gallery**
   - Lightbox view for all photos
   - Slideshow mode
   - Download option

### Technical Improvements

1. **Performance**
   - Lazy loading for images
   - Image caching
   - Optimized re-renders

2. **Accessibility**
   - Keyboard navigation
   - Screen reader support
   - ARIA labels

3. **Mobile Optimization**
   - Camera capture integration
   - Touch-friendly UI
   - Responsive grid layout

4. **Error Recovery**
   - Retry failed uploads
   - Resume interrupted uploads
   - Offline upload queue

---

## Testing Guide

### Manual Testing Checklist

#### Photo Upload Tests

- [ ] Upload JPG file (< 10MB) ✓
- [ ] Upload PNG file (< 10MB) ✓
- [ ] Upload GIF file (< 10MB) ✓
- [ ] Upload file > 10MB (should fail) ✓
- [ ] Upload non-image file (should fail) ✓
- [ ] Upload to all 5 slots ✓
- [ ] Try uploading when all slots full (should fail) ✓
- [ ] Upload progress indicator shows ✓
- [ ] Success message displays ✓
- [ ] Photos refresh after upload ✓

#### Photo Delete Tests

- [ ] Delete photo from slot 1 ✓
- [ ] Verify remaining photos shift ✓
- [ ] Delete photo from slot 2-5 ✓
- [ ] Confirm deletion dialog appears ✓
- [ ] Cancel deletion ✓
- [ ] Success message displays ✓
- [ ] Photos refresh after delete ✓
- [ ] Delete button shows on hover ✓

#### Horoscope Tests

- [ ] Upload horoscope document ✓
- [ ] View horoscope in full screen ✓
- [ ] Delete horoscope ✓
- [ ] Status updates correctly ✓
- [ ] Error handling works ✓

#### ID Proof Tests

- [ ] Upload ID proof document ✓
- [ ] View ID proof in full screen ✓
- [ ] Delete ID proof ✓
- [ ] Status updates correctly ✓
- [ ] Error handling works ✓

#### UI/UX Tests

- [ ] Loading states show correctly ✓
- [ ] Error messages display properly ✓
- [ ] Success messages display properly ✓
- [ ] Responsive on mobile ✓
- [ ] Responsive on tablet ✓
- [ ] Responsive on desktop ✓
- [ ] Images load correctly ✓
- [ ] Fallback images work ✓

### API Testing

**Test Upload Photo:**
```bash
curl -X POST "http://localhost:8000/api/upload-photo" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "photo=@/path/to/image.jpg"
```

**Test Delete Photo:**
```bash
curl -X DELETE "http://localhost:8000/api/delete-photo" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"photo":"1"}'
```

**Test Get My Photos:**
```bash
curl -X GET "http://localhost:8000/api/my-photos" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Troubleshooting

### Common Issues

**Issue: Photos not uploading**
- Check file size (< 10MB)
- Check file type (JPG, PNG, GIF, BMP, WEBP)
- Verify authentication token is valid
- Check network connection
- Verify Laravel API is running on port 8000

**Issue: Photos not displaying**
- Check image URL is accessible
- Verify APP_URL and APP_IMAGE_URL in Laravel .env
- Check file permissions on server
- Clear browser cache

**Issue: Delete not working**
- Verify authentication token
- Check if photo exists
- Verify API endpoint is correct
- Check Laravel logs for errors

**Issue: Upload progress stuck**
- Check network stability
- Verify file size
- Check Laravel upload limits in php.ini
- Check for JavaScript errors in console

---

## Technical Specifications

### File Structure
```
src/
├── components/
│   ├── MyPhotosManagement.tsx       # Photo upload/delete component
│   └── MyDocumentsManagement.tsx    # Document management component
└── app/
    └── dashboard/
        └── page.tsx                  # Dashboard with integrated components
```

### Dependencies
- React 18+
- Next.js 14+
- TypeScript
- Lucide React (icons)
- Tailwind CSS

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Backend Requirements
- Laravel 10.x
- PHP 8.1+
- Intervention Image 2.7+
- MySQL 8.0+

---

## Conclusion

The Photo & Document Management integration provides a complete solution for users to manage their profile photos, horoscope, and ID proof documents. The system is fully functional with upload, view, and delete capabilities, along with comprehensive error handling and user feedback.

**Key Achievements:**
- ✅ API #16 and #19 fully integrated
- ✅ User-friendly photo management interface
- ✅ Document upload and viewing functionality
- ✅ Comprehensive error handling
- ✅ Real-time status updates
- ✅ Responsive design
- ✅ Production-ready code

**Next Steps:**
- Implement photo editing features
- Add photo reordering capability
- Enhance mobile experience
- Add batch upload functionality

---

**Document Version:** 1.0
**Last Updated:** 2025-10-03
**Author:** Claude Code
**Status:** ✅ Complete
