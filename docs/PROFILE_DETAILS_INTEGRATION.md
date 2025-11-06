# Profile Details Page - API Integration Documentation

## Overview
This document describes the integration of API 22 (Profile Details) and API 51 (Send Profile Request) in the matrimonial website's profile details page located at `/profile/[id]`.

**Last Updated:** October 2025
**API Backend Port:** 8000
**Frontend Location:** `src/app/profile/[id]/page.tsx`

---

## API Endpoints

### 1. API 22: Profile Details
**Endpoint:** `POST /api/profile-details`
**Documentation:** `c:\wamp64\www\vivahavedi\vivahavedi-laravel-api\user-website-api-documentation.md` (Line 3028)

**Purpose:** Retrieves comprehensive profile information for a specific user

**Request:**
```json
{
  "match_id": 123
}
```

**Response Structure:**
```json
{
  "status": "success",
  "data": {
    "basic": { /* User basic info */ },
    "detailed": { /* Extended profile details */ },
    "photo": {
      "photo": ["url1", "url2"],
      "photo_status": "visible" | "locked"
    },
    "astro": { /* Astrological details */ },
    "partner": { /* Partner preferences */ },
    "match": {
      "score": 72,
      "age": "yes",
      "height": "yes",
      /* ... other compatibility flags */
    },
    "communicaton": {
      "interest": "yes" | "no",
      "shortlist": "yes" | "no",
      "block": "yes" | "no",
      "report": "yes" | "no"
    },
    "request": {
      "photo_add": false,
      "photo_view": true,
      "basic": false,
      "education": false,
      "family": false,
      "hobbies": false,
      "astro": false,
      "horoscope": false,
      "partner_basic": false,
      "partner_religion": false,
      "partner_location": false,
      "partner_education": false
    }
  }
}
```

---

### 2. API 51: Send Profile Request
**Endpoint:** `POST /api/profile-request/send`
**Documentation:** `c:\wamp64\www\vivahavedi\vivahavedi-laravel-api\user-website-api-documentation-part2.md` (Line 2854)

**Purpose:** Send a request to access locked/incomplete profile sections

**Request:**
```json
{
  "match_id": 237915,
  "type": "photo_lock" | "contact_details" | "general"
}
```

**Request Types:**
- `photo_lock` - Request access to locked photos
- `contact_details` - Request contact information
- `general` - Request access to complete profile

**Response:**
```json
{
  "status": "success",
  "message": "profile requested"
}
```

**Error Messages:**
- `same_gender` - Cannot request from same gender profile
- `already_requested` - Request already sent
- `User not found` - Profile doesn't exist

---

## Frontend Implementation

### Key Features Implemented

#### 1. Profile Data Display
All API response fields are now properly displayed:
- ✅ Basic Information (name, age, gender, location)
- ✅ Detailed Profile (height, weight, marital status, body type, etc.)
- ✅ Photo Gallery (with locked photo handling)
- ✅ Astrological Details (nakshatra, manglik, birth details)
- ✅ Partner Preferences (age range, height, religion, caste, location, education, profession)
- ✅ Compatibility Score (percentage + individual attribute matching)
- ✅ Communication Status (interest, shortlist, block, report tracking)
- ✅ Request Status Tracking (what has been requested)

#### 2. Profile Request Functionality
Three types of profile requests are now supported:

**Request Photo Access**
- Shown when: `photo.photo_status === 'locked'` AND `!request.photo_view`
- Button Color: Purple (`bg-purple-500`)
- Icon: ImageIcon
- Request Type: `photo_lock`

**Request Contact Details**
- Always available in request section
- Button Color: Indigo (`bg-indigo-500`)
- Icon: Phone
- Request Type: `contact_details`

**Request Complete Profile**
- For requesting incomplete profile sections
- Button Color: Teal (`bg-teal-500`)
- Icon: User
- Request Type: `general`

#### 3. Request Section UI Logic
The "Request Profile Access" section is conditionally shown when:
```typescript
request && (photo.photo_status === 'locked' || !request.photo_view)
```

This ensures the section only appears when:
1. Request data is available from API, AND
2. Either photos are locked OR photo view has not been requested yet

---

## TypeScript Interfaces

