# Profile Communication APIs Integration Documentation

## Overview
This document describes the integration of Profile Communication APIs (APIs 20-25) into the profile details page (`/profile/[id]`). The integration enables users to interact with profiles through various communication features.

## APIs Integrated

### 1. Send Interest (API 20)
- **Endpoint**: `POST /api/send-interest`
- **Description**: Send interest expression to another user's profile
- **Authentication**: Required (Bearer Token)
- **Request Body**: `{ "match_id": number }`
- **Features**:
  - Plan validation and expiry checks
  - Time interval limit enforcement
  - Same gender prevention
  - Duplicate interest prevention
  - Push notification support

**Response Scenarios**:
- Success: `{ "status": "success", "message": "interest_send" }`
- Already Sent: `{ "status": "success", "message": "already_send" }`
- Plan Expired: `{ "status": "failed", "message": "plan_expired" }`
- Same Gender: `{ "status": "failed", "message": "same_gender" }`
- Time Limit: `{ "status": "failed", "message": "time_limit", "time": "..." }`

### 2. Add to Shortlist (API 23)
- **Endpoint**: `POST /api/add-shortlist`
- **Description**: Add user profile to shortlist for easy access
- **Authentication**: Required (Bearer Token)
- **Request Body**: `{ "match_id": number }`

**Response Scenarios**:
- Success: `{ "status": "success", "message": "shortlisted" }`
- Already Shortlisted: `{ "status": "success", "message": "already_shortlisted" }`

### 3. Remove from Shortlist (API 24)
- **Endpoint**: `DELETE /api/remove-shortlist`
- **Description**: Remove user profile from shortlist
- **Authentication**: Required (Bearer Token)
- **Request Body**: `{ "match_id": number }`

**Response Scenarios**:
- Success: `{ "status": "success", "message": "shortlist_removed" }`
- Not in Shortlist: `{ "status": "success", "message": "not_in_shortlist" }`

### 4. View Contact Details (API 22)
- **Endpoint**: `POST /api/contact-details`
- **Description**: View contact information (mobile, phone, address) of a profile
- **Authentication**: Required (Bearer Token)
- **Request Body**: `{ "match_id": number }`
- **Features**:
  - Plan validation and contact view limit
  - Time interval restrictions
  - Tracks contact views
  - Returns remaining contact views

**Response Scenarios**:
- First Time: `{ "status": "success", "message": "newly_viewed", "data": {...} }`
- Already Viewed: `{ "status": "success", "message": "already_viewed", "data": {...} }`
- Plan Expired: `{ "status": "failed", "message": "plan_expired" }`
- Time Limit: `{ "status": "failed", "message": "time_limit", "time": "..." }`

## Frontend Implementation

### File Location
`C:\wamp64\www\vivahavedi\matrimonial-website\src\app\profile\[id]\page.tsx`

### State Management

```typescript
const [isInterestSent, setIsInterestSent] = useState(false);
const [isShortlisted, setIsShortlisted] = useState(false);
const [actionLoading, setActionLoading] = useState<string | null>(null);
```

### Key Functions

#### 1. handleSendInterest()
- Sends interest to the profile
- Updates UI state on success
- Handles all error scenarios with appropriate user feedback
- Prevents duplicate requests while loading

#### 2. handleToggleShortlist()
- Toggles shortlist status (add/remove)
- Dynamically chooses endpoint based on current state
- Updates UI state immediately after success
- Provides user feedback via alerts

#### 3. handleViewContact()
- Fetches and displays contact details
- Shows remaining contact view count
- Handles plan expiry and time limits
- Displays contact info in alert (can be upgraded to modal)

### UI Components

#### Send Interest Button
```tsx
<button
  onClick={handleSendInterest}
  disabled={isInterestSent || actionLoading === 'interest'}
  className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-semibold transition-colors ${
    isInterestSent
      ? 'bg-gray-400 cursor-not-allowed text-white'
      : 'bg-red-500 hover:bg-red-600 text-white'
  }`}
>
  {actionLoading === 'interest' ? (
    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
  ) : (
    <Heart className={`h-5 w-5 mr-2 ${isInterestSent ? 'fill-current' : ''}`} />
  )}
  {isInterestSent ? 'Interest Sent' : 'Send Interest'}
</button>
```

#### Shortlist Button
```tsx
<button
  onClick={handleToggleShortlist}
  disabled={actionLoading === 'shortlist'}
  className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-semibold transition-colors ${
    isShortlisted
      ? 'bg-yellow-500 hover:bg-yellow-600 text-white border-2 border-yellow-500'
      : 'bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700'
  }`}
>
  {actionLoading === 'shortlist' ? (
    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
  ) : (
    <Bookmark className={`h-5 w-5 mr-2 ${isShortlisted ? 'fill-current' : ''}`} />
  )}
  {isShortlisted ? 'Shortlisted' : 'Shortlist'}
</button>
```

