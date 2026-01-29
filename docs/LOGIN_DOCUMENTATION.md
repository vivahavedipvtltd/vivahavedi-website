# Login Feature - Documentation

## Overview

This document provides comprehensive documentation for the login functionality implemented in the Next.js matrimonial website. The login feature includes user authentication, state management, route protection, and header UI updates.

## Table of Contents

1. [Features](#features)
2. [Technology Stack](#technology-stack)
3. [File Structure](#file-structure)
4. [Implementation Details](#implementation-details)
5. [API Integration](#api-integration)
6. [State Management](#state-management)
7. [Route Protection](#route-protection)
8. [UI Components](#ui-components)
9. [Testing](#testing)
10. [Future Enhancements](#future-enhancements)

---

## Features

### Core Features
- ✅ User login with email or mobile number
- ✅ Password field with show/hide toggle
- ✅ Client-side form validation
- ✅ Laravel API integration
- ✅ Token-based authentication using localStorage
- ✅ Global authentication state management (React Context)
- ✅ Route protection (prevent logged-in users from accessing login/register)
- ✅ Dynamic header UI (Login/Register buttons vs Dashboard/Logout)
- ✅ Loading states and error handling
- ✅ Responsive design (mobile and desktop)

### User Experience
- Clean, modern login form design
- Real-time validation feedback
- Loading indicators during API calls
- Test credentials displayed for easy testing
- Smooth redirects after login/logout
- Mobile-responsive layout

---

## Technology Stack

- **Framework**: Next.js 15.5.4 (App Router)
- **UI Library**: React 19.0.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API**: Laravel REST API
- **Authentication**: Laravel Sanctum (Bearer Token)
- **State Management**: React Context API

---

## File Structure

```
src/
├── app/
│   ├── login/
│   │   └── page.tsx                    # Login page component
│   └── layout.tsx                      # Root layout with AuthProvider
├── components/
│   ├── Header.tsx                      # Header with auth-aware UI
│   ├── Footer.tsx                      # Footer component
│   └── auth/
│       └── AuthGuard.tsx               # Route protection component
├── contexts/
│   └── AuthContext.tsx                 # Authentication state management
├── lib/
│   └── api.ts                          # API client and auth helpers
└── types/
    └── registration.ts                 # TypeScript interfaces (reused)
```

---

## Implementation Details

### 1. Login Page (`src/app/login/page.tsx`)

**Purpose**: Main login interface for users to authenticate

**Key Features**:
- Email/mobile input field
- Password field with visibility toggle
- Form validation
- API integration
- Loading states
- Error handling
- Test credentials display

**Form Fields**:
| Field | Type | Validation | Description |
|-------|------|------------|-------------|
| login | text | Required | Email or mobile number |
| password | password | Required | User password |

**Validation Rules**:
```typescript
- login: Must not be empty
- password: Must not be empty
```

**Login Flow**:
1. User enters credentials
2. Client-side validation runs
3. API call to Laravel backend
4. On success:
   - Store token in localStorage
   - Store userId in localStorage
   - Update AuthContext state
   - Redirect to home page
5. On failure:
   - Display error message
   - Keep user on login page

---

### 2. Authentication Context (`src/contexts/AuthContext.tsx`)

**Purpose**: Global state management for authentication

**State Variables**:
```typescript
interface AuthContextType {
  isAuthenticated: boolean;    // User login status
  userId: number | null;        // Logged-in user ID
  token: string | null;         // API authentication token
  login: (token, userId) => void;  // Function to log in
  logout: () => void;           // Function to log out
  loading: boolean;             // Initial auth check loading
}
```

**Key Functions**:

1. **Initialization (useEffect)**:
   - Runs on app load
   - Checks localStorage for existing token
   - Restores authentication state if token exists

2. **login(token, userId)**:
   - Stores token and userId in localStorage
   - Updates context state
   - Sets isAuthenticated to true

3. **logout()**:
   - Removes token and userId from localStorage
   - Clears context state
   - Sets isAuthenticated to false

**Usage Example**:
```typescript
const { isAuthenticated, login, logout } = useAuth();

// After successful API login
login(result.data.token, result.data.user_id);

// To log out
logout();
```

---

### 3. Route Protection (`src/components/auth/AuthGuard.tsx`)

**Purpose**: Prevent unauthorized access to pages and redirect logged-in users

**Props**:
```typescript
interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;     // true = protected route, false = public route
  redirectTo?: string;       // Where to redirect authenticated users
}
```

**Logic**:
```typescript
// For auth pages (login/register): requireAuth = false
if (user is authenticated) {
  redirect to home page
}

// For protected pages (dashboard): requireAuth = true
if (user is not authenticated) {
  redirect to login page
}
```

**Usage**:
```tsx
// Login page (prevent logged-in users)
<AuthGuard requireAuth={false} redirectTo="/">
  <LoginPage />
</AuthGuard>

// Dashboard page (require login)
<AuthGuard requireAuth={true} redirectTo="/login">
  <Dashboard />
</AuthGuard>
```

---

### 4. Header Component Updates (`src/components/Header.tsx`)

**Purpose**: Display different UI based on authentication status

**Desktop Header States**:

**Not Logged In**:
```tsx
<Link href="/login">Login</Link>
<Link href="/register">Register</Link>
```

**Logged In**:
```tsx
<Link href="/dashboard">Dashboard</Link>
<button onClick={logout}>Logout</button>
```

**Mobile Menu States**: Same logic as desktop, with mobile-optimized layout

**Loading State**: Shows skeleton loader while checking authentication

---

## API Integration

### Login Endpoint

**Endpoint**: `POST /api/login`

**Request**:
```json
{
  "login": "8888888888",         // or email: "user@example.com"
  "password": "testpass123"
}
```

**Success Response** (200):
```json
{
  "status": "success",
  "data": {
    "user_id": 237947,
    "token": "9|GtOyj0ORttWYnMsFTDSy1Smt5TcHuGWkaM4naX11",
    "expire_date": 1672531200
  }
}
```

**Error Response** (401):
```json
{
  "status": "failed",
  "message": "Invalid Login Details"
}
```

### API Client (`src/lib/api.ts`)

**Login Function**:
```typescript
async login(login: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ login, password }),
  });
  return response.json();
}
```

**Auth Helper Functions**:
```typescript
// Store token
auth.setToken(token: string)

// Get stored token
auth.getToken(): string | null

// Remove token
auth.removeToken()

// Store user ID
auth.setUserId(userId: number)

// Get stored user ID
auth.getUserId(): number | null

// Check if authenticated
auth.isAuthenticated(): boolean
```

---

## State Management

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      App Initialization                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
               ┌─────────────────────────┐
               │   Check localStorage    │
               │   for token/userId      │
               └─────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ↓                       ↓
        ┌──────────────┐        ┌──────────────┐
        │ Token Found  │        │ No Token     │
        │ Set auth=true│        │ Set auth=false│
        └──────────────┘        └──────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       Login Process                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
                  ┌───────────────────┐
                  │  User submits     │
                  │  login form       │
                  └───────────────────┘
                            │
                            ↓
                  ┌───────────────────┐
                  │  API call to      │
                  │  Laravel backend  │
                  └───────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ↓                       ↓
        ┌──────────────┐        ┌──────────────┐
        │   Success    │        │    Error     │
        └──────────────┘        └──────────────┘
                │                       │
                ↓                       ↓
    ┌──────────────────────┐   ┌──────────────┐
    │ Store token/userId   │   │ Show error   │
    │ Update AuthContext   │   │ message      │
    │ Redirect to home     │   └──────────────┘
    └──────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       Logout Process                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
                  ┌───────────────────┐
                  │  User clicks      │
                  │  logout button    │
                  └───────────────────┘
                            │
                            ↓
                  ┌───────────────────┐
                  │  Remove token     │
                  │  from localStorage│
                  └───────────────────┘
                            │
                            ↓
                  ┌───────────────────┐
                  │  Update           │
                  │  AuthContext      │
                  └───────────────────┘
                            │
                            ↓
                  ┌───────────────────┐
                  │  Redirect to      │
                  │  home page        │
                  └───────────────────┘
```

---

## Route Protection

### Protected Routes

**Login Page** (`/login`):
- Accessible: NOT logged in
- Redirect: Logged-in users → home page

**Register Page** (`/register`):
- Accessible: NOT logged in
- Redirect: Logged-in users → home page

**Dashboard** (future):
- Accessible: Logged in
- Redirect: Not logged-in users → login page

### Implementation

```tsx
// In login/register pages
<AuthGuard requireAuth={false} redirectTo="/">
  <PageContent />
</AuthGuard>

// In dashboard pages (future)
<AuthGuard requireAuth={true}>
  <DashboardContent />
</AuthGuard>
```

---

## UI Components

### Login Form Design

**Desktop View**:
```
┌───────────────────────────────────────────┐
│              Welcome Back                  │
│    Sign in to your account to continue    │
├───────────────────────────────────────────┤
│                                           │
│  Email or Mobile Number *                 │
│  ┌─────────────────────────────────────┐ │
│  │ 📧 [Input field]                    │ │
│  └─────────────────────────────────────┘ │
│                                           │
│  Password *                               │
│  ┌─────────────────────────────────────┐ │
│  │ 🔒 [Password field]             👁 │ │
│  └─────────────────────────────────────┘ │
│                                           │
│  ┌─────────────────────────────────────┐ │
│  │      🔑 Sign In                     │ │
│  └─────────────────────────────────────┘ │
│                                           │
│              ─── OR ───                   │
│                                           │
│  Don't have an account? Create Account   │
│                                           │
├───────────────────────────────────────────┤
│  Test Credentials:                        │
│  Mobile/Email: 8888888888                 │
│  Password: testpass123                    │
└───────────────────────────────────────────┘
```

**Mobile View**: Responsive layout with full-width inputs

---

### Header States

**Not Authenticated**:
```
┌──────────────────────────────────────────┐
│ ❤️ Vivahavedi Matrimony  [Nav] [Login][Register]│
└──────────────────────────────────────────┘
```

**Authenticated**:
```
┌──────────────────────────────────────────┐
│ ❤️ Vivahavedi Matrimony  [Nav] [Dashboard][Logout]│
└──────────────────────────────────────────┘
```

---

## Testing

### Manual Testing Steps

#### 1. Test Login Page Access

**When NOT logged in**:
1. Navigate to `http://localhost:3001/login`
2. ✅ Should display login form
3. ✅ Header should show "Login" and "Register" buttons

**When logged in**:
1. Log in successfully
2. Try navigating to `http://localhost:3001/login`
3. ✅ Should redirect to home page (`/`)

---

#### 2. Test Login Flow

**Valid Credentials**:
1. Go to `/login`
2. Enter: `8888888888` (or `testuser2@example.com`)
3. Enter password: `testpass123`
4. Click "Sign In"
5. ✅ Should show loading spinner
6. ✅ Should redirect to home page
7. ✅ Header should show "Dashboard" and "Logout"
8. ✅ localStorage should contain token and userId

**Invalid Credentials**:
1. Go to `/login`
2. Enter wrong credentials
3. Click "Sign In"
4. ✅ Should show error message "Invalid login credentials"
5. ✅ Should stay on login page

**Empty Fields**:
1. Go to `/login`
2. Leave fields empty
3. Click "Sign In"
4. ✅ Should show validation errors
5. ✅ Should not make API call

---

#### 3. Test Header Updates

**Before Login**:
1. Visit home page
2. ✅ Header shows "Login" and "Register" buttons

**After Login**:
1. Log in with valid credentials
2. ✅ Header shows "Dashboard" and "Logout" buttons
3. ✅ "Login" and "Register" buttons are hidden

**After Logout**:
1. Click "Logout" in header
2. ✅ Should redirect to home page
3. ✅ Header reverts to "Login" and "Register"
4. ✅ localStorage token is removed

---

#### 4. Test Register Page Access

**When NOT logged in**:
1. Navigate to `http://localhost:3001/register`
2. ✅ Should display registration form

**When logged in**:
1. Log in successfully
2. Try navigating to `http://localhost:3001/register`
3. ✅ Should redirect to home page (`/`)

---

#### 5. Test Page Refresh

**When logged in**:
1. Log in successfully
2. Refresh the page
3. ✅ User should remain logged in
4. ✅ Header should still show "Dashboard" and "Logout"
5. ✅ Token should persist in localStorage

---

### Test Credentials

**Test User Account**:
- **Mobile**: 8888888888
- **Email**: testuser2@example.com
- **Password**: testpass123
- **User ID**: 237947

---

### Browser DevTools Checks

**localStorage Inspection**:
```javascript
// Open browser console
localStorage.getItem('token');    // Should show token after login
localStorage.getItem('userId');   // Should show user ID after login

// After logout
localStorage.getItem('token');    // Should be null
localStorage.getItem('userId');   // Should be null
```

**Network Tab**:
```
POST http://localhost:8000/api/login
Status: 200 OK
Response: { status: "success", data: { user_id, token, expire_date } }
```

---

## Environment Configuration

### API URL Setup

**File**: `.env.local` (create if not exists)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**For production**:
```env
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

---

## Security Considerations

### Current Implementation

✅ **Implemented**:
- Bearer token authentication
- Password field masking with toggle
- Client-side validation
- HTTPS support (production)
- Token stored in localStorage

⚠️ **Future Improvements**:
- Add CSRF token support
- Implement token refresh mechanism
- Add "Remember Me" functionality
- Add rate limiting for login attempts
- Implement session timeout
- Add two-factor authentication (2FA)

---

## Error Handling

### Error Types and Messages

| Error Type | Status | Message | Action |
|------------|--------|---------|--------|
| Invalid credentials | 401 | "Invalid login credentials" | Show error, stay on page |
| Empty fields | Client | "Email or mobile number is required" | Show validation error |
| Network error | N/A | "Login failed. Please try again." | Show error, allow retry |
| API timeout | 500 | "Login failed. Please try again." | Show error, allow retry |

### Error Display

```tsx
{errors.login && (
  <p className="mt-1 text-sm text-red-600">{errors.login}</p>
)}
```

---

## Future Enhancements

### Planned Features

1. **Forgot Password**:
   - Add "Forgot Password?" link
   - Create password reset flow

2. **Social Login**:
   - Add Google login
   - Add Facebook login

3. **Remember Me**:
   - Add checkbox to persist login
   - Extend token expiry

4. **Session Management**:
   - Implement token refresh
   - Add session timeout warnings
   - Auto-logout on token expiry

5. **Security Enhancements**:
   - Add CAPTCHA for bot prevention
   - Implement rate limiting
   - Add login attempt tracking
   - Email notifications for new logins

6. **User Experience**:
   - Add loading skeleton
   - Implement toast notifications (replace alerts)
   - Add animated transitions
   - Show last login time

7. **Analytics**:
   - Track login success/failure rates
   - Monitor login attempt patterns
   - Track authentication errors

---

## Troubleshooting

### Common Issues

**Issue**: "Cannot read property 'token' of undefined"
- **Cause**: API response doesn't match expected format
- **Solution**: Check API endpoint and response structure

**Issue**: User stays logged in after logout
- **Cause**: localStorage not cleared properly
- **Solution**: Clear browser cache and localStorage manually

**Issue**: Redirect loop after login
- **Cause**: AuthGuard logic conflict
- **Solution**: Check `requireAuth` prop values

**Issue**: "Unauthenticated" on protected routes
- **Cause**: Token expired or invalid
- **Solution**: Log out and log back in

---

## API Reference

### Login API

**Endpoint**: `POST http://localhost:8000/api/login`

**Request Headers**:
```
Content-Type: application/json
Accept: application/json
```

**Request Body**:
```json
{
  "login": "string",      // Email or mobile number
  "password": "string"    // User password
}
```

**Success Response** (200):
```json
{
  "status": "success",
  "data": {
    "user_id": 237947,
    "token": "9|abc123...",
    "expire_date": 1672531200
  }
}
```

**Error Response** (401):
```json
{
  "status": "failed",
  "message": "Invalid Login Details"
}
```

---

## Deployment Checklist

- [ ] Update `NEXT_PUBLIC_API_URL` for production
- [ ] Enable HTTPS for API and Next.js
- [ ] Test login with production API
- [ ] Verify CORS settings on Laravel
- [ ] Test token expiry handling
- [ ] Test logout functionality
- [ ] Verify route protection works
- [ ] Check mobile responsiveness
- [ ] Test on multiple browsers
- [ ] Set up error monitoring
- [ ] Configure analytics tracking

---

## Conclusion

The login feature is **fully functional** with the following completed:

✅ Login page with form validation
✅ API integration with Laravel backend
✅ Global authentication state management
✅ Route protection for login/register pages
✅ Dynamic header UI updates
✅ Token-based authentication
✅ Logout functionality
✅ Responsive design
✅ Error handling
✅ Loading states

**Status**: Ready for testing and user acceptance

---

**Documentation Version**: 1.0
**Last Updated**: 2025-01-01
**Author**: Development Team
**Laravel API Port**: 8000
**Next.js Port**: 3001
