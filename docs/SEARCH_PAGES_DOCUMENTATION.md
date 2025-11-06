# Search Feature - Two Page Architecture

## Overview
The Vivahavedi Matrimonial Website search feature is now split into **two separate pages** for better user experience and cleaner architecture:

1. **Search Page** (`/search`) - Filter selection and search configuration
2. **Search Results Page** (`/search-results`) - Display results with refine options

## File Structure

```
matrimonial-website/
├── src/
│   ├── app/
│   │   ├── search/
│   │   │   └── page.tsx                 # Search filters page
│   │   └── search-results/
│   │       └── page.tsx                 # Search results display page
│   └── lib/
│       ├── searchApi.ts                 # Search API functions
│       └── masterApi.ts                 # Master data API functions
```

## Page Flow

### 1. Search Page (`/search`)

**Purpose**: Configure search filters and initiate search

**Features**:
- Left sidebar with search filters (desktop) or full-screen overlay (mobile)
- Two search modes: Advanced Search and ID Search
- Cascading dropdowns for location (Country → State → District)
- Religion-based caste filtering
- Optional "Get Search Count" button to preview results count
- Right side shows helpful information about search types

**User Actions**:
- Select filters from sidebar
- Click "Get Search Count" (optional) to see how many profiles match
- Click "Search Profiles" to navigate to results page with filters

**URL Format**:
```
/search
```

---

### 2. Search Results Page (`/search-results`)

**Purpose**: Display search results and allow filter refinement

**Features**:
- Left sidebar with "Refine Search" filters
- Results displayed in responsive grid (1-3 columns)
- Pagination for large result sets
- "Back to Search" button in header
- Loading states during search
- "No results" message with back button

**User Actions**:
- View search results
- Refine filters from sidebar
- Navigate through pages
- Click profile card to view details
- Return to search page

**URL Format**:
```
# Advanced Search
/search-results?type=advanced&sort=featured&age_from=25&age_to=35&religion=1&caste=1,2&...

# ID Search
/search-results?type=id&id=12345
```

## Data Flow

### Advanced Search Flow

```
┌──────────────┐
│ Search Page  │
│  (/search)   │
└──────┬───────┘
       │
       │ 1. User selects filters
       │ 2. Optional: Get Count
       │ 3. Click "Search Profiles"
       │
       ▼
┌──────────────┐
│ Build URL    │
│ with params  │
└──────┬───────┘
       │
       │ router.push('/search-results?params')
       │
       ▼
┌─────────────────────┐
│ Search Results Page │
│ (/search-results)   │
└──────────┬──────────┘
           │
           │ 1. Parse URL params
           │ 2. Call API with filters
           │ 3. Display results
           │
           ▼
┌───────────────────┐
│ Show Results Grid │
└───────────────────┘
```

### ID Search Flow

```
┌──────────────┐
│ Search Page  │
│  (/search)   │
└──────┬───────┘
       │
       │ 1. User enters Profile ID
       │ 2. Click "Search by ID"
       │
       ▼
┌────────────────────┐
│ Navigate to results│
│ with ID parameter  │
└──────┬─────────────┘
       │
       │ router.push('/search-results?type=id&id=12345')
       │
       ▼
┌─────────────────────┐
│ Search Results Page │
│ (/search-results)   │
└──────────┬──────────┘
           │
           │ 1. Parse ID from URL
           │ 2. Call API with user_id
           │ 3. Display profile(s)
           │
           ▼
┌───────────────────┐
│ Show Profile(s)   │
└───────────────────┘
```

## Search Page Details

### Component: `SearchPage` (`src/app/search/page.tsx`)

#### State Management
```typescript
const [activeTab, setActiveTab] = useState<'advanced' | 'id'>('advanced');
const [masterData, setMasterData] = useState<MasterData | null>(null);
const [searchCount, setSearchCount] = useState<number | null>(null);
const [filters, setFilters] = useState<SearchFilters>({});
const [searchId, setSearchId] = useState('');
const [sortBy, setSortBy] = useState<'featured' | 'new' | 'photo'>('featured');
```

#### Key Functions

**`handleAdvancedSearch()`**
```typescript
// Builds URL parameters from filters
// Navigates to /search-results with query string
const params = new URLSearchParams();
params.append('type', 'advanced');
params.append('sort', sortBy);
// Add all filter values...
router.push(`/search-results?${params.toString()}`);
```

