# Profile Update APIs Integration Documentation

## Overview

This document provides comprehensive documentation for the Profile Update APIs (APIs 28-32) integration in the Vivahavedi Matrimonial Website. These APIs allow users to update their hobbies/lifestyle preferences and partner preferences.

**Date Created:** 2025-10-02
**Laravel API Base URL:** `http://localhost:8000/api`
**Next.js Frontend:** `http://localhost:3000`

---

## Table of Contents

1. [APIs Overview](#apis-overview)
2. [Pages Created](#pages-created)
3. [Dashboard Integration](#dashboard-integration)
4. [API Endpoints Details](#api-endpoints-details)
5. [Data Transformation Rules](#data-transformation-rules)
6. [Masters API Integration](#masters-api-integration)
7. [Future Enhancements](#future-enhancements)
8. [Troubleshooting](#troubleshooting)

---

## APIs Overview

### Summary of Implemented APIs

| API # | Endpoint | Method | Purpose | Status |
|-------|----------|--------|---------|--------|
| 28 | `/api/profile-updation/hobbies` | POST | Update user's hobbies and lifestyle | ✅ Implemented |
| 29 | `/api/profile-updation/partner-basic` | POST | Update partner's basic preferences | ✅ Implemented |
| 30 | `/api/profile-updation/partner-religion` | POST | Update partner's religion preferences | ✅ Implemented |
| 31 | `/api/profile-updation/partner-location` | POST | Update partner's location preferences | ✅ Implemented |
| 32 | `/api/profile-updation/partner-education` | POST | Update partner's education preferences | ✅ Implemented |

---

## Pages Created

### 1. Hobbies & Lifestyle Update Page
**Location:** `src/app/dashboard/profile/hobbies/page.tsx`
**Route:** `/dashboard/profile/hobbies`
**API Endpoint:** `POST /api/profile-updation/hobbies`

#### Features:
- Multi-select checkboxes for hobbies, music, reading, and cuisine preferences
- Dropdown selects for diet, drinking, and smoking habits
- Pre-populated data from user profile
- Real-time form validation
- Success/error message display
- Automatic redirect to dashboard on successful update

#### Form Fields:
- `up_hobbies` (array) - Selected hobbies
- `up_music` (array) - Music preferences
- `up_reads` (array) - Reading preferences
- `up_cuisine` (array) - Cuisine preferences
- `up_diet` (string) - Diet preference
- `up_drink` (string) - Drinking habits
- `up_smoke` (string) - Smoking habits

---

### 2. Partner Basic Profile Update Page
**Location:** `src/app/dashboard/profile/partner-basic/page.tsx`
**Route:** `/dashboard/profile/partner-basic`
**API Endpoint:** `POST /api/profile-updation/partner-basic`

#### Features:
- Age range selector (from-to)
- Height range selector (feet and inches)
- Multi-select for marital status, body type, complexion
- Multi-select for physical status, mother tongue, residence status
- Integrates with Masters API for dynamic options
- Pre-populated from partner profile data

#### Form Fields:
- `upp_age_from` (string) - Minimum partner age
- `upp_age_to` (string) - Maximum partner age
- `upp_height_from` (string) - Minimum partner height
- `upp_height_to` (string) - Maximum partner height
- `upp_m_status` (array) - Marital status preferences
- `upp_body_type` (array) - Body type preferences
- `upp_complexion` (array) - Complexion preferences
- `upp_physical_status` (array) - Physical status preferences
- `upp_mother_tongue` (array) - Mother tongue preferences
- `upp_res_status` (array) - Residence status preferences

---

### 3. Partner Religion Profile Update Page
**Location:** `src/app/dashboard/profile/partner-religion/page.tsx`
**Route:** `/dashboard/profile/partner-religion`
**API Endpoint:** `POST /api/profile-updation/partner-religion`

#### Features:
- Multi-select for religions (with scrollable container)
- Multi-select for castes (with scrollable container)
- Multi-select for sub-castes (with scrollable container)
- Multi-select for nakshatras (with scrollable container)
- Fetches options from Masters API
- Stores selections as numeric IDs

#### Form Fields:
- `upp_relegion` (array of IDs) - Religion preferences
- `upp_caste` (array of IDs) - Caste preferences
- `upp_sub_caste` (array of IDs) - Sub-caste preferences
- `upp_nakshatra` (array of IDs) - Nakshatra preferences

---

### 4. Partner Location Profile Update Page
**Location:** `src/app/dashboard/profile/partner-location/page.tsx`
**Route:** `/dashboard/profile/partner-location`
**API Endpoint:** `POST /api/profile-updation/partner-location`

#### Features:
- Multi-select for countries (with scrollable container)
- Multi-select for states (with scrollable container)
- Multi-select for districts (with scrollable container)
- Selection counter for each category
- Fetches location data from Masters API
- Stores selections as numeric IDs

#### Form Fields:
- `upp_country` (array of IDs) - Country preferences
- `upp_state` (array of IDs) - State preferences
- `upp_district` (array of IDs) - District preferences

---

### 5. Partner Education Profile Update Page
**Location:** `src/app/dashboard/profile/partner-education/page.tsx`
**Route:** `/dashboard/profile/partner-education`
**API Endpoint:** `POST /api/profile-updation/partner-education`

#### Features:
- Multi-select for qualification levels
- Multi-select for qualifications (with scrollable container)
- Multi-select for specializations (with scrollable container)
- Multi-select for professions (with scrollable container)
- Selection counter for each category
- Fetches education data from Masters API

#### Form Fields:
- `upp_qualification_level` (array of IDs) - Qualification level preferences
- `upp_qualification` (array of IDs) - Qualification preferences
- `upp_spetialization` (array of IDs) - Specialization preferences (note: typo in field name maintained for API compatibility)
- `upp_profession` (array of IDs) - Profession preferences

---

## Dashboard Integration

### Location
**File:** `src/app/dashboard/page.tsx`

### Changes Made

#### 1. Added Hobbies Link in Profile Completion Section
**Lines:** 544-560

```tsx
<button
  onClick={() => router.push('/dashboard/profile/hobbies')}
  className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors duration-200"
>
  <div className="flex items-center">
    <Heart className="h-5 w-5 text-gray-600 mr-3" />
    <span className="font-medium text-gray-900">Hobbies & Lifestyle</span>
  </div>
  <div className="flex items-center space-x-2">
    {myDetails.profile_completion.hobbies === '1' ? (
      <span className="text-green-600 font-semibold">✓</span>
    ) : (
      <span className="text-red-600 font-semibold">!</span>
    )}
    <span className="text-red-600 text-sm">→</span>
  </div>
</button>
```

#### 2. Added Partner Profile Preferences Section
**Lines:** 583-633

A new card component containing 4 navigation buttons:
- Partner Basic Preferences
- Partner Religion & Caste
- Partner Location Preferences
- Partner Education & Career

This section is positioned below the Profile Completion card and above the Quick Actions card.

---

## API Endpoints Details

### API 28: Update Hobbies Profile

**Endpoint:** `POST /api/profile-updation/hobbies`
**Authentication:** Required (Bearer Token)
**Content-Type:** `application/json`

#### Request Body Example:
```json
{
  "up_hobbies": ["Reading", "Swimming", "Cooking"],
  "up_music": ["Classical", "Jazz", "Pop"],
  "up_reads": ["Novels", "Newspapers", "Technical Books"],
  "up_cuisine": ["Indian", "Chinese", "Continental"],
  "up_diet": "Vegetarian",
  "up_drink": "No",
  "up_smoke": "No"
}
```

#### Success Response (200):
```json
{
  "status": "success",
  "message": "Hobbies profile updated successfully"
}
```

#### Laravel Controller:
**File:** `app/Http/Controllers/ProfileUpdationController.php`
**Method:** `updateHobbiesProfile()`
**Lines:** 17-88

#### Database Fields (user_profile_details table):
- `up_hobbies` - Comma-separated string
- `up_music` - Comma-separated string
- `up_reads` - Comma-separated string
- `up_cuisine` - Comma-separated string
- `up_diet` - String (max 50 chars)
- `up_drink` - String (max 50 chars)
- `up_smoke` - String (max 50 chars)
- `up_hobbies_complete` - Set to '1' after update

---

### API 29: Update Partner Basic Profile

**Endpoint:** `POST /api/profile-updation/partner-basic`
**Authentication:** Required (Bearer Token)
**Content-Type:** `application/json`

#### Request Body Example:
```json
{
  "upp_age_from": "25",
  "upp_age_to": "35",
  "upp_height_from": "5.2",
  "upp_height_to": "6.0",
  "upp_m_status": ["Never Married", "Divorced"],
  "upp_body_type": ["Slim", "Average"],
  "upp_complexion": ["Fair", "Wheatish"],
  "upp_physical_status": ["Normal"],
  "upp_mother_tongue": ["English", "Hindi"],
  "upp_res_status": ["Citizen", "Permanent Resident"]
}
```

#### Success Response (200):
```json
{
  "status": "success",
  "message": "Partner basic profile updated successfully"
}
```

#### Laravel Controller:
**File:** `app/Http/Controllers/ProfileUpdationController.php`
**Method:** `updatePartnerBasicProfile()`
**Lines:** 93-176

#### Database Fields (user_partner_profile_details table):
- `upp_age_from` - String
- `upp_age_to` - String
- `upp_height_from` - String
- `upp_height_to` - String
- `upp_m_status` - Comma-separated string
- `upp_body_type` - Comma-separated string
- `upp_complexion` - Comma-separated string
- `upp_physical_status` - Comma-separated string
- `upp_mother_tongue` - Comma-separated string
- `upp_res_status` - Comma-separated string
- `upp_complete` - Set to 'yes' after update

---

### API 30: Update Partner Religion Profile

**Endpoint:** `POST /api/profile-updation/partner-religion`
**Authentication:** Required (Bearer Token)
**Content-Type:** `application/json`

#### Request Body Example:
```json
{
  "upp_relegion": [1, 2, 3],
  "upp_caste": [10, 20, 30],
  "upp_sub_caste": [100, 200],
  "upp_nakshatra": [5, 10, 15]
}
```

#### Success Response (200):
```json
{
  "status": "success",
  "message": "Partner religion profile updated successfully"
}
```

#### Laravel Controller:
**File:** `app/Http/Controllers/ProfileUpdationController.php`
**Method:** `updatePartnerReligionProfile()`
**Lines:** 181-240

#### Database Fields (user_partner_profile_details table):
- `upp_relegion` - Pipe-separated IDs (e.g., "1|2|3")
- `upp_caste` - Pipe-separated IDs
- `upp_sub_caste` - Pipe-separated IDs
- `upp_nakshatra` - Pipe-separated IDs
- `upp_religion_complete` - Set to '1' after update

---

### API 31: Update Partner Location Profile

**Endpoint:** `POST /api/profile-updation/partner-location`
**Authentication:** Required (Bearer Token)
**Content-Type:** `application/json`

#### Request Body Example:
```json
{
  "upp_country": [57, 278, 275],
  "upp_state": [24, 1, 35],
  "upp_district": [1113, 2, 2210]
}
```

#### Success Response (200):
```json
{
  "status": "success",
  "message": "Partner location profile updated successfully"
}
```

#### Laravel Controller:
**File:** `app/Http/Controllers/ProfileUpdationController.php`
**Method:** `updatePartnerLocationProfile()`
**Lines:** 245-300

#### Database Fields (user_partner_profile_details table):
- `upp_country` - Pipe-separated IDs
- `upp_state` - Pipe-separated IDs
- `upp_district` - Pipe-separated IDs
- `upp_location_complete` - Set to '1' after update

---

### API 32: Update Partner Education Profile

**Endpoint:** `POST /api/profile-updation/partner-education`
**Authentication:** Required (Bearer Token)
**Content-Type:** `application/json`

#### Request Body Example:
```json
{
  "upp_qualification_level": [1, 2, 3],
  "upp_qualification": [10, 20, 30],
  "upp_spetialization": [100, 200],
  "upp_profession": [5, 10, 15]
}
```

#### Success Response (200):
```json
{
  "status": "success",
  "message": "Partner education profile updated successfully"
}
```

#### Laravel Controller:
**File:** `app/Http/Controllers/ProfileUpdationController.php`
**Method:** `updatePartnerEducationProfile()`
**Lines:** 305-364

#### Database Fields (user_partner_profile_details table):
- `upp_qualification_level` - Pipe-separated IDs
- `upp_qualification` - Pipe-separated IDs
- `upp_spetialization` - Pipe-separated IDs (note: typo in field name)
- `upp_profession` - Pipe-separated IDs
- `upp_qualification_complete` - Set to '1' after update

---

## Data Transformation Rules

### Array to String Conversion

The Laravel APIs use different delimiters for different types of data:

#### Comma-Separated Strings
**Used for:** Hobbies API (API 28) and Partner Basic API (API 29)

**Frontend (Array):**
```javascript
["Reading", "Swimming", "Cooking"]
```

**Laravel Processing:**
```php
implode(',', $request->input('up_hobbies'))
```

**Database Storage:**
```
"Reading,Swimming,Cooking"
```

**Frontend Retrieval:**
```javascript
// From my-details API response
const hobbies = detailed.up_hobbies.split(',').map(h => h.trim());
```

---

#### Pipe-Separated IDs
**Used for:** Partner Religion (API 30), Partner Location (API 31), Partner Education (API 32)

**Frontend (Array of IDs):**
```javascript
[1, 2, 3, 10, 20]
```

**Laravel Processing:**
```php
implode('|', $request->input('upp_relegion'))
```

**Database Storage:**
```
"1|2|3|10|20"
```

**Frontend Retrieval:**
```javascript
// From partner-profile API response
const religions = partner.upp_relegion.split('|').map(id => parseInt(id.trim()));
```

---

## Masters API Integration

### Endpoint
`GET /api/masters`
**Authentication:** Not Required
**Content-Type:** `application/json`

### Response Structure
```json
{
  "status": "success",
  "data": {
    "religion": [
      { "id": 1, "name": "Hindu" },
      { "id": 2, "name": "Muslim" }
    ],
    "caste": [
      { "id": 1, "name": "Brahmin" },
      { "id": 2, "name": "Kshatriya" }
    ],
    "sub_caste": [...],
    "nakshatra": [...],
    "country": [...],
    "state": [...],
    "district": [...],
    "body_type": [
      { "id": 1, "name": "Slim" },
      { "id": 2, "name": "Average" }
    ],
    "complexion": [...],
    "mother_tongue": [...],
    "physical_status": [...],
    "marital_status": [...],
    "qualification_level": [...],
    "qualification": [...],
    "specialization": [...],
    "profession": [...]
  }
}
```

### Usage in Pages

All partner profile pages fetch masters data on component mount:

```typescript
useEffect(() => {
  if (token) {
    fetchData();
  }
}, [token]);

const fetchData = async () => {
  // Fetch master data
  const mastersResponse = await fetch('http://localhost:8000/api/masters', {
    headers: {
      'Accept': 'application/json',
    },
  });
  const mastersResult = await mastersResponse.json();
  if (mastersResult.status === 'success') {
    setMasters(mastersResult.data);
  }

  // Fetch current profile data
  // ...
};
```

---

## Future Enhancements

### Recommended Improvements

1. **Form Validation**
   - Add client-side validation for age ranges (from < to)
   - Add height range validation
   - Add minimum selection requirements

2. **User Experience**
   - Add search/filter functionality for long lists (e.g., districts, qualifications)
   - Implement "Select All" / "Deselect All" buttons
   - Add keyboard shortcuts for navigation
   - Implement unsaved changes warning

3. **Performance Optimization**
   - Implement virtualization for long lists (React Window or React Virtual)
   - Cache masters data in localStorage
   - Debounce form submissions
   - Add loading skeletons

4. **Accessibility**
   - Add ARIA labels for screen readers
   - Implement keyboard navigation
   - Add focus management
   - Ensure proper color contrast

5. **Mobile Responsiveness**
   - Optimize checkbox layouts for mobile
   - Add mobile-specific UI patterns
   - Implement touch-friendly controls
   - Test on various screen sizes

6. **Data Management**
   - Add draft save functionality
   - Implement auto-save feature
   - Add profile update history
   - Show "last updated" timestamps

7. **Analytics Integration**
   - Track profile completion rates
   - Monitor form abandonment
   - Analyze popular preferences
   - Track user engagement

8. **Integration Enhancements**
   - Add profile completion percentage tracking
   - Integrate with matching algorithm
   - Add profile preview before save
   - Implement progressive disclosure

---

## Troubleshooting

### Common Issues and Solutions

#### 1. "Failed to load profile data" Error

**Possible Causes:**
- Invalid or expired authentication token
- Laravel API server not running
- CORS issues

**Solutions:**
```bash
# Check if Laravel server is running
cd C:\wamp64\www\vivahavedi\vivahavedi-laravel-api
php artisan serve --port=8000

# Clear browser cache and try again
# Verify token in browser DevTools > Application > Local Storage
```

---

#### 2. Masters Data Not Loading

**Possible Causes:**
- Masters API endpoint unreachable
- Database connection issues
- Empty master tables

**Solutions:**
```bash
# Test masters API directly
curl http://localhost:8000/api/masters

# Check database tables
php artisan tinker
>>> DB::table('religion')->count();
>>> DB::table('country')->count();
```

---

#### 3. Form Submission Fails with 422 Error

**Possible Causes:**
- Invalid data format
- Missing required fields
- Validation errors

**Solutions:**
- Check browser console for error details
- Verify request payload matches API documentation
- Ensure arrays are being sent (not comma-separated strings)

**Example Debug:**
```javascript
console.log('Submitting data:', JSON.stringify(formData, null, 2));
```

---

#### 4. Data Not Saving to Database

**Possible Causes:**
- Laravel validation errors
- Database permissions
- Incorrect field names

**Solutions:**
```bash
# Check Laravel logs
tail -f storage/logs/laravel.log

# Test API with Postman/cURL
curl -X POST http://localhost:8000/api/profile-updation/hobbies \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"up_hobbies":["Reading","Swimming"]}'
```

---

#### 5. Profile Completion Status Not Updating

**Possible Causes:**
- Completion tracking not implemented
- Database field not updating
- Dashboard not refreshing data

**Solutions:**
- Verify completion fields in database (e.g., `up_hobbies_complete`)
- Check my-details API response includes completion data
- Force refresh dashboard data after update

---

### Debug Mode

To enable detailed debugging:

**Frontend (Next.js):**
```typescript
// Add to page component
useEffect(() => {
  console.log('Form Data:', formData);
  console.log('Masters Data:', masters);
}, [formData, masters]);
```

**Backend (Laravel):**
```php
// Add to controller method
\Log::info('Profile Update Request', [
    'user_id' => Auth::id(),
    'data' => $request->all()
]);
```

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-10-02 | Initial implementation of APIs 28-32 | Claude |

---

## Contact and Support

For questions or issues:

1. **Documentation Issues:** Update this file directly
2. **API Issues:** Check `vivahavedi-laravel-api/user-website-api-documentation-part2.md`
3. **Bug Reports:** Create detailed issue with reproduction steps
4. **Feature Requests:** Document requirements before implementation

---

## Additional Resources

### Related Files

**Frontend:**
- `src/app/dashboard/page.tsx` - Dashboard with navigation
- `src/app/dashboard/profile/hobbies/page.tsx` - Hobbies update page
- `src/app/dashboard/profile/partner-basic/page.tsx` - Partner basic preferences
- `src/app/dashboard/profile/partner-religion/page.tsx` - Partner religion preferences
- `src/app/dashboard/profile/partner-location/page.tsx` - Partner location preferences
- `src/app/dashboard/profile/partner-education/page.tsx` - Partner education preferences

**Backend:**
- `vivahavedi-laravel-api/app/Http/Controllers/ProfileUpdationController.php` - Main controller
- `vivahavedi-laravel-api/app/Models/UserProfileDetails.php` - User profile model
- `vivahavedi-laravel-api/app/Models/UserPartnerProfileDetails.php` - Partner profile model
- `vivahavedi-laravel-api/routes/api.php` - API routes (lines 128-133)

**Documentation:**
- `vivahavedi-laravel-api/user-website-api-documentation-part2.md` - Full API specs (lines 1200-1475)

---

## Testing Checklist

Before deployment, verify:

- [ ] All pages load without errors
- [ ] Authentication is properly checked
- [ ] Masters API data loads correctly
- [ ] Form submissions work for all 5 pages
- [ ] Data persists in database
- [ ] Profile completion tracking updates
- [ ] Dashboard navigation works
- [ ] Success/error messages display correctly
- [ ] Mobile responsiveness is acceptable
- [ ] Browser back button works correctly
- [ ] Form resets properly on cancel
- [ ] Multi-select checkboxes work correctly
- [ ] Data retrieval populates forms correctly
- [ ] Array to string conversion works both ways

---

**End of Documentation**
