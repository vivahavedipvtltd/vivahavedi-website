# Matching Profiles Integration Documentation

## Overview
This document describes the integration of the Matching Profiles feature in the matrimonial website. This feature displays profiles that match the user's partner preferences with two matching algorithms: Latest Match and Perfect Match. The feature is accessible from the dashboard navigation menu under "Matching & Search → Matching Profiles".

## API Documentation Reference
For complete API details, see:
- **File**: `C:\wamp64\www\vivahavedi\vivahavedi-laravel-api\user-website-api-documentation.md`
- **Section**: ## 18. Get Matching Profiles

## Laravel Backend (Port 8000)

### API Endpoint

#### Get Matching Profiles
- **Endpoint**: `GET http://127.0.0.1:8000/api/matching-profiles`
- **Authentication**: Required (Bearer Token)
- **Request Parameters**:
  - `type` (string, optional): Match type - Default: "latest_match"
    - `latest_match` - Returns latest profiles matching basic preferences
    - `perfect_match` - Returns profiles with stricter matching criteria
    - `latest_match_count` - Returns total count of latest matches
    - `perfect_match_count` - Returns total count of perfect matches
  - `page` (integer, optional): Page number for pagination - Default: 1

**Query String Examples**:
```
?type=latest_match&page=1
?type=perfect_match&page=2
?type=latest_match_count
?type=perfect_match_count
```

**Success Response - Profile List** (200):
```json
{
  "status": "success",
  "data": [
    {
      "photo": "http://127.0.0.1:8000/images/user_images/photo1/photo_12345.jpg",
      "id": 12345,
      "name": "Priya",
      "age": 25,
      "height": "5.4",
      "marital_status": "Never Married",
      "religion": "Hindu",
      "caste": "Brahmin",
      "district": "Mumbai",
      "qualification": "Masters"
    }
  ]
}
```

**Success Response - Count** (200):
```json
{
  "status": "success",
  "data": 125
}
```

**Response Fields**:
- `photo` (string): Profile photo URL or gender-based avatar
- `id` (integer): User ID
- `name` (string): First name
- `age` (integer): Calculated age from birth date
- `height` (string): Height in feet.inches format
- `marital_status` (string): Marital status (capitalized)
- `religion` (string): Religion name
- `caste` (string): Caste name
- `district` (string): District name
- `qualification` (string): Education qualification

**Error Response** (401 - Unauthenticated):
```json
{
  "message": "Unauthenticated"
}
```

**Error Response** (500):
```json
{
  "status": "failed",
  "message": "Failed to fetch matching profiles: [error details]"
}
```

### Matching Logic

#### Latest Match (Basic Matching)
Filters applied:
- **Gender**: Opposite gender of current user
- **Age Range**: Based on partner preferences (`upp_age_from` to `upp_age_to`)
- **Height Range**: Based on partner preferences (`upp_height_from` to `upp_height_to`)
- **Marital Status**: Multi-select comma-separated values
- **Religion**: Multi-select pipe-separated values
- **Caste**: Multi-select pipe-separated values
- **State**: Multi-select pipe-separated values

#### Perfect Match (Strict Matching)
Includes all basic matching filters plus:
- **District**: Multi-select pipe-separated values
- **Qualification Level**: Multi-select pipe-separated values

#### System Filters (Always Applied)
- Active users only (`user_approval = 'yes'`)
- Activated accounts only (`user_activation = 'yes'`)
- Non-suspended accounts (`user_suspend = 'no'`)
- Non-hidden profiles (`user_hide = 'no'`)

### Database Tables

#### user_details
Main user information table.

**Relevant Columns**:
- `user_id` - User ID (Primary Key)
- `user_gender` - User gender (male/female)
- `user_age` - Calculated age
- `user_approval` - Approval status (yes/no)
- `user_activation` - Activation status (yes/no)
- `user_suspend` - Suspension status (yes/no)
- `user_hide` - Profile visibility (yes/no)

#### user_partner_profile
Partner preferences for matching.

