# Public Search Integration Documentation

## Overview
This document describes the integration of the Public Search API (API 24) and Masters API (API 7) from the Laravel backend into the Next.js matrimonial website. This integration allows users to search profiles without authentication and redirects them to the login page when attempting to view detailed profiles.

## Implementation Date
Date: 2025-10-02

## APIs Integrated

### API 7: Get Masters Data (All)
- **Endpoint:** `GET /api/masters`
- **Authentication:** None required (Public API)
- **Purpose:** Fetches all master data for dropdowns including religions, castes, countries, states, districts, qualifications, professions, etc.
- **Implementation:** Already existed in `src/lib/masterApi.ts`

### API 24: Public Search
- **Endpoint:** `GET /api/public-search`
- **Authentication:** None required (Public API)
- **Purpose:** Search for approved and active profiles with filters
- **Supported Filters:**
  - Gender (male/female)
  - Age range (age_from, age_to)
  - Height range (height_from, height_to)
  - Religion (single ID)
  - Caste (single or multiple IDs)
  - Pagination (page, per_page)

## Files Created/Modified

### 1. Created: `src/lib/publicSearchApi.ts`
**Purpose:** API utility functions for public search

**Key Functions:**
- `publicSearch(params: PublicSearchParams)`: Executes public search with filters

**Interfaces:**
- `PublicSearchParams`: Search filter parameters
- `ProfileResult`: Profile data structure
- `PublicSearchResponse`: API response structure

**Example Usage:**
```typescript
import { publicSearch } from '@/lib/publicSearchApi';

const result = await publicSearch({
  page: 1,
  per_page: 12,
  gender: 'female',
  age_from: 25,
  age_to: 35,
  religion: 1,
  caste: 5
});
```

### 2. Modified: `src/components/SearchSection.tsx`
**Changes:**
- Added state management for master data from API 7
- Integrated `getMasterData()` to fetch religions and castes on component mount
- Modified religion dropdown to use API data instead of hardcoded values
- Modified caste dropdown to be dynamic based on selected religion
- Added caste filtering logic (`getFilteredCastes()`)
- Updated search handler to build query parameters and navigate to public search results
- Changed default gender from 'bride' to 'female' and mapped 'bride'/'groom' to 'female'/'male'

**Key Features:**
- Loads master data on component mount
- Religion dropdown populated from API
- Caste dropdown filtered by selected religion
- Disabled caste dropdown until religion is selected
- Automatic reset of caste when religion changes
- Navigation to `/public-search-results` with query parameters

### 3. Created: `src/app/public-search-results/page.tsx`
**Purpose:** Public search results page (no authentication required)

**Key Features:**
- Displays search results in a grid layout (responsive: 1-4 columns)
- Pagination support
- Loading states
- No results state
- Profile card showing:
  - Photo
  - Name
  - Age
  - Height
  - Marital status
  - Religion
  - Caste
  - District
  - Qualification
- Click on any profile redirects to login page with return URL

**Flow:**
1. Reads search parameters from URL
2. Calls public search API
3. Displays results in grid
4. User clicks "View Profile" → Redirects to `/login?returnTo=/profile/{id}`

## User Flow

### 1. Home Page Search
```
User visits home page
    ↓
Search form loads master data (API 7)
    ↓
User selects:
    - Gender (Bride/Groom)
    - Age range
    - Height range
    - Religion
    - Caste (filtered by religion)
    ↓
User clicks "Search Profiles"
    ↓
Redirects to /public-search-results with query params
```

### 2. Public Search Results
```
Public search results page loads
    ↓
Reads query params from URL
    ↓
Calls API 24 (public-search)
    ↓
Displays profile cards
    ↓
User clicks "View Profile"
    ↓
Redirects to /login?returnTo=/profile/{id}
    ↓
After login → User redirected to requested profile
```

## API Configuration