**`handleIdSearch()`**
```typescript
// Navigates to results page with ID parameter
router.push(`/search-results?type=id&id=${searchId}`);
```

**`handleGetSearchCount()`**
```typescript
// Optionally fetch count before searching
const countResult = await getSearchCount(token, filters);
setSearchCount(countResult.data);
```

#### Layout Structure

**Desktop**:
```
┌─────────────────────────────────────────────┐
│ Header                                      │
├─────────────────────────────────────────────┤
│ ┌──────────┐ ┌───────────────────────────┐ │
│ │          │ │                           │ │
│ │ Filters  │ │  Help/Information Panel   │ │
│ │ Sidebar  │ │  - Advanced Search info   │ │
│ │          │ │  - ID Search info         │ │
│ │ (25%)    │ │  (75%)                    │ │
│ │          │ │                           │ │
│ └──────────┘ └───────────────────────────┘ │
├─────────────────────────────────────────────┤
│ Footer                                      │
└─────────────────────────────────────────────┘
```

**Mobile**:
```
┌─────────────────────┐
│ Header [Filters Btn]│
├─────────────────────┤
│                     │
│  Help/Information   │
│     Panel           │
│                     │
├─────────────────────┤
│ Footer              │
└─────────────────────┘

[Filters Button] → Full-screen overlay
```

## Search Results Page Details

### Component: `SearchResultsPage` (`src/app/search-results/page.tsx`)

#### State Management
```typescript
const searchParams = useSearchParams(); // Read URL params
const [searchType, setSearchType] = useState<'advanced' | 'id'>('advanced');
const [filters, setFilters] = useState<SearchFilters>({});
const [searchResults, setSearchResults] = useState<ProfileResult[]>([]);
const [totalCount, setTotalCount] = useState(0);
const [currentPage, setCurrentPage] = useState(1);
```

#### Key Functions

**`loadSearchFromParams()`**
```typescript
// Runs on page load
// Parses URL parameters
// Executes search automatically
const type = searchParams.get('type');
const ageFrom = searchParams.get('age_from');
// Parse all params...
executeAdvancedSearch(parsedFilters, sort, 1);
```

**`executeAdvancedSearch()`**
```typescript
// Fetches count and results
const countResult = await getSearchCount(token, searchFilters);
const result = await searchProfiles(token, searchFilters, sort, page);
setSearchResults(result.data);
```

**`handleRefineSearch()`**
```typescript
// Applies modified filters without changing URL
executeAdvancedSearch(filters, sortBy, 1);
```

**`handlePageChange()`**
```typescript
// Loads next/previous page
executeAdvancedSearch(filters, sortBy, page);
window.scrollTo({ top: 0, behavior: 'smooth' });
```

#### Layout Structure

**Desktop**:
```
┌──────────────────────────────────────────────────┐
│ Header [Back to Search]                          │
├──────────────────────────────────────────────────┤
│ ┌──────────┐ ┌────────────────────────────────┐ │
│ │          │ │ [Total: 45 results][Page 1/8] │ │
│ │ Refine   │ ├────────────────────────────────┤ │
│ │ Search   │ │ ┌───┐ ┌───┐ ┌───┐             │ │
│ │ Filters  │ │ │ P │ │ P │ │ P │  Results    │ │
│ │          │ │ │ 1 │ │ 2 │ │ 3 │  Grid       │ │
│ │ (25%)    │ │ └───┘ └───┘ └───┘  (75%)      │ │
│ │          │ │ ┌───┐ ┌───┐ ┌───┐             │ │
│ │          │ │ │ P │ │ P │ │ P │             │ │
│ │          │ │ │ 4 │ │ 5 │ │ 6 │             │ │
│ │          │ │ └───┘ └───┘ └───┘             │ │
│ │          │ ├────────────────────────────────┤ │
│ │          │ │ [Prev] [Page 1/8] [Next]      │ │
│ └──────────┘ └────────────────────────────────┘ │
├──────────────────────────────────────────────────┤
│ Footer                                           │
└──────────────────────────────────────────────────┘
```

**Mobile**:
```
┌──────────────────────┐
│ Header [Refine Btn]  │
├──────────────────────┤
│ [Total: 45][Pg 1/8] │
├──────────────────────┤
│  ┌────────────────┐  │
│  │   Profile 1    │  │
│  └────────────────┘  │
│  ┌────────────────┐  │
│  │   Profile 2    │  │
│  └────────────────┘  │
├──────────────────────┤
│ [Prev] [1/8] [Next] │
├──────────────────────┤
│ Footer               │
└──────────────────────┘
```