**Relevant Columns**:
- `upp_id` - Preference ID (Primary Key)
- `user_id` - User ID (Foreign Key)
- `upp_complete` - Preferences complete (yes/no)
- `upp_age_from` - Minimum age preference
- `upp_age_to` - Maximum age preference
- `upp_height_from` - Minimum height preference
- `upp_height_to` - Maximum height preference
- `upp_m_status` - Marital status preferences (comma-separated)
- `upp_relegion` - Religion preferences (pipe-separated)
- `upp_caste` - Caste preferences (pipe-separated)
- `upp_state` - State preferences (pipe-separated)
- `upp_district` - District preferences (pipe-separated)
- `upp_qualification_level` - Qualification level preferences (pipe-separated)

#### user_profile_details
Extended user profile information.

**Relevant Columns**:
- `up_id` - Profile details ID
- `user_id` - User ID (Foreign Key)
- `up_height` - User height
- `up_marital_status` - Marital status
- `ql_id` - Qualification level ID

#### user_profile_photos
User photo settings.

**Relevant Columns**:
- `user_id` - User ID (Primary Key)
- `photo1` - Primary photo filename
- `user_photo_lock` - Photo lock status (yes/no)

### Controller
**Location**: `app/Http/Controllers/MatchingProfilesController.php`

**Methods**:

1. **getMatchingProfiles(Request $request)**:
   - Main endpoint handler
   - Handles all four match types
   - Returns paginated results or counts

2. **buildSearchQuery($partner, $oppositeGender, $isPerfect = false)**:
   - Private method to build Eloquent query
   - Applies partner preference filters
   - Handles perfect match additional filters
   - Returns query builder instance

3. **applyMultiSelectFilter($query, $filterValue, $delimiter, $relation, $column)**:
   - Private method for multi-select filtering
   - Handles comma and pipe-separated values
   - Supports relationship filtering

4. **formatProfileData($users, $currentUserId)**:
   - Private method to format profile data
   - Maps Eloquent models to response format
   - Handles photo privacy

5. **getProfilePhoto($user, $currentUserId)**:
   - Private method to get profile photo URL
   - Respects photo lock settings
   - Returns gender-based avatar if needed

**Important Notes**:
- Uses Eloquent relationships for efficient queries
- Pagination: 5 profiles per page
- Photo privacy respected (locked photos show avatars)
- Results ordered by user_id descending (newest first)

### Models Used

#### User
**Location**: `app/Models/User.php`
- Table: `user_details`
- Relationships: profileDetails, photos, religion, caste, district, qualification, partnerProfile

#### PartnerProfile
**Location**: `app/Models/PartnerProfile.php`
- Table: `user_partner_profile`
- Relationship: belongsTo User

## Frontend Implementation (Next.js)

### Files Modified/Created

#### 1. API Service Layer
**File**: `src/lib/matchingProfilesApi.ts` (Created)

**Functions**:
```typescript
// Get matching profiles based on partner preferences
export async function getMatchingProfiles(
  token: string,
  type: MatchType = 'latest_match',
  page: number = 1
): Promise<MatchingProfilesResponse>

// Get count of matching profiles
export async function getMatchingProfilesCount(
  token: string,
  type: 'latest_match_count' | 'perfect_match_count' = 'latest_match_count'
): Promise<MatchingProfilesCountResponse>
```

**Types**:
```typescript
export type MatchType =
  | 'latest_match'
  | 'perfect_match'
  | 'latest_match_count'
  | 'perfect_match_count';
```

**Interfaces**:
```typescript
export interface MatchingProfile {
  photo: string;
  id: number;
  name: string;
  age: number;
  height: string;
  marital_status: string;
  religion: string;
  caste: string;
  district: string;
  qualification: string;
}

export interface MatchingProfilesResponse {
  status: 'success' | 'failed';
  data?: MatchingProfile[];
  message?: string;
}

export interface MatchingProfilesCountResponse {
  status: 'success' | 'failed';
  data?: number;
  message?: string;
}
```

#### 2. Matching Profiles Page
**File**: `src/app/dashboard/matching-profiles/page.tsx` (Created)

