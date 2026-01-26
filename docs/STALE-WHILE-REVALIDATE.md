# Stale-While-Revalidate Strategy

## Overview

This application implements the **stale-while-revalidate** caching pattern using SWR (stale-while-revalidate) library. This pattern provides optimal user experience by:

1. **Showing cached data instantly** (no loading spinners)
2. **Revalidating in background** (fetch fresh data)
3. **Updating UI smoothly** (when fresh data arrives)

## How It Works

### First Visit (Cold Cache)
```
User visits dashboard
  ↓
No cached data exists
  ↓
Show loading spinner
  ↓
Fetch data from API
  ↓
Store in cache
  ↓
Display data
```

**Time to interactive:** ~500-1000ms (API latency)

---

### Subsequent Visits (Warm Cache)
```
User visits dashboard
  ↓
Cached data exists! ✅
  ↓
Display cached data INSTANTLY (0ms)
  ↓
(In background) Check if data is stale
  ↓
If stale: Fetch fresh data from API
  ↓
Update UI when fresh data arrives
```

**Time to interactive:** ~0ms (instant!)
**Fresh data arrives:** ~500-1000ms (invisible to user)

---

## User Experience Comparison

### Without Stale-While-Revalidate ❌
```
Visit 1: Loading... (1000ms) → Data
Visit 2: Loading... (1000ms) → Data
Visit 3: Loading... (1000ms) → Data
```
**User sees loading spinner every time** 😞

### With Stale-While-Revalidate ✅
```
Visit 1: Loading... (1000ms) → Data
Visit 2: Data (0ms) → [Background refresh] → Updated data
Visit 3: Data (0ms) → [Background refresh] → Updated data
```
**User sees instant data after first load** 🚀

---

## Configuration

### Dashboard Data (Semi-Static)

**File:** `src/lib/swrConfig.ts`

```typescript
export const semiStaticDataConfig: SWRConfiguration = {
  revalidateOnFocus: false,      // Don't refetch on focus (prevent excessive requests)
  revalidateOnReconnect: true,   // Refetch when network restored
  revalidateIfStale: true,       // ✅ CRITICAL: Revalidate stale data in background
  revalidateOnMount: true,       // ✅ Always revalidate on mount (ensure freshness)
  dedupingInterval: 60000,       // Cache for 1 minute (60 seconds)
  refreshInterval: 300000,       // Auto-refresh every 5 minutes
  keepPreviousData: true,        // ✅ CRITICAL: Show stale data while fetching
  compare: (a, b) => {...},      // Prevent unnecessary re-renders
};
```

**Cache Duration:** 60 seconds
**Auto-Refresh:** Every 5 minutes
**Behavior:** Show cached data → Revalidate in background

---

### Dynamic Data (Messages, Notifications)

**File:** `src/lib/swrConfig.ts`

```typescript
export const dynamicDataConfig: SWRConfiguration = {
  revalidateOnFocus: true,       // ✅ Refetch when user switches back to tab
  revalidateOnReconnect: true,   // ✅ Refetch when network restored
  revalidateIfStale: true,       // ✅ Revalidate stale data in background
  dedupingInterval: 10000,       // Cache for 10 seconds
  refreshInterval: 60000,        // Auto-refresh every 1 minute
  keepPreviousData: true,        // ✅ Show stale data while fetching
};
```

**Cache Duration:** 10 seconds
**Auto-Refresh:** Every 1 minute
**Focus Revalidation:** ✅ Enabled (for real-time feel)

---

## Real-World Examples

### Example 1: Dashboard Data

```typescript
// Hook usage
const { myDetails, isLoading, error } = useDashboardData(token);

// First visit
// isLoading: true → (fetch) → isLoading: false, myDetails: {...}

// Second visit (within 60 seconds)
// isLoading: false, myDetails: {...} (from cache, instant!)
// → (background fetch) → myDetails: {...} (updated silently)

// Third visit (after 60 seconds)
// isLoading: false, myDetails: {...} (from cache, instant!)
// → (background fetch) → myDetails: {...} (updated)
```

**User sees loading spinner:**
- First visit: Yes (no cached data)
- All subsequent visits: No (cached data shown instantly)

---

