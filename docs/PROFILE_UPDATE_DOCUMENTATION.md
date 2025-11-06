# Profile Update Feature Documentation

## Overview
This document provides comprehensive information about the Profile Update feature implementation in the Vivahavedi Matrimonial Website. The feature allows users to update various sections of their profile through dedicated forms.

**Date Created:** October 1, 2025
**Laravel API Base URL:** `http://localhost:8000/api`
**Next.js Project:** Matrimonial Website

---

## Table of Contents
1. [APIs Used](#apis-used)
2. [Created Pages](#created-pages)
3. [Features](#features)
4. [Master Data Integration](#master-data-integration)
5. [Technical Implementation](#technical-implementation)
6. [Navigation](#navigation)
7. [Future Enhancements](#future-enhancements)
8. [Important Notes](#important-notes)

---

## APIs Used

### API #10: Update Basic Profile
- **Endpoint:** `PUT /api/profile/basic`
- **Authentication:** Bearer Token Required
- **Purpose:** Updates user's basic profile information including physical characteristics and personal preferences

#### Request Parameters:
```json
{
  "profile_created": "Self",
  "height": "5.8",
  "weight": "65",
  "merital_status": "Never Married",
  "childrens": "No",
  "body_type": "Average",
  "complexion": "Fair",
  "mother_tongue": "English",
  "personal_values": "Traditional",
  "physical_status": "Normal"
}
```

---

### API #11: Update Education Profile
- **Endpoint:** `PUT /api/profile/education`
- **Authentication:** Bearer Token Required
- **Purpose:** Updates user's education and career information

#### Request Parameters:
```json
{
  "qualification": 1,
  "spcialization": 1,
  "profession": 1,
  "job_status": "Employed",
  "working_in": "Private",
  "working_at": "Tech Corp",
  "working_as": "Software Developer",
  "income": "500000"
}
```

---

### API #12: Update Family Profile
- **Endpoint:** `PUT /api/profile/family`
- **Authentication:** Bearer Token Required
- **Purpose:** Updates user's family background information

#### Request Parameters:
```json
{
  "family_values": "Traditional",
  "native_place": "Kerala",
  "father_name": "John Doe Sr",
  "father_occupation": "Business",
  "mother_name": "Jane Doe",
  "mother_occupation": "Homemaker",
  "brothers": "1",
  "m_brothers": "0",
  "sisters": "1",
  "m_sisters": "0"
}
```

---

### API #13: Update Astrological Profile
- **Endpoint:** `PUT /api/profile/astrological`
- **Authentication:** Bearer Token Required
- **Purpose:** Updates user's astrological information

#### Request Parameters:
```json
{
  "astro_profile": "Yes",
  "city_of_birth": "Mumbai",
  "nakshathra": 1,
  "manglik": "No",
  "hour": 10,
  "minute": 30,
  "second": 0
}
```

---

### API #14: Update About Profile
- **Endpoint:** `PUT /api/profile/about`
- **Authentication:** Bearer Token Required
- **Purpose:** Updates user's "About Myself" section

#### Request Parameters:
```json
{
  "about_my_self": "I am a software developer with a passion for technology..."
}
```

---

## Created Pages

### 1. Basic Profile Page
**Location:** `/src/app/dashboard/profile/basic/page.tsx`
**Route:** `/dashboard/profile/basic`

**Features:**
- Form with 10 fields for basic profile information
- Integrated dropdowns populated from master data API
- Real-time form validation
- Pre-populated with existing user data
- Success/Error message display
- Character limits and input validation

**Master Data Used:**
- Body Type
- Complexion
- Mother Tongue
- Personal Values
- Physical Status
- Marital Status
- Profile Created By

---

### 2. Education Profile Page
**Location:** `/src/app/dashboard/profile/education/page.tsx`
**Route:** `/dashboard/profile/education`

**Features:**
- Separated sections for Education, Career, and Employment details
- Dropdown fields for qualifications, specializations, and professions
- Text input fields for company name, designation, and income
- Pre-populated form data from existing profile
- Proper data type handling (integers for IDs, strings for text)

**Master Data Used:**
- Qualifications
- Specializations
- Professions
- Job Status

---

### 3. Family Profile Page
**Location:** `/src/app/dashboard/profile/family/page.tsx`
**Route:** `/dashboard/profile/family`

**Features:**
- Three main sections: Family Background, Parents Details, Siblings Details
- Text input fields for all family information
- Separate fields for total and married siblings
- Clean and organized layout

**Master Data Used:**
- None (all text inputs)

---

### 4. Astrological Profile Page
**Location:** `/src/app/dashboard/profile/astrological/page.tsx`
**Route:** `/dashboard/profile/astrological`

**Features:**
- Three sections: Astrological Details, Birth Time, Astrological Information
- Separate hour, minute, second inputs for birth time
- Validation for time inputs (hour: 0-23, minute/second: 0-59)
- Helpful placeholder text and instructions
- Dropdown fields for Nakshatra and Manglik status

**Master Data Used:**
- Nakshatra
- Manglik Status

---

### 5. About Me Profile Page
**Location:** `/src/app/dashboard/profile/about/page.tsx`
**Route:** `/dashboard/profile/about`

**Features:**
- Large textarea for personal description (1000 characters max)
- Real-time character counter
- Visual warning when character limit reached
- Tips section with writing guidelines
- Info box with suggestions for writing engaging profile description

**Master Data Used:**
- None (textarea input)

---

## Features

### Common Features Across All Pages

1. **Authentication & Authorization**
   - All pages protected with `AuthGuard`
   - Requires valid Bearer token
   - Auto-redirects to login if not authenticated

2. **Header & Footer**
   - Consistent use of site-wide Header and Footer components
   - Maintains branding and navigation consistency

3. **Loading States**
   - Spinner displayed while fetching data
   - Prevents user interaction during loading
   - Professional UX with centered loading animation

4. **Error Handling**
   - Success messages displayed after successful updates
   - Error messages shown for failed operations
   - Auto-redirect to dashboard after successful save (2-second delay)

5. **Form Pre-population**
   - Fetches existing profile data from `/api/my-details`
   - Pre-fills all form fields with current values
   - Allows users to see and edit existing information

6. **Navigation**
   - "Back to Dashboard" button with arrow icon
   - Cancel button to return without saving
   - Auto-redirect after successful save

7. **Responsive Design**
   - Mobile-friendly layouts
   - Grid-based responsive forms (1 column on mobile, 2 on desktop)
   - Touch-friendly buttons and inputs

8. **Visual Feedback**
   - Save button shows loading spinner during submission
   - Disabled state for buttons during save operation
   - Color-coded success (green) and error (red) messages

---

## Master Data Integration

### Master Data API
**Endpoint:** `GET /api/masters`
**Authentication:** Not Required (Public API)

### Usage in Forms

All master data is fetched once when the page loads and stored in component state. The data is used to populate dropdown menus throughout the forms.

**Master Data Categories Used:**
- `body_type`: Physical body types (Slim, Average, Athletic, etc.)
- `complexion`: Skin complexions (Fair, Wheatish, Dark, etc.)
- `mother_tongue`: Languages
- `personal_values`: Personal value systems (Traditional, Modern, etc.)
- `physical_status`: Physical status options
- `marital_status`: Marital status options
- `created`: Who created the profile (Self, Parents, etc.)
- `qualification`: Educational qualifications
- `specialization`: Academic specializations
- `profession`: Professional fields
- `job_status`: Employment status
- `nakshathra`: Astrological nakshatras
- `manglik`: Manglik status

---

## Technical Implementation

### Tech Stack
- **Frontend Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State Management:** React Hooks (useState, useEffect)
- **Authentication:** Custom AuthContext with Bearer tokens
- **API Communication:** Fetch API

### Component Structure

```
src/app/dashboard/
├── page.tsx (Dashboard with navigation buttons)
└── profile/
    ├── basic/
    │   └── page.tsx
    ├── education/
    │   └── page.tsx
    ├── family/
    │   └── page.tsx
    ├── astrological/
    │   └── page.tsx
    └── about/
        └── page.tsx
```

### Authentication Flow
1. User must be logged in to access any profile update page
2. AuthGuard wrapper checks for valid token
3. Token is passed in Authorization header: `Bearer {token}`
4. Invalid/expired tokens redirect to login page

### Data Flow
1. **Page Load:** Fetch master data + current profile data
2. **Form Interaction:** User modifies form fields
3. **Submit:** Send PUT request with updated data
4. **Response:** Display success/error message
5. **Redirect:** Auto-navigate to dashboard on success

### Form Validation
- Required fields enforced through form structure
- Type validation (integers for IDs, strings for text)
- Character limits on text inputs (e.g., 1000 chars for About Me)
- Time validation (0-23 for hours, 0-59 for minutes/seconds)
- Real-time character counting

---

## Navigation

### Dashboard Integration

**Location:** `/src/app/dashboard/page.tsx`

The dashboard's "Profile Completion" card has been updated with navigation buttons:

#### Added Edit Buttons:
1. **Basic Profile** → `/dashboard/profile/basic`
2. **Education** → `/dashboard/profile/education`
3. **Family** → `/dashboard/profile/family`
4. **Astrological** → `/dashboard/profile/astrological`
5. **About Me** → `/dashboard/profile/about`

**Button Style:**
- Small, compact buttons
- Red/pink color scheme matching site theme
- Hover effects for better UX
- Located next to completion status indicators

**Code Location:** Lines 418-488 in `src/app/dashboard/page.tsx`

---

## Future Enhancements

### Recommended Improvements

1. **Form Validation Enhancement**
   - Add client-side validation before submission
   - Show field-specific error messages
   - Highlight invalid fields in red

2. **Photo Upload Integration**
   - Create page for photo upload (API #19 available)
   - Add horoscope upload feature
   - Implement ID proof upload

3. **Partner Preferences Page**
   - Create page for updating partner preferences (API #15 available)
   - Multi-select dropdowns for preferences
   - Range sliders for age/height preferences

4. **Hobbies & Interests Page**
   - Dedicated page for hobbies section
   - Multi-select checkboxes for interests
   - Music, reading, cuisine preferences

5. **Profile Preview**
   - Add "Preview Profile" feature
   - Show how profile appears to other users
   - Quick edit links from preview page

6. **Progress Tracking**
   - Real-time profile completion percentage updates
   - Visual progress indicators on each page
   - Gamification elements for profile completion

7. **Auto-Save Functionality**
   - Periodically save form data as draft
   - Prevent data loss on accidental navigation
   - "Changes not saved" warning on exit

8. **Mobile App Optimization**
   - Further optimize forms for mobile devices
   - Add mobile-specific input types (tel, email)
   - Implement bottom sheet modals for better mobile UX

9. **Accessibility Improvements**
   - Add ARIA labels
   - Keyboard navigation support
   - Screen reader compatibility

10. **Analytics Integration**
    - Track which sections users complete first
    - Identify drop-off points in profile completion
    - Measure time spent on each section

---

## Important Notes

### Known Issues from Laravel Backend Analysis

⚠️ **Critical: Missing Fillable Columns in Laravel Models**

During the Laravel backend analysis, it was discovered that several database columns are being updated but are NOT in the models' `$fillable` arrays. This means these updates may silently fail due to Laravel's mass assignment protection.

#### UserProfileDetails Model Issues:
Missing fillable columns:
- `up_company_name`
- `up_designation`
- `up_annualincome`
- `up_family_values`
- `up_native`
- `up_father_name`
- `up_father_occupation`
- `up_mother_name`
- `up_mother_occupation`
- `up_brothers`
- `up_mbrothers`
- `up_sisters`
- `up_msisters`
- `up_about_myself`

#### UserAstrologicalDetails Model Issues:
Missing fillable columns:
- `astro_profile`
- `city_of_birth` (or should be `place_of_birth`)
- `uap_add_date`

**Recommendation:** Update the Laravel models to include these columns in the `$fillable` array before deploying to production.

---

### API Base URL Configuration

**Current Configuration:** `http://localhost:8000/api`

⚠️ **Action Required:** Before deployment, update the API base URL in all pages:

**Files to Update:**
- `/src/app/dashboard/profile/basic/page.tsx`
- `/src/app/dashboard/profile/education/page.tsx`
- `/src/app/dashboard/profile/family/page.tsx`
- `/src/app/dashboard/profile/astrological/page.tsx`
- `/src/app/dashboard/profile/about/page.tsx`

**Recommended Approach:**
Create an environment variable:
```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=https://yourdomain.com/api
```

Then replace hardcoded URLs with:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
```

---

### Security Considerations

1. **Token Storage**
   - Tokens are stored in AuthContext
   - Consider implementing token refresh mechanism
   - Add token expiration handling

2. **Input Sanitization**
   - Backend handles input sanitization
   - Frontend should still validate data types and formats
   - Consider adding XSS protection for text inputs

3. **HTTPS Requirement**
   - All API calls should use HTTPS in production
   - Ensure Bearer tokens are never transmitted over HTTP

4. **Rate Limiting**
   - Consider implementing frontend rate limiting
   - Prevent abuse through multiple rapid submissions
   - Add debouncing to save operations

---

### Testing Checklist

Before deploying to production, test:

- [ ] All forms load with existing data
- [ ] All dropdowns populate from master data
- [ ] Form submission works for each page
- [ ] Success messages display correctly
- [ ] Error handling works (test with invalid token)
- [ ] Redirect to dashboard after save works
- [ ] Cancel buttons work correctly
- [ ] Back to Dashboard button works
- [ ] Mobile responsiveness on all pages
- [ ] Loading states display properly
- [ ] Character counter works (About Me page)
- [ ] Time validation works (Astrological page)
- [ ] Navigation buttons on dashboard work
- [ ] AuthGuard redirects work correctly

---

## Code Maintenance

### Adding New Profile Update Pages

To add a new profile update page:

1. **Create API in Laravel** (if not exists)
2. **Create new page** in `/src/app/dashboard/profile/{section}/page.tsx`
3. **Follow existing pattern:**
   - Import necessary components (Header, Footer, AuthGuard)
   - Use AuthContext for token management
   - Implement loading, error, and success states
   - Fetch existing data on component mount
   - Handle form submission with proper error handling
   - Add navigation buttons (Back, Cancel, Save)
4. **Add navigation button** in dashboard Profile Completion card
5. **Update this documentation** with new page details
6. **Test thoroughly** before deployment

### Updating Master Data

If master data categories change:

1. Update TypeScript interfaces in affected pages
2. Update dropdown rendering logic
3. Test with new master data structure
4. Update documentation

### Modifying API Endpoints

If API endpoints change:

1. Update all fetch calls in affected pages
2. Update request/response interfaces
3. Test all CRUD operations
4. Update this documentation

---

## Support & Contact

For questions or issues related to this feature:

**Frontend Implementation:**
- Next.js project: `/matrimonial-website/`
- Component files: `/src/app/dashboard/profile/`

**Backend APIs:**
- Laravel project: `/vivahavedi-laravel-api/`
- Controller: `ProfileUpdateController.php`
- Documentation: `user-website-api-documentation.md`

---

## Revision History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-10-01 | 1.0 | Initial documentation created | Development Team |

---

**End of Documentation**