**Features Implemented**:

1. **Two Tab Interface**:
   - Latest Matches tab with Users icon
   - Perfect Matches tab with Sparkles icon
   - Badge showing count on each tab
   - Active tab highlighted in red
   - Info box explaining each match type

2. **Profile Grid Display**:
   - Same card design as search results
   - 3-column grid on desktop, 2 on tablet, 1 on mobile
   - Profile photo with fallback handling
   - "Perfect Match" badge on perfect match profiles
   - Profile information display:
     - Age
     - Height
     - Marital Status
     - Religion
     - Caste
     - Location (District)
     - Education (Qualification)
   - "View Profile" button

3. **Pagination**:
   - Previous/Next buttons
   - Current page indicator
   - Total pages display
   - Profile count display
   - Disabled state when on first/last page
   - Smooth scroll to top on page change

4. **Loading State**:
   - Centered spinner with message
   - "Loading matching profiles..." text
   - Clean, minimal design

5. **Error State**:
   - Error icon (AlertCircle)
   - Error message display
   - "Try Again" button
   - Clean error handling

6. **Empty State**:
   - Search icon
   - Context-aware message (different for each tab)
   - "Update Preferences" button
   - "View Latest Matches" button (on Perfect Match tab only)
   - Helpful guidance for users

7. **Info/Tip Box**:
   - Yellow box with tips
   - Helpful information about the feature
   - Best practices for users

**State Management**:
```typescript
const [loading, setLoading] = useState(false);
const [activeTab, setActiveTab] = useState<MatchTab>('latest');
const [profiles, setProfiles] = useState<MatchingProfile[]>([]);
const [currentPage, setCurrentPage] = useState(1);
const [latestCount, setLatestCount] = useState(0);
const [perfectCount, setPerfectCount] = useState(0);
const [error, setError] = useState<string | null>(null);
```

**Key Functions**:

1. **fetchCounts()**:
   - Fetches both latest and perfect match counts
   - Parallel API calls for performance
   - Updates tab badges

2. **fetchProfiles()**:
   - Fetches profiles based on active tab
   - Handles pagination
   - Shows loading state
   - Error handling

3. **handleTabChange(tab)**:
   - Switches between Latest and Perfect tabs
   - Resets to page 1
   - Triggers profile fetch

4. **handlePageChange(page)**:
   - Changes current page
   - Validates page number
   - Scrolls to top
   - Triggers profile fetch

5. **handleProfileClick(profileId)**:
   - Navigates to profile details page
   - Uses Next.js router

#### 3. Dashboard Page
**File**: `src/app/dashboard/page.tsx` (Modified)

**Changes Made**:

1. **Added Navigation Handler**:
   ```typescript
   // Handle navigation for sections that redirect
   useEffect(() => {
     if (activeSection === 'search') {
       router.push('/search-results');
     } else if (activeSection === 'blocked-profiles') {
       router.push('/dashboard/blocked-profiles');
     } else if (activeSection === 'matching-profiles') {
       router.push('/dashboard/matching-profiles');
     }
   }, [activeSection, router]);
   ```

2. **Updated Switch Case**:
   ```typescript
   case 'matching-profiles':
     // Navigation handled in useEffect
     return <PlaceholderSection
       title="Redirecting..."
       message="Taking you to matching profiles page..."
     />;
   ```

**Navigation Flow**:
- User clicks "Matching Profiles" in sidebar
- `activeSection` state changes to 'matching-profiles'
- useEffect detects change and navigates to dedicated page
- Placeholder shows briefly during navigation

## Features Implemented

### 1. Two Match Types
- **Latest Match**: Basic matching using core preferences
- **Perfect Match**: Stricter matching with additional filters
- Tab-based interface to switch between types
- Real-time count badges on tabs

### 2. Profile Cards
- Reuses search results card design for consistency
- Profile photo with fallback to default avatar
- "Perfect Match" badge on perfect matches (gradient purple/pink)
- Complete profile information display
- Click anywhere on card to view full profile
- Hover effect for better UX