## URL Parameters

### Advanced Search Parameters

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| `type` | string | `advanced` | Search type |
| `sort` | string | `featured` | Sort order |
| `age_from` | number | `25` | Minimum age |
| `age_to` | number | `35` | Maximum age |
| `height_from` | string | `5.0` | Minimum height |
| `height_to` | string | `6.0` | Maximum height |
| `religion` | number | `1` | Religion ID |
| `caste` | string | `1,2,3` | Comma-separated caste IDs |
| `country` | number | `1` | Country ID |
| `state` | number | `10` | State ID |
| `district` | string | `25,30` | Comma-separated district IDs |
| `marital_status` | string | `single,divorced` | Comma-separated statuses |

### ID Search Parameters

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| `type` | string | `id` | Search type |
| `id` | string | `12345` | Profile ID to search |

## Example URLs

### Advanced Search Examples

```
# Basic age and height filter
/search-results?type=advanced&sort=featured&age_from=25&age_to=35&height_from=5.0&height_to=6.0

# Religion and location filter
/search-results?type=advanced&sort=new&religion=1&country=1&state=10&district=25,30

# Complex multi-filter search
/search-results?type=advanced&sort=featured&age_from=28&age_to=35&religion=1&caste=1,2&country=1&state=10&district=25&marital_status=single
```

### ID Search Example

```
/search-results?type=id&id=237947
```

## Benefits of Two-Page Architecture

### 1. **Better User Experience**
- Clear separation of concerns (filter vs results)
- Cleaner interface without cluttered results on search page
- Easier navigation with dedicated results page

### 2. **Shareable Results**
- Results page URLs can be bookmarked
- Users can share specific search results via URL
- Browser back/forward works correctly

### 3. **Performance**
- Search page loads faster (no results to render)
- Results page only loads when needed
- Can add browser caching for repeated searches

### 4. **Flexibility**
- Easy to add search history (track URLs visited)
- Can implement "Save Search" feature using URLs
- Results page can be accessed directly with URL

### 5. **Mobile Optimization**
- Full screen available for results on mobile
- Filter overlay doesn't interfere with results
- Better scrolling experience

## Migration from Single Page

### Previous Architecture (Single Page)
```
/search → [Filters + Results on same page]
```

### New Architecture (Two Pages)
```
/search → [Filters only]
      ↓
/search-results → [Results + Refine filters]
```

### What Changed

**Search Page**:
- ❌ Removed: Results grid, pagination
- ✅ Added: Help/info panel, "Get Count" button
- ✅ Changed: Search button now redirects instead of showing results

**New Results Page**:
- ✅ Added: Dedicated results display
- ✅ Added: URL parameter parsing
- ✅ Added: Refine search sidebar
- ✅ Added: "Back to Search" navigation

## Future Enhancements

### Search Page
1. **Save Search**: Save filter combinations for quick access
2. **Recent Searches**: Show recently used filters
3. **Quick Filters**: Preset filter combinations
4. **Filter Templates**: Common search scenarios

### Results Page
1. **Compare Profiles**: Side-by-side comparison
2. **Export Results**: Download as PDF
3. **Email Results**: Share results via email
4. **Sort on Results**: Client-side sorting without API call
5. **Filter on Results**: Client-side filtering for refinement

## Testing Checklist

### Search Page
- [ ] Advanced search filters display correctly
- [ ] ID search form works
- [ ] "Get Count" button fetches and displays count
- [ ] "Search Profiles" navigates to results page with correct URL
- [ ] Cascading dropdowns work (religion→caste, country→state→district)
- [ ] Mobile filter overlay opens and closes
- [ ] Clear filters button resets all fields

### Results Page
- [ ] URL parameters are parsed correctly
- [ ] Search executes automatically on page load
- [ ] Results display in responsive grid
- [ ] Pagination works correctly
- [ ] "Refine Search" modifies results
- [ ] "Back to Search" returns to search page
- [ ] No results message displays when appropriate
- [ ] Loading states show during API calls
- [ ] Profile cards navigate to detail page

---

**Last Updated**: 2025-10-01
**Architecture**: Two-Page Search System
**Version**: 2.0.0
