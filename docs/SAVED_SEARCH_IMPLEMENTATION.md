# Saved Search Feature Implementation Documentation

## Overview
This document describes the implementation of the Saved Search feature in the Vivahavedi matrimonial website. The feature allows users to save their search filters for quick access later.

## Features Implemented

### 1. Save Search Option in Advanced Search Results
- **Location**: `/search-results` page (only for advanced searches)
- **Functionality**:
  - A "Save Search" button appears in the search results header when results are displayed
  - Clicking the button opens a modal where users can enter a name for their search
  - The current search filters and sort preferences are saved to the backend
  - Success/error messages are displayed to the user

### 2. Saved Searches List in Dashboard
- **Location**: `/dashboard/saved-searches` page
- **Functionality**:
  - Displays all saved searches for the logged-in user
  - Each saved search shows:
    - Search name
    - Search ID
    - "View Results" button to execute the search
    - Delete button to remove the saved search
  - Empty state with a link to start searching when no saved searches exist

### 3. Execute Saved Search
- **Location**: `/search-results` page with `type=saved` parameter
- **Functionality**:
  - When clicking "View Results" from the saved searches list, the user is redirected to the search results page
  - The saved search filters are automatically applied
  - Results are displayed in the same format as regular searches
  - Pagination is supported for saved search results
  - The filter sidebar is hidden for saved searches (since filters are pre-applied)

## Technical Implementation

### API Integration

The following API endpoints from the Laravel backend are used:

#### 1. Save Search
- **Endpoint**: `POST /api/saved-searches`
- **Request Type**: `save_search`
- **Request Body**:
```json
{
  "type": "save_search",
  "search_name": "Young Professionals",
  "filters": {
    "age_from": 25,
    "age_to": 35,
    "height_from": "5.0",
    "height_to": "6.0",
    "religion": 2,
    "marital_status": ["single"],
    "qualification": [1, 2, 3],
    "district": [1113, 1132]
  },
  "sort": {
    "sort_by": "featured"
  }
}
```

#### 2. Get Saved Searches List
- **Endpoint**: `POST /api/saved-searches`
- **Request Type**: `saved_search_list`
- **Request Body**:
```json
{
  "type": "saved_search_list"
}
```

#### 3. Execute Saved Search
- **Endpoint**: `POST /api/saved-searches`
- **Request Type**: `saved_search_result`
- **Request Body**:
```json
{
  "type": "saved_search_result",
  "search_id": 123,
  "page": 1
}
```

#### 4. Delete Saved Search
- **Endpoint**: `POST /api/saved-searches`
- **Request Type**: `delete_search`
- **Request Body**:
```json
{
  "type": "delete_search",
  "search_id": 123
}
```

### Frontend Components

#### 1. Search Results Page (`src/app/search-results/page.tsx`)
**Changes Made**:
- Added `Bookmark` icon import from lucide-react
- Added `saveSearch` and `executeSavedSearch` imports from searchApi
- Added state variables for save search modal:
  - `showSaveModal`: Controls modal visibility
  - `searchName`: Stores the name entered by user
  - `saving`: Loading state while saving
  - `saveMessage`: Success/error message display
  - `savedSearchId`: Stores ID of saved search being executed
- Extended `searchType` to include `'saved'` type
- Added `handleSaveSearch` function to save searches
- Added `executeSavedSearchById` function to execute saved searches
- Modified `handlePageChange` to support saved search pagination
- Modified `loadSearchFromParams` to handle saved search type from URL
- Added conditional rendering:
  - Hide filter sidebar for saved searches
  - Adjust grid layout for saved searches (full width)
  - Show "Save Search" button only for advanced searches
- Added Save Search Modal component at the end

#### 2. Saved Searches Page (`src/app/dashboard/saved-searches/page.tsx`)
**New File Created**:
- Displays list of saved searches
- Supports viewing and deleting saved searches
- Includes empty state when no searches are saved
- Uses consistent styling with other dashboard pages

#### 3. Dashboard Page (`src/app/dashboard/page.tsx`)
**Changes Made**:
- Added navigation handler for `saved-searches` section
- Redirects to `/dashboard/saved-searches` when clicking "Saved Searches" in sidebar

#### 4. Search API (`src/lib/searchApi.ts`)
**Existing Implementation**:
- All required API functions were already implemented:
  - `saveSearch()`: Save a search with name and filters
  - `getSavedSearches()`: Get list of all saved searches
  - `executeSavedSearch()`: Execute a saved search by ID
  - `deleteSavedSearch()`: Delete a saved search