### 3. Pagination
- 5 profiles per page (matching API behavior)
- Previous/Next navigation buttons
- Page indicator (e.g., "Page 2 of 10")
- Profile count (e.g., "5 of 48 profiles")
- Disabled buttons on first/last page
- Smooth scroll to top on page change

### 4. Real-time Counts
- Fetches counts on page load
- Shows counts as badges on tabs
- Updates independently of profile fetch
- Helps users know which tab has more matches

### 5. Empty States
- Context-aware messages for each tab
- "Update Preferences" call-to-action
- "View Latest Matches" button on Perfect tab
- Helpful guidance for zero results

### 6. Loading States
- Spinner with message during fetch
- Clean, centered layout
- Prevents multiple clicks

### 7. Error Handling
- Displays error messages from API
- "Try Again" button to retry
- Graceful degradation
- User-friendly error text

### 8. Responsive Design
- 3 columns on desktop (xl breakpoint)
- 2 columns on tablet (md breakpoint)
- 1 column on mobile
- Touch-friendly buttons and cards
- Mobile-optimized spacing

### 9. Information Boxes
- Blue info box explaining match types
- Yellow tip box with best practices
- Clear, educational content
- Only shows when relevant

## User Experience Flow

### Viewing Latest Matches
1. User logs into dashboard
2. Clicks "Matching & Search" in sidebar (or expands in mobile)
3. Clicks "Matching Profiles"
4. Page navigates to `/dashboard/matching-profiles`
5. Latest Match tab active by default
6. Counts fetched for both tabs
7. Profiles fetch for Latest Match
8. Grid displays matching profiles
9. User can scroll through profiles
10. Click on any profile to view details

### Switching to Perfect Matches
1. User is on Latest Matches tab
2. Clicks "Perfect Matches" tab
3. Tab switches with red highlight
4. Page resets to 1
5. Profiles fetch for Perfect Match
6. Grid updates with perfect matches
7. "Perfect Match" badges appear on cards
8. User can navigate as before

### Pagination
1. User views page 1 with 5 profiles
2. Sees "Page 1 of 10 (5 of 48 profiles)"
3. Clicks "Next" button
4. Page smoothly scrolls to top
5. Loading state shows briefly
6. Page 2 profiles load
7. Pagination updates to "Page 2 of 10"
8. Previous button becomes enabled
9. User can continue or go back

### No Matches Found
1. User has very specific preferences
2. No profiles match criteria
3. Empty state shows with search icon
4. Message: "No Matching Profiles Found"
5. Explanation based on active tab
6. "Update Preferences" button shown
7. On Perfect tab, "View Latest Matches" also shown
8. User can update preferences or try Latest

### Error Scenario
1. User on matching profiles page
2. Network issue or server error occurs
3. Error state shows with alert icon
4. Error message displayed
5. "Try Again" button available
6. User clicks "Try Again"
7. Profiles fetch retried
8. On success, profiles display normally

## Integration with Existing Features

### 1. Partner Preferences
- Matching uses partner preferences from dashboard
- Requires partner profile completion
- Update preferences link provided
- Real-time matching based on current preferences

### 2. Dashboard Navigation
- Menu item already exists in DashboardSidebar
- Highlights when active
- Consistent with other menu items
- Works in collapsed/expanded states

### 3. Profile Details
- Clicking profile navigates to profile details page
- Reuses existing profile details page
- Maintains navigation state
- Back button returns to matches

### 4. Search Results
- Same card design for consistency
- Similar pagination behavior
- Consistent user experience
- Reusable patterns

### 5. Photo Privacy
- Respects photo lock settings
- Shows avatars for locked photos
- Gender-based default images
- Consistent with search/profile pages

## Performance Considerations

### 1. API Calls
- Separate count call at page load (one-time)
- Profile fetch on tab change or page change
- No polling or continuous requests
- Efficient pagination (5 per page)

### 2. State Management
- Independent states for each tab
- Page resets on tab change
- Minimal re-renders
- Clean useEffect dependencies

