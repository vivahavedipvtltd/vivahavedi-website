# Search Filters Documentation

## Overview
This document provides comprehensive information about the search functionality in the matrimonial website, including all available filters, API integration, and implementation details.

**Last Updated:** 2025-10-04
**Laravel API Port:** 8000
**Next.js Frontend Port:** 3000

---

## Table of Contents
1. [Search API Overview](#search-api-overview)
2. [Available Filters](#available-filters)
3. [Filter Implementation](#filter-implementation)
4. [API Integration](#api-integration)
5. [Master Data API](#master-data-api)
6. [Frontend Components](#frontend-components)
7. [Future Updates Guide](#future-updates-guide)

---

## Search API Overview

### API Endpoint
**POST** `http://localhost:8000/api/search-profiles`

### Authentication
Bearer Token required in headers:
```
Authorization: Bearer {your-token}
```

### Search Types
1. **Advanced Search** - Multiple filters with pagination
2. **Advanced Search Count** - Get total count of matching profiles
3. **ID Search** - Search by specific profile ID

---

## Available Filters

### Complete Filter List

#### Basic Filters
| Filter Name | Type | API Field | Description | UI Component |
|------------|------|-----------|-------------|--------------|
| Age From | Number | `age_from` | Minimum age (18-70) | Select dropdown |
| Age To | Number | `age_to` | Maximum age (18-70) | Select dropdown |
| Height From | String | `height_from` | Minimum height in cm (140-210) | Select dropdown (displays cm + ft'in") |
| Height To | String | `height_to` | Maximum height in cm (140-210) | Select dropdown (displays cm + ft'in") |

#### Location Filters
| Filter Name | Type | API Field | Description | UI Component |
|------------|------|-----------|-------------|--------------|
| Religion | Number | `religion` | Religion ID (single) | Select dropdown |
| Caste | Array[Number] | `caste` | Caste IDs (multiple) | Multi-select |
| Country | Number | `country` | Country ID (single) | Select dropdown |
| State | Number | `state` | State ID (single) | Select dropdown |
| District | Array[Number] | `district` | District IDs (multiple) | Multi-select |

#### Personal Filters
| Filter Name | Type | API Field | Description | UI Component |
|------------|------|-----------|-------------|--------------|
| Marital Status | Array[String] | `marital_status` | Values: single, divorced, widowed | Multi-select |
| Physical Status | Array[String] | `physicalstatus` | Physical condition | Multi-select |

#### Astrological Filters
| Filter Name | Type | API Field | Description | UI Component |
|------------|------|-----------|-------------|--------------|
| Nakshatra | Array[Number] | `nakshatra` | Nakshatra IDs | Multi-select |
| Manglik | Array[String] | `manglik` | Values: yes, no, anshik | Multi-select |

#### Education & Career Filters
| Filter Name | Type | API Field | Description | UI Component |
|------------|------|-----------|-------------|--------------|
| Qualification Level | Array[Number] | `q_level` | Education level IDs | Multi-select |
| Qualification | Array[Number] | `qualification` | Specific qualification IDs | Multi-select (shown when q_level selected) |
| Specialization | Array[Number] | `specialization` | Specialization IDs | Multi-select |
| Profession | Array[Number] | `profession` | Profession IDs | Multi-select |
| Working In | Array[String] | `workedin` | Values: private, government, business, defence | Multi-select |

#### Sorting Options
| Sort Type | Value | Description |
|-----------|-------|-------------|
| Featured | `featured` | Featured profiles first |
| Newest | `new` | Recently joined profiles |
| With Photos | `photo` | Profiles with photos |

---

## Filter Implementation

### 1. Search Page Component
**File:** `src/app/search/page.tsx`

#### Filter State Management
```typescript
interface SearchFilters {
  age_from?: number;
  age_to?: number;
  height_from?: string;
  height_to?: string;
  religion?: number;
  country?: number;
  state?: number;
  marital_status?: string[];
  caste?: number[];
  nakshatra?: number[];
  district?: number[];
  qualification?: number[];
  q_level?: number[];
  specialization?: number[];
  profession?: number[];
  workedin?: string[];
  manglik?: string[];
  physicalstatus?: string[];
}
```

#### Height Conversion Helper
```typescript
const cmToFeetInches = (cm: number): string => {
  const inches = cm / 2.54;
  const feet = Math.floor(inches / 12);
  const remainingInches = Math.round(inches % 12);
  return `${feet}'${remainingInches}"`;
};
```

### 2. Search Results Page
**File:** `src/app/search-results/page.tsx`

Handles:
- URL parameter parsing for all filters
- API integration for search execution
- Result display and pagination
- Filter state persistence

### 3. Search Section (Homepage)
**File:** `src/components/SearchSection.tsx`

Simplified search form for homepage with basic filters:
- Gender selection (Bride/Groom)
- Age range
- Height range
- Religion
- Caste

---

## API Integration

### Request Format for Advanced Search

```json
{
  "type": "advance_search",
  "page": 1,
  "filters": {
    "age_from": 25,
    "age_to": 35,
    "height_from": "150",
    "height_to": "180",
    "religion": 1,
    "country": 1,
    "state": 5,
    "marital_status": ["single", "divorced"],
    "caste": [1, 2, 3],
    "nakshatra": [1, 2],
    "district": [10, 11],
    "qualification": [1, 2],
    "q_level": [1, 2],
    "specialization": [1],
    "profession": [1, 2],
    "workedin": ["private", "government"],
    "manglik": ["yes", "no"],
    "physicalstatus": ["normal"]
  },
  "sort": {
    "sort_by": "featured"
  }
}
```

### Response Format

```json
{
  "status": "success",
  "data": [
    {
      "id": 237947,
      "name": "John",
      "age": 28,
      "height": "170",
      "marital_status": "Single",
      "religion": "Hindu",
      "caste": "Brahmin",
      "district": "Bangalore",
      "qualification": "BE",
      "photo": "http://localhost:8000/images/user_images/photo1/profile.jpg"
    }
  ]
}
```

### Get Count Request

```json
{
  "type": "advance_search_count",
  "age_from": 25,
  "age_to": 35,
  "religion": 1
}
```

### Count Response

```json
{
  "status": "success",
  "data": 150
}
```

---

## Master Data API

### Endpoint
**GET** `http://localhost:8000/api/masters`

### Response Structure
```json
{
  "status": "success",
  "data": {
    "religion": [{"id": 1, "name": "Hindu"}],
    "caste": [{"id": 1, "name": "Brahmin", "masterId": 1}],
    "nakshathra": [{"id": 1, "name": "Ashwini"}],
    "country": [{"id": 1, "name": "India"}],
    "state": [{"id": 1, "name": "Karnataka", "masterId": 1}],
    "district": [{"id": 1, "name": "Bangalore", "masterId": 1}],
    "qualification_level": [{"id": 1, "name": "Under Graduate"}],
    "qualification": [{"id": 1, "name": "BE", "masterId": 1}],
    "specialization": [{"id": 1, "name": "Computer Science"}],
    "profession": [{"id": 1, "name": "Software Engineer"}],
    "manglik": [{"id": 1, "name": "Yes"}],
    "marital_status": [{"id": 1, "name": "Single"}],
    "physical_status": [{"id": 1, "name": "Normal"}],
    "body_type": [{"id": 1, "name": "Athletic"}],
    "complexion": [{"id": 1, "name": "Fair"}]
  }
}
```

### Master Data Dependencies

#### Hierarchical Relationships
- **Caste** depends on **Religion** (`masterId = religion.id`)
- **State** depends on **Country** (`masterId = country.id`)
- **District** depends on **State** (`masterId = state.id`)
- **Qualification** depends on **Qualification Level** (`masterId = q_level.id`)

#### Implementation Example
```typescript
const getFilteredCastes = () => {
  if (!masterData || !filters.religion) return [];
  return masterData.caste.filter(c => c.masterId === filters.religion);
};

const getFilteredQualifications = () => {
  if (!masterData || !filters.q_level) return [];
  return masterData.qualification.filter(q => q.masterId === filters.q_level);
};
```

---

## Frontend Components

### Search API Functions
**File:** `src/lib/searchApi.ts`

```typescript
// Advanced Search
export async function searchProfiles(
  token: string,
  filters: SearchFilters,
  sortBy: 'featured' | 'new' | 'photo',
  page: number = 1,
  type: string = 'advance_search'
): Promise<SearchResponse>

// Get Count
export async function getSearchCount(
  token: string,
  filters: SearchFilters
): Promise<CountResponse>
```

### Master Data API Functions
**File:** `src/lib/masterApi.ts`

```typescript
export async function getMasterData(): Promise<MasterDataResponse>

export function getFilteredData<T extends { masterId?: number }>(
  data: T[],
  masterId: number
): T[]
```

### MultiSelectCheckbox Component
**File:** `src/components/MultiSelectCheckbox.tsx`

A reusable checkbox-based multi-select dropdown component with enhanced UX.

#### Features:
- ✅ Checkbox-based selection (more intuitive than Ctrl+Click)
- ✅ Search functionality (auto-enabled for lists > 5 items)
- ✅ "Select All" and "Clear All" quick actions
- ✅ Selected count display in label
- ✅ Click outside to close
- ✅ Visual feedback for selected items
- ✅ Mobile-friendly touch interface
- ✅ Smooth animations and transitions

#### Props:
```typescript
interface MultiSelectCheckboxProps {
  label: string;                          // Field label
  options: Option[];                      // Array of {id, name}
  selectedValues: (number | string)[];    // Currently selected values
  onChange: (values: (number | string)[]) => void;  // Change handler
  placeholder?: string;                   // Placeholder text
  disabled?: boolean;                     // Disable the field
  maxHeight?: string;                     // Max height of dropdown
}
```

#### Usage Example:
```tsx
<MultiSelectCheckbox
  label="Profession"
  options={masterData.profession || []}
  selectedValues={filters.profession || []}
  onChange={(values) => handleFilterChange('profession', values as number[])}
  placeholder="Select professions"
/>
```

---

## Future Updates Guide

### Adding a New Filter

#### Step 1: Update Interface (if new field)
**File:** `src/app/search/page.tsx`
```typescript
interface SearchFilters {
  // ... existing fields
  new_filter?: string | number | string[] | number[];
}
```

#### Step 2: Add UI Component
**File:** `src/app/search/page.tsx`
```tsx
{/* New Filter */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    New Filter Name
  </label>
  <select
    value={filters.new_filter || ''}
    onChange={(e) => handleFilterChange('new_filter', e.target.value)}
    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
  >
    <option value="">Select Option</option>
    {/* Add options */}
  </select>
</div>
```

#### Step 3: Update URL Parameters
**File:** `src/app/search/page.tsx` - `handleAdvancedSearch` function
```typescript
if (filters.new_filter) {
  params.append('new_filter', filters.new_filter.toString());
}
```

#### Step 4: Update Search Results Parser
**File:** `src/app/search-results/page.tsx` - `loadSearchFromParams` function
```typescript
const newFilter = searchParams.get('new_filter');
if (newFilter) parsedFilters.new_filter = newFilter;
```

#### Step 5: Verify Laravel API Support
Check `SearchProfilesController.php` to ensure the filter is handled in `buildAdvancedSearchQuery()`.

### Adding Master Data Fields

#### Step 1: Update Master Data Interface
**File:** `src/lib/masterApi.ts`
```typescript
export interface MasterDataResponse {
  data: {
    // ... existing fields
    new_master_field: Array<{ id: number; name: string }>;
  };
}
```

#### Step 2: Update Component Interface
**File:** `src/app/search/page.tsx`
```typescript
interface MasterData {
  // ... existing fields
  new_master_field: Array<{ id: number; name: string }>;
}
```

#### Step 3: Use in UI
```tsx
{masterData.new_master_field?.map((item) => (
  <option key={item.id} value={item.id}>
    {item.name}
  </option>
))}
```

### Testing Checklist

When adding new filters, verify:
- [ ] Filter appears in UI correctly
- [ ] Filter state updates on selection
- [ ] Filter is included in URL parameters
- [ ] Filter is parsed correctly in search results page
- [ ] Filter is sent to API correctly
- [ ] API processes filter correctly
- [ ] Results are filtered as expected
- [ ] Clear filters button resets the new filter
- [ ] Mobile responsive view works

---

## API Testing with cURL

### Advanced Search
```bash
curl -X POST "http://localhost:8000/api/search-profiles" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "type": "advance_search",
    "page": 1,
    "filters": {
      "age_from": 25,
      "age_to": 35,
      "height_from": "150",
      "height_to": "180",
      "religion": 1,
      "marital_status": ["single"],
      "nakshatra": [1, 2],
      "profession": [1]
    },
    "sort": {
      "sort_by": "featured"
    }
  }'
```

### Get Search Count
```bash
curl -X POST "http://localhost:8000/api/search-profiles" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "type": "advance_search_count",
    "age_from": 25,
    "age_to": 35,
    "religion": 1
  }'
```

### Get Master Data
```bash
curl -X GET "http://localhost:8000/api/masters" \
  -H "Accept: application/json"
```

---

## Common Issues and Solutions

### Issue 1: Filter Not Working
**Symptoms:** Filter selected but results don't change
**Solutions:**
1. Check browser console for errors
2. Verify filter is included in URL parameters
3. Check API request in Network tab
4. Verify Laravel controller handles the filter

### Issue 2: Master Data Not Loading
**Symptoms:** Dropdowns are empty
**Solutions:**
1. Check API response in Network tab
2. Verify master data structure matches interface
3. Check for CORS issues
4. Verify API endpoint is correct

### Issue 3: Dependent Filters Not Showing
**Symptoms:** Child filter doesn't appear when parent selected
**Solutions:**
1. Verify parent filter value is set correctly
2. Check filtering logic uses correct masterId
3. Ensure conditional rendering is correct

### Issue 4: Multi-select Not Working
**Symptoms:** Can't select multiple options
**Solutions:**
1. Verify `multiple` attribute is set
2. Check value uses array format
3. Ensure onChange handles array values correctly

---

## Performance Considerations

### Optimization Tips
1. **Lazy Load Master Data** - Only load when needed
2. **Debounce Filter Changes** - For text inputs
3. **Pagination** - Use 6-10 results per page
4. **Caching** - Cache master data in context/localStorage
5. **Index Database** - Ensure filters use indexed columns

### Query Optimization
- Religion, Country, State use single values (faster)
- Multi-selects use `whereIn` (slower with large arrays)
- Height uses range query (indexed for performance)
- Age calculated from birth year (indexed)

---

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Mobile Support
- Responsive design for all screen sizes
- Touch-friendly multi-select
- Mobile filter drawer for smaller screens

---

## Change Log

### Version 1.2.0 (2025-10-04)
- ✅ Created reusable `MultiSelectCheckbox` component
- ✅ Replaced all basic multi-select fields with checkbox-based UI
- ✅ Added search functionality within multi-select dropdowns (for lists > 5 items)
- ✅ Added "Select All" and "Clear All" quick actions
- ✅ Improved UX with:
  - Click outside to close
  - Selected count display
  - Visual feedback for selected items
  - Smooth animations and transitions
  - Better mobile responsiveness

### Version 1.1.0 (2025-10-04)
- ✅ Added Age Range as select dropdowns (18-70)
- ✅ Updated Height display to show both cm and ft'in"
- ✅ Added Nakshatra filter (multi-select)
- ✅ Added Manglik filter (multi-select)
- ✅ Added Qualification Level filter (multi-select)
- ✅ Added Qualification filter (dependent on level)
- ✅ Added Specialization filter (multi-select)
- ✅ Added Profession filter (multi-select)
- ✅ Added Working In filter (multi-select)
- ✅ Added Physical Status filter (multi-select)
- ✅ Updated search results parser for all new filters
- ✅ Integrated all filters with master data API

### Version 1.0.0 (Initial)
- Basic search with age, height, religion, caste
- Location filters (country, state, district)
- Marital status filter
- Sort options

---

## Support and Contact
For issues or questions:
1. Check this documentation first
2. Review API documentation: `user-website-api-documentation.md`
3. Check Laravel logs: `storage/logs/laravel.log`
4. Check browser console for frontend errors

## Related Documentation
- [User Website API Documentation](../vivahavedi-laravel-api/user-website-api-documentation.md)
- [Search Feature Documentation](./SEARCH_FEATURE_DOCUMENTATION.md)
- [Search Pages Documentation](./SEARCH_PAGES_DOCUMENTATION.md)