#### 5. Dashboard Sidebar (`src/components/DashboardSidebar.tsx`)
**Existing Implementation**:
- "Saved Searches" menu item was already present in the sidebar
- Located under "Matching & Search" section
- No changes needed

## User Flow

### Saving a Search
1. User performs an advanced search on `/search` page
2. Search results are displayed on `/search-results` page
3. User clicks "Save Search" button
4. Modal opens asking for a search name
5. User enters a name and clicks "Save"
6. Search is saved to the backend
7. Success message is displayed
8. Modal closes automatically after 2 seconds

### Viewing Saved Searches
1. User clicks "Saved Searches" in the dashboard sidebar
2. User is redirected to `/dashboard/saved-searches`
3. All saved searches are displayed in a grid layout
4. Each card shows the search name and ID

### Executing a Saved Search
1. User clicks "View Results" on a saved search card
2. User is redirected to `/search-results?type=saved&id={search_id}`
3. Search results are loaded from the backend using the saved filters
4. Results are displayed (without the filter sidebar)
5. User can navigate through pages if there are multiple pages of results

### Deleting a Saved Search
1. User clicks the delete icon on a saved search card
2. Confirmation dialog appears
3. User confirms deletion
4. Search is deleted from the backend
5. Card is removed from the list

## Future Laravel Backend Updates

### Database Table
The feature uses the `user_saved_search` table in the Laravel backend. Ensure this table exists with the following structure:

```sql
CREATE TABLE `user_saved_search` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `search_name` varchar(255) NOT NULL,
  `filters` text NOT NULL, -- JSON encoded filters
  `sort` varchar(50) DEFAULT 'featured',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Controller Requirements
The Laravel controller should handle the following operations:

1. **Save Search**: Store user's search criteria with a custom name
2. **List Searches**: Retrieve all saved searches for the authenticated user
3. **Execute Search**: Apply saved filters and return matching profiles
4. **Get Result Count**: Return count of profiles matching saved search
5. **Delete Search**: Remove a saved search by ID

### Security Considerations
- Ensure users can only access their own saved searches
- Validate that the authenticated user owns a saved search before allowing view/delete operations
- Sanitize search names to prevent XSS attacks
- Validate filter parameters to prevent SQL injection

### API Response Format
All responses follow the standard format:
```json
{
  "status": "success" | "failed",
  "data": {},
  "message": "Optional message"
}
```

## File Changes Summary

### New Files Created
1. `src/app/dashboard/saved-searches/page.tsx` - Saved searches list page

### Modified Files
1. `src/app/search-results/page.tsx` - Added save search functionality and saved search execution
2. `src/app/dashboard/page.tsx` - Added navigation for saved searches

### No Changes Required
1. `src/lib/searchApi.ts` - Already had all required API functions
2. `src/components/DashboardSidebar.tsx` - Already had "Saved Searches" menu item

## Testing Checklist

- [ ] Save a new search from the search results page
- [ ] Verify search appears in the saved searches list
- [ ] Click "View Results" and verify results are displayed correctly
- [ ] Test pagination on saved search results
- [ ] Delete a saved search and verify it's removed
- [ ] Test with multiple saved searches
- [ ] Verify filter sidebar is hidden for saved searches
- [ ] Test empty state when no saved searches exist
- [ ] Test error handling (invalid search ID, network errors, etc.)
- [ ] Verify mobile responsiveness
- [ ] Test save search modal validation (empty name)
- [ ] Verify success/error messages display correctly

## Navigation Enhancement

The DashboardSidebar component has been enhanced to support direct navigation:

- Pages with their own routes (search, matching-profiles, saved-searches, blocked-profiles, upgrade-plan) navigate directly in one click
- Dashboard sections (interests, messages, overview, etc.) navigate to `/dashboard?section={sectionId}`
- The dashboard page reads the section parameter and displays the correct section
- This ensures seamless navigation from any page without intermediate redirects

## Notes

- The "Save Search" button only appears for **advanced searches**, not for ID-based searches
- Saved searches show the filter sidebar is **hidden** to provide a cleaner view
- The implementation uses the existing API endpoints documented in `user-website-api-documentation.md`
- All authentication is handled via Bearer token
- The Laravel backend must be running on port 8000 (as specified in the requirements)
- User's gender is automatically fetched and included in saved search filters (required by API)

## Configuration

The API base URL is configured in the environment:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Ensure this is set correctly in your `.env.local` file.
