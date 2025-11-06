# Homepage Profiles API Integration Documentation

## Overview
This document describes the integration of **API 23: Homepage Profiles** from the Laravel backend into the Next.js matrimonial website's Featured Profiles section.

## Integration Date
October 3, 2025

## Backend Details

### Laravel API
- **Endpoint:** `GET /api/homepage-profiles`
- **Base URL:** `http://127.0.0.1:8000/api` (Development)
- **Controller:** `HomepageProfilesController`
- **Location:** `app/Http/Controllers/HomepageProfilesController.php`
- **Model:** `User` (`app/Models/User.php`)
- **Authentication:** None required (Public API)

### Database
- **Table:** `user_details`
- **Key Field:** `user_homepage` (VARCHAR(20) - Unix timestamp)
- **Filter Logic:** Shows profiles where `user_homepage > current_timestamp`

### API Features
- ✅ Public access (no authentication)
- ✅ Pagination support (default: 12, max: 50 per page)
- ✅ Auto-filtering (approved, activated, not suspended/hidden)
- ✅ Photo privacy respected (locked photos show gender avatars)
- ✅ Sorting: Featured first, then newest
- ✅ Eager loading for optimal performance

## Frontend Implementation

### Files Created/Modified

#### 1. API Integration Layer
**File:** `src/lib/homepageProfilesApi.ts`

**Purpose:** Handles all communication with the Laravel backend API

**Key Functions:**
```typescript
// Fetch homepage profiles with pagination
getHomepageProfiles(page: number, perPage: number): Promise<HomepageProfilesResponse>

// Convert height from cm to feet-inches
formatHeight(heightCm: string): string

// Truncate long names
getDisplayName(name: string, maxLength: number): string
```

**Interfaces:**
```typescript
interface HomepageProfile {
  id: number;
  name: string;
  age: number;
  height: string;
  marital_status: string;
  religion: string;
  caste: string;
  district: string;
  qualification: string;
  photo: string;
}

interface ProfilesPagination {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

interface HomepageProfilesResponse {
  status: 'success' | 'failed';
  data: HomepageProfile[];
  pagination: ProfilesPagination;
  message?: string;
}
```

#### 2. Featured Profiles Component
**File:** `src/components/FeaturedProfiles.tsx`

**Changes:**
- ✅ Replaced static mock data with live API integration
- ✅ Added loading state with spinner
- ✅ Added error handling with retry functionality
- ✅ Implemented pagination controls (Previous/Next buttons)
- ✅ Added page information display
- ✅ Configured "View Profile" button to redirect to `/login`
- ✅ Configured "View All Profiles" button to redirect to `/login`
- ✅ Added empty state message
- ✅ Display 8 profiles per page

**Features:**
- **Loading State:** Shows spinner while fetching data
- **Error State:** Shows error message with "Try Again" button
- **Pagination:** Previous/Next buttons with page info
- **Login Redirect:** All profile actions redirect to login page
- **Responsive Grid:** 1 column (mobile), 2 columns (tablet), 4 columns (desktop)
- **Image Fallback:** Shows placeholder on image load error

#### 3. Environment Configuration
**File:** `.env.local`

**Added Variable:**
```bash
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
```

**Usage:** The API integration uses this environment variable to determine the backend URL

## API Request/Response Examples

### Request Example
```bash
GET http://127.0.0.1:8000/api/homepage-profiles?page=1&per_page=8

Headers:
Accept: application/json
Content-Type: application/json
```

### Success Response Example
```json
{
  "status": "success",
  "data": [
    {
      "id": 233727,
      "name": "AISWARIYA",
      "age": 25,
      "height": "160",
      "marital_status": "Unmarried",
      "religion": "Hindu",
      "caste": "Ezhava",
      "district": "Palakkadu",
      "qualification": "B.Tech",
      "photo": "http://127.0.0.1:8000/images/user_images/photo1/233727_1673875113.jpg"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 8,
    "total": 45,
    "total_pages": 6
  }
}
```

### Error Response Example
```json
{
  "status": "failed",
  "message": "Failed to fetch homepage profiles: Database connection error"
}
```

## User Flow

### 1. Page Load
1. User visits homepage
2. FeaturedProfiles component mounts
3. API call made to fetch first page (8 profiles)
4. Loading spinner shown
5. Profiles displayed in grid layout

### 2. Pagination
1. User clicks "Next" or "Previous" button
2. New API call made for requested page
3. Loading spinner shown
4. New profiles displayed
5. Page info updated

### 3. Profile Interaction
1. User clicks "View Profile" button
2. Redirected to `/login` page
3. After login, user can view full profile details

### 4. View All
1. User clicks "View All Profiles" button
2. Redirected to `/login` page
3. After login, user can access advanced search

## Security Considerations

### Public API
- ✅ No authentication required
- ✅ Only shows approved, activated, non-suspended profiles
- ✅ Respects photo privacy settings
- ✅ No sensitive data exposed (email, phone hidden)

### Rate Limiting
- ⚠️ **Recommended:** Implement rate limiting on Laravel backend
- Suggestion: 60 requests per minute per IP

### CORS Configuration
- ✅ Configure Laravel CORS to allow Next.js frontend domain
- Location: `config/cors.php`

