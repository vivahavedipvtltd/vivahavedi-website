# Profile Details Feature Documentation

## Overview
This document provides comprehensive information about the Profile Details feature implementation in the Vivahavedi Matrimonial Website. The feature allows users to view complete profile information of matches including photos, basic details, professional information, astrological data, partner preferences, and compatibility scores.

**Date Created:** October 1, 2025
**API Endpoint:** `POST /api/profile-details`
**Laravel API Base URL:** `http://localhost:8000/api`
**Next.js Project:** Matrimonial Website

---

## Table of Contents
1. [API Overview](#api-overview)
2. [Created Pages](#created-pages)
3. [Features](#features)
4. [Navigation Flow](#navigation-flow)
5. [Technical Implementation](#technical-implementation)
6. [Data Sections](#data-sections)
7. [UI Components](#ui-components)
8. [Future Enhancements](#future-enhancements)
9. [Important Notes](#important-notes)

---

## API Overview

### API #22: Profile Details

**Endpoint:** `POST /api/profile-details`
**Authentication:** Bearer Token Required
**Purpose:** Retrieves comprehensive profile details for a specific user including all sections

#### Request Parameters:
```json
{
  "match_id": 123
}
```

#### Response Structure:
```json
{
  "status": "success",
  "data": {
    "basic": { ... },
    "detailed": { ... },
    "photo": { ... },
    "astro": { ... },
    "partner": { ... },
    "match": { ... },
    "communicaton": { ... },
    "request": { ... }
  }
}
```

### Laravel Implementation

**Controller:** `ProfileDetailsController.php`
**Location:** `C:\wamp64\www\vivahavedi\vivahavedi-laravel-api\app\Http\Controllers\ProfileDetailsController.php`
**Method:** `getProfileDetails(Request $request)`

**Key Features:**
- Photo privacy handling with lock-based access control
- Compatibility scoring algorithm (range-based matching)
- Communication status tracking
- Profile view tracking
- Auto-creation of missing profile records
- ID-to-name resolution for all master data

**Models Involved:**
- `User` - Basic user information
- `UserProfileDetails` - Detailed profile data
- `UserAstrologicalDetails` - Astrological information
- `UserPartnerProfileDetails` - Partner preferences
- `UserPhotos` - Photo management
- `PlanTaken` - Subscription plan
- Master Data Models (Religion, Caste, State, District, etc.)
- Communication Models (Interest, Shortlist, Block, Report)

---

## Created Pages

### Profile Details Page

**Location:** `/src/app/profile/[id]/page.tsx`
**Route:** `/profile/{userId}`
**Type:** Dynamic Route with ID parameter

**Page Structure:**
```
/profile/[id]
├── Photo Gallery (Left Column)
│   ├── Main Photo Display
│   ├── Photo Thumbnails (up to 5)
│   ├── Compatibility Score Card
│   └── Action Buttons
│
└── Profile Information (Right Column)
    ├── Basic Info Header
    ├── About Me Section
    ├── Basic Details Card
    ├── Professional Details Card
    ├── Astrological Details Card
    └── Partner Preferences Card
```

---

## Features

### 1. Photo Gallery

**Features:**
- Main photo display (responsive aspect ratio)
- Thumbnail grid for up to 5 photos
- Click to switch between photos
- Selected photo highlight with red border
- Handles avatar images when photos are locked
- Photo privacy status display

**Privacy Logic:**
- Shows actual photos if unlocked or viewing own profile
- Shows gender-based avatar if photos are locked
- Photo status indicator: 'visible' or 'avatar'

### 2. Compatibility Score

**Visual Display:**
- Circular progress indicator (SVG-based)
- Large percentage display in center
- Individual match criteria with icons
- Color-coded indicators (green for match, red for no match)

**Criteria Shown:**
- Age compatibility
- Height compatibility
- Religion match
- Location match

**Match Indicators:**
- ✓ (CheckCircle) for matches
- ✗ (XCircle) for non-matches
- Green text for positive matches
- Red text for non-matches

### 3. Action Buttons

**Primary Actions:**
- **Send Interest** - Express interest in the profile
  - Shows "Interest Sent" if already sent
  - Red background with Heart icon
- **Shortlist** - Add to shortlist
  - Shows "Shortlisted" if already shortlisted
  - White background with Bookmark icon
- **Send Message** - Initiate conversation
  - MessageCircle icon

**Secondary Actions:**
- **Block** - Block the user
  - Ban icon
- **Report** - Report inappropriate profile
  - Flag icon

**Button States:**
- Dynamically updates based on communication status
- Visual feedback for completed actions
- Disabled state handling

### 4. Profile Information Sections

#### A. Basic Info Header
- Full name display (first name + last name)
- Age with Calendar icon
- Location (district, state) with MapPin icon
- Gender with User icon

#### B. About Me Section
- Full-width text display
- Clean typography for readability
- Only shown if content exists
- MessageCircle icon in header

#### C. Basic Details Card
**Information Displayed:**
- Height (in feet)
- Weight (in kg)
- Marital Status
- Body Type
- Complexion
- Physical Status
- Mother Tongue
- Religion
- Caste
- Location

**Layout:** 2-column grid on desktop, 1-column on mobile

#### D. Professional Details Card
**Information Displayed:**
- Education/Qualification
- Profession
- Annual Income (formatted with ₹ symbol)

**Layout:** 2-column grid

#### E. Astrological Details Card
**Information Displayed:**
- Nakshatra (birth star)
- Manglik status
- Birth place
- Birth time

**Layout:** 2-column grid
**Display:** Only shown if astrological data exists

#### F. Partner Preferences Card
**Information Displayed:**
- Age range (min - max years)
- Height range (min - max cm)
- Religion preferences (array)
- Caste preferences (array)
- Preferred states (array)
- Education preferences (array)
- Profession preferences (array)

**Display:** Only shown if partner preferences exist
**Format:** Arrays displayed as comma-separated values

---

## Navigation Flow

### Entry Points

1. **Search Results Page** (`/search-results`)
   - Click on profile card → navigates to `/profile/{id}`
   - "View Profile" button click
   - Card click event: `onClick={() => router.push(\`/profile/${profile.id}\`)}`
   - **Location:** Line 624 in `src/app/search-results/page.tsx`

2. **Featured Profiles Component** (Homepage)
   - Can be integrated to navigate to profile details
   - **Location:** `src/components/FeaturedProfiles.tsx`

### Navigation Elements

**Back Button:**
- Located at top of page
- Uses `router.back()` to return to previous page
- Arrow icon with "Back to Results" text
- Position: Above all content

**URL Structure:**
```
/profile/123
```
- Dynamic route with user ID as parameter
- Extracted using `useParams()` hook
- Parameter name: `id`

---

## Technical Implementation

### Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State Management:** React Hooks (useState, useEffect)
- **Authentication:** AuthContext with Bearer tokens
- **API Communication:** Fetch API

### Component Architecture

```typescript
ProfileDetailsPage Component
├── State Management
│   ├── loading (boolean)
│   ├── profileData (ProfileData | null)
│   ├── error (string | null)
│   └── selectedPhoto (number)
│
├── Effects
│   └── fetchProfileDetails() on mount
│
├── Helper Functions
│   ├── getMatchColor(value: string)
│   └── getMatchIcon(value: string)
│
└── Render Sections
    ├── Loading State
    ├── Error State
    └── Profile Content
```

### TypeScript Interfaces

#### ProfileData Interface
```typescript
interface ProfileData {
  basic: BasicInfo;
  detailed: DetailedInfo;
  photo: PhotoInfo;
  astro?: AstroInfo;
  partner?: PartnerPreferences;
  match?: MatchScore;
  communicaton?: CommunicationStatus;
}
```

**Key Interfaces:**
- `BasicInfo` - Core user data (name, age, gender, location)
- `DetailedInfo` - Physical and professional details
- `PhotoInfo` - Photo URLs and status
- `AstroInfo` - Astrological data (optional)
- `PartnerPreferences` - Partner criteria (optional)
- `MatchScore` - Compatibility scores
- `CommunicationStatus` - Interaction status

### Data Flow

1. **Page Load:**
   ```
   User → Profile URL → useParams extracts ID → useEffect triggered
   ```

2. **API Call:**
   ```
   fetchProfileDetails() → POST to /api/profile-details
   → Send match_id → Receive profile data → Update state
   ```

3. **Rendering:**
   ```
   Check loading → Check error → Render profile sections
   ```

4. **Photo Selection:**
   ```
   User clicks thumbnail → setSelectedPhoto(index) → Main photo updates
   ```

### Authentication & Authorization

**Requirements:**
- Valid Bearer token from AuthContext
- User must be logged in (AuthGuard wrapper)
- Token sent in Authorization header

**Security:**
- Auto-redirects to `/login` if not authenticated
- Profile privacy respected by backend API
- Photo locking handled by Laravel API

### Error Handling

**Scenarios Covered:**
1. Network errors (fetch failed)
2. API errors (status: 'failed')
3. Profile not found
4. Invalid/suspended profiles
5. Unauthorized access

**User Experience:**
- Loading spinner while fetching
- Error message display
- "Go Back" button on error
- Graceful handling of missing data

---

## Data Sections

### 1. Basic Section

**Source:** User model
**Data Includes:**
- User ID, first name, last name
- Gender
- Age (calculated from birth date)
- Contact info (email, mobile)
- Religion and caste
- Location (country, state, district, locality)

**Display Location:** Header card at top of right column

---

### 2. Detailed Section

**Source:** UserProfileDetails model
**Data Includes:**
- Physical: height, weight, body type, complexion
- Personal: marital status, mother tongue, physical status
- Professional: qualification, profession, annual income
- About Me: personal description text

**Display Locations:**
- Basic Details Card
- Professional Details Card
- About Me Section

---

### 3. Photo Section

**Source:** UserPhotos model
**Data Includes:**
- Array of photo URLs (up to 5)
- Photo status ('visible' or 'avatar')

**Privacy Handling:**
- Backend handles photo locking
- Frontend displays avatar if locked
- Gender-specific avatars (male_l.png / female_l.png)

**Display Location:** Left column photo gallery

---

### 4. Astrological Section

**Source:** UserAstrologicalDetails model
**Data Includes:**
- Nakshatra (birth star)
- Manglik status
- Place of birth
- Time of birth
- Horoscope image URL

**Display Location:** Astrological Details Card
**Conditional:** Only shown if astro data exists

---

### 5. Partner Preferences Section

**Source:** UserPartnerProfileDetails model
**Data Includes:**
- Age range (from - to)
- Height range (from - to in cm)
- Religion preferences (array)
- Caste preferences (array)
- Location preferences (states, districts arrays)
- Education preferences (qualifications array)
- Profession preferences (array)

**Data Transformation:**
- Backend converts IDs to names
- Frontend displays as comma-separated lists

**Display Location:** Partner Preferences Card
**Conditional:** Only shown if partner data exists

---

### 6. Match/Compatibility Section

**Source:** Calculated by backend
**Data Includes:**
- Overall compatibility score (0-100%)
- Individual match flags for 14 criteria:
  - Age, Height, Marital Status, Body Type
  - Complexion, Physical Status, Religion, Caste
  - Nakshatra, Country, State, District
  - Qualification, Profession

**Algorithm:**
- Range-based matching
- Current user's attributes vs partner preferences
- Point-based scoring system

**Display Location:** Compatibility Score Card in left column

---

### 7. Communication Section

**Source:** Database interaction tables
**Data Includes:**
- Interest status ('yes' or 'no')
- Shortlist status ('yes' or 'no')
- Block status ('yes' or 'no')
- Report status ('yes' or 'no')

**Usage:**
- Updates action button states
- Shows current interaction status
- Prevents duplicate actions

**Display Location:** Used by action buttons

---

### 8. Request Section

**Source:** user_request table
**Data Includes:**
Boolean flags for 12 request types:
- photo_add, photo_view
- basic, education, family, hobbies
- astro, horoscope
- partner_basic, partner_religion, partner_location, partner_education

**Usage:**
- Track what information has been requested
- Can be used to show/hide request buttons
- Currently not displayed (backend tracking only)

**Future Use:** Can show "Request Sent" status for locked sections

---

## UI Components

### Color Scheme

**Primary Colors:**
- Red (#EF4444): Primary actions, highlights, progress indicators
- Green (#10B981): Positive matches, success states
- Gray (#6B7280): Text, borders, secondary elements

**Backgrounds:**
- White (#FFFFFF): Cards and sections
- Light Gray (#F9FAFB): Page background
- Red Tint (#FEE2E2): Hover states for red buttons

### Icons Usage

| Icon | Usage | Location |
|------|-------|----------|
| Heart | Send Interest button | Action buttons |
| Bookmark | Shortlist button | Action buttons |
| MessageCircle | Send Message, About Me | Action buttons, section headers |
| Ban | Block button | Action buttons |
| Flag | Report button | Action buttons |
| User | Gender, Basic Details header | Info display, headers |
| Calendar | Age display | Basic info header |
| MapPin | Location display | Basic info header |
| Briefcase | Professional Details header | Section header |
| GraduationCap | Education info | Professional details |
| Users | Partner Preferences header | Section header |
| Star | Astrological Details header | Section header |
| CheckCircle | Match indicator | Compatibility card |
| XCircle | No match indicator | Compatibility card |
| ArrowLeft | Back button | Navigation |
| Loader2 | Loading spinner | Loading state |

### Responsive Design

**Breakpoints:**
- **Mobile** (< 640px): Single column layout
- **Tablet** (640px - 1024px): Adjusted spacing
- **Desktop** (> 1024px): 3-column grid (1 col for photos, 2 cols for info)

**Responsive Features:**
- Photo gallery adapts to screen size
- Grid layouts change from 2-column to 1-column
- Action buttons stack vertically on mobile
- Cards maintain readability across all devices

### Tailwind Classes Used

**Common Patterns:**
```css
/* Card Container */
.bg-white .rounded-lg .shadow-md .p-6

/* Section Header */
.text-xl .font-bold .text-gray-900 .mb-4

/* Grid Layout */
.grid .grid-cols-1 .md:grid-cols-2 .gap-4

/* Button Primary */
.bg-red-500 .hover:bg-red-600 .text-white

/* Button Secondary */
.bg-white .border-2 .border-gray-300 .text-gray-700
```

---

## Future Enhancements

### Recommended Features

1. **Photo Viewer Modal**
   - Full-screen photo viewer
   - Swipe/arrow navigation
   - Zoom functionality
   - Download option (if permitted)

2. **Horoscope Display**
   - Show horoscope image in modal
   - Horoscope matching details
   - Request horoscope button

3. **Request Functionality**
   - "Request to View" buttons for locked sections
   - Track request status
   - Show pending/approved/rejected states
   - Notification when request is approved

4. **Contact Information**
   - Show contact details based on plan
   - "View Contact" button with plan check
   - Email and phone reveal with animation
   - WhatsApp direct link

5. **Similar Profiles**
   - "Similar Profiles" section at bottom
   - Based on compatibility score
   - Quick navigation between profiles
   - Swipe left/right for next/previous match

6. **Profile Actions Enhancement**
   - Send custom message with interest
   - Add note to shortlisted profiles
   - Undo block action
   - View interaction history

7. **Social Proof**
   - Show "X people viewed this profile"
   - "Profile verified" badge
   - "Premium member" indicator
   - Last seen/active status

8. **Detailed Match Analysis**
   - Expand compatibility card
   - Show all 14 match criteria
   - Explain why matches/doesn't match
   - Improvement suggestions

9. **PDF Download**
   - "Download Profile" button
   - Generate PDF with all details
   - Include photos and horoscope
   - Branded template

10. **Share Profile**
    - Share with family members
    - Generate shareable link
    - Email profile to contacts
    - WhatsApp share integration

11. **Profile Comparison**
    - Compare with another profile
    - Side-by-side view
    - Highlight differences
    - Export comparison

12. **Activity Timeline**
    - Show interaction history
    - When interest sent/received
    - Message history summary
    - Request timeline

---

## Important Notes

### API Base URL Configuration

**Current Configuration:** `http://localhost:8000/api`

⚠️ **Action Required:** Before deployment, update the API base URL.

**File to Update:**
- `/src/app/profile/[id]/page.tsx` (Line 130)

**Recommended Approach:**
Create environment variable:
```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=https://yourdomain.com/api
```

Update fetch call:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

const response = await fetch(`${API_BASE_URL}/profile-details`, {
  // ... rest of the config
});
```

---

### Data Availability

**Optional Sections:**
The following sections may not exist for all profiles:
- `astro` - Astrological details
- `partner` - Partner preferences
- `match` - Compatibility scores

**Handling:**
- Use optional chaining (`astro?.nak_name`)
- Conditional rendering (`{astro && <AstroCard />}`)
- Fallback values ("Not specified")

---

### Photo Privacy

**Privacy States:**
1. **Visible** - Photos are unlocked and displayed
2. **Avatar** - Photos are locked, showing gender-based avatar

**Backend Logic:**
- Photo locking controlled by `user_photo_lock` field
- Plan-based access control
- Request-to-view system

**Frontend Handling:**
- Backend returns appropriate URLs
- Frontend displays what backend provides
- No frontend-side privacy logic needed

---

### Compatibility Scoring

**Current Implementation:**
- Partial implementation in backend
- Age and height matching functional
- Other criteria being calculated

**Score Calculation:**
- Each criterion has point value
- Age: 8 points, Height: 8 points
- Total score: sum of all matched criteria
- Range-based matching (between min and max)

**Display:**
- Shows percentage (0-100%)
- Individual match indicators
- Color-coded for quick understanding

---

### Communication Status

**Typo Note:**
- API returns `communicaton` (missing 'i')
- Frontend uses same spelling for consistency
- Consider fixing in future API version

**Status Types:**
- `interest`: Express interest in profile
- `shortlist`: Save to shortlist
- `block`: Block the user
- `report`: Report inappropriate content

**Updates:**
- Currently readonly from this page
- Action buttons can trigger API calls
- Need additional APIs for these actions

---

### Navigation Behavior

**Back Button:**
- Uses `router.back()` for browser history
- Returns to previous page (usually search results)
- Maintains scroll position

**Direct Access:**
- Page can be accessed directly via URL
- Supports bookmarking
- Shareable links

**SEO Considerations:**
- Dynamic routes support SEO
- Can add metadata for profile pages
- Consider adding structured data (JSON-LD)

---

### Performance Considerations

**Loading States:**
- Shows spinner while fetching data
- Prevents layout shift
- Smooth transition to content

**Image Loading:**
- Consider lazy loading for thumbnails
- Add loading placeholder
- Optimize image sizes from backend

**Data Caching:**
- Consider caching profile data
- Implement stale-while-revalidate
- Use Next.js caching strategies

---

### Testing Checklist

Before deploying to production:

- [ ] Profile loads with valid ID
- [ ] Error handling for invalid ID
- [ ] Photo gallery navigation works
- [ ] All data sections display correctly
- [ ] Missing data shows "Not specified"
- [ ] Optional sections hide when no data
- [ ] Compatibility score calculates correctly
- [ ] Match indicators show correct colors/icons
- [ ] Action buttons display correct states
- [ ] Back button navigates correctly
- [ ] Mobile responsive layout works
- [ ] Tablet breakpoints look good
- [ ] Loading state displays properly
- [ ] Error state handles gracefully
- [ ] AuthGuard redirects work
- [ ] Photo privacy is respected
- [ ] Arrays display as comma-separated
- [ ] All icons render correctly
- [ ] Typography is readable
- [ ] Colors match brand guidelines

---

### Code Maintenance

**Adding New Sections:**

1. Update `ProfileData` interface with new section
2. Add new card component in render section
3. Ensure conditional rendering if optional
4. Add appropriate icons and styling
5. Test with and without data
6. Update this documentation

**Modifying Existing Sections:**

1. Check TypeScript interfaces
2. Update display logic
3. Test data transformation
4. Verify responsive layout
5. Update documentation

**API Changes:**

If backend API changes:

1. Update `ProfileData` interfaces
2. Modify fetch call if endpoint changes
3. Update error handling
4. Update request/response examples in docs
5. Test all scenarios
6. Update this documentation

---

## Integration Points

### Other Features That Use Profile Details

1. **Search Results** (`/search-results`)
   - Navigates to profile page
   - Passes user ID in URL

2. **Featured Profiles** (Homepage)
   - Can link to profile page
   - Same URL structure

3. **Shortlist** (Future)
   - Will link to profile page from shortlist

4. **Matches** (Future)
   - Will show profile details for matches

5. **Messages** (Future)
   - View profile from message thread

---

## API Dependencies

**Required APIs:**
1. `POST /api/profile-details` - Main profile data (IMPLEMENTED)
2. `GET /api/masters` - Master data for dropdowns (IMPLEMENTED)
3. `POST /api/my-details` - Current user data (IMPLEMENTED)

**Future APIs Needed:**
1. `POST /api/send-interest` - Express interest
2. `POST /api/add-shortlist` - Add to shortlist
3. `POST /api/block-user` - Block user
4. `POST /api/report-user` - Report profile
5. `POST /api/send-message` - Send message
6. `POST /api/request-info` - Request locked information
7. `POST /api/view-contact` - View contact details

---

## Support & Contact

For questions or issues related to this feature:

**Frontend Implementation:**
- Next.js project: `/matrimonial-website/`
- Profile page: `/src/app/profile/[id]/page.tsx`
- Search results: `/src/app/search-results/page.tsx`

**Backend API:**
- Laravel project: `/vivahavedi-laravel-api/`
- Controller: `ProfileDetailsController.php`
- Route: Line 107 in `routes/api.php`
- Documentation: `user-website-api-documentation.md` (API #22)

---

## Revision History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-10-01 | 1.0 | Initial documentation created | Development Team |

---

**End of Documentation**
