# Registration Feature Documentation

## Overview
This document describes the implementation of the user registration feature in the Next.js matrimonial website, integrated with the Laravel API backend.

## Architecture

### Backend API
- **Base URL**: `http://localhost:8000/api` (configurable via `NEXT_PUBLIC_API_URL`)
- **API Documentation**: Located at `C:\wamp64\www\vivahavedi\vivahavedi-laravel-api\user-website-api-documentation.md`
- **Laravel Project Port**: 8000
- **Next.js Project Port**: 3000

### Frontend Structure
```
src/
├── app/
│   └── register/
│       └── page.tsx              # Main registration page
├── components/
│   └── registration/
│       ├── RegistrationStepOne.tsx    # Step 1: Basic info
│       ├── RegistrationStepTwo.tsx    # Step 2: Personal details
│       └── RegistrationStepThree.tsx  # Step 3: Location
├── types/
│   └── registration.ts           # TypeScript interfaces
└── lib/
    └── api.ts                    # API client functions
```

## Multi-Step Registration Flow

### Step 1: Basic Information
**Fields:**
- Mobile Number (10 digits, required)
- Email Address (required, validated)
- First Name (required, max 255 chars)
- Last Name (required, max 255 chars)
- Password (required, min 6 chars)
- Confirm Password (required, must match)
- Gender (male/female, required)

**Validation:**
- Mobile: Must be exactly 10 digits
- Email: Standard email format validation
- Password: Minimum 6 characters
- Confirm Password: Must match password
- All fields are required

**Component**: `RegistrationStepOne.tsx`

### Step 2: Personal Details
**Fields:**
- Date of Birth (day, month, year - required)
- Religion (dropdown from API, required)
- Caste (dropdown filtered by religion, required)

**Validation:**
- Birth Date: User must be 18+ years old (calculated from current year - 18)
- Religion: Must select from available options
- Caste: Auto-filtered based on selected religion

**API Integration:**
- Fetches master data from `/api/masters`
- Dynamically filters castes based on selected religion

**Component**: `RegistrationStepTwo.tsx`

### Step 3: Location Details
**Fields:**
- Country (dropdown from API, required)
- State (dropdown filtered by country, required)
- District (dropdown filtered by state, required)
- Location/Post Office (dropdown filtered by district, required)

**Validation:**
- All fields are required
- Cascading dropdowns: Each field depends on the previous selection

**API Integration:**
- Fetches master data from `/api/masters`
- Fetches locations from `/api/masters/locations?district_id={id}`
- Dynamic filtering based on parent selection

**Component**: `RegistrationStepThree.tsx`

## API Integration

### Endpoints Used

#### 1. Get Master Data
```http
GET /api/masters
Accept: application/json
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "religion": [...],
    "caste": [...],
    "country": [...],
    "state": [...],
    "district": [...],
    ...
  }
}
```

#### 2. Get Locations by District
```http
GET /api/masters/locations?district_id={district_id}
Accept: application/json
```

**Response:**
```json
{
  "status": "success",
  "data": [
    { "id": 1, "name": "Location Name", "masterId": 25 }
  ]
}
```

#### 3. User Registration
```http
POST /api/register
Content-Type: application/json
Accept: application/json

{
  "mobile": "9876543210",
  "email": "user@example.com",
  "password": "securepass123",
  "name": "John",
  "last_name": "Doe",
  "gender": "male",
  "birth_day": 15,
  "birth_month": 8,
  "birth_year": 1995,
  "religion": 1,
  "caste": 5,
  "country": 1,
  "state": 10,
  "district": 25,
  "location": 100
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "user_id": 12345,
    "token": "1|abcdef123456token...",
    "expire_date": 1672531200
  }
}
```

**Error Responses:**
- `400`: Mobile/email already registered
- `422`: Validation errors

## Key Features

### 1. Progressive Form Navigation
- Users can navigate back to previous steps
- Form data persists across steps
- Visual progress indicator shows current step

### 2. Real-time Validation
- Client-side validation on all fields
- Error messages display below each field
- Form submission blocked until validation passes

### 3. Dynamic Dropdowns
- Master data loaded once at component mount
- Cascading filters for related fields
- Loading states while fetching data

### 4. API Integration
- Centralized API client in `src/lib/api.ts`
- Error handling for network failures
- Token management for authentication

### 5. Theme Integration
- Uses existing Header and Footer components
- Consistent styling with the home page
- Red/pink color scheme matching brand identity
- Responsive design for mobile and desktop

## Data Flow

```
1. User lands on /register
   ↓
2. Step 1: Enters basic info
   ↓
3. Clicks "Next Step" (validates locally)
   ↓
4. Step 2: Selects personal details (fetches master data)
   ↓
5. Clicks "Next Step" (validates locally)
   ↓
6. Step 3: Selects location (fetches locations dynamically)
   ↓
7. Clicks "Complete Registration" (submits to API)
   ↓
8. API Response:
   - Success: Store token, redirect to dashboard
   - Error: Display message, stay on current/appropriate step
```

## Environment Configuration

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**Note**: Default API URL is `http://localhost:8000/api` if not configured.

## Authentication & Token Management

After successful registration:
1. Token is stored in localStorage
2. User ID is stored in localStorage
3. User is redirected to `/dashboard`

**Storage Keys:**
- `token`: Authentication bearer token
- `userId`: Registered user's ID