## Testing

### Manual Testing Checklist
- [x] Homepage loads and fetches profiles
- [x] Loading state displays correctly
- [x] Profiles display in grid (4 columns desktop)
- [x] Pagination controls work (Previous/Next)
- [x] Page information displays correctly
- [x] "View Profile" redirects to login
- [x] "View All Profiles" redirects to login
- [x] Error state displays when API fails
- [x] "Try Again" button works
- [x] Empty state shows when no profiles
- [x] Image fallback works for broken images
- [x] Height converts from cm to feet-inches
- [x] Responsive design works on mobile/tablet

### API Testing
```bash
# Test with default parameters
curl -X GET "http://127.0.0.1:8000/api/homepage-profiles" \
  -H "Accept: application/json"

# Test with pagination
curl -X GET "http://127.0.0.1:8000/api/homepage-profiles?page=2&per_page=8" \
  -H "Accept: application/json"

# Test with max per_page
curl -X GET "http://127.0.0.1:8000/api/homepage-profiles?page=1&per_page=50" \
  -H "Accept: application/json"
```

## Managing Homepage Profiles (Backend)

### Add Profile to Homepage (30 days)
```sql
UPDATE user_details
SET user_homepage = UNIX_TIMESTAMP(DATE_ADD(NOW(), INTERVAL 30 DAY))
WHERE user_id = 12345;
```

### Add Profile to Homepage (90 days)
```sql
UPDATE user_details
SET user_homepage = UNIX_TIMESTAMP(DATE_ADD(NOW(), INTERVAL 90 DAY))
WHERE user_id = 12345;
```

### Remove Profile from Homepage
```sql
UPDATE user_details
SET user_homepage = UNIX_TIMESTAMP(NOW()) - 1
WHERE user_id = 12345;
```

### Check Homepage Profiles Count
```sql
SELECT COUNT(*)
FROM user_details
WHERE user_homepage > UNIX_TIMESTAMP(NOW())
  AND user_approval = 'yes'
  AND user_activation = 'yes'
  AND user_suspend = 'no'
  AND user_hide = 'no';
```

## Future Enhancements

### Recommended Features
1. **Auto-refresh:** Refresh profiles every 5 minutes
2. **Carousel Mode:** Auto-slide through pages
3. **Filter Options:** Quick filters by religion/location
4. **Profile Preview:** Hover to show more details
5. **Wishlist:** Save favorite profiles (requires auth)
6. **Share Profile:** Social media sharing
7. **Profile Statistics:** View count tracking

### Performance Optimization
1. **Caching:** Cache API responses for 2-5 minutes
2. **Lazy Loading:** Load images on scroll
3. **Prefetching:** Prefetch next page on hover
4. **CDN:** Serve profile images via CDN

## Troubleshooting

### Common Issues

#### 1. CORS Error
**Symptom:** "Access to fetch has been blocked by CORS policy"

**Solution:**
```php
// Laravel: config/cors.php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:3000', 'http://localhost:3002'],
'allowed_methods' => ['GET', 'POST'],
```

#### 2. No Profiles Showing
**Symptom:** "No featured profiles available"

**Check:**
```sql
-- Verify profiles exist with future homepage timestamp
SELECT user_id, user_fname, user_homepage, FROM_UNIXTIME(user_homepage)
FROM user_details
WHERE user_homepage > UNIX_TIMESTAMP(NOW())
LIMIT 10;
```

**Fix:** Add profiles to homepage using SQL above

#### 3. Images Not Loading
**Symptom:** Placeholder images showing

**Check:**
- Verify `APP_IMAGE_URL` in Laravel `.env`
- Check file permissions on `public/images/user_images`
- Verify image files exist at specified path

#### 4. API Connection Failed
**Symptom:** "Unable to load profiles. Please try again later."

**Check:**
- Laravel server running on port 8000
- `NEXT_PUBLIC_API_BASE_URL` correct in `.env.local`
- Network connectivity between Next.js and Laravel

## Configuration Summary

### Laravel (.env)
```bash
APP_URL=http://127.0.0.1:8000
APP_IMAGE_URL=http://127.0.0.1:8000
```

### Next.js (.env.local)
```bash
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
NEXT_PUBLIC_LARAVEL_URL=http://127.0.0.1:8000
```

### Ports
- **Laravel Backend:** 8000
- **Next.js Frontend:** 3002 (current dev server)

## Support & Maintenance

### Monitoring
- Monitor API response times
- Track error rates
- Watch database query performance
- Monitor featured profile counts

### Regular Tasks
- Review and update featured profiles weekly
- Remove expired profiles monthly
- Check API error logs daily
- Verify image URLs are valid

## Related Documentation
- Laravel API Documentation: `user-website-api-documentation.md`
- Public Search Integration: `PUBLIC_SEARCH_INTEGRATION_DOCUMENTATION.md`
- Master API Integration: Check `src/lib/masterApi.ts`

## Version History
- **v1.0** (Oct 3, 2025) - Initial integration with pagination and login redirect

---

**Last Updated:** October 3, 2025
**Maintained By:** Development Team
**Backend Version:** Laravel 10.x
**Frontend Version:** Next.js 15.5.4
