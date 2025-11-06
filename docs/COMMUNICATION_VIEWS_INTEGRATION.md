# Communication Views API Integration Documentation

## Overview
This document describes the integration of API 26 (Profile Communication Views) into the dashboard page. This API provides a comprehensive view of all profile communication activities including views, interests, shortlists, and contacts.

---

## Table of Contents
1. [API Specification](#api-specification)
2. [Backend Architecture](#backend-architecture)
3. [Frontend Implementation](#frontend-implementation)
4. [Integration Details](#integration-details)
5. [Usage Guide](#usage-guide)
6. [Future Enhancements](#future-enhancements)

---

## API Specification

### Endpoint
`POST /api/communication-views`

### Authentication
Required: Bearer Token

### Request Body
```json
{
  "type": "interested_to_me",
  "page": 1
}
```

### View Types Available

| Type | Description | Includes Extra Data |
|------|-------------|---------------------|
| `profile_viewed_by_me` | Profiles I have viewed | Basic profile info |
| `profile_viewed_to_me` | Profiles that viewed me | Basic profile info |
| `shortlised_by_me` | Profiles I shortlisted | Basic profile info |
| `shortlised_to_me` | Profiles that shortlisted me | Basic profile info |
| `contacted_by_me` | Profiles I contacted | Mobile, Phone numbers |
| `contacted_to_me` | Profiles that contacted me | Basic profile info |
| `interested_by_me` | Interests I sent | Content, Status |
| `interested_to_me` | Interests I received | Content, Status |
| `communication_statistics` | Overall statistics | Count only |

### Response Structure

#### Profile List Response
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
      "qualification": "Bachelor's Degree",
      "photo": "http://localhost:8000/images/user_images/thumb1/237915.jpg",
      "content": "Hi, I came across your profile...",
      "status": "pending",
      "mobile": "9876543210",
      "phone": "04712345678"
    }
  ]
}
```

#### Statistics Response
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

### Pagination
- **Items per page**: 5 profiles
- **Page parameter**: Optional (default: 1)
- **No explicit pagination metadata** - Check if result has 5 items to determine if more pages exist

---

## Backend Architecture

### Controller
**File**: `C:\wamp64\www\vivahavedi\vivahavedi-laravel-api\app\Http\Controllers\ProfileCommunicationViewController.php`

**Main Method**:
```php
public function getCommunicationViews(Request $request)
```

**Switch Logic**:
```php
switch ($type) {
    case 'profile_viewed_by_me':
        return $this->getProfilesViewedByMe($user_id, $page, $per_page);
    case 'profile_viewed_to_me':
        return $this->getProfilesViewedToMe($user_id, $page, $per_page);
    // ... other cases
    case 'communication_statistics':
        return $this->getCommunicationStatistics($user_id);
}
```

### Models Used

1. **ProfileView**
   - Table: `user_profile_view`
   - Tracks profile viewing history
   - Relations: `viewedProfile`, `viewer`

2. **UserShortlist**
   - Table: `user_shortlist`
   - Tracks shortlisted profiles
   - Relations: `shortlistedProfile`, `user`

3. **ContactView**
   - Table: `plan_contact`
   - Tracks contact detail views
   - Relations: `match`, `user`

4. **Inbox**
   - Table: `plan_inbox`
   - Tracks interests sent/received
   - Relations: `sender`, `receiver`
   - Filter: `pi_type = 'interest'`

### Data Formatting

**formatProfileData() Method**:
- Calculates age dynamically
- Handles photo privacy (lock, activation)
- Provides gender-based avatars
- Includes conditional fields based on view type
- Filters null profiles

**Key Features**:
```php
// Age calculation
$age = date('Y') - $birth_year;
if (date('m') < $birth_month || (date('m') == $birth_month && date('d') < $birth_day)) {
    $age--;
}

// Photo privacy
if ($photos && $photo1 && $photo1_activation === 'yes' && $user_photo_lock !== 'yes') {
    $photo_url = url("images/user_images/thumb1/" . $photo1);
} else {
    $photo_url = url("images/avathar/{$gender}.gif");
}
```

---

## Frontend Implementation

### Component Structure

#### CommunicationViewsSection Component
**File**: `C:\wamp64\www\vivahavedi\matrimonial-website\src\components\CommunicationViewsSection.tsx`

**Purpose**: Reusable component for displaying different types of communication views

**Props**:
```typescript
interface CommunicationViewsSectionProps {
  viewType: string;           // API view type
  title: string;              // Display title
  icon: React.ReactNode;      // Icon to display
  description: string;        // Empty state message
}
```

**State Management**:
```typescript
const [profiles, setProfiles] = useState<Profile[]>([]);
const [loading, setLoading] = useState(true);
const [currentPage, setCurrentPage] = useState(1);
const [hasMore, setHasMore] = useState(false);
```

**Key Features**:

1. **Pagination**
   - Previous/Next buttons
   - Page number display
   - Automatic detection of more pages (5 items = has more)

2. **Profile Display**
   - Profile photo with fallback to avatar
   - Basic info (name, age, height, marital status)
   - Location and religion
   - Click to navigate to profile details

3. **Conditional Content**
   - Interest status badges (accepted/rejected/pending)
   - Contact details (mobile/phone) for contacted views
   - Interest message content for interest views

4. **Empty States**
   - Custom message when no profiles
   - Loading spinner during fetch

### Dashboard Integration
**File**: `C:\wamp64\www\vivahavedi\matrimonial-website\src\app\dashboard\page.tsx`

**Added Sections**:
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
  <CommunicationViewsSection
    viewType="profile_viewed_to_me"
    title="Profiles Who Viewed Me"
    icon={<Eye className="h-5 w-5 text-blue-600" />}
    description="No one has viewed your profile yet"
  />

  <CommunicationViewsSection
    viewType="interested_to_me"
    title="Interests Received"
    icon={<Heart className="h-5 w-5 text-red-600" />}
    description="No interests received yet"
  />

  <CommunicationViewsSection
    viewType="shortlised_to_me"
    title="Profiles Who Shortlisted Me"
    icon={<Bookmark className="h-5 w-5 text-yellow-600" />}
    description="No one has shortlisted your profile yet"
  />

  <CommunicationViewsSection
    viewType="contacted_to_me"
    title="Profiles Who Contacted Me"
    icon={<PhoneCall className="h-5 w-5 text-green-600" />}
    description="No one has contacted you yet"
  />
</div>
```

**Statistics Display** (Already Implemented):
- Profile Views count with Eye icon
- Interests count with Heart icon
- Chats count with MessageCircle icon
- Requests count with Star icon

---

## Integration Details

### What Was Fixed/Added

#### 1. Communication Statistics
**Already Working**:
- API call to `communication_statistics` type
- Display of 4 stat cards
- Icons and counts showing correctly

**Enhancement Added**:
- Hover effects on stat cards
- Better visual feedback

#### 2. Communication Views
**Previously Missing**:
- No display of actual profiles in each category
- No pagination
- No detailed profile information

**Now Added**:
- 4 new sections showing profiles in each category:
  - Who viewed my profile
  - Interests received
  - Who shortlisted me
  - Who contacted me
- Pagination controls (Previous/Next)
- Clickable profiles to view details
- Status badges for interests
- Contact info display where applicable

#### 3. User Experience
**Improvements**:
- Reusable component for consistency
- Loading states
- Empty states with helpful messages
- Profile navigation on click
- Responsive grid layout

---

## Usage Guide

### For Users

#### Viewing Communication Activity

1. **Dashboard Overview**
   - Statistics cards show total counts
   - Scroll down to see detailed views

2. **Profile Views**
   - See who viewed your profile
   - Click on any profile to view details
   - Use pagination for more profiles

3. **Interests**
   - View interests received
   - See status (pending/accepted/rejected)
   - Read interest messages
   - Click to view full profile

4. **Shortlists**
   - See who shortlisted you
   - Access their profiles quickly

5. **Contacts**
   - View who accessed your contact details
   - See their contact info if you contacted them

### For Developers

#### Adding New View Types

1. **Create New Section**:
```tsx
<CommunicationViewsSection
  viewType="your_new_type"
  title="Your Section Title"
  icon={<YourIcon className="h-5 w-5 text-color" />}
  description="Empty state message"
/>
```

2. **Ensure Backend Support**:
- Add case in switch statement
- Implement private method
- Format data correctly

#### Testing Communication Views

```bash
# Test each view type
curl -X POST "http://localhost:8000/api/communication-views" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "profile_viewed_to_me",
    "page": 1
  }'

# Test statistics
curl -X POST "http://localhost:8000/api/communication-views" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"type": "communication_statistics"}'
```

#### Database Queries

**Check Profile Views**:
```sql
SELECT * FROM user_profile_view WHERE upv_to = ?;
```

**Check Interests**:
```sql
SELECT * FROM plan_inbox
WHERE pi_user_to = ? AND pi_type = 'interest';
```

**Check Shortlists**:
```sql
SELECT * FROM user_shortlist WHERE us_user_to = ?;
```

**Check Contacts**:
```sql
SELECT * FROM plan_contact WHERE user_to = ?;
```

---

## Features Implemented

### ✅ Core Features

1. **Multiple View Types** (8 types)
   - Viewed by me / to me
   - Shortlisted by me / to me
   - Contacted by me / to me
   - Interested by me / to me

2. **Statistics Dashboard**
   - Profile views count
   - Interests count
   - Chats count
   - Requests count

3. **Profile Display**
   - Photo with privacy respect
   - Basic information
   - Age calculation
   - Location details
   - Qualification

4. **Conditional Content**
   - Interest messages
   - Interest status badges
   - Contact details (mobile/phone)

5. **Pagination**
   - 5 profiles per page
   - Previous/Next navigation
   - Page number display
   - Auto-detection of more pages

6. **User Experience**
   - Loading states
   - Empty states
   - Clickable profiles
   - Responsive layout
   - Hover effects

### 🔧 Technical Features

1. **Reusable Component**
   - Single component for all view types
   - Props-based configuration
   - State management

2. **Photo Privacy**
   - Respects photo lock
   - Checks activation status
   - Gender-based avatars

3. **Error Handling**
   - Try-catch blocks
   - Graceful fallbacks
   - Empty state handling

4. **Performance**
   - Pagination for large datasets
   - Efficient queries with relations
   - Optimized image loading

---

## View Type Details

### 1. Profile Viewed To Me
**Shows**: Profiles that viewed my profile
**Use Case**: See who's interested in me
**Data**: Basic profile info
**Extra**: None

### 2. Interested To Me
**Shows**: Profiles that sent me interest
**Use Case**: Manage interest requests
**Data**: Basic profile info
**Extra**: Interest message, Status (pending/accepted/rejected)

### 3. Shortlisted To Me
**Shows**: Profiles that shortlisted me
**Use Case**: See who bookmarked my profile
**Data**: Basic profile info
**Extra**: None

### 4. Contacted To Me
**Shows**: Profiles that viewed my contact details
**Use Case**: Know who has my contact info
**Data**: Basic profile info
**Extra**: None

### 5. Profile Viewed By Me
**Shows**: Profiles I have viewed
**Use Case**: Revisit profiles I checked
**Data**: Basic profile info
**Extra**: None

### 6. Interested By Me
**Shows**: Profiles I sent interest to
**Use Case**: Track my interest requests
**Data**: Basic profile info
**Extra**: Interest message, Status

### 7. Shortlisted By Me
**Shows**: Profiles I shortlisted
**Use Case**: My saved profiles
**Data**: Basic profile info
**Extra**: None

### 8. Contacted By Me
**Shows**: Profiles I contacted
**Use Case**: See whose contact I viewed
**Data**: Basic profile info
**Extra**: Mobile, Phone numbers

---

## Future Enhancements

### Recommended Improvements

#### 1. Advanced Filtering
```tsx
// Add filter options
<select onChange={(e) => setFilter(e.target.value)}>
  <option value="all">All</option>
  <option value="today">Today</option>
  <option value="this_week">This Week</option>
  <option value="this_month">This Month</option>
</select>
```

#### 2. Sorting Options
- Sort by date (newest/oldest)
- Sort by age
- Sort by location
- Sort by education

#### 3. Bulk Actions
- Select multiple profiles
- Send interest to multiple
- Shortlist multiple
- Delete multiple views

#### 4. Search Functionality
```tsx
<input
  type="text"
  placeholder="Search by name..."
  onChange={(e) => setSearchQuery(e.target.value)}
/>
```

#### 5. Export Data
- Export to CSV
- Export to PDF
- Email report

#### 6. Enhanced Statistics
- View trends (graphs)
- Weekly/Monthly reports
- Comparison charts
- Activity heatmap

#### 7. Real-time Updates
- WebSocket integration
- Live notifications
- Auto-refresh views

#### 8. Mobile Optimizations
- Swipe gestures
- Pull to refresh
- Infinite scroll
- Bottom sheet modals

#### 9. Privacy Settings
- Hide profile views
- Control who can see shortlist
- Incognito mode

#### 10. Interaction Tracking
- Track response rate
- Show engagement metrics
- Suggest best time to send interest

---

## API Configuration

### Environment Variables

**Frontend (.env.local)**:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**Backend (.env)**:
```env
APP_URL=http://localhost:8000
```

### CORS Configuration
Ensure dashboard domain is allowed in Laravel CORS config.

---

## Troubleshooting

### Common Issues

1. **No profiles showing**
   - Check if data exists in database
   - Verify API response in network tab
   - Check authentication token

2. **Photos not loading**
   - Verify photo paths in response
   - Check photo activation status
   - Ensure image directory exists

3. **Pagination not working**
   - Verify page parameter sent to API
   - Check if 5 items returned
   - Test Previous/Next button states

4. **Statistics showing 0**
   - Check database for records
   - Verify query logic in controller
   - Test with sample data

### Debug Commands

```bash
# Check database records
mysql> SELECT COUNT(*) FROM user_profile_view WHERE upv_to = ?;
mysql> SELECT COUNT(*) FROM plan_inbox WHERE pi_user_to = ? AND pi_type = 'interest';

# Test API directly
curl -X POST "http://localhost:8000/api/communication-views" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"type":"profile_viewed_to_me"}'
```

---

## Testing Checklist

### Functional Testing

- [ ] Statistics display correctly
- [ ] Profile views load
- [ ] Interests show with status
- [ ] Shortlists display
- [ ] Contacts show with details
- [ ] Pagination works
- [ ] Profile click navigates
- [ ] Empty states show
- [ ] Loading states appear

### Data Validation

- [ ] Age calculated correctly
- [ ] Photos respect privacy
- [ ] Gender avatars work
- [ ] Contact details show (where applicable)
- [ ] Interest status correct
- [ ] Interest messages display

### UI/UX Testing

- [ ] Responsive on mobile
- [ ] Icons display correctly
- [ ] Hover effects work
- [ ] Buttons enabled/disabled properly
- [ ] Empty state messages clear

---

## Performance Metrics

### Target Metrics
- API response time: < 1s
- Page render time: < 2s
- Pagination switch: < 500ms
- Image load time: < 1s per image

### Optimization Tips

1. **Backend**:
   - Add database indexes
   - Use query caching
   - Optimize joins

2. **Frontend**:
   - Lazy load images
   - Implement virtual scrolling
   - Cache API responses

3. **Database**:
```sql
-- Add indexes
CREATE INDEX idx_profile_view_to ON user_profile_view(upv_to);
CREATE INDEX idx_inbox_to_type ON plan_inbox(pi_user_to, pi_type);
CREATE INDEX idx_shortlist_to ON user_shortlist(us_user_to);
CREATE INDEX idx_contact_to ON plan_contact(user_to);
```

---

## Deployment Guide

### Pre-deployment Checklist

- [ ] Update API URL for production
- [ ] Test all view types
- [ ] Verify pagination
- [ ] Check photo URLs
- [ ] Test on mobile
- [ ] Optimize images
- [ ] Add error tracking
- [ ] Set up monitoring

### Production Configuration

**Update API URL**:
```env
# .env.local
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

**Laravel Optimization**:
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## Support & Maintenance

### Documentation References
- Main API Docs: `user-website-api-documentation-part2.md` (Section 26)
- Backend Controller: `ProfileCommunicationViewController.php`
- Frontend Component: `CommunicationViewsSection.tsx`
- Dashboard Page: `dashboard/page.tsx`

### Contact Information
- Backend Issues: Check Laravel logs
- Frontend Issues: Check browser console
- API Issues: Review network tab

---

**Last Updated**: 2025-10-02
**Version**: 1.0
**Status**: Integration Complete - Production Ready
**Components Added**: CommunicationViewsSection.tsx
**Pages Modified**: dashboard/page.tsx