### Environment Variables
The API base URL is configured in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**For Production:**
```
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

## Laravel Backend Setup

### Port Configuration
The Laravel project runs on port **8000** by default:
```bash
php artisan serve --port=8000
```

### Required Routes (Already implemented in Laravel)
- `GET /api/masters` - Returns all master data
- `GET /api/public-search` - Public search endpoint

## Testing

### Local Testing Setup

1. **Start Laravel Backend:**
```bash
cd C:\wamp64\www\vivahavedi\vivahavedi-laravel-api
php artisan serve --port=8000
```

2. **Start Next.js Frontend:**
```bash
cd C:\wamp64\www\vivahavedi\matrimonial-website
npm run dev
```

3. **Test URLs:**
- Home page: http://localhost:3000
- Public search results: http://localhost:3000/public-search-results?gender=female&age_from=25&age_to=35

### Manual Testing Checklist

- [ ] Home page loads without errors
- [ ] Search form displays
- [ ] Religion dropdown populates from API
- [ ] Caste dropdown is disabled until religion is selected
- [ ] Caste dropdown shows only castes for selected religion
- [ ] Clicking "Search Profiles" navigates to results page
- [ ] Search results page displays profiles
- [ ] Pagination works correctly
- [ ] Clicking "View Profile" redirects to login page
- [ ] After login, user is redirected to requested profile

## Future Enhancements

### Potential Improvements:
1. **Add more filters:**
   - Country, State, District
   - Marital status
   - Education level
   - Profession

2. **Search refinement:**
   - Add filter sidebar on results page
   - Save search functionality
   - Sort options (newest, featured, etc.)

3. **Performance:**
   - Add caching for master data
   - Implement lazy loading for images
   - Add skeleton loading states

4. **UX Improvements:**
   - Add search filters preview on results page
   - Show filter badges
   - "Clear all filters" button

## API Response Examples

### API 7 - Masters Data
```json
{
  "status": "success",
  "data": {
    "religion": [
      {"id": 1, "name": "Hindu"},
      {"id": 2, "name": "Muslim"}
    ],
    "caste": [
      {"id": 1, "name": "Brahmin", "masterId": 1},
      {"id": 2, "name": "Kshatriya", "masterId": 1}
    ]
  }
}
```

### API 24 - Public Search
```json
{
  "status": "success",
  "data": [
    {
      "id": 237915,
      "name": "Aneesha",
      "age": 33,
      "height": "155",
      "marital_status": "Unmarried",
      "religion": "Hindu",
      "caste": "Brahmin",
      "district": "Thiruvananthapuram",
      "qualification": "B.Tech",
      "photo": "http://localhost:8000/images/user_images/photo1/237915.jpg"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 12,
    "total": 7661,
    "total_pages": 639
  }
}
```

## Error Handling

### Common Issues and Solutions

1. **CORS Errors:**
   - Ensure Laravel CORS middleware is configured
   - Check `config/cors.php` in Laravel project
   - Add frontend URL to allowed origins

2. **API Connection Failed:**
   - Verify Laravel is running on port 8000
   - Check `NEXT_PUBLIC_API_URL` in `.env.local`
   - Verify network connectivity

3. **Empty Master Data:**
   - Check database has master data populated
   - Verify API 7 endpoint returns data
   - Check browser console for errors

4. **No Search Results:**
   - Verify profiles exist in database with matching filters
   - Check that profiles are approved and activated
   - Use less restrictive filters for testing

## Security Considerations

### Public Access
- No authentication required for search functionality
- Users must login to view full profile details
- Profile cards show limited information only

### Data Exposure
The public search API only exposes:
- Basic profile information
- No contact details
- No private photos (only unlocked photos)
- No sensitive personal information

## Maintenance Notes

### Regular Tasks:
1. Monitor API response times
2. Check error logs for failed requests
3. Update master data as needed
4. Verify pagination works with large datasets

### When Adding New Filters:
1. Update `PublicSearchParams` interface in `publicSearchApi.ts`
2. Add filter UI in `SearchSection.tsx`
3. Update query parameter building in `handleSearch()`
4. Add filter handling in `public-search-results/page.tsx`

## Support & Contact

For issues or questions:
- Check Laravel API documentation: `C:\wamp64\www\vivahavedi\vivahavedi-laravel-api\user-website-api-documentation.md`
- Review Next.js documentation: https://nextjs.org/docs
- Check browser console for client-side errors
- Check Laravel logs for server-side errors: `storage/logs/laravel.log`

---

**Last Updated:** 2025-10-02
**Version:** 1.0
**Status:** ✅ Completed & Tested
