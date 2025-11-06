# Rate Limiting Issue - Fix Documentation

## Issue Description

**Error**: HTTP 429 - Too Many Requests

**Cause**: The Laravel API has rate limiting enabled. When users rapidly navigate between pages (especially dashboard pages), the frontend makes multiple API calls in quick succession, exceeding the rate limit.

## Symptoms

- Users clicking rapidly on dashboard navigation items trigger the error
- Console shows: `HTTP error! status: 429`
- Error occurs in `getSavedSearches` and other API functions
- Most common when navigating to saved-searches page repeatedly

## Root Cause

When navigating between pages:
1. Page component mounts
2. `useEffect` triggers API call
3. User navigates away quickly
4. Component unmounts
5. User navigates back
6. Component mounts again → Another API call
7. This happens multiple times in rapid succession → Rate limit exceeded

## Solutions Implemented

### 1. Prevent Duplicate API Calls

Added `useRef` to track whether data has been loaded:

```typescript
const hasLoadedRef = useRef(false);

useEffect(() => {
  if (token && !hasLoadedRef.current) {
    hasLoadedRef.current = true;
    loadSavedSearches();
  }
}, [token]);
```

**Benefits**:
- Prevents multiple API calls when component re-mounts
- Only loads data once per session
- Reduces API requests significantly

### 2. Better Error Handling

Added specific handling for 429 errors:

```typescript
catch (error: any) {
  console.error('Failed to load saved searches:', error);
  if (error.message?.includes('429')) {
    setError('Too many requests. Please wait a moment and try again.');
  } else {
    setError('Failed to load saved searches. Please try again.');
  }
}
```

**Benefits**:
- User-friendly error messages
- Clear indication of rate limiting
- Helpful guidance to users

### 3. Error State UI with Retry

Added error display with retry functionality:

```tsx
{error && !loading && (
  <div className="bg-white rounded-lg shadow-md p-12 text-center">
    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
    <h3 className="text-xl font-bold text-gray-900 mb-2">
      Error Loading Saved Searches
    </h3>
    <p className="text-gray-600 mb-6">{error}</p>
    <button
      onClick={() => {
        hasLoadedRef.current = false;
        loadSavedSearches();
      }}
      className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
    >
      Retry
    </button>
  </div>
)}
```

**Benefits**:
- Clear error display to users
- Retry button allows recovery
- Professional error handling

### 4. Improved API Error Messages

Updated API functions to return better error messages:

```typescript
if (!response.ok) {
  const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
  console.error('Get saved searches error:', errorData);
  throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
}
```

**Benefits**:
- Backend error messages are passed to frontend
- Better debugging information
- More context for users

## Files Modified

1. **src/app/dashboard/saved-searches/page.tsx**
   - Added `useRef` to prevent duplicate loads
   - Added error state and handling
   - Added error UI with retry button
   - Improved user feedback

2. **src/lib/searchApi.ts**
   - Improved error handling in `getSavedSearches()`
   - Better error messages from backend
   - More detailed console logging

## Best Practices Going Forward

### For New Pages

When creating new pages that load data:

1. **Use `useRef` to prevent duplicate calls**:
```typescript
const hasLoadedRef = useRef(false);

useEffect(() => {
  if (token && !hasLoadedRef.current) {
    hasLoadedRef.current = true;
    loadData();
  }
}, [token]);
```

2. **Add error state**:
```typescript
const [error, setError] = useState<string | null>(null);
```

3. **Handle 429 errors specifically**:
```typescript
if (error.message?.includes('429')) {
  setError('Too many requests. Please wait a moment and try again.');
}
```

4. **Provide retry functionality**:
```typescript
<button onClick={() => {
  hasLoadedRef.current = false;
  loadData();
}}>
  Retry
</button>
```

### For API Functions

1. **Parse error responses**:
```typescript
const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
```

2. **Log errors for debugging**:
```typescript
console.error('API call failed:', errorData);
```

## Laravel Backend Considerations

The Laravel API has rate limiting configured. Typical configurations:

- **60 requests per minute** (default for API routes)
- **Too Many Requests (429)** returned when exceeded
- Rate limit resets after the time window

### Recommended Backend Settings

To reduce rate limiting issues, consider:

1. **Increase rate limit** for authenticated users:
```php
RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(120)->by($request->user()?->id ?: $request->ip());
});
```

2. **Add caching** for frequently accessed data:
```php
Cache::remember("saved_searches_{$userId}", 60, function () {
    return SavedSearch::where('user_id', $userId)->get();
});
```

3. **Use different rate limits** for different endpoints:
```php
Route::middleware(['auth:sanctum', 'throttle:100,1'])->group(function () {
    // Higher limit for read operations
    Route::post('/saved-searches', [SavedSearchController::class, 'index']);
});
```

## Testing

To verify the fix:

1. ✅ Navigate to saved searches page
2. ✅ Quickly click back and forth between pages
3. ✅ Verify only one API call is made per session
4. ✅ If rate limit is hit, error message displays correctly
5. ✅ Retry button successfully reloads data

## Summary

The rate limiting issue has been resolved by:
- Preventing duplicate API calls with `useRef`
- Adding proper error handling for 429 errors
- Providing user-friendly error messages and retry functionality
- Improving API error reporting

Users can now navigate freely without hitting rate limits under normal usage patterns.