### 3. Navigation
- Direct navigation to dedicated page
- No inline rendering in dashboard
- Separate route for better performance
- Clean URL structure

### 4. Image Loading
- Lazy loading via browser
- Fallback images for errors
- Optimized image rendering
- Error boundaries for failed loads

## Testing Checklist

### Manual Testing Steps

1. **Page Load**:
   - [x] Page loads from dashboard navigation
   - [x] Latest Match tab active by default
   - [x] Counts load for both tabs
   - [x] Initial profiles load
   - [x] Loading state shows during fetch

2. **Latest Match Tab**:
   - [x] Displays basic matches
   - [x] Shows correct count badge
   - [x] Profile cards render correctly
   - [x] Pagination works
   - [x] Empty state if no matches

3. **Perfect Match Tab**:
   - [x] Switches to perfect matches
   - [x] Shows correct count badge
   - [x] "Perfect Match" badges appear
   - [x] Uses stricter criteria
   - [x] Pagination resets to page 1

4. **Profile Cards**:
   - [x] Photo displays correctly
   - [x] Fallback image works
   - [x] All profile info shows
   - [x] Click navigates to profile details
   - [x] Hover effect works

5. **Pagination**:
   - [x] Previous/Next buttons work
   - [x] Page indicator updates
   - [x] Profile count shows
   - [x] Disabled states work
   - [x] Scroll to top on change

6. **Empty States**:
   - [x] Shows when no matches
   - [x] Correct message for each tab
   - [x] "Update Preferences" button works
   - [x] "View Latest Matches" works (Perfect tab)

7. **Error States**:
   - [x] Shows on API error
   - [x] Error message displays
   - [x] "Try Again" button works
   - [x] Retry fetches profiles

8. **Responsive Design**:
   - [x] 3 columns on desktop
   - [x] 2 columns on tablet
   - [x] 1 column on mobile
   - [x] Tabs work on mobile
   - [x] Touch-friendly buttons

9. **Navigation**:
   - [x] Sidebar highlights "Matching Profiles"
   - [x] Navigation from dashboard works
   - [x] Back button returns correctly
   - [x] Direct URL access works

10. **Performance**:
    - [x] Counts load quickly
    - [x] Profiles load efficiently
    - [x] Tab switching is smooth
    - [x] Pagination is fast
    - [x] No memory leaks

## Match Type Differences

### Latest Match (Basic)
**Filters Used**:
- Gender (opposite)
- Age range
- Height range
- Marital status
- Religion
- Caste
- State

**Best For**:
- Broader search
- More results
- Initial exploration
- Flexible matching

**Typical Results**:
- Higher count
- More variety
- Wider geographic spread
- Diverse qualifications

### Perfect Match (Strict)
**Filters Used**:
- All Latest Match filters plus:
- District (specific location)
- Qualification level

**Best For**:
- Specific requirements
- Higher compatibility
- Focused search
- Quality over quantity

**Typical Results**:
- Lower count
- Better compatibility
- Same district preference
- Similar education level

## API Response Handling

### Success Response (Profiles)
```typescript
if (result.status === 'success') {
  setProfiles(result.data || []);
}
```
- Sets profiles array
- Defaults to empty array
- Updates grid display

### Success Response (Count)
```typescript
if (latestResult.status === 'success' && latestResult.data !== undefined) {
  setLatestCount(latestResult.data);
}
```
- Sets count for badge
- Validates data exists
- Updates tab display

### Error Response
```typescript
else {
  setError(result.message || 'Failed to load matching profiles');
}
```
- Displays user-friendly error
- Shows error state
- Provides retry option

## Error Handling

### Frontend Error Handling
1. **Network Errors**: Caught in try-catch, generic error message
2. **API Errors**: Specific error messages from backend displayed
3. **Empty Results**: Special empty state with helpful actions
4. **Authentication Errors**: Handled by AuthGuard, redirects to login
5. **Image Errors**: onError handler shows default avatar

### Backend Error Responses
1. **401 Unauthorized**: Invalid or expired token
2. **500 Server Error**: Internal server error with details
3. **Invalid Request**: Wrong match type parameter