### ProfileData Interface
```typescript
interface ProfileData {
  basic: {
    user_id: number;
    user_fname: string;
    user_lname: string;
    user_gender: string;
    age: number;
    user_mobile?: string;
    user_email?: string;
    rel_name?: string;
    caste_name?: string;
    con_name?: string;
    state_name?: string;
    dist_name?: string;
    lpo_name?: string;
  };
  detailed: {
    up_height?: string;
    up_weight?: string;
    up_marital_status?: string;
    up_body_type?: string;
    up_complexion?: string;
    up_physical_status?: string;
    up_mother_tongue?: string;
    up_qualification?: string;
    up_profession?: string;
    up_annual_income?: string;
    up_about_myself?: string;
  };
  photo: {
    photo: string[];
    photo_status: string;
  };
  astro?: {
    nak_name?: string;
    manglik?: string;
    place_of_birth?: string;
    time_of_birth?: string;
    horoscope?: string;
  };
  partner?: {
    upp_age_f?: number;
    upp_age_t?: number;
    upp_height_f?: number;
    upp_height_t?: number;
    religion?: string[];
    caste?: string[];
    state?: string[];
    district?: string[];
    qualification?: string[];
    profession?: string[];
  };
  match?: {
    score: number;
    age: string;
    height: string;
    marital_status: string;
    body_type: string;
    complexion: string;
    physical_status: string;
    relegion: string;
    caste: string;
    nakshathra: string;
    country: string;
    state: string;
    district: string;
    qualification: string;
    profession: string;
  };
  communicaton?: {
    interest: string;
    shortlist: string;
    block: string;
    report: string;
  };
  request?: {
    photo_add: boolean;
    photo_view: boolean;
    basic: boolean;
    education: boolean;
    family: boolean;
    hobbies: boolean;
    astro: boolean;
    horoscope: boolean;
    partner_basic: boolean;
    partner_religion: boolean;
    partner_location: boolean;
    partner_education: boolean;
  };
}
```

---

## Key Functions

### fetchProfileDetails()
Fetches profile data from API 22 and updates state.

**Implementation:**
```typescript
const fetchProfileDetails = async () => {
  try {
    setLoading(true);
    setError(null);

    const response = await fetch('http://localhost:8000/api/profile-details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ match_id: parseInt(profileId) }),
    });

    const result = await response.json();

    if (result.status === 'success') {
      setProfileData(result.data);
      setIsInterestSent(result.data.communicaton?.interest === 'yes');
      setIsShortlisted(result.data.communicaton?.shortlist === 'yes');
    } else {
      setError(result.message || 'Failed to load profile');
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    setError('An error occurred while loading the profile');
  } finally {
    setLoading(false);
  }
};
```

### handleSendProfileRequest()
Sends profile request using API 51.

**Implementation:**
```typescript
const handleSendProfileRequest = async (
  requestType: 'photo_lock' | 'contact_details' | 'general'
) => {
  if (actionLoading === `request_${requestType}`) return;

  try {
    setActionLoading(`request_${requestType}`);
    const response = await fetch('http://localhost:8000/api/profile-request/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        match_id: parseInt(profileId),
        type: requestType
      }),
    });

    const result = await response.json();

    if (result.status === 'success') {
      alert('Profile request sent successfully!');
      fetchProfileDetails(); // Refresh to update request status
    } else if (result.message === 'same_gender') {
      alert('Cannot send request to same gender profile.');
    } else if (result.message === 'already_requested') {
      alert('You have already sent a request for this.');
    } else {
      alert(result.message || 'Failed to send profile request');
    }
  } catch (error) {
    console.error('Error sending profile request:', error);
    alert('An error occurred while sending profile request');
  } finally {
    setActionLoading(null);
  }
};
```

---

## UI Components

### Action Buttons
Located in left sidebar:
1. **Send Interest** - Red button with Heart icon
2. **Shortlist/Shortlisted** - Yellow/White button with Bookmark icon
3. **View Contact** - Blue button with Phone icon
4. **Send Message** - Green button with MessageCircle icon
5. **Block** - White bordered button with Ban icon
6. **Report** - White bordered button with Flag icon

### Request Profile Access Section
Conditionally rendered card with three request buttons:
1. **Request Photo Access** (purple)
2. **Request Contact Details** (indigo)
3. **Request Complete Profile** (teal)

### Compatibility Score Display
- Circular progress indicator showing match percentage
- Individual compatibility flags for 14 attributes
- Green checkmark for matches, red X for non-matches

---

## Future Enhancements

### Potential Improvements:
1. **Granular Profile Requests**
   - Add individual section requests (education, family, hobbies, etc.)
   - Show request status for each section
   - Disable already-requested sections