#### View Contact Button
```tsx
<button
  onClick={handleViewContact}
  disabled={actionLoading === 'contact'}
  className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
>
  {actionLoading === 'contact' ? (
    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
  ) : (
    <Phone className="h-5 w-5 mr-2" />
  )}
  View Contact
</button>
```

## Backend Implementation

### Controller Location
`C:\wamp64\www\vivahavedi\vivahavedi-laravel-api\app\Http\Controllers\ProfileCommunicationController.php`

### Database Models Used
- **User**: User profile information
- **PlanTaken**: User's active plan and limits
- **Inbox**: Interest messages storage
- **UserShortlist**: Shortlisted profiles
- **ContactView**: Contact view tracking
- **FcmToken**: Push notification tokens

### Key Features in Backend

1. **Plan Validation**
   - Checks plan expiry date
   - Validates available credits/limits
   - Enforces time interval restrictions

2. **Business Logic**
   - Same gender prevention
   - Duplicate prevention
   - Automatic credit deduction
   - Contact view tracking

3. **Security**
   - Bearer token authentication
   - Input validation
   - User existence checks
   - Gender-based access control

## API Configuration

### Base URL
- **Development**: `http://localhost:8000/api`
- **Production**: Update to production URL

### Headers Required
```typescript
{
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${token}`
}
```

## Error Handling

### Frontend Error Handling
1. Network errors: Try-catch with user-friendly messages
2. API errors: Parse response and show specific error messages
3. Loading states: Prevent duplicate requests
4. User feedback: Alert dialogs for success/error

### Common Error Messages
- `plan_expired`: User's plan has expired
- `same_gender`: Cannot interact with same gender
- `time_limit`: Time interval restriction active
- `already_send/already_shortlisted`: Duplicate action prevented

## Future Enhancements

### Recommended Improvements

1. **UI/UX Enhancements**
   - Replace alerts with toast notifications
   - Add modal for contact details display
   - Implement confirmation dialogs for destructive actions
   - Add animation for state changes

2. **Feature Additions**
   - Implement Respond to Interest (API 21)
   - Add Get My Shortlist view (API 25)
   - Integrate chat system (APIs 27.x)
   - Add profile request system (APIs 46-48)

3. **State Management**
   - Consider using Context API or Redux
   - Implement optimistic UI updates
   - Add local caching for frequently accessed data

4. **Error Handling**
   - Implement global error boundary
   - Add retry mechanisms for failed requests
   - Log errors to monitoring service

5. **Performance**
   - Debounce button clicks
   - Add request cancellation for unmounted components
   - Implement lazy loading for profile details

## Testing Guidelines

### Test Scenarios

1. **Send Interest**
   - First time interest send
   - Already sent interest
   - Plan expired scenario
   - Time limit scenario
   - Same gender prevention

2. **Shortlist**
   - Add to shortlist
   - Remove from shortlist
   - Toggle multiple times
   - Already shortlisted

3. **View Contact**
   - First time view (credit deduction)
   - Already viewed (no deduction)
   - Plan expired
   - Time limit active
   - Remaining contacts display

### Test Data
- Use different user profiles with various plan types
- Test with expired plans
- Test with users of same/opposite gender
- Test with time interval restrictions

## API Routes Configuration

### Laravel Routes (api.php)
```php
// Profile Communication APIs
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/send-interest', [ProfileCommunicationController::class, 'sendInterest']);
    Route::post('/interest-response', [ProfileCommunicationController::class, 'respondToInterest']);
    Route::post('/contact-details', [ProfileCommunicationController::class, 'viewContactDetails']);
    Route::post('/add-shortlist', [ProfileCommunicationController::class, 'addToShortlist']);
    Route::delete('/remove-shortlist', [ProfileCommunicationController::class, 'removeFromShortlist']);
    Route::get('/my-shortlist', [ProfileCommunicationController::class, 'getShortlistedProfiles']);
});
```

## Deployment Checklist

- [ ] Update API base URL for production
- [ ] Test all communication features
- [ ] Verify plan validation logic
- [ ] Test error scenarios
- [ ] Update environment variables
- [ ] Configure CORS for production domain
- [ ] Set up error logging
- [ ] Configure push notifications (if implemented)

## Support & Maintenance

### Documentation References
- Main API Documentation: `user-website-api-documentation.md`
- Communication APIs: `user-website-api-documentation-part2.md` (APIs 20-25)
- Profile Details API: API 19

### Contact Information
- Backend Developer: Check Laravel controller comments
- Frontend Developer: Check React component comments
- API Issues: Review error logs in Laravel

---

**Last Updated**: 2025-10-02
**Version**: 1.0
**Status**: Integration Complete - Ready for Testing