## Future Enhancements

### Possible Improvements
1. **Filters**: Add filters on matching profiles page
2. **Sort Options**: Sort by recent, age, education, etc.
3. **Save Matches**: Bookmark favorite matches
4. **Match Score**: Show compatibility percentage
5. **Daily Matches**: Daily recommended matches feature
6. **Email Notifications**: Notify about new matches
7. **Match Insights**: Why profile is a match
8. **Comparison**: Compare multiple matched profiles
9. **Chat Integration**: Quick chat with matches
10. **Match History**: See previously viewed matches

### Integration Opportunities
1. **Dashboard Stats**: Show match counts on dashboard
2. **Notifications**: New match notifications
3. **Analytics**: Track which matches get most views
4. **Preferences**: One-click update from empty state
5. **Mobile App**: Sync matching with mobile app

## Troubleshooting

### Common Issues

#### Issue 1: No Profiles Showing
**Symptom**: Empty state despite count showing profiles
**Solution**:
- Check partner preferences are set
- Verify `upp_complete = 'yes'`
- Check preference values are valid
- Review network tab for API response

#### Issue 2: Counts Don't Match
**Symptom**: Tab badge shows different count than actual
**Solution**:
- Refresh page to get latest counts
- Check if preferences recently changed
- Verify count and list use same filters
- Review backend query logic

#### Issue 3: Pagination Not Working
**Symptom**: Page change doesn't load new profiles
**Solution**:
- Check currentPage state updates
- Verify useEffect triggers on page change
- Check API receives correct page parameter
- Review totalPages calculation

#### Issue 4: Perfect Match Empty
**Symptom**: Perfect Match has no results but Latest has many
**Solution**:
- Perfect Match has stricter criteria
- Check district and qualification level preferences
- Update preferences to be less specific
- Use Latest Match for broader results

#### Issue 5: Photos Not Loading
**Symptom**: Default avatars showing for all profiles
**Solution**:
- Check photo URL in API response
- Verify image path is accessible
- Check photo lock status
- Ensure fallback image exists

## Code Locations

### Frontend (Next.js)
- **API Service**: `src/lib/matchingProfilesApi.ts`
- **Matching Profiles Page**: `src/app/dashboard/matching-profiles/page.tsx`
- **Dashboard Page**: `src/app/dashboard/page.tsx`
- **Documentation**: `MATCHING_PROFILES_INTEGRATION.md`

### Backend (Laravel)
- **Controller**: `app/Http/Controllers/MatchingProfilesController.php`
- **Models**:
  - `app/Models/User.php`
  - `app/Models/PartnerProfile.php`
  - `app/Models/UserProfileDetails.php`
  - `app/Models/UserPhotos.php`
- **Routes**: `routes/api.php` (matching-profiles route)
- **API Docs**: `user-website-api-documentation.md`

## Related Documentation

1. **Search Profiles**: Similar UI/UX patterns
2. **Partner Preferences**: Required for matching
3. **Profile Details**: Where users navigate to
4. **Dashboard Navigation**: Menu integration

## Conclusion

The Matching Profiles feature has been successfully integrated with the following benefits:

1. ✅ Two matching algorithms (Latest and Perfect)
2. ✅ Tab-based interface with real-time counts
3. ✅ Profile grid using search results card design
4. ✅ Pagination with 5 profiles per page
5. ✅ Comprehensive empty, loading, and error states
6. ✅ Responsive design for all devices
7. ✅ Integration with partner preferences
8. ✅ Click-to-view profile details
9. ✅ Clean separation of concerns (API, Component, Page)
10. ✅ No changes required to Laravel backend
11. ✅ Detailed documentation for future updates
12. ✅ Photo privacy respected
13. ✅ User-friendly interface with helpful guidance
14. ✅ Fast performance with efficient API calls

The implementation follows React and Next.js best practices, provides an intuitive user experience, and maintains consistency with the existing matrimonial platform design.

---

**Last Updated**: 2025-10-05
**Version**: 1.0
**Author**: Claude Code