2. **Request History**
   - Display when request was sent
   - Show pending/accepted/rejected status
   - Add ability to cancel pending requests

3. **Photo Gallery Enhancements**
   - Lightbox/modal for full-size photo viewing
   - Swipe gestures for mobile
   - Photo count indicator

4. **Real-time Updates**
   - WebSocket integration for live request status updates
   - Push notifications when requests are accepted
   - Live chat status indicators

5. **Enhanced Error Handling**
   - Toast notifications instead of alerts
   - Retry mechanism for failed API calls
   - Better offline mode handling

6. **Accessibility**
   - ARIA labels for all interactive elements
   - Keyboard navigation support
   - Screen reader compatibility

---

## Testing Checklist

### Manual Testing:
- [ ] Profile loads correctly for valid match_id
- [ ] Error handling for invalid/non-existent profiles
- [ ] Photo gallery navigation works
- [ ] Compatibility score displays correctly
- [ ] Send Interest button works and updates state
- [ ] Shortlist toggle works
- [ ] View Contact fetches contact details
- [ ] Chat modal opens correctly
- [ ] Request Photo Access button appears when photos are locked
- [ ] Request Contact Details works
- [ ] Request Complete Profile works
- [ ] Already-requested state is handled properly
- [ ] Same-gender validation works
- [ ] Loading states show properly
- [ ] Responsive design works on mobile/tablet
- [ ] All API error messages are handled gracefully

### API Integration Testing:
```bash
# Test Profile Details API
curl -X POST "http://localhost:8000/api/profile-details" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"match_id": 123}'

# Test Profile Request API
curl -X POST "http://localhost:8000/api/profile-request/send" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"match_id": 123, "type": "photo_lock"}'
```

---

## Troubleshooting

### Common Issues:

**Problem:** Photos not loading
- Check if `photo.photo` array has valid URLs
- Verify image paths are accessible
- Check CORS settings if images are from different domain

**Problem:** Request buttons not appearing
- Verify `request` object exists in API response
- Check conditional logic: `request && (photo.photo_status === 'locked' || !request.photo_view)`
- Ensure backend is returning the `request` field

**Problem:** Already requested error immediately
- Backend may not be tracking requests properly
- Check database for existing request records
- Verify match_id is correct

**Problem:** Same gender error
- Backend validation is working correctly
- Ensure user gender data is accurate
- This is expected behavior per business rules

---

## Code Locations

**Frontend:**
- Main file: `src/app/profile/[id]/page.tsx`
- Chat component: `src/components/ChatModal.tsx`
- Auth guard: `src/components/auth/AuthGuard.tsx`

**Backend:**
- Profile Details Controller: `c:\wamp64\www\vivahavedi\vivahavedi-laravel-api\app\Http\Controllers\ProfileDetailsController.php`
- Profile Request Controller: `c:\wamp64\www\vivahavedi\vivahavedi-laravel-api\app\Http\Controllers\ProfileRequestController.php`
- Routes: `c:\wamp64\www\vivahavedi\vivahavedi-laravel-api\routes\api.php`

**Documentation:**
- API 22: `user-website-api-documentation.md` (Line 3028)
- API 51: `user-website-api-documentation-part2.md` (Line 2854)

---

## Dependencies

**Frontend Packages:**
- `next`: React framework
- `lucide-react`: Icon library
- TypeScript for type safety

**API Requirements:**
- Laravel Sanctum for authentication
- Bearer token in Authorization header
- JSON request/response format

---

## Change Log

### October 2025 - Initial Integration
- Added `request` field to ProfileData interface
- Implemented `handleSendProfileRequest()` function
- Added Profile Request Access UI section
- Integrated API 51 for all three request types
- Added loading states for request actions
- Implemented error handling for all request scenarios
- Added auto-refresh after successful request

---

## Notes for Developers

1. **Do not modify Laravel backend** as per project requirements
2. All changes should be made to frontend only
3. API contracts are defined in backend documentation
4. Test all changes with actual API endpoints at `http://localhost:8000`
5. Maintain TypeScript type safety for all API responses
6. Use existing auth context for Bearer token
7. Follow existing code style and patterns
8. Keep UI consistent with rest of application

---

## Contact & Support

For questions or issues:
1. Check API documentation in Laravel project
2. Review this integration document
3. Test with curl commands to isolate frontend/backend issues
4. Check browser console for detailed error messages

---

**End of Documentation**
