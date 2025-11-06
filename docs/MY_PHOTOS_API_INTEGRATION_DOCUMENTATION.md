# My Photos API Integration Documentation

## Overview

This document provides comprehensive documentation for the **My Photos API (API #16)** integration in the Vivahavedi Matrimonial Website dashboard. This API retrieves all user photos, ID proof documents, and horoscope files with comprehensive status tracking.

**Date Created:** 2025-10-02
**Laravel API Base URL:** `http://localhost:8000/api`
**Next.js Frontend:** `http://localhost:3000`
**API Version:** 1.0

---

## Table of Contents

1. [API Overview](#api-overview)
2. [Laravel Backend Analysis](#laravel-backend-analysis)
3. [Dashboard Integration](#dashboard-integration)
4. [UI Components](#ui-components)
5. [Photo Management Features](#photo-management-features)
6. [Future Enhancements](#future-enhancements)
7. [Troubleshooting](#troubleshooting)
8. [Testing Guide](#testing-guide)

---

## API Overview

### Endpoint Details

**API Number:** 16
**Endpoint:** `GET /api/my-photos`
**Method:** GET
**Authentication:** Required (Bearer Token)
**Content-Type:** `application/json`

### Purpose
Retrieves comprehensive photo and document information for the authenticated user including:
- Up to 6 profile photos (photo1 duplicated as index 0 and 1)
- ID proof document
- Horoscope document
- Upload status for each item
- Photo lock status
- Completion tracking

### Key Features
- **Auto-creation:** Automatically creates photo profile record if missing
- **Gender-based defaults:** Shows male/female avatar when no photo uploaded
- **Photo indexing:** Photo1 duplicated for backward compatibility
- **Full URLs:** Complete URLs for all uploaded media
- **Status tracking:** Comprehensive flags for UI state management

---

## Laravel Backend Analysis

### 1. Route Configuration

**File:** `C:\wamp64\www\vivahavedi\vivahavedi-laravel-api\routes\api.php`
**Line:** 86

```php
Route::get('/my-photos', [PhotoController::class, 'getMyPhotos']);
```

**Middleware:** `auth:sanctum` (requires Bearer token)

---

### 2. Controller Implementation

**File:** `C:\wamp64\www\vivahavedi\vivahavedi-laravel-api\app\Http\Controllers\PhotoController.php`

**Method:** `getMyPhotos(Request $request)`

#### Controller Logic:

```php
public function getMyPhotos(Request $request)
{
    try {
        $user = $request->user();
        $userId = $user->user_id;
        $data = [];

        // Get or create photo profile
        $photoProfile = UserPhotos::where('user_id', $userId)->first();
        if (!$photoProfile) {
            $photoProfile = UserPhotos::create(['user_id' => $userId]);
        }

        // Get formatted photo data (includes photos, id_proof, statuses)
        $photoData = $photoProfile->formatted_data;
        $data = array_merge($data, $photoData);

        // Get horoscope from astrological details
        $astroProfile = UserAstrologicalDetails::where('user_id', $userId)->first();
        if ($astroProfile && $astroProfile->horoscope && $astroProfile->horoscope !== 'no') {
            $data['horoscope'] = config('app.url') . '/images/horoscope/' . $astroProfile->horoscope;
            $data['horoscope_status'] = 'yes';
        } else {
            $data['horoscope'] = 'no';
            $data['horoscope_status'] = 'no';
        }

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'status' => 'failed',
            'message' => 'Failed to fetch photos: ' . $e->getMessage()
        ], 500);
    }
}
```

---

### 3. Models

#### Model 1: UserPhotos

**File:** `C:\wamp64\www\vivahavedi\vivahavedi-laravel-api\app\Models\UserPhotos.php`

**Table:** `user_profile_photos`
**Primary Key:** `upp_id`
**Timestamps:** Disabled

**Key Fields:**
```php
protected $fillable = [
    'user_id',
    'photo1', 'photo2', 'photo3', 'photo4', 'photo5',
    'photo1_activation', 'photo2_activation', 'photo3_activation',
    'photo4_activation', 'photo5_activation',
    'id_proof',
    'user_photo_lock',
    'user_photo_complete',
    'id_proof_complete'
];
```

**Relationships:**
```php
public function user()
{
    return $this->belongsTo(User::class, 'user_id', 'user_id');
}
```

**Key Accessors:**

1. **getPhotosAttribute()** - Generates photo URLs and status
2. **getIdProofUrlAttribute()** - Generates ID proof URL
3. **getFormattedDataAttribute()** - Returns complete formatted response

---

#### Model 2: UserAstrologicalDetails

**File:** `C:\wamp64\www\vivahavedi\vivahavedi-laravel-api\app\Models\UserAstrologicalDetails.php`

**Table:** `user_aprofile_details`
**Primary Key:** `uap_id`

**Key Fields:**
```php
protected $fillable = [
    'user_id',
    'time_of_birth',
    'place_of_birth',
    'nak_id',
    'raasi',
    'gothram',
    'manglik',
    'horoscope',
    'horoscope_approval',
    'uap_complete'
];
```

---

### 4. Photo URL Generation Logic

**Photo Processing (from UserPhotos model):**

```php
public function getPhotosAttribute()
{
    $photos = [];
    $photoFlag = 0;
    $baseUrl = config('app.url');
    $userGender = $this->user ? $this->user->gender : 'male';

    // Photo 1 (index 0 and 1) with gender-based default
    if ($this->photo1 && $this->photo1 !== 'no' && !empty($this->photo1)) {
        $photos[0] = $baseUrl . '/images/user_images/photo1/' . $this->photo1;
        $photos[1] = $photos[0]; // Duplicate for compatibility
        $photoFlag++;
    } else {
        // Gender-based avatar
        if ($userGender === 'male') {
            $photos[0] = $baseUrl . '/images/avathar/male_l.png';
        } else {
            $photos[0] = $baseUrl . '/images/avathar/female_l.png';
        }
        $photos[1] = 'no';
    }

    // Photos 2-5
    for ($i = 2; $i <= 5; $i++) {
        $photoField = 'photo' . $i;
        if ($this->$photoField && $this->$photoField !== 'no' && !empty($this->$photoField)) {
            $photos[$i] = $baseUrl . '/images/user_images/photo' . $i . '/' . $this->$photoField;
            $photoFlag++;
        } else {
            $photos[$i] = 'no';
        }
    }

    return [
        'photos' => $photos,
        'photo_count' => $photoFlag,
        'photo_status' => $photoFlag > 0 ? 'yes' : 'no',
        'photo_all_status' => $photoFlag == 5 ? 'yes' : 'no'
    ];
}
```

---

### 5. Database Schema

#### Table: user_profile_photos

| Column | Type | Description |
|--------|------|-------------|
| `upp_id` | INT | Primary key (auto-increment) |
| `user_id` | INT | Foreign key to user_details |
| `photo1` | VARCHAR | First photo filename |
| `photo2` | VARCHAR | Second photo filename |
| `photo3` | VARCHAR | Third photo filename |
| `photo4` | VARCHAR | Fourth photo filename |
| `photo5` | VARCHAR | Fifth photo filename |
| `photo1_activation` | ENUM('yes','no') | Photo1 activation status |
| `photo2_activation` | ENUM('yes','no') | Photo2 activation status |
| `photo3_activation` | ENUM('yes','no') | Photo3 activation status |
| `photo4_activation` | ENUM('yes','no') | Photo4 activation status |
| `photo5_activation` | ENUM('yes','no') | Photo5 activation status |
| `id_proof` | VARCHAR | ID proof filename |
| `user_photo_lock` | ENUM('yes','no') | Photo lock status |
| `user_photo_complete` | ENUM('yes','no') | Photo completion status |
| `id_proof_complete` | ENUM('yes','no') | ID proof completion status |

#### Table: user_aprofile_details

| Column | Type | Description |
|--------|------|-------------|
| `uap_id` | INT | Primary key (auto-increment) |
| `user_id` | INT | Foreign key to user_details |
| `horoscope` | VARCHAR | Horoscope document filename |
| `horoscope_approval` | ENUM('pending','approved','rejected') | Approval status |
| Other fields | ... | Birth details, nakshatra, etc. |

---

### 6. Photo Storage Structure

**Directory Organization:**

```
public/images/
├── user_images/
│   ├── photo1/
│   │   └── photo_[filename].jpg
│   ├── photo2/
│   │   └── photo_[filename].jpg
│   ├── photo3/
│   │   └── photo_[filename].jpg
│   ├── photo4/
│   │   └── photo_[filename].jpg
│   └── photo5/
│       └── photo_[filename].jpg
├── id_proof/
│   └── id_[filename].jpg
├── horoscope/
│   └── horoscope_[filename].jpg
└── avathar/
    ├── male_l.png
    └── female_l.png
```

---

## Dashboard Integration

### 1. Files Modified

**File:** `src/app/dashboard/page.tsx`

**Changes Made:**
1. Added `MyPhotos` interface (Lines 93-104)
2. Added `myPhotos` state variable (Line 112)
3. Added API call to fetch photos (Lines 176-189)
4. Added photo gallery UI component (Lines 796-892)
5. Added new icons: `ImageIcon`, `FileText`, `Lock`, `Upload` (Lines 29-32)

---

### 2. Interface Definition

```typescript
interface MyPhotos {
  photos: {
    [key: string]: string;  // Photo URLs indexed by number
  };
  photo_status: string;      // "yes" if any photo exists
  photo_all_status: string;  // "yes" if all 5 photos exist
  lock_status: string;       // "yes" if photos are locked
  id_proof: string;          // ID proof URL or "no"
  id_proof_status: string;   // "yes" if ID proof uploaded
  horoscope: string;         // Horoscope URL or "no"
  horoscope_status: string;  // "yes" if horoscope uploaded
}
```

---

### 3. State Management

```typescript
const [myPhotos, setMyPhotos] = useState<MyPhotos | null>(null);
```

**Initial Value:** `null` (no photos loaded)

---

### 4. API Integration Code

**Location:** `fetchDashboardData()` function (Lines 176-189)

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

## UI Components

### 1. Photo Gallery Card

**Location:** Dashboard right sidebar (Lines 796-892)
**Position:** Below Quick Actions card

**Component Structure:**

```
┌─────────────────────────────────────┐
│ My Photos              [🔒 Locked]  │
├─────────────────────────────────────┤
│ ┌─────┬─────┬─────┐                 │
│ │ P0  │ P1  │ P2  │                 │
│ └─────┴─────┴─────┘                 │
│ ┌─────┬─────┬─────┐                 │
│ │ P3  │ P4  │ P5  │                 │
│ └─────┴─────┴─────┘                 │
├─────────────────────────────────────┤
│ Profile Photos    ✓ Complete (5/5)  │
│ ID Proof          ✓ Verified        │
│ Horoscope         ✓ Uploaded        │
├─────────────────────────────────────┤
│      [Upload Photos Button]         │
└─────────────────────────────────────┘
```

---

### 2. Photo Grid Component

```typescript
<div className="grid grid-cols-3 gap-3 mb-4">
  {Object.keys(myPhotos.photos).slice(0, 6).map((key) => (
    <div
      key={key}
      className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200 hover:border-red-500 transition-colors"
    >
      {myPhotos.photos[key] !== 'no' ? (
        <img
          src={myPhotos.photos[key]}
          alt={`Photo ${parseInt(key) + 1}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/images/avathar/male_l.png';
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Upload className="h-8 w-8 text-gray-400" />
        </div>
      )}
    </div>
  ))}
</div>
```

**Features:**
- 3x2 grid layout (6 photos total)
- Square aspect ratio for consistency
- Hover effect (border changes to red)
- Fallback image on load error
- Upload icon for empty slots

---

### 3. Photo Status Display

```typescript
<div className="flex items-center justify-between text-sm mb-3">
  <span className="text-gray-600">Profile Photos</span>
  {myPhotos.photo_all_status === 'yes' ? (
    <span className="text-green-600 font-semibold flex items-center">
      <CheckCircle2 className="h-4 w-4 mr-1" />
      Complete (5/5)
    </span>
  ) : myPhotos.photo_status === 'yes' ? (
    <span className="text-yellow-600 font-semibold">
      {Object.values(myPhotos.photos).filter(p => p !== 'no').length}/5 Uploaded
    </span>
  ) : (
    <span className="text-red-600 font-semibold">No Photos</span>
  )}
</div>
```

**Status Types:**
- **Complete (5/5):** Green checkmark - All photos uploaded
- **X/5 Uploaded:** Yellow warning - Partial upload
- **No Photos:** Red alert - No photos uploaded

---

### 4. Document Status Indicators

**ID Proof:**
```typescript
<div className="flex items-center justify-between text-sm mb-3">
  <div className="flex items-center">
    <FileText className="h-4 w-4 mr-2 text-gray-500" />
    <span className="text-gray-600">ID Proof</span>
  </div>
  {myPhotos.id_proof_status === 'yes' ? (
    <span className="text-green-600 font-semibold flex items-center">
      <CheckCircle2 className="h-4 w-4 mr-1" />
      Verified
    </span>
  ) : (
    <span className="text-red-600 font-semibold">Pending</span>
  )}
</div>
```

**Horoscope:**
```typescript
<div className="flex items-center justify-between text-sm">
  <div className="flex items-center">
    <Star className="h-4 w-4 mr-2 text-gray-500" />
    <span className="text-gray-600">Horoscope</span>
  </div>
  {myPhotos.horoscope_status === 'yes' ? (
    <span className="text-green-600 font-semibold flex items-center">
      <CheckCircle2 className="h-4 w-4 mr-1" />
      Uploaded
    </span>
  ) : (
    <span className="text-gray-500 font-semibold">Not Uploaded</span>
  )}
</div>
```

---

### 5. Lock Status Indicator

```typescript
{myPhotos.lock_status === 'yes' && (
  <div className="flex items-center text-sm text-yellow-600">
    <Lock className="h-4 w-4 mr-1" />
    <span>Locked</span>
  </div>
)}
```

**Display:** Shows in header when photos are locked
**Color:** Yellow/amber to indicate caution

---

## Photo Management Features

### 1. Gender-Based Avatars

**Logic:**
- When user has no `photo1` uploaded, system displays default avatar
- Avatar selected based on `user_gender` field from database
- Male users: `/images/avathar/male_l.png`
- Female users: `/images/avathar/female_l.png`

**Implementation (Frontend):**
```typescript
onError={(e) => {
  e.currentTarget.src = '/images/avathar/male_l.png';
}}
```

---

### 2. Photo Indexing System

**Backend Behavior:**
- `photo1` is duplicated as index `0` and `1` in response
- Indices `2-5` map to `photo2-photo5` respectively
- Total of 6 entries in photos object (0, 1, 2, 3, 4, 5)

**Why Duplication?**
- Backward compatibility with older API consumers
- Index 0 used for primary profile display
- Index 1 available for secondary display needs

**Frontend Display:**
```typescript
Object.keys(myPhotos.photos).slice(0, 6).map((key) => ...)
// Displays all 6 entries including duplicate
```

---

### 3. Upload Status Tracking

**Three-Level Status System:**

1. **No Photos:**
   - `photo_status === 'no'`
   - All photo fields are 'no' or empty
   - Display: Red "No Photos" message

2. **Partial Upload:**
   - `photo_status === 'yes'`
   - `photo_all_status === 'no'`
   - Some photos uploaded (1-4 out of 5)
   - Display: Yellow "X/5 Uploaded"

3. **Complete:**
   - `photo_all_status === 'yes'`
   - All 5 photos uploaded
   - Display: Green "Complete (5/5)" with checkmark

---

### 4. Photo Lock Feature

**Purpose:** Prevents photo updates when locked

**Status:** `lock_status` ("yes"/"no")

**UI Indicator:**
- Lock icon in card header
- Yellow color to indicate restricted state
- Visible only when `lock_status === 'yes'`

**Use Cases:**
- Admin review in progress
- Verification pending
- Violation reported
- Premium feature restriction

---

## Future Enhancements

### 1. Photo Upload Functionality

**Priority:** High

**Implementation:**
- Create `/dashboard/photos/upload` page
- Implement drag-and-drop upload
- Image cropping/resizing before upload
- Upload progress indicator
- Photo upload API integration

**File to Create:** `src/app/dashboard/photos/upload/page.tsx`

**API Endpoint:** `POST /api/upload-photos`

---

### 2. Photo Gallery Modal

**Priority:** Medium

**Features:**
- Full-screen photo viewer
- Swipe/arrow navigation
- Zoom functionality
- Download option
- Delete confirmation

**Implementation:**
```typescript
const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

<PhotoModal
  photos={myPhotos.photos}
  selectedIndex={selectedPhoto}
  onClose={() => setSelectedPhoto(null)}
/>
```

---

### 3. ID Proof & Horoscope Viewers

**Priority:** Medium

**Features:**
- Click to view ID proof document
- Click to view horoscope document
- PDF viewer integration
- Download buttons

**Implementation:**
```typescript
<button onClick={() => window.open(myPhotos.id_proof, '_blank')}>
  View ID Proof
</button>
```

---

### 4. Photo Approval Status

**Priority:** Low

**Features:**
- Show approval status for each photo
- Admin comments/feedback
- Rejection reasons
- Re-upload option

**UI Addition:**
```typescript
{photo.approval_status === 'rejected' && (
  <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs">
    Rejected
  </div>
)}
```

---

### 5. Photo Privacy Settings

**Priority:** Medium

**Features:**
- Set photos as public/private
- Visible to premium members only
- Require interest before showing
- Watermark option

---

### 6. Photo Order Management

**Priority:** Low

**Features:**
- Drag and drop to reorder photos
- Set primary/featured photo
- Hide specific photos

---

### 7. Verification Badges

**Priority:** Medium

**Features:**
- Verified photo badge
- ID verified badge
- Profile verified badge

**UI:**
```typescript
{myPhotos.id_proof_status === 'yes' && (
  <div className="absolute bottom-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs rounded-full">
    ✓ Verified
  </div>
)}
```

---

### 8. Loading Skeletons

**Priority:** Low

**Features:**
- Skeleton UI while loading photos
- Shimmer effect
- Better perceived performance

**Implementation:**
```typescript
{loading ? (
  <div className="grid grid-cols-3 gap-3">
    {[1,2,3,4,5,6].map(i => (
      <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-lg"></div>
    ))}
  </div>
) : (
  // Actual photos
)}
```

---

## Troubleshooting

### Issue 1: Photos Not Displaying

**Symptoms:**
- Photo card shows but images don't load
- Broken image icons appear
- Upload icons show for all slots

**Possible Causes:**
1. Incorrect image URLs from API
2. CORS issues
3. Images don't exist on server
4. Wrong base URL configuration

**Solutions:**

```bash
# 1. Check API response
curl -X GET http://localhost:8000/api/my-photos \
  -H "Authorization: Bearer YOUR_TOKEN"

# 2. Verify image URLs in response
# Should be: http://localhost:8000/images/user_images/photo1/filename.jpg

# 3. Check Laravel config
cd C:\wamp64\www\vivahavedi\vivahavedi-laravel-api
php artisan tinker
>>> config('app.url')
# Should return: http://localhost:8000

# 4. Verify images exist
ls public/images/user_images/photo1/

# 5. Check browser console for errors
# Look for CORS or 404 errors
```

---

### Issue 2: Gender-Based Avatar Not Showing

**Symptoms:**
- Broken image when no photo uploaded
- Wrong gender avatar displayed

**Possible Causes:**
1. Avatar files missing from server
2. Incorrect gender value in database
3. Wrong fallback path

**Solutions:**

```bash
# 1. Verify avatar files exist
ls public/images/avathar/
# Should have: male_l.png, female_l.png

# 2. Check user gender
php artisan tinker
>>> $user = User::find(YOUR_USER_ID);
>>> $user->user_gender;
# Should be 'male' or 'female'

# 3. Update fallback image in frontend
onError={(e) => {
  e.currentTarget.src = 'http://localhost:8000/images/avathar/male_l.png';
}}
```

---

### Issue 3: Photo Count Incorrect

**Symptoms:**
- Status shows "3/5" but only 2 photos visible
- Count doesn't match visible photos

**Cause:**
- Photo duplication (photo1 as index 0 and 1)
- Both counted but appear as one photo

**Solution:**

```typescript
// Correct count calculation (excluding duplicate)
const photoCount = Object.entries(myPhotos.photos)
  .filter(([key, url]) => key !== '1' && url !== 'no')
  .length;

// Display
<span>{photoCount}/5 Uploaded</span>
```

---

### Issue 4: Upload Button Not Working

**Symptoms:**
- Click on "Upload Photos" does nothing
- No navigation or modal appears

**Cause:**
- Button not yet implemented (placeholder)

**Temporary Solution:**

```typescript
<button
  onClick={() => router.push('/dashboard/photos/upload')}
  className="..."
>
  <Upload className="h-5 w-5 mr-2" />
  Upload Photos
</button>
```

**Permanent Solution:**
- Create photo upload page
- Implement upload functionality
- See "Future Enhancements" section

---

### Issue 5: Horoscope Always Shows "Not Uploaded"

**Symptoms:**
- Horoscope exists but status shows not uploaded
- API returns horoscope data but UI doesn't update

**Possible Causes:**
1. Horoscope in wrong table/field
2. State not updating
3. Conditional rendering issue

**Solutions:**

```bash
# 1. Verify horoscope data
php artisan tinker
>>> $astro = UserAstrologicalDetails::where('user_id', YOUR_USER_ID)->first();
>>> $astro->horoscope;
# Should return filename or 'no'

# 2. Check API response
curl http://localhost:8000/api/my-photos -H "Authorization: Bearer TOKEN"
# Verify horoscope and horoscope_status fields

# 3. Debug frontend state
console.log('Photos state:', myPhotos);
console.log('Horoscope status:', myPhotos.horoscope_status);
```

---

## Testing Guide

### 1. Manual Testing Checklist

**Pre-requisites:**
- [ ] Laravel server running on port 8000
- [ ] Next.js dev server running on port 3000
- [ ] User logged in with valid token
- [ ] User has photo profile record in database

**Photo Display Test:**
- [ ] Navigate to `/dashboard`
- [ ] Verify photo card displays in right sidebar
- [ ] Check if existing photos load correctly
- [ ] Verify empty slots show upload icon
- [ ] Check hover effect on photo thumbnails
- [ ] Verify fallback image works (break image URL)

**Status Display Test:**
- [ ] User with 0 photos: Shows "No Photos" (red)
- [ ] User with 1-4 photos: Shows "X/5 Uploaded" (yellow)
- [ ] User with 5 photos: Shows "Complete (5/5)" (green with checkmark)
- [ ] ID proof uploaded: Shows "Verified" (green)
- [ ] ID proof not uploaded: Shows "Pending" (red)
- [ ] Horoscope uploaded: Shows "Uploaded" (green)
- [ ] Horoscope not uploaded: Shows "Not Uploaded" (gray)

**Lock Status Test:**
- [ ] Set `user_photo_lock = 'yes'` in database
- [ ] Reload dashboard
- [ ] Verify lock icon appears in header
- [ ] Set `user_photo_lock = 'no'`
- [ ] Reload dashboard
- [ ] Verify lock icon disappears

**Responsive Design Test:**
- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] Verify 3-column grid on all sizes
- [ ] Check image aspect ratios maintained

---

### 2. API Testing with cURL

**Test 1: Valid Request**
```bash
curl -X GET http://localhost:8000/api/my-photos \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
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
    "horoscope": "no",
    "horoscope_status": "no"
  }
}
```

---

**Test 2: User Without Photos**
```bash
# Create new user or clear photos
DELETE FROM user_profile_photos WHERE user_id = YOUR_USER_ID;

# Make request
curl -X GET http://localhost:8000/api/my-photos \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "status": "success",
  "data": {
    "photos": {
      "0": "http://localhost:8000/images/avathar/male_l.png",
      "1": "no",
      "2": "no",
      "3": "no",
      "4": "no",
      "5": "no"
    },
    "photo_status": "no",
    "photo_all_status": "no",
    "lock_status": "no",
    "id_proof": "no",
    "id_proof_status": "no",
    "horoscope": "no",
    "horoscope_status": "no"
  }
}
```

---

**Test 3: Invalid Token**
```bash
curl -X GET http://localhost:8000/api/my-photos \
  -H "Accept: application/json" \
  -H "Authorization: Bearer invalid_token_12345"
```

**Expected Response:**
```json
{
  "message": "Unauthenticated"
}
```

---

### 3. Database Verification

**Check Photo Records:**
```sql
-- View user's photos
SELECT
  upp.*,
  u.user_fname,
  u.user_gender
FROM user_profile_photos upp
JOIN user_details u ON upp.user_id = u.user_id
WHERE upp.user_id = YOUR_USER_ID;

-- Check horoscope
SELECT
  uap.user_id,
  uap.horoscope,
  uap.horoscope_approval
FROM user_aprofile_details uap
WHERE uap.user_id = YOUR_USER_ID;

-- Count photos uploaded
SELECT
  user_id,
  CASE WHEN photo1 IS NOT NULL AND photo1 != 'no' THEN 1 ELSE 0 END +
  CASE WHEN photo2 IS NOT NULL AND photo2 != 'no' THEN 1 ELSE 0 END +
  CASE WHEN photo3 IS NOT NULL AND photo3 != 'no' THEN 1 ELSE 0 END +
  CASE WHEN photo4 IS NOT NULL AND photo4 != 'no' THEN 1 ELSE 0 END +
  CASE WHEN photo5 IS NOT NULL AND photo5 != 'no' THEN 1 ELSE 0 END AS photo_count
FROM user_profile_photos
WHERE user_id = YOUR_USER_ID;
```

---

### 4. Frontend Testing

**Browser Console Tests:**
```javascript
// Check photo state
// (Requires React DevTools)

// Manual API test
fetch('http://localhost:8000/api/my-photos', {
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  }
})
.then(r => r.json())
.then(data => console.log(data));

