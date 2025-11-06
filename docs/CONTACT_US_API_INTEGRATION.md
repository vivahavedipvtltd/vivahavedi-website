# Contact Us API Integration Documentation

## Overview

This document provides comprehensive documentation for the Contact Us API integration in the Next.js frontend application. The integration connects to the Laravel backend APIs to fetch and display contact details and branch information.

**Created:** January 2025
**Last Updated:** January 2025
**Version:** 1.0.0

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [API Endpoints](#api-endpoints)
3. [Implementation Files](#implementation-files)
4. [Data Flow](#data-flow)
5. [API Service Functions](#api-service-functions)
6. [Frontend Integration](#frontend-integration)
7. [Error Handling](#error-handling)
8. [Testing](#testing)
9. [Future Enhancements](#future-enhancements)
10. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

### Technology Stack

**Backend:**
- **Framework:** Laravel (PHP)
- **Database:** MySQL
- **API Type:** RESTful JSON API
- **Port:** 8000 (http://127.0.0.1:8000)

**Frontend:**
- **Framework:** Next.js 14+ (React)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **HTTP Client:** Native Fetch API

### System Architecture

```
┌─────────────────────────────────────┐
│         Next.js Frontend            │
│      (Port: 3000 or similar)        │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Contact Us Page           │   │
│  │   (/contact-us)             │   │
│  └─────────────────────────────┘   │
│              ↓                      │
│  ┌─────────────────────────────┐   │
│  │   API Service Layer         │   │
│  │   (contactUsApi.ts)         │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
              ↓ HTTP/JSON
┌─────────────────────────────────────┐
│        Laravel Backend              │
│         (Port: 8000)                │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  ContactUsController        │   │
│  └─────────────────────────────┘   │
│              ↓                      │
│  ┌─────────────────────────────┐   │
│  │   Models & Database         │   │
│  │   - WebsiteDetail           │   │
│  │   - CompanyBranch           │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## API Endpoints

### 1. Get Home Contact Details

Fetches the main website contact information.

**Endpoint:** `GET /api/contact-us/home`

**Request:**
- **Method:** GET
- **Headers:**
  - `Accept: application/json`
- **Authentication:** Not required (Public API)

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "name": "Vivahavedi",
    "mobile": "9995699944",
    "email": "info@vivahavedi.com"
  }
}
```

**Error Responses:**

404 Not Found:
```json
{
  "status": "error",
  "message": "No active website details found"
}
```

500 Internal Server Error:
```json
{
  "status": "error",
  "message": "An error occurred while fetching contact details"
}
```

**Database Table:** `website_details`

**Table Schema:**
- `website_id` (Primary Key)
- `website_name` - Company/Website name
- `website_mobile` - Contact mobile number
- `website_email` - Contact email address
- `website_status` - Status (active/inactive)

---

### 2. Get Branches

Fetches all active company branches with their details.

**Endpoint:** `GET /api/contact-us/branches`

**Request:**
- **Method:** GET
- **Headers:**
  - `Accept: application/json`
- **Authentication:** Not required (Public API)

**Success Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Ernakulam",
      "phone": "871 444 5190",
      "service": "9061 967 111",
      "email": "vivahavediekm@gmail.com",
      "address": "1st Floor,Gowri Arcade,\nPetta,Poonithura PO, Ernakulam,Kerala - 682038",
      "map": "https://goo.gl/maps/1n1YjrJ3TExFN43T8",
      "image": "http://127.0.0.1:8000/asset/images/matrimony/office_ernakulam.jpg"
    },
    {
      "id": 2,
      "name": "Pattambi",
      "phone": "8089 953 432",
      "service": "7736 425 548",
      "email": "vivahavediptb@gmail.com",
      "address": "Sudarsana Building Near South Indian Bank Mele Pattambi",
      "map": "https://www.google.com/maps/place/Vivahavedi+Matrimony/@10.805792,76.1885323,17z/...",
      "image": "http://127.0.0.1:8000/asset/images/matrimony/office.jpg"
    }
  ]
}
```

**Response Fields:**
- `id` (integer): Branch identifier
- `name` (string): Branch location/name
- `phone` (string): Primary contact number
- `service` (string): Service contact number
- `email` (string): Branch email address
- `address` (string): Full physical address (may contain newlines)
- `map` (string): Google Maps URL (or "#" if not available)
- `image` (string): Full URL to branch office image

**Error Response (500):**
```json
{
  "status": "error",
  "message": "An error occurred while fetching branches"
}
```

**Database Table:** `company_branches`

**Table Schema:**
- `cb_id` (Primary Key)
- `cb_name` - Branch name/location
- `cb_phone` - Primary phone number
- `cb_phone_service` - Service phone number
- `cb_email` - Branch email
- `cb_address` - Full address
- `cb_google_map` - Google Maps URL
- `cb_image` - Image filename
- `cb_active` - Active status (yes/no)

**Notes:**
- Only branches with `cb_active = 'yes'` are returned
- If a branch has no custom image, default image path is used
- Images are served with full URL from the backend

---

## Implementation Files

### 1. API Service Layer

**File:** `src/lib/contactUsApi.ts`

**Purpose:** Provides reusable API service functions for fetching contact data.

**Exports:**
- `getHomeContactDetails()` - Fetch main contact details
- `getBranches()` - Fetch all active branches
- `formatPhoneNumber()` - Helper to format phone numbers
- `getMapEmbedUrl()` - Helper to convert Google Maps URLs

**Interfaces:**
```typescript
interface ContactDetails {
  name: string;
  mobile: string;
  email: string;
}

interface Branch {
  id: number;
  name: string;
  phone: string;
  service: string;
  email: string;
  address: string;
  map: string;
  image: string;
}
```

### 2. Frontend Page

**File:** `src/app/contact-us/page.tsx`

**Purpose:** Main contact page that displays contact information, branches, and contact form.

**Features:**
- Fetches and displays contact details on mount
- Fetches and displays all active branches
- Contact form for user inquiries
- Responsive design with Tailwind CSS
- Loading states and error handling
- Google Maps integration support

---

## Data Flow

### Initial Page Load

1. **User navigates to `/contact-us`**
   - Next.js renders the Contact Us page component

2. **useEffect Hook Triggers**
   - Calls `fetchData()` function on component mount

3. **Parallel API Calls**
   ```typescript
   const [details, branchList] = await Promise.all([
     getHomeContactDetails(),
     getBranches()
   ]);
   ```

4. **API Requests**
   - `GET http://127.0.0.1:8000/api/contact-us/home`
   - `GET http://127.0.0.1:8000/api/contact-us/branches`

5. **Backend Processing**
   - Laravel routes requests to `ContactUsController`
   - Controller queries database tables
   - Returns JSON responses

6. **Frontend Updates**
   - Updates state with fetched data
   - Renders contact information
   - Displays branches in grid layout

### State Management

```typescript
// Loading state - shows spinner
const [dataLoading, setDataLoading] = useState(true);

// Contact details state
const [contactDetails, setContactDetails] = useState<ContactDetails | null>(null);

// Branches list state
const [branches, setBranches] = useState<Branch[]>([]);

// Error state - shows error message
const [dataError, setDataError] = useState<string | null>(null);
```

---

## API Service Functions

### getHomeContactDetails()

**Purpose:** Fetches main website contact information.

**Usage:**
```typescript
import { getHomeContactDetails } from '@/lib/contactUsApi';

const details = await getHomeContactDetails();
console.log(details.email); // "info@vivahavedi.com"
```

**Return Type:** `Promise<ContactDetails>`

**Error Handling:**
- Throws error if HTTP request fails
- Throws error if API returns error status
- Logs errors to console

### getBranches()

**Purpose:** Fetches all active company branches.

**Usage:**
```typescript
import { getBranches } from '@/lib/contactUsApi';

const branches = await getBranches();
branches.forEach(branch => {
  console.log(`${branch.name}: ${branch.phone}`);
});
```

**Return Type:** `Promise<Branch[]>`

**Error Handling:**
- Throws error if HTTP request fails
- Throws error if API returns error status
- Logs errors to console

### Helper Functions

#### formatPhoneNumber(phone: string)

Formats phone numbers for display.

**Example:**
```typescript
formatPhoneNumber("9995699944"); // Returns formatted number
```

#### getMapEmbedUrl(mapUrl: string)

Converts Google Maps URL to embed URL for iframe.

**Example:**
```typescript
const embedUrl = getMapEmbedUrl("https://goo.gl/maps/...");
// Returns embed-compatible URL or null
```

---

## Frontend Integration

### Component Structure

```typescript
export default function ContactUsPage() {
  // State management
  const [contactDetails, setContactDetails] = useState<ContactDetails | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        setDataError(null);

        const [details, branchList] = await Promise.all([
          getHomeContactDetails(),
          getBranches()
        ]);

        setContactDetails(details);
        setBranches(branchList);
      } catch (err) {
        setDataError('Unable to load contact information...');
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    // JSX rendering
  );
}
```

### UI States

#### Loading State
```typescript
{dataLoading && (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
  </div>
)}
```

#### Error State
```typescript
{dataError && (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <p className="text-red-600 text-sm">{dataError}</p>
  </div>
)}
```

#### Success State
```typescript
{contactDetails && (
  <>
    <div>Email: {contactDetails.email}</div>
    <div>Phone: {formatPhoneNumber(contactDetails.mobile)}</div>
  </>
)}
```

### Branches Display

```typescript
{branches.length > 0 && (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
    {branches.map((branch) => (
      <div key={branch.id} className="bg-gray-50 rounded-lg shadow-md">
        <img src={branch.image} alt={`${branch.name} Office`} />
        <div>
          <h3>{branch.name}</h3>
          <p>{branch.phone}</p>
          <p>{branch.email}</p>
          <p>{branch.address}</p>
          <a href={branch.map} target="_blank">View on Map</a>
        </div>
      </div>
    ))}
  </div>
)}
```

---

## Error Handling

### API Service Layer

**Network Errors:**
```typescript
try {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
} catch (error) {
  console.error('Error fetching data:', error);
  throw error;
}
```

**API Error Responses:**
```typescript
const result = await response.json();
if (result.status === 'success' && result.data) {
  return result.data;
} else {
  throw new Error(result.message || 'Failed to fetch data');
}
```

### Frontend Component

**Error Display:**
```typescript
catch (err) {
  console.error('Error fetching contact data:', err);
  setDataError('Unable to load contact information. Please try again later.');
}
```

**Graceful Degradation:**
- Shows error message if API fails
- Form remains functional even if contact details fail to load
- Branches section only displays if data is available

---

## Testing

### Manual Testing Checklist

1. **Contact Details Loading**
   - [ ] Navigate to `/contact-us`
   - [ ] Verify loading spinner appears
   - [ ] Verify contact details display correctly
   - [ ] Verify phone number is clickable (tel: link)
   - [ ] Verify email is clickable (mailto: link)

2. **Branches Display**
   - [ ] Verify all branches are displayed
   - [ ] Verify branch images load correctly
   - [ ] Verify fallback image works if image fails to load
   - [ ] Verify "View on Map" link opens in new tab
   - [ ] Verify phone and email links work

3. **Error Handling**
   - [ ] Stop Laravel server and verify error message displays
   - [ ] Verify form still works when API is down
   - [ ] Restart server and verify data loads

4. **Responsive Design**
   - [ ] Test on mobile (< 768px)
   - [ ] Test on tablet (768px - 1024px)
   - [ ] Test on desktop (> 1024px)

### API Testing

**Using cURL:**

```bash
# Test home contact details
curl -X GET "http://127.0.0.1:8000/api/contact-us/home" \
  -H "Accept: application/json"

# Test branches
curl -X GET "http://127.0.0.1:8000/api/contact-us/branches" \
  -H "Accept: application/json"
```

**Using Postman:**
1. Import endpoints into Postman
2. Set Accept header to `application/json`
3. Verify response structure matches documentation

---

## Future Enhancements

### Planned Features

1. **Contact Form Submission API**
   - Implement backend API for form submission
   - Add email notification system
   - Store contact inquiries in database

2. **Google Maps Integration**
   - Add Google Maps API key
   - Display interactive maps for each branch
   - Add directions functionality

3. **Caching Strategy**
   - Implement client-side caching with SWR or React Query
   - Add revalidation on focus/reconnect
   - Cache branch images

4. **Real-time Updates**
   - Add WebSocket support for real-time contact updates
   - Push notifications for new branch additions

5. **SEO Optimization**
   - Add structured data (JSON-LD) for contact information
   - Implement server-side rendering for contact details
   - Add meta tags with contact information

### API Enhancements

1. **Search & Filter**
   - Add endpoint to search branches by location
   - Filter branches by services offered
   - Sort branches by proximity to user

2. **Analytics**
   - Track contact form submissions
   - Monitor branch page views
   - Track map link clicks

---

## Troubleshooting

### Common Issues

#### 1. API Connection Failed

**Symptom:** Error message "Unable to load contact information"

**Possible Causes:**
- Laravel backend is not running
- Port 8000 is not accessible
- CORS issues

**Solutions:**
```bash
# Start Laravel backend
cd C:\wamp64\www\vivahavedi\vivahavedi-laravel-api
php artisan serve --port=8000

# Verify backend is running
curl http://127.0.0.1:8000/api/contact-us/home
```

#### 2. CORS Errors

**Symptom:** Browser console shows CORS policy errors

**Solution:** Ensure Laravel CORS configuration allows requests from Next.js app:

```php
// config/cors.php
'allowed_origins' => ['http://localhost:3000'],
'allowed_headers' => ['*'],
'allowed_methods' => ['GET', 'POST'],
```

#### 3. Images Not Loading

**Symptom:** Branch images show broken image icon

**Possible Causes:**
- Image path is incorrect
- Images don't exist in Laravel public directory
- Backend URL is wrong

**Solutions:**
- Verify image exists at: `C:\wamp64\www\vivahavedi\vivahavedi-laravel-api\public\asset\images\matrimony\`
- Check image URL in API response
- Implement fallback image in frontend

#### 4. Data Not Updating

**Symptom:** Old data still displays after database changes

**Possible Causes:**
- Next.js caching
- Browser caching
- API caching

**Solutions:**
```typescript
// Disable caching in fetch
fetch(url, {
  cache: 'no-store', // Already implemented
});

// Clear browser cache
// Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

### Debug Mode

Enable detailed logging:

```typescript
// In contactUsApi.ts
export async function getHomeContactDetails(): Promise<ContactDetails> {
  console.log('[DEBUG] Fetching home contact details...');

  try {
    const response = await fetch(`${API_BASE_URL}/api/contact-us/home`);
    console.log('[DEBUG] Response status:', response.status);

    const result = await response.json();
    console.log('[DEBUG] Response data:', result);

    return result.data;
  } catch (error) {
    console.error('[DEBUG] Error:', error);
    throw error;
  }
}
```

---

## Maintenance Notes

### Regular Checks

1. **Weekly:**
   - Verify all API endpoints are responsive
   - Check error logs for API failures
   - Monitor API response times

2. **Monthly:**
   - Review and update branch information
   - Verify all images are loading
   - Test on multiple devices

3. **Quarterly:**
   - Review API documentation for changes
   - Update TypeScript interfaces if needed
   - Optimize API calls if performance degrades

### Updating API Endpoints

If the Laravel backend API endpoints change:

1. Update `API_BASE_URL` in `contactUsApi.ts`
2. Update endpoint paths in service functions
3. Update interfaces if response structure changes
4. Update this documentation
5. Test all functionality

### Database Changes

If database schema changes:

1. Update TypeScript interfaces
2. Update API service functions
3. Update frontend rendering logic
4. Test thoroughly
5. Update documentation

---

## Contact

For questions or issues related to this integration:

**Development Team:**
- Email: dev@vivahavedi.com
- Documentation: This file

**API Documentation:**
- Location: `C:\wamp64\www\vivahavedi\vivahavedi-laravel-api\user-website-api-documentation-part3.md`
- Sections: Contact Us APIs (Lines 11-175)

**Related Files:**
- Backend Controller: `app/Http/Controllers/ContactUsController.php`
- Backend Models: `app/Models/WebsiteDetail.php`, `app/Models/CompanyBranch.php`
- Frontend Service: `src/lib/contactUsApi.ts`
- Frontend Page: `src/app/contact-us/page.tsx`

---

**Document Version:** 1.0.0
**Last Updated:** January 2025
**Author:** Development Team
