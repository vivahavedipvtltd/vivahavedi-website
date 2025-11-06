# Backend Update Required for Section-Specific Requests

## Issue

The frontend now has **section-specific request buttons** (Education, Family, Hobbies, Astro), but the Laravel API validation only accepts 3 request types:
- `photo_lock`
- `contact_details`
- `general`

However, the backend's `getRequestStatus()` function checks for 12 granular types:
- `photo_add`, `photo_view`
- `basic`, `education`, `family`, `hobbies`
- `astro`, `horoscope`
- `partner_basic`, `partner_religion`, `partner_location`, `partner_education`

## Current Workaround

All section-specific buttons currently send `type: 'general'` to the API, but display section-specific UI. This means:
- ✅ Each section has its own request button
- ✅ Loading states are section-specific
- ✅ Success messages are section-specific
- ❌ Backend stores all as 'general' type instead of granular types

## Required Backend Change

**File:** `c:\wamp64\www\vivahavedi\vivahavedi-laravel-api\app\Http\Controllers\ProfileRequestController.php`

**Line:** 23

### Current Code:
```php
$validator = Validator::make($request->all(), [
    'match_id' => 'required|integer',
    'type' => 'required|string|in:photo_lock,contact_details,general'
]);
```

### Required Update:
```php
$validator = Validator::make($request->all(), [
    'match_id' => 'required|integer',
    'type' => 'required|string|in:photo_lock,contact_details,general,photo_add,photo_view,basic,education,family,hobbies,astro,horoscope,partner_basic,partner_religion,partner_location,partner_education'
]);
```

Or more cleanly:
```php
$validTypes = [
    'photo_lock', 'photo_add', 'photo_view',
    'contact_details', 'general',
    'basic', 'education', 'family', 'hobbies',
    'astro', 'horoscope',
    'partner_basic', 'partner_religion', 'partner_location', 'partner_education'
];

$validator = Validator::make($request->all(), [
    'match_id' => 'required|integer',
    'type' => 'required|string|in:' . implode(',', $validTypes)
]);
```

## Frontend Update (After Backend is Fixed)

Once the backend accepts granular types, update the frontend:

**File:** `src/app/profile/[id]/page.tsx`

**Function:** `handleSendSectionRequest`

### Current Code:
```typescript
body: JSON.stringify({
  match_id: parseInt(profileId),
  type: 'general' // API only accepts general, but tracks granular types internally
}),
```

### Update To:
```typescript
// Map section keys to API request types
const sectionToApiType: Record<string, string> = {
  'education': 'education',
  'family': 'family',
  'hobbies': 'hobbies',
  'astro': 'astro',
  'horoscope': 'horoscope',
  'basic': 'basic',
  'photo_add': 'photo_add',
  'photo_view': 'photo_lock', // Note: different naming
  'partner_basic': 'partner_basic',
  'partner_religion': 'partner_religion',
  'partner_location': 'partner_location',
  'partner_education': 'partner_education'
};

body: JSON.stringify({
  match_id: parseInt(profileId),
  type: sectionToApiType[sectionKey] || 'general'
}),
```

## Testing After Backend Update

1. **Clear existing requests** from database:
```sql
DELETE FROM user_request WHERE ur_from = YOUR_USER_ID;
```

2. **Test each section**:
   - Click "Request Education & Career Details"
   - Verify database has `ur_type = 'education'`
   - Verify UI shows "Request Sent"
   - Refresh page, verify button still shows "Request Sent"

3. **Test request tracking**:
   - Request Education → Check `request.education = true`
   - Request Family → Check `request.family = true`
   - Both sections should show "Request Sent" independently

## Benefits After Backend Update

1. **Granular Tracking** - Each section request is tracked separately
2. **Proper Analytics** - Know which sections are most frequently requested
3. **Targeted Notifications** - User receives "Education request" vs generic "Profile request"
4. **Better UX** - User can request multiple sections, each tracked independently

## Migration Notes

### Database Impact
- No migration needed
- `user_request` table already has `ur_type` VARCHAR field
- Field already accepts any string value
- Only API validation needs updating

### Backward Compatibility
- Existing 'general', 'photo_lock', 'contact_details' requests will continue to work
- New granular types will be additional options
- No breaking changes

## Priority

**Medium-High** - Current workaround functions but doesn't provide the full intended user experience of section-specific request tracking.

---

**Status:** Waiting for backend validation update
**Blocked:** No - frontend functional with workaround
**Frontend Ready:** Yes - will work immediately after backend update
