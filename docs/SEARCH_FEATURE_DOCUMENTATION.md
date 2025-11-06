# Search Feature Documentation

## Overview
This document provides comprehensive documentation for the Search Profiles feature in the Vivahavedi Matrimonial Website Next.js application. The feature allows users to search for matrimonial profiles using two methods: Advanced Search with multiple filters and ID-based search.

## File Structure

```
matrimonial-website/
├── src/
│   ├── app/
│   │   └── search/
│   │       └── page.tsx                 # Main search page component
│   └── lib/
│       ├── searchApi.ts                 # Search API functions
│       └── masterApi.ts                 # Master data API functions
```

## Features

### 1. Advanced Search
- **Multiple Filters**: Age range, height range, religion, caste, location, marital status, etc.
- **Real-time Count**: Displays the total count of matching profiles before executing search
- **Sorting Options**: Featured profiles, newest first, or profiles with photos
- **Pagination**: 6 results per page with navigation controls
- **Cascading Dropdowns**: Location filters cascade (Country → State → District)
- **Clear Filters**: One-click button to reset all filters

### 2. ID Search
- **Direct Profile Search**: Search by specific profile ID
- **Quick Results**: Instant profile retrieval by user ID

### 3. Search Results
- **Profile Cards**: Displays profile photo, name, age, height, marital status, religion, caste, district, and education
- **Click to View**: Click on any profile card to navigate to detailed profile page
- **Responsive Grid**: 1 column on mobile, 2 on tablet, 3 on desktop

### 4. Pagination
- **Previous/Next Navigation**: Navigate through result pages
- **Page Indicator**: Shows current page and total pages
- **Results Per Page**: 6 profiles per page

### 5. Layout Design
- **Left Sidebar**: Fixed position filter panel on desktop (25% width)
- **Right Content Area**: Search results display area (75% width)
- **Mobile Responsive**: Full-screen filter overlay on mobile devices with toggle button
- **Sticky Filters**: Filters remain visible while scrolling through results

## API Integration

### Base URL
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
```

### Authentication
All search API calls require Bearer token authentication:
```typescript
'Authorization': `Bearer ${token}`
```

## API Endpoints Used

### 1. Get Master Data
**Endpoint**: `GET /api/masters`

**Purpose**: Fetch all dropdown options (religion, caste, location, etc.)

**Response**:
```json
{
  "status": "success",
  "data": {
    "religion": [...],
    "caste": [...],
    "country": [...],
    "state": [...],
    "district": [...],
    "marital_status": [...],
    ...
  }
}
```

### 2. Advanced Search
**Endpoint**: `POST /api/search-profiles`

**Request Body**:
```json
{
  "type": "advance_search",
  "page": 1,
  "filters": {
    "age_from": 25,
    "age_to": 35,
    "height_from": "5.0",
    "height_to": "6.0",
    "religion": 1,
    "caste": [1, 2, 3],
    "marital_status": ["single", "divorced"],
    ...
  },
  "sort": {
    "sort_by": "featured"
  }
}
```

**Response**:
```json
{
  "status": "success",
  "data": [
    {
      "id": 123,
      "name": "John",
      "age": 28,
      "height": "5.8",
      "marital_status": "Single",
      "religion": "Hindu",
      "caste": "Brahmin",
      "district": "Mumbai",
      "qualification": "Bachelor's Degree",
      "photo": "http://localhost:8000/images/..."
    },
    ...
  ]
}
```

### 3. Search Count
**Endpoint**: `POST /api/search-profiles`

**Request Body**:
```json
{
  "type": "advance_search_count",
  "age_from": 25,
  "age_to": 35,
  "religion": 1,
  ...
}
```

**Response**:
```json
{
  "status": "success",
  "data": 45
}
```

### 4. ID Search
**Endpoint**: `POST /api/search-profiles`

**Request Body**:
```json
{
  "type": "id_search",
  "filters": {
    "user_id": "12345"
  }
}
```

## Component Architecture

### Main Component: SearchPage (`src/app/search/page.tsx`)

#### State Management
```typescript
// Tab control
const [activeTab, setActiveTab] = useState<'advanced' | 'id'>('advanced');

// Loading states
const [loading, setLoading] = useState(false);

