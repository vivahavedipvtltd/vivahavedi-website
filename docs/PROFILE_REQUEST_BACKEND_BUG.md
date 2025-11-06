# Profile Request Backend Bug - FIXED ✅

## Issue (RESOLVED)
The `ProfileDetailsController::getRequestStatus()` method in the Laravel backend had incorrect table name and column references.

## Location
File: `C:\wamp64\www\vivahavedi\vivahavedi-laravel-api\app\Http\Controllers\ProfileDetailsController.php`
Line: ~555-558

## Previous Code (INCORRECT)
```php
$existingRequests = DB::table('user_request')
                     ->where('user_id', $currentUserId)
                     ->where('request_user_id', $matchId)
                     ->pluck('ur_type')
                     ->toArray();
```

## Current Code (✅ FIXED)
```php
$existingRequests = DB::table('user_requests')  // ✅ Correct: plural 'user_requests'
                     ->where('ur_from', $currentUserId)  // ✅ Correct: 'ur_from'
                     ->where('ur_to', $matchId)          // ✅ Correct: 'ur_to'
                     ->pluck('ur_type')
                     ->toArray();
```

## Explanation
According to the `ProfileRequest` model (app/Models/ProfileRequest.php):
- Table name is `user_requests` (plural), not `user_request` (singular)
- Columns are:
  - `ur_from` (sender user ID) - not `user_id`
  - `ur_to` (receiver user ID) - not `request_user_id`
  - `ur_type` (request type) ✓ correct

## Impact (BEFORE FIX)
This bug prevented the profile details API from correctly detecting which profile request types have already been sent by the current user to the viewed profile. This caused:
- Request buttons not showing "Already Requested" status correctly
- Users potentially sending duplicate requests
- Frontend not knowing which sections have already been requested

## Status: ✅ FIXED
The backend has been updated with the correct table and column names. The integration is now working correctly.

## Frontend Changes Made
The Next.js frontend (src/app/profile/[id]/page.tsx) has been updated to:
1. Use correct request types from API documentation (photo_add, photo_view, basic, education, family, etc.)
2. Add photo request buttons for:
   - "Request to Add Photo" when photo_status is 'avatar'
   - "Request to View Photo" when photo_status is 'locked'
3. Show "Request Sent" status based on the `request` object from API
4. Send correct payload types for each section-specific request

Once the backend bug is fixed, all request buttons will correctly show their status.