### Example 2: Component Re-renders

```typescript
// Component re-renders 5 times while data is loading
function MyComponent() {
  const { data } = useDashboardData(token); // Called 5 times
  return <div>{data}</div>;
}

// Without deduplication: 5 API requests ❌
// With SWR deduplication: 1 API request ✅
```

---

### Example 3: Multiple Components

```typescript
// Component A
function ComponentA() {
  const { myDetails } = useMyDetails(token); // Request 1
}

// Component B
function ComponentB() {
  const { myDetails } = useMyDetails(token); // Shares Request 1!
}

// Result: 1 API request, 2 components updated ✅
```

---

## Cache Lifecycle

### In-Memory Cache (Default)

```
App loads → Cache empty
  ↓
User logs in → Fetch data → Cache populated
  ↓
User navigates around → Cache persists
  ↓
User refreshes page → Cache cleared → Start over
```

**Pros:**
- Fast (in-memory)
- Automatic cleanup
- Simple implementation

**Cons:**
- Lost on page refresh
- Lost on browser restart

---

## Performance Metrics

### Before Stale-While-Revalidate

```
First visit:   1000ms (loading)
Second visit:  1000ms (loading)
Third visit:   1000ms (loading)
Average:       1000ms time to interactive
```

### After Stale-While-Revalidate

```
First visit:   1000ms (loading)
Second visit:  0ms (instant from cache)
Third visit:   0ms (instant from cache)
Average:       333ms time to interactive
```

**Performance Improvement: 67% faster perceived load time!** 🚀

---

## Configuration Options Summary

| Option | Dashboard | Dynamic | Static | Purpose |
|--------|-----------|---------|--------|---------|
| `keepPreviousData` | ✅ | ✅ | ❌ | Show stale while fetching |
| `revalidateIfStale` | ✅ | ✅ | ❌ | Background revalidation |
| `revalidateOnMount` | ✅ | ✅ | ❌ | Ensure fresh data |
| `revalidateOnFocus` | ❌ | ✅ | ❌ | Real-time updates |
| `refreshInterval` | 5 min | 1 min | ❌ | Auto-refresh |
| `dedupingInterval` | 60s | 10s | 1hr | Request deduplication |

---

## Best Practices

### ✅ DO

1. **Use `keepPreviousData: true`** for all user-facing data
2. **Set appropriate `dedupingInterval`** based on data volatility
3. **Enable `revalidateIfStale`** for background updates
4. **Use `compare` function** to prevent unnecessary re-renders
5. **Set `refreshInterval`** for auto-updating data

### ❌ DON'T

1. **Don't disable `revalidateIfStale`** unless data never changes
2. **Don't set `dedupingInterval` too low** (causes excessive requests)
3. **Don't set `refreshInterval` too low** (causes battery drain)
4. **Don't forget `keepPreviousData`** (causes loading flicker)

---

## Troubleshooting

### Q: I see loading spinners on every visit
**A:** Check that `keepPreviousData: true` is set in your SWR config

### Q: Data never updates
**A:** Verify `revalidateIfStale: true` is enabled

### Q: Too many API requests
**A:** Increase `dedupingInterval` or disable `revalidateOnFocus`

### Q: Data feels stale
**A:** Decrease `refreshInterval` or enable `revalidateOnFocus`

---

## Monitoring

### Development Mode

SWR logging is enabled in development mode:

```console
🌐 SWR FETCH /api/my-details
⚡ SWR CACHE_HIT /api/my-details (from cache)
🔄 SWR REVALIDATE /api/my-details (background)
```

### Statistics (Every 30 seconds)

```console
📊 SWR Deduplication Statistics
Total Requests:    15
Actual Fetches:    4
Deduplicated:      8
Cache Hits:        3
Requests Saved:    11 (73.3%)
```

---

## Conclusion

The stale-while-revalidate pattern provides:

- ⚡ **Instant data display** (0ms time to interactive)
- 🔄 **Always fresh data** (background revalidation)
- 📉 **Reduced server load** (request deduplication)
- 💰 **Lower bandwidth costs** (fewer requests)
- 😊 **Better UX** (no loading spinners)

**Result:** Users get instant data that's always fresh! 🎉