// Master data
const [masterData, setMasterData] = useState<MasterData | null>(null);

// Search results
const [searchResults, setSearchResults] = useState<ProfileResult[]>([]);
const [totalCount, setTotalCount] = useState(0);
const [currentPage, setCurrentPage] = useState(1);
const [searchCount, setSearchCount] = useState<number | null>(null);

// Filters
const [filters, setFilters] = useState<SearchFilters>({});
const [searchId, setSearchId] = useState('');
const [sortBy, setSortBy] = useState<'featured' | 'new' | 'photo'>('featured');
```

#### Key Functions

##### `loadMasterData()`
Fetches master data from API on component mount.

##### `handleAdvancedSearch(page = 1)`
1. Fetches search count with current filters
2. Fetches paginated search results
3. Updates state with results and count

##### `handleIdSearch()`
Searches for a specific profile by ID.

##### `handleFilterChange(key, value)`
Updates filter state with new values.

##### `getFilteredCastes()`, `getFilteredStates()`, `getFilteredDistricts()`
Returns filtered dropdown options based on parent selections.

## Available Search Filters

| Filter | Type | Description |
|--------|------|-------------|
| `age_from` | number | Minimum age |
| `age_to` | number | Maximum age |
| `height_from` | string | Minimum height (e.g., "5.0") |
| `height_to` | string | Maximum height (e.g., "6.0") |
| `religion` | number | Religion ID (single select) |
| `caste` | number[] | Caste IDs (multi-select) |
| `country` | number | Country ID (single select) |
| `state` | number | State ID (single select) |
| `district` | number[] | District IDs (multi-select) |
| `marital_status` | string[] | Marital statuses (multi-select) |
| `qualification` | number[] | Qualification IDs (multi-select) |
| `q_level` | number[] | Qualification level IDs (multi-select) |
| `specialization` | number[] | Specialization IDs (multi-select) |
| `profession` | number[] | Profession IDs (multi-select) |
| `nakshatra` | number[] | Nakshatra IDs (multi-select) |
| `manglik` | string[] | Manglik status (multi-select) |
| `workedin` | string[] | Work sectors (multi-select) |
| `physicalstatus` | string[] | Physical status (multi-select) |

## Styling and UI

### Layout Structure
- **Desktop (lg+)**:
  - Left Sidebar: 25% width (1/4 of grid)
  - Right Content: 75% width (3/4 of grid)
  - Filters always visible in sidebar
  - Results displayed in 1-3 column grid

- **Mobile/Tablet**:
  - Full-width layout
  - Filter toggle button in header
  - Full-screen filter overlay when opened
  - Sticky filter header with close button

### Color Scheme
- **Primary**: Red (#EF4444 / red-500)
- **Text**: Gray shades (gray-600, gray-700, gray-900)
- **Background**: White and gray-50
- **Borders**: Gray-200, Gray-300
- **Active Tabs**: Red-50 background with red-600 text and border

### Responsive Design
- **Mobile (<768px)**:
  - Single column results
  - Full-screen filter overlay
  - Filter toggle button visible

- **Tablet (768px-1023px)**:
  - 2-column grid for results
  - Full-screen filter overlay

- **Desktop (1024px+)**:
  - Fixed left sidebar (always visible)
  - 3-column grid for results
  - No filter overlay

## Authentication & Authorization

### Protected Route
The search page is wrapped with `AuthGuard` component:
```tsx
<AuthGuard requireAuth={true} redirectTo="/login">
  {/* Page content */}