**Token Usage:**
```typescript
import { auth } from '@/lib/api';

// Check if authenticated
const isAuth = auth.isAuthenticated();

// Get token
const token = auth.getToken();

// Get user ID
const userId = auth.getUserId();
```

## Error Handling

### Client-Side Errors
- Validation errors: Display below each field
- Missing fields: Prevent form submission
- Network errors: Alert user to retry

### Server-Side Errors
- **400 - Duplicate Mobile**: "user already registered"
  - Action: Return to Step 1
- **400 - Duplicate Email**: "email already registered"
  - Action: Return to Step 1
- **422 - Validation Error**: Field-specific errors
  - Action: Display errors on appropriate step
- **500 - Server Error**: Generic error message
  - Action: Prompt user to try again

## Testing

### Test User Registration Flow

1. **Start Laravel API**:
   ```bash
   cd C:\wamp64\www\vivahavedi\vivahavedi-laravel-api
   php artisan serve --port=8000
   ```

2. **Start Next.js Dev Server**:
   ```bash
   cd C:\wamp64\www\vivahavedi\matrimonial-website
   npm run dev
   ```

3. **Navigate to Registration**:
   - Open: `http://localhost:3000/register`

4. **Test Scenarios**:
   - Valid registration with all fields
   - Duplicate mobile/email detection
   - Age validation (must be 18+)
   - Cascading dropdown functionality
   - Form persistence across steps
   - Back button functionality

### Sample Test Data

```json
{
  "mobile": "9876543210",
  "email": "test@example.com",
  "password": "test123",
  "name": "Test",
  "last_name": "User",
  "gender": "male",
  "birth_day": 15,
  "birth_month": 5,
  "birth_year": 1995,
  "religion": 1,
  "caste": 5,
  "country": 57,
  "state": 24,
  "district": 1113,
  "location": 1383
}
```

## Future Enhancements

### Recommended Improvements

1. **Email/Mobile Verification**
   - Send OTP for email verification
   - Send OTP for mobile verification
   - Add verification step before final submission

2. **Password Strength Indicator**
   - Visual indicator for password strength
   - Real-time feedback as user types
   - Requirements checklist

3. **Social Login Integration**
   - Google OAuth
   - Facebook OAuth
   - Apple Sign-in

4. **Profile Photo Upload**
   - Add optional photo upload in Step 3
   - Image preview before upload
   - Image compression

5. **Save Progress**
   - Allow users to save incomplete registration
   - Email reminder to complete registration
   - Resume from saved progress

6. **Enhanced Validation**
   - Real-time email/mobile uniqueness check
   - Phone number format validation by country
   - Age calculation based on actual date

7. **Better Error Messages**
   - More descriptive validation errors
   - Helpful hints for each field
   - Inline suggestions

8. **Analytics**
   - Track step completion rates
   - Identify drop-off points
   - A/B testing for form variants

## Troubleshooting

### Common Issues

**Issue 1: Master data not loading**
- **Cause**: Laravel API not running or CORS issue
- **Solution**: Ensure Laravel API is running on port 8000, check CORS configuration

**Issue 2: Registration fails with no error**
- **Cause**: Network error or API endpoint mismatch
- **Solution**: Check browser console, verify API URL in `.env.local`

**Issue 3: Cascading dropdowns not working**
- **Cause**: Master data structure mismatch or filtering logic error
- **Solution**: Verify `masterId` fields in API response match expected structure

**Issue 4: Token not persisting**
- **Cause**: localStorage not accessible or token not being stored
- **Solution**: Check browser localStorage permissions, verify token storage logic

### Debug Mode

Enable debug logging by adding to components:
```typescript
console.log('Form Data:', localFormData);
console.log('Master Data:', masterData);
console.log('Errors:', errors);
```

## Security Considerations

1. **Password Handling**
   - Passwords are sent over HTTPS in production
   - Never log passwords to console
   - Backend uses MD5 hashing (legacy system)

2. **Token Security**
   - Tokens stored in localStorage (consider httpOnly cookies for production)
   - Token expiry: 30 days
   - Implement token refresh mechanism

3. **Input Sanitization**
   - All inputs validated client-side
   - Backend performs additional validation
   - XSS protection through React's automatic escaping

4. **CORS Configuration**
   - Configure Laravel API to allow Next.js origin
   - Set appropriate CORS headers
   - Use environment-specific origins

## Deployment Checklist

- [ ] Update `NEXT_PUBLIC_API_URL` for production
- [ ] Enable HTTPS for API communication
- [ ] Configure CORS properly
- [ ] Test on multiple devices/browsers
- [ ] Verify cascading dropdowns work
- [ ] Check error handling flows
- [ ] Test with slow network conditions
- [ ] Validate accessibility features
- [ ] Review security configurations
- [ ] Set up monitoring/logging

## Contact

For questions or issues:
- Check Laravel API documentation first
- Review Next.js component implementation
- Test API endpoints using cURL or Postman
- Check browser console for client-side errors

## Version History

- **v1.0** (Current): Initial implementation with 3-step registration form
  - Basic information collection
  - Personal details with master data
  - Location selection with cascading dropdowns
  - Full API integration
  - Theme consistency with homepage

---

**Last Updated**: 2025-01-01
**Author**: Development Team
**Status**: Ready for Testing
