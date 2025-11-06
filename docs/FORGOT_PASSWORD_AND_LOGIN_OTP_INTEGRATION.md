# Forgot Password & Login OTP APIs Integration Documentation

## Overview

This document provides comprehensive documentation for the Forgot Password (APIs 38-40) and Login OTP (APIs 41-42) integration in the Vivahavedi Matrimonial Website. These APIs provide alternative authentication and account recovery mechanisms.

**Created:** 2025-10-03
**Laravel API Port:** 8000
**Frontend Framework:** Next.js 14 with TypeScript
**Backend Framework:** Laravel 10.x

---

## Table of Contents

1. [API Specifications](#api-specifications)
2. [Laravel Backend Analysis](#laravel-backend-analysis)
3. [Frontend Integration](#frontend-integration)
4. [Component Documentation](#component-documentation)
5. [User Flows](#user-flows)
6. [Security Considerations](#security-considerations)
7. [Testing Guide](#testing-guide)
8. [Troubleshooting](#troubleshooting)
9. [Future Enhancements](#future-enhancements)

---

## API Specifications

### Forgot Password Flow

#### API 38: Send OTP for Password Reset

**Endpoint:** `POST http://localhost:8000/api/forgot-password/send-otp`

**Authentication:** Not Required (Public endpoint)

**Request Body:**
```json
{
  "mobile": "8888888888"
}
```

**Request Parameters:**

| Parameter | Type | Required | Validation | Description |
|-----------|------|----------|------------|-------------|
| mobile | string | Yes | 10 digits | Registered mobile number |

**Success Response (200):**
```json
{
  "status": "success",
  "message": "otp_sent"
}
```

**Error Responses:**

**Invalid Mobile Number (404):**
```json
{
  "status": "failed",
  "message": "invalid_number"
}
```

**Validation Error (422):**
```json
{
  "status": "failed",
  "message": "The given data was invalid.",
  "errors": {
    "mobile": ["The mobile format is invalid."]
  }
}
```

---

#### API 39: Verify OTP for Password Reset

**Endpoint:** `POST http://localhost:8000/api/forgot-password/verify-otp`

**Authentication:** Not Required (Public endpoint)

**Request Body:**
```json
{
  "mobile": "8888888888",
  "otp": "123456"
}
```

**Request Parameters:**

| Parameter | Type | Required | Validation | Description |
|-----------|------|----------|------------|-------------|
| mobile | string | Yes | 10 digits | Mobile number |
| otp | string | Yes | 6 digits | OTP received via SMS |

**Success Response (200):**
```json
{
  "status": "success",
  "message": "verified"
}
```

**Error Responses:**

**Invalid OTP (400):**
```json
{
  "status": "failed",
  "message": "invalid_otp"
}
```

---

#### API 40: Reset Password with OTP

**Endpoint:** `POST http://localhost:8000/api/forgot-password/reset-password`

**Authentication:** Not Required (Public endpoint)

**Request Body:**
```json
{
  "mobile": "8888888888",
  "otp": "123456",
  "password": "newpassword123"
}
```

**Request Parameters:**

| Parameter | Type | Required | Validation | Description |
|-----------|------|----------|------------|-------------|
| mobile | string | Yes | 10 digits | Mobile number |
| otp | string | Yes | 6 digits | OTP received via SMS |
| password | string | Yes | 6-20 characters | New password |

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "user_id": 237947,
    "token": "15|bWfefsTpGfqW49qrxHLGCeZhWGRFNWpwEa9ZO9YX",
    "expire_date": 1640995200
  }
}
```

**Notes:**
- User is automatically logged in after successful password reset
- OTP is cleared from database after use
- Authentication token is valid for 30 days

---

### Login OTP Flow

#### API 41: Send OTP for Login

**Endpoint:** `POST http://localhost:8000/api/login-otp/send-otp`

**Authentication:** Not Required (Public endpoint)

**Request Body:**
```json
{
  "mobile": "8888888888"
}
```

**Request Parameters:**

| Parameter | Type | Required | Validation | Description |
|-----------|------|----------|------------|-------------|
| mobile | string | Yes | 10 digits | Registered mobile number |

**Success Response (200):**
```json
{
  "status": "success",
  "message": "otp_sent"
}
```

**Error Responses:**

**Invalid Mobile Number (404):**
```json
{
  "status": "failed",
  "message": "invalid_number"
}
```

---

#### API 42: Verify OTP and Login

**Endpoint:** `POST http://localhost:8000/api/login-otp/verify-login`

**Authentication:** Not Required (Public endpoint)

**Request Body:**
```json
{
  "mobile": "8888888888",
  "otp": "123456"
}
```

**Request Parameters:**

| Parameter | Type | Required | Validation | Description |
|-----------|------|----------|------------|-------------|
| mobile | string | Yes | 10 digits | Mobile number |
| otp | string | Yes | 6 digits | OTP received via SMS |

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "user_id": 237947,
    "token": "16|bWfefsTpGfqW49qrxHLGCeZhWGRFNWpwEa9ZO9YX",
    "expire_date": 1640995200
  }
}
```

**Error Responses:**

**Invalid OTP (400):**
```json
{
  "status": "failed",
  "message": "Invalid OTP"
}
```

---

## Laravel Backend Analysis

### Controllers

#### ForgotPasswordController.php

**Location:** `app/Http/Controllers/ForgotPasswordController.php`

**Methods:**

1. **sendOtp(Request $request)**
   - Validates mobile number (10 digits)
   - Checks if mobile exists in database
   - Generates random 6-digit OTP
   - Stores OTP in `user_forget_password_code` field
   - Sends SMS (placeholder implementation)
   - Returns success/failure

2. **verifyOtp(Request $request)**
   - Validates mobile and OTP
   - Checks if user exists with given mobile and OTP
   - Returns verification result
   - OTP remains valid for password reset

3. **resetPassword(Request $request)**
   - Validates mobile, OTP, and new password
   - Verifies OTP matches
   - Updates password using MD5 hash
   - Clears OTP from database
   - Updates last login time
   - Creates authentication token
   - Returns login data (auto-login)

**SMS Implementation:**
```php
private function sendOtpSms($mobile, $otp)
{
    // Placeholder implementation
    \Log::info("Password Reset OTP for {$mobile}: {$otp}");

    // TODO: Integrate with actual SMS service provider
    // Example: Twilio, AWS SNS, or local SMS gateway

    return true;
}
```

---

#### LoginOtpController.php

**Location:** `app/Http/Controllers/LoginOtpController.php`

**Methods:**

1. **sendOtp(Request $request)**
   - Validates mobile number
   - Checks if mobile exists
   - Generates random 6-digit OTP
   - Stores OTP in `user_forget_password_code` field
   - Sends SMS
   - Returns success/failure

2. **verifyOtpAndLogin(Request $request)**
   - Validates mobile and OTP
   - Verifies OTP matches
   - Updates last login time
   - Clears OTP from database
   - Creates authentication token
   - Returns login data

**Database Fields:**
- `user_mobile` - User's mobile number
- `user_forget_password_code` - Stores OTP (shared for both forgot password and login OTP)
- `user_password` - MD5 hashed password
- `user_last_login` - Unix timestamp

---

## Frontend Integration

### Component Structure

```
src/
├── app/
│   └── login/
│       └── page.tsx                  # Updated with mode switching
└── components/
    ├── LoginWithOTP.tsx              # New: OTP login component
    └── ForgotPassword.tsx            # New: Password reset component
```

### Files Created/Modified

**New Components:**
1. `src/components/LoginWithOTP.tsx` - OTP-based login
2. `src/components/ForgotPassword.tsx` - Password reset flow

**Modified Files:**
1. `src/app/login/page.tsx` - Updated to support multiple login modes

---

## Component Documentation

### LoginWithOTP Component

**Location:** `src/components/LoginWithOTP.tsx`

**Props:**
```typescript
interface LoginWithOTPProps {
  onBack: () => void; // Callback to return to main login
}
```

**Features:**

**Step 1: Mobile Number Entry**
- Input field for 10-digit mobile number
- Real-time validation
- Auto-format (numbers only)
- Send OTP button

**Step 2: OTP Verification**
- 6-digit OTP input
- Mobile number display with change option
- Resend OTP functionality
- Verify and login button

**State Management:**
```typescript
const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
const [mobile, setMobile] = useState('');
const [otp, setOtp] = useState('');
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [success, setSuccess] = useState<string | null>(null);
```

**User Flow:**
1. Enter registered mobile number
2. Click "Send OTP"
3. Receive OTP via SMS
4. Enter 6-digit OTP
5. Click "Verify & Login"
6. Automatically redirected to dashboard

---

### ForgotPassword Component

**Location:** `src/components/ForgotPassword.tsx`

**Props:**
```typescript
interface ForgotPasswordProps {
  onBack: () => void; // Callback to return to main login
}
```

**Features:**

**Step 1: Mobile Number Entry**
- Input field for 10-digit mobile number
- Validation
- Send OTP button

**Step 2: Verify OTP (Optional)**
- 6-digit OTP input
- Option to skip verification
- Verify OTP button
- Resend OTP option

**Step 3: Reset Password**
- OTP input field
- New password input with visibility toggle
- Confirm password input with visibility toggle
- Password validation (6-20 characters, matching)
- Reset password button

**State Management:**
```typescript
const [step, setStep] = useState<'mobile' | 'verify' | 'reset'>('mobile');
const [mobile, setMobile] = useState('');
const [otp, setOtp] = useState('');
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
```

**User Flow:**
1. Enter registered mobile number
2. Receive OTP via SMS
3. (Optional) Verify OTP
4. Enter OTP and new password
5. Confirm password
6. Reset password
7. Automatically logged in and redirected to dashboard

**Progress Indicator:**
- Visual progress bar showing current step
- Labels: Mobile → Verify OTP → New Password

---

### Login Page Updates

**Location:** `src/app/login/page.tsx`

**New Features:**

1. **Mode Switching:**
   ```typescript
   type LoginMode = 'password' | 'otp' | 'forgot-password';
   const [mode, setMode] = useState<LoginMode>('password');
   ```

2. **Password Login (Default):**
   - Traditional email/mobile + password login
   - "Forgot Password?" link
   - "Login with OTP" button

3. **OTP Login Mode:**
   - Renders `LoginWithOTP` component
   - Back button to return to password login

4. **Forgot Password Mode:**
   - Renders `ForgotPassword` component
   - Back button to return to password login

**UI Elements:**
- Forgot Password link (top right of form)
- "Login with OTP" button (below password login)
- Divider with "OR" text
- Clear mode separation

---

## User Flows

### Forgot Password Flow

```
┌─────────────────────┐
│   Click "Forgot     │
│   Password?"        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Step 1: Enter       │
│ Mobile Number       │
└──────────┬──────────┘
           │ Send OTP
           ▼
┌─────────────────────┐
│ Step 2: Verify OTP  │
│ (Optional)          │
└──────────┬──────────┘
           │ Verify / Skip
           ▼
┌─────────────────────┐
│ Step 3: Enter OTP   │
│ & New Password      │
└──────────┬──────────┘
           │ Reset Password
           ▼
┌─────────────────────┐
│ Auto Login          │
│ → Dashboard         │
└─────────────────────┘
```

### Login with OTP Flow

```
┌─────────────────────┐
│   Click "Login      │
│   with OTP"         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Enter Mobile Number │
└──────────┬──────────┘
           │ Send OTP
           ▼
┌─────────────────────┐
│ Enter 6-digit OTP   │
└──────────┬──────────┘
           │ Verify & Login
           ▼
┌─────────────────────┐
│ Auto Login          │
│ → Dashboard         │
└─────────────────────┘
```

---

## Security Considerations

### OTP Generation
- Random 6-digit numeric code
- Stored in `user_forget_password_code` field
- Cleared after successful use
- No expiration time (current implementation)

### Password Requirements
- Length: 6-20 characters
- Hashed using MD5 (legacy compatibility)
- Must match confirmation

### Security Best Practices

1. **OTP Security:**
   - Random generation using `rand(100000, 999999)`
   - Single-use (cleared after use)
   - Should implement expiration time (recommended)

2. **SMS Security:**
   - Placeholder implementation in development
   - Production should use trusted SMS gateway
   - Log OTPs in development for testing

3. **Password Security:**
   - MD5 hashing (legacy system)
   - Should migrate to bcrypt/Argon2 in future
   - Password strength validation on frontend

4. **Rate Limiting:**
   - Should implement rate limiting for OTP requests
   - Prevent abuse and spam
   - Recommended: Max 3 OTP requests per mobile per hour

5. **Mobile Verification:**
   - Only registered mobile numbers can receive OTP
   - Invalid numbers rejected immediately

---

## Testing Guide

### Manual Testing

#### Test Case 1: Forgot Password - Success Flow

1. Navigate to Login page
2. Click "Forgot Password?"
3. Enter registered mobile: `8888888888`
4. Click "Send OTP"
5. Check Laravel logs for OTP: `tail -f storage/logs/laravel.log`
6. Enter OTP
7. (Optional) Click "Verify OTP"
8. Enter new password: `newpass123`
9. Confirm password: `newpass123`
10. Click "Reset Password"
11. Verify redirect to dashboard
12. Log out and login with new password

#### Test Case 2: Login with OTP - Success Flow

1. Navigate to Login page
2. Click "Login with OTP"
3. Enter registered mobile: `8888888888`
4. Click "Send OTP"
5. Check Laravel logs for OTP
6. Enter 6-digit OTP
7. Click "Verify & Login"
8. Verify redirect to dashboard

#### Test Case 3: Invalid Mobile Number

1. Enter unregistered mobile: `9999999999`
2. Click "Send OTP"
3. Verify error: "Mobile number not registered"

#### Test Case 4: Invalid OTP

1. Complete mobile entry step
2. Enter incorrect OTP: `000000`
3. Click verify
4. Verify error: "Invalid OTP"

#### Test Case 5: Password Mismatch

1. Complete forgot password flow to reset step
2. Enter password: `newpass123`
3. Enter confirm: `differentpass`
4. Click reset
5. Verify error: "Passwords do not match"

### API Testing with cURL

**Send Forgot Password OTP:**
```bash
curl -X POST "http://localhost:8000/api/forgot-password/send-otp" \
  -H "Content-Type: application/json" \
  -d '{"mobile": "8888888888"}'
```

**Verify Forgot Password OTP:**
```bash
curl -X POST "http://localhost:8000/api/forgot-password/verify-otp" \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "8888888888",
    "otp": "123456"
  }'
```

**Reset Password:**
```bash
curl -X POST "http://localhost:8000/api/forgot-password/reset-password" \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "8888888888",
    "otp": "123456",
    "password": "newpassword123"
  }'
```

**Send Login OTP:**
```bash
curl -X POST "http://localhost:8000/api/login-otp/send-otp" \
  -H "Content-Type: application/json" \
  -d '{"mobile": "8888888888"}'
```

**Verify Login OTP:**
```bash
curl -X POST "http://localhost:8000/api/login-otp/verify-login" \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "8888888888",
    "otp": "123456"
  }'
```

---

## Troubleshooting

### Common Issues

**Issue 1: OTP Not Received**

**Cause:** SMS service not configured

**Solution:**
- In development: Check Laravel logs for OTP
- In production: Configure SMS gateway
- Command: `tail -f storage/logs/laravel.log | grep OTP`

**Issue 2: "Invalid Mobile Number" Error**

**Cause:** Mobile number not registered

**Solution:**
- Verify mobile number is registered in database
- Use correct test credentials
- Check `user_mobile` field in database

**Issue 3: "Invalid OTP" Error**

**Cause:** OTP mismatch or expired

**Solution:**
- Check OTP in Laravel logs
- Request new OTP
- Ensure OTP hasn't been used already

**Issue 4: Password Reset Not Working**

**Cause:** Various validation issues

**Solution:**
- Check password length (6-20 characters)
- Ensure passwords match
- Verify OTP is correct
- Check for JavaScript errors in console

**Issue 5: Auto-Login Not Working**

**Cause:** Token storage issue

**Solution:**
- Check browser console for errors
- Verify AuthContext is properly set up
- Check token is being stored in localStorage
- Verify API response contains token

---

## Future Enhancements

### Recommended Improvements

1. **OTP Expiration:**
   - Add expiration time (e.g., 5 minutes)
   - Store OTP generation time in database
   - Validate expiration on verification

2. **Rate Limiting:**
   - Implement request throttling
   - Max 3 OTP requests per mobile per hour
   - Block suspicious activity

3. **SMS Service Integration:**
   - Integrate with Twilio, AWS SNS, or local SMS gateway
   - Production-ready SMS delivery
   - Delivery status tracking

4. **OTP Attempts Limit:**
   - Max 3 wrong OTP attempts
   - Lock account temporarily after limit
   - Send alert to user

5. **Enhanced Security:**
   - Migrate from MD5 to bcrypt/Argon2
   - Add CAPTCHA for OTP requests
   - Implement device fingerprinting

6. **User Experience:**
   - Auto-focus OTP input after sending
   - Auto-submit when 6 digits entered
   - Better error messages
   - Loading indicators

7. **Analytics:**
   - Track OTP success/failure rates
   - Monitor SMS delivery
   - User behavior analytics

8. **Multi-Channel OTP:**
   - Email OTP as alternative
   - WhatsApp OTP
   - Voice call OTP

---

## Integration Checklist

- [x] Analyze API documentation (API 38-42)
- [x] Review Laravel controllers
- [x] Create LoginWithOTP component
- [x] Create ForgotPassword component
- [x] Update login page with mode switching
- [x] Add forgot password link
- [x] Add login with OTP button
- [x] Implement error handling
- [x] Create comprehensive documentation
- [x] Test all user flows
- [ ] Configure SMS service for production
- [ ] Implement OTP expiration
- [ ] Add rate limiting
- [ ] Production testing with real users

---

## Code Examples

### Using the Components

```typescript
import LoginWithOTP from '@/components/LoginWithOTP';
import ForgotPassword from '@/components/ForgotPassword';

// Login with OTP
<LoginWithOTP onBack={() => setMode('password')} />

// Forgot Password
<ForgotPassword onBack={() => setMode('password')} />
```

### API Call Examples

```typescript
// Send Forgot Password OTP
const sendForgotPasswordOTP = async (mobile: string) => {
  const response = await fetch('http://localhost:8000/api/forgot-password/send-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ mobile }),
  });
  return await response.json();
};

// Reset Password
const resetPassword = async (mobile: string, otp: string, password: string) => {
  const response = await fetch('http://localhost:8000/api/forgot-password/reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ mobile, otp, password }),
  });
  return await response.json();
};

// Send Login OTP
const sendLoginOTP = async (mobile: string) => {
  const response = await fetch('http://localhost:8000/api/login-otp/send-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ mobile }),
  });
  return await response.json();
};

// Verify Login OTP
const verifyLoginOTP = async (mobile: string, otp: string) => {
  const response = await fetch('http://localhost:8000/api/login-otp/verify-login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ mobile, otp }),
  });
  return await response.json();
};
```

---

## Contact & Support

For questions or issues related to this integration:

1. Check this documentation first
2. Review Laravel API documentation in `user-website-api-documentation-part2.md`
3. Test API endpoints using cURL or Postman
4. Check browser console for frontend errors
5. Review Laravel logs for backend errors: `tail -f storage/logs/laravel.log`

---

**Document Version:** 1.0
**Last Updated:** 2025-10-03
**Maintained By:** Development Team
**Status:** Production Ready (SMS service needs configuration)