</AuthGuard>
```

### Token Usage
Token is retrieved from `AuthContext` and passed to all API calls:
```typescript
const { token } = useAuth();
```

## Error Handling

### Loading States
- Loading spinner displayed during API calls
- Buttons disabled during loading

### Error Messages
- Network errors caught and logged to console
- Failed API calls show appropriate error messages

### No Results
- Displays friendly message when no profiles match filters
- Suggests adjusting search filters

## Performance Optimizations

1. **Lazy Loading**: Master data loaded only once on mount
2. **Pagination**: Only 6 results loaded per page
3. **Debouncing**: Consider adding debouncing for filter changes (future enhancement)
4. **Memoization**: Consider using React.memo for profile cards (future enhancement)

## Future Enhancements

### Recommended Features
1. **Save Search**: Allow users to save frequently used filter combinations
2. **Recent Searches**: Display recently executed searches
3. **Filter Presets**: Quick filter templates (e.g., "Young Professionals", "Local Matches")
4. **Advanced Sorting**: More sorting options (e.g., by compatibility score)
5. **Export Results**: Download search results as PDF/Excel
6. **Email Alerts**: Notify users when new profiles match their saved searches
7. **Filter Count Badges**: Show count of profiles for each filter option
8. **Quick Filters**: Toggle buttons for common filters
9. **Search History**: Track and display search history
10. **Comparison**: Compare multiple profiles side-by-side

### Performance Enhancements
1. **Infinite Scroll**: Replace pagination with infinite scroll
2. **Virtual Scrolling**: For large result sets
3. **Image Lazy Loading**: Load profile images on demand
4. **Filter Debouncing**: Prevent excessive API calls
5. **Client-side Caching**: Cache search results

## Testing

### Manual Testing Checklist

#### Advanced Search
- [ ] Select age range and verify results
- [ ] Select height range and verify results
- [ ] Select religion and verify caste dropdown updates
- [ ] Select country and verify state dropdown updates
- [ ] Select state and verify district dropdown updates
- [ ] Use multiple filters simultaneously
- [ ] Test all sort options (featured, new, photo)
- [ ] Navigate through pagination
- [ ] Verify search count displays correctly

#### ID Search
- [ ] Enter valid profile ID and verify result
- [ ] Enter invalid profile ID and verify error handling
- [ ] Verify result count displays correctly

#### UI/UX
- [ ] Test responsive design on mobile, tablet, desktop
- [ ] Verify all buttons and inputs are accessible
- [ ] Check loading states display correctly
- [ ] Verify error messages are user-friendly
- [ ] Test navigation to profile detail page

## Troubleshooting

### Common Issues

#### 1. "No Results Found" despite valid filters
**Solution**: Check if Laravel API is running on port 8000

#### 2. Dropdown options not loading
**Solution**: Verify `/api/masters` endpoint is accessible

#### 3. Authentication errors
**Solution**: Check if user is logged in and token is valid

#### 4. Images not displaying
**Solution**: Verify Laravel API URL is correct and images are accessible

## API Configuration

### Environment Variables
Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Laravel API Setup
Ensure Laravel API is running:
```bash
cd C:\wamp64\www\vivahavedi\vivahavedi-laravel-api
php artisan serve --port=8000
```

## Code Examples

### Using Search API Functions

```typescript
import { searchProfiles, getSearchCount } from '@/lib/searchApi';

// Advanced search
const filters = {
  age_from: 25,
  age_to: 35,
  religion: 1,
  marital_status: ['single']
};

const result = await searchProfiles(token, filters, 'featured', 1);

// Get count
const countResult = await getSearchCount(token, filters);
console.log(`Found ${countResult.data} profiles`);

// ID search
const idResult = await searchProfiles(
  token,
  { user_id: '12345' },
  'featured',
  1,
  'id_search'
);
```

### Using Master API Functions

```typescript
import { getMasterData, getLocationsByDistrict } from '@/lib/masterApi';

// Get all master data
const masterData = await getMasterData();

// Get locations for a district
const locations = await getLocationsByDistrict(25);
```

## Deployment Notes

### Production Considerations
1. Update `NEXT_PUBLIC_API_URL` to production API URL
2. Enable CORS on Laravel API for production domain
3. Optimize images (consider using Next.js Image component)
4. Add rate limiting to prevent abuse
5. Implement proper error tracking (e.g., Sentry)
6. Add analytics tracking (e.g., Google Analytics)

### Build Command
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## Support

For issues or questions:
- Check Laravel API logs: `storage/logs/laravel.log`
- Check Next.js console for client-side errors
- Verify network tab in browser DevTools for API calls

## Version History

### Version 1.0.0 (Initial Release)
- Advanced search with multiple filters
- ID-based search
- Pagination support
- Master data integration
- Responsive UI design
- Search count display

---

**Last Updated**: 2025-10-01
**Author**: Claude Code
**Project**: Vivahavedi Matrimonial Website