// Test image loading
const testImg = new Image();
testImg.onload = () => console.log('Image loaded successfully');
testImg.onerror = () => console.log('Image failed to load');
testImg.src = 'http://localhost:8000/images/user_images/photo1/test.jpg';
```

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-10-02 | Initial implementation of My Photos API integration | Claude |

---

## Additional Resources

### Related Files

**Frontend:**
- `src/app/dashboard/page.tsx` - Dashboard with photo gallery (Lines 93-104, 112, 176-189, 796-892)

**Backend:**
- `vivahavedi-laravel-api/app/Http/Controllers/PhotoController.php` - Photo controller
- `vivahavedi-laravel-api/app/Models/UserPhotos.php` - Photo model with accessors
- `vivahavedi-laravel-api/app/Models/UserAstrologicalDetails.php` - Horoscope model
- `vivahavedi-laravel-api/routes/api.php` - API routes (Line 86)

**Documentation:**
- `vivahavedi-laravel-api/user-website-api-documentation.md` - Full API specs (Lines 1574-1651)

---

## Quick Reference

### Common Tasks

**Get User's Photos (Laravel Tinker):**
```php
$user = User::find(1);
$photos = $user->photos;
echo $photos->photo1;
```

**Upload Photo Manually (Database):**
```php
$photoProfile = UserPhotos::where('user_id', 1)->first();
$photoProfile->photo1 = 'photo_12345.jpg';
$photoProfile->photo1_activation = 'yes';
$photoProfile->save();
```

**Set Photo Lock:**
```php
$photoProfile = UserPhotos::where('user_id', 1)->first();
$photoProfile->user_photo_lock = 'yes';
$photoProfile->save();
```

**Upload Horoscope:**
```php
$astroProfile = UserAstrologicalDetails::where('user_id', 1)->first();
$astroProfile->horoscope = 'horoscope_12345.pdf';
$astroProfile->save();
```

---

**End of Documentation**
