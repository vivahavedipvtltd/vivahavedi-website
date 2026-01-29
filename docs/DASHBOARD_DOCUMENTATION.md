# User Dashboard Documentation

## Overview
This document provides comprehensive documentation for the user dashboard feature implemented in the Vivahavedi Matrimony Next.js application. The dashboard displays user profile information and communication statistics after successful login or registration.

## Table of Contents
1. [Features](#features)
2. [API Integration](#api-integration)
3. [File Structure](#file-structure)
4. [Implementation Details](#implementation-details)
5. [Authentication Flow](#authentication-flow)
6. [Testing Instructions](#testing-instructions)
7. [Troubleshooting](#troubleshooting)
8. [Future Enhancements](#future-enhancements)

---

## Features

### Current Features
- **Welcome Section**: Personalized greeting with user's first name and profile completion percentage
- **Communication Statistics**: Real-time display of:
  - Profile Views
  - Interests Received
  - Active Chats
  - Pending Requests
- **Profile Overview**: Complete user information including:
  - Contact details (Email, Mobile with verification status)
  - Age and Gender
  - Religion and Caste
  - Location information
  - Address
- **Professional & Physical Details**:
  - Education and Profession
  - Height, Weight, Complexion
  - Body Type, Marital Status
  - Mother Tongue
- **Profile Completion Tracker**: Visual progress indicator showing completion status for:
  - Registration
  - Basic Profile
  - Education
  - Family
  - Hobbies
  - Astrological
  - Photo
  - ID Proof
- **Quick Actions**: Easy access buttons for common tasks
- **Responsive Design**: Fully responsive layout for all screen sizes

---

## API Integration

### APIs Used

#### 1. My Details API
**Endpoint**: `GET /api/my-details`

**Purpose**: Retrieves the authenticated user's complete profile information

**Request Headers**:
```
Accept: application/json
Authorization: Bearer {token}
```

**Response Structure**:
```json
{
  "status": "success",
  "data": {
    "basic": {
      "user_id": 12345,
      "user_fname": "John",
      "user_lname": "Doe",
      "user_gender": "male",
      "age": 28,
      "user_mobile": "9876543210",
      "user_email": "user@example.com",
      "user_address": "123 Main Street",
      "user_email_verify": "yes",
      "user_mobile_verify": "yes",
      "rel_name": "Hindu",
      "caste_name": "Brahmin",
      "con_name": "India",
      "state_name": "Kerala",
      "dist_name": "Thiruvananthapuram",
      "lpo_name": "Pattom"
    },
    "detailed": {
      "up_height": "5.8",
      "up_weight": "65",
      "up_complexion": "Fair",
      "up_body_type": "Average",
      "up_physical_status": "Normal",
      "up_mother_tongue": "Malayalam",
      "up_marital_status": "Never Married",
      "up_qualification": "B.Tech",
      "up_profession": "Software Engineer",
      "up_annual_income": "500000"
    },
    "profile_completion": {
      "registration": "1",
      "basic": "1",
      "education": "1",
      "family": "1",
      "hobbies": "1",
      "astro": "1",
      "photo": "0",
      "id_proof": "0",
      "score": 75
    }
  }
}
```

#### 2. Profile Communication Views API
**Endpoint**: `POST /api/communication-views`

**Purpose**: Retrieves communication statistics for the authenticated user

**Request Headers**:
```
Content-Type: application/json
Accept: application/json
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "type": "communication_statistics"
}
```

**Response Structure**:
```json
{
  "status": "success",
  "data": {
    "profile_view": 15,
    "profile_interest": 8,
    "profile_chat": 3,
    "profile_request": 2
  }
}
```

---

## File Structure

```
matrimonial-website/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   └── page.tsx               # Main dashboard component
│   │   ├── login/
│   │   │   └── page.tsx               # Login page (updated)
│   │   └── register/
│   │       └── page.tsx               # Registration page (updated)
│   ├── components/
│   │   ├── Header.tsx                 # Header component (already auth-aware)
│   │   ├── Footer.tsx                 # Footer component
│   │   └── auth/
│   │       └── AuthGuard.tsx          # Route protection component
│   └── contexts/
│       └── AuthContext.tsx            # Authentication context
└── DASHBOARD_DOCUMENTATION.md         # This file
```

---

## Implementation Details

### Component Structure

#### DashboardPage Component
**Location**: `src/app/dashboard/page.tsx`

**Key Features**:
1. **Protected Route**: Uses `AuthGuard` to ensure only authenticated users can access
2. **Data Fetching**: Fetches both profile details and communication statistics on mount
3. **Loading State**: Shows loading spinner while fetching data
4. **Error Handling**: Displays error message with retry button if fetch fails
5. **Responsive Layout**: Uses Tailwind CSS grid system for responsive design

**State Management**:
```typescript
const [myDetails, setMyDetails] = useState<MyDetails | null>(null);
const [communicationStats, setCommunicationStats] = useState<CommunicationStats | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

**Data Fetching Logic**:
```typescript
const fetchDashboardData = async () => {
  try {
    setLoading(true);
    setError(null);

    // Fetch My Details
    const myDetailsResponse = await fetch('http://localhost:8000/api/my-details', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    // Fetch Communication Statistics
    const commStatsResponse = await fetch('http://localhost:8000/api/communication-views', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ type: 'communication_statistics' }),
    });

    // Process responses...
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    setError('An error occurred while loading dashboard data');
  } finally {
    setLoading(false);
  }
};
```

### UI Components

#### 1. Welcome Section
- Displays personalized greeting with user's first name
- Shows profile completion progress bar (desktop only)
- Full-width card with white background

#### 2. Communication Statistics Cards
- Grid of 4 cards (responsive: 1 column mobile, 4 columns desktop)
- Each card shows:
  - Icon with colored background
  - Label
  - Count value
- Color scheme:
  - Profile Views: Blue
  - Interests: Red
  - Chats: Green
  - Requests: Purple

#### 3. Profile Overview
- Two-column grid (responsive)
- Each row displays:
  - Icon
  - Label
  - Value
- Shows verification status for email and mobile

#### 4. Professional & Physical Details
- Two-column grid (responsive)
- Displays education, profession, physical attributes
- Handles "Not specified" values gracefully

#### 5. Profile Completion Card
- List of all profile sections with completion status
- Visual indicators: ✓ (green) for complete, ✗ (red) for incomplete
- Overall completion progress bar at bottom
- Percentage display

#### 6. Quick Actions Card
- Stacked buttons for common actions
- Primary action (Edit Profile) highlighted in red
- Secondary actions in gray

---

## Authentication Flow

### Login Flow (Updated)
1. User enters credentials on login page
2. Credentials validated against Laravel API
3. On success:
   - Token and userId stored in localStorage
   - AuthContext updated
   - **Redirect to `/dashboard` (changed from `/`)**
4. On failure:
   - Error message displayed
   - User remains on login page

### Registration Flow (Updated)
1. User completes 3-step registration form
2. Data submitted to Laravel API
3. On success:
   - Token and userId stored in localStorage
   - **Redirect to `/dashboard` (changed from `/`)**
4. On failure:
   - Error message displayed
   - User returned to appropriate step

### Dashboard Access
1. User navigates to `/dashboard`
2. AuthGuard checks authentication status
3. If authenticated:
   - Dashboard page loads
   - API calls fetch user data
4. If not authenticated:
   - Redirect to `/login`

### Header Updates
- When authenticated, header shows:
  - Dashboard button (links to `/dashboard`)
  - Logout button
- When not authenticated, header shows:
  - Login button
  - Register button

---

## Testing Instructions

### Prerequisites
1. Laravel API running on `http://localhost:8000`
2. Next.js app running on port 3001 or 3002
3. Test user credentials available

### Test Credentials
```
Mobile/Email: 8888888888 or testuser2@example.com
Password: testpass123
```

### Test Cases

#### Test Case 1: Dashboard Access (Authenticated)
1. Navigate to login page
2. Enter test credentials
3. Click "Sign In"
4. **Expected**: Redirected to `/dashboard`
5. **Verify**:
   - Welcome message shows user's name
   - Profile completion percentage displays
   - Communication statistics load
   - Profile information displays correctly

#### Test Case 2: Dashboard Access (Unauthenticated)
1. Clear localStorage
2. Navigate directly to `/dashboard`
3. **Expected**: Redirected to `/login`
4. **Verify**: User cannot access dashboard without authentication

#### Test Case 3: Loading State
1. Login with valid credentials
2. Observe dashboard loading
3. **Verify**:
   - Loading spinner displays
   - "Loading your dashboard..." message shows
   - No flickering or layout shifts

#### Test Case 4: Error Handling
1. Stop Laravel API server
2. Login (will succeed from cache)
3. Navigate to dashboard
4. **Expected**: Error message displays
5. **Verify**:
   - "Failed to load dashboard" message shows
   - Retry button available
   - No console errors

#### Test Case 5: Profile Completion Display
1. Login with test account
2. Navigate to dashboard
3. **Verify**:
   - All 8 profile sections listed
   - Correct completion status for each
   - Overall percentage matches individual completions
   - Progress bar width matches percentage

#### Test Case 6: Communication Statistics
1. Login with account that has interactions
2. Navigate to dashboard
3. **Verify**:
   - All 4 stat cards display
   - Numbers are accurate
   - Icons and colors correct
   - Cards responsive on mobile

#### Test Case 7: Responsive Design
1. Login and navigate to dashboard
2. Resize browser window or use dev tools
3. **Verify**:
   - Mobile: Single column layout
   - Tablet: Adjusted grid layout
   - Desktop: Full multi-column layout
   - No horizontal scrolling
   - All text readable

#### Test Case 8: Header Integration
1. Login successfully
2. **Verify** header shows:
   - Dashboard button (active on dashboard page)
   - Logout button
3. Click Logout
4. **Verify** header shows:
   - Login button
   - Register button

---

## Troubleshooting

### Issue: Dashboard shows "Failed to load dashboard"

**Possible Causes**:
1. Laravel API not running
2. Invalid or expired token
3. CORS issues
4. Network connectivity

**Solutions**:
1. Verify Laravel API is running: `http://localhost:8000/api/my-details`
2. Clear localStorage and login again
3. Check browser console for CORS errors
4. Verify API endpoint URLs match server configuration

### Issue: Profile completion always shows 0%

**Possible Causes**:
1. Profile not set up in Laravel database
2. API returning wrong data format

**Solutions**:
1. Check API response in browser Network tab
2. Verify profile_completion object structure
3. Ensure user has completed registration

### Issue: Communication statistics not displaying

**Possible Causes**:
1. API endpoint not available
2. User has no interactions yet
3. Token authentication failing

**Solutions**:
1. Test API endpoint directly: `POST /api/communication-views`
2. Verify token in request headers
3. Check for 401 Unauthorized errors
4. Statistics will show 0 for new users (this is normal)

### Issue: Redirect not working after login

**Possible Causes**:
1. Router not properly initialized
2. AuthGuard blocking redirect
3. Browser cache issues

**Solutions**:
1. Clear browser cache
2. Verify useRouter is imported from 'next/navigation'
3. Check console for navigation errors
4. Try hard refresh (Ctrl+Shift+R)

### Issue: Loading spinner never disappears

**Possible Causes**:
1. API request hanging
2. Try-catch not handling error properly
3. Loading state not being updated

**Solutions**:
1. Add timeout to fetch requests
2. Check browser Network tab for stuck requests
3. Verify finally block executes
4. Add console.log to debug loading state changes

---

## Future Enhancements

### Phase 1: Interactive Features
- [ ] Make "Edit Profile" button functional
- [ ] Implement "View Matches" navigation
- [ ] Add "Messages" chat interface
- [ ] Create "Interests Received" list page

### Phase 2: Data Visualization
- [ ] Add charts for communication statistics trends
- [ ] Show profile view history graph
- [ ] Display interest acceptance rate
- [ ] Show monthly activity summary

### Phase 3: Additional Information
- [ ] Display recent profile visitors (with photos)
- [ ] Show shortlisted profiles
- [ ] Add plan/subscription information
- [ ] Display remaining plan credits

### Phase 4: Customization
- [ ] Allow users to customize dashboard layout
- [ ] Add widget system for modular content
- [ ] Implement dark mode support
- [ ] Add notification preferences

### Phase 5: Performance
- [ ] Implement caching for profile data
- [ ] Add optimistic UI updates
- [ ] Lazy load communication statistics
- [ ] Add skeleton screens for better UX

---

## API Reference Summary

### My Details API
- **Method**: GET
- **Endpoint**: `/api/my-details`
- **Authentication**: Required (Bearer Token)
- **Response**: Complete user profile with completion status

### Communication Views API
- **Method**: POST
- **Endpoint**: `/api/communication-views`
- **Authentication**: Required (Bearer Token)
- **Request Body**: `{ "type": "communication_statistics" }`
- **Response**: Statistics object with counts

For complete API documentation, refer to:
- `user-website-api-documentation.md` (API 6: Get My Profile Details)
- `user-website-api-documentation-part2.md` (API 26: Profile Communication Views)

---

## Technical Stack

### Frontend Technologies
- **Framework**: Next.js 15.5.4 (App Router)
- **UI Library**: React 19.0.0
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **TypeScript**: For type safety

### Backend Technologies
- **API**: Laravel 10.x
- **Authentication**: Laravel Sanctum (Bearer Tokens)
- **Database**: MySQL
- **Port**: 8000

### State Management
- **Context API**: For global authentication state
- **Local State**: useState for component-level state
- **Storage**: localStorage for token persistence

---

## Security Considerations

1. **Token Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)
2. **Route Protection**: AuthGuard component prevents unauthorized access
3. **API Security**: All endpoints require Bearer token authentication
4. **Data Validation**: Frontend validates data before display
5. **HTTPS**: Should be used in production environment

---

## Maintenance Notes

### Regular Checks
- Monitor API response times
- Check for console errors
- Verify mobile responsiveness
- Test with different user profiles
- Ensure all profile completion statuses work

### Update Requirements
When updating dashboard:
1. Test all existing features
2. Verify API compatibility
3. Check responsive design
4. Update documentation
5. Test authentication flow

---

## Contact & Support

For issues or questions:
1. Check this documentation first
2. Review API documentation
3. Check browser console for errors
4. Review Network tab for API issues
5. Contact backend team if API issues persist

---

**Last Updated**: January 2025
**Version**: 1.0
**Author**: Development Team
**Related Files**:
- `src/app/dashboard/page.tsx`
- `src/app/login/page.tsx`
- `src/app/register/page.tsx`
- `LOGIN_DOCUMENTATION.md`
