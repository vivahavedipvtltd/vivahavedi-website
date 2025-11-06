# Password Change API Integration Documentation

## Overview

This document provides comprehensive documentation for the Password Change APIs (API 43 & 44) integration in the Vivahavedi Matrimonial Website. These APIs allow authenticated users to change their account password and validate their current password.

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
5. [Security Considerations](#security-considerations)
6. [Testing Guide](#testing-guide)
7. [Troubleshooting](#troubleshooting)
8. [Future Enhancements](#future-enhancements)

---

## API Specifications

### API 43: Change Password

**Endpoint:** `POST http://localhost:8000/api/change-password`

**Authentication:** Required (Bearer Token)

**Request Headers:**
```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer {your-token}
```

**Request Body:**
```json
{
  "old_password": "currentpass123",
  "new_password": "newpassword456"
}
```

**Request Parameters:**

| Parameter | Type | Required | Validation | Description |
|-----------|------|----------|------------|-------------|
| old_password | string | Yes | 6-20 characters | Current password |
| new_password | string | Yes | 6-20 characters, must be different from old | New password |

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Password Changed"
}
```

**Error Responses:**

**Wrong Old Password (400):**
```json
{
  "status": "failed",
  "message": "Password Not Changed"
}
```

**Validation Error (422):**
```json
{
  "status": "failed",
  "message": "The given data was invalid.",
  "errors": {
    "old_password": ["The old password must be at least 6 characters."],
    "new_password": [
      "The new password must be at least 6 characters.",
      "The new password and old password must be different."
    ]
  }
}
```

**Unauthenticated (401):**
```json
{
  "message": "Unauthenticated"
}
```

---

### API 44: Validate Current Password

**Endpoint:** `POST http://localhost:8000/api/validate-password`

**Authentication:** Required (Bearer Token)

**Request Headers:**
```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer {your-token}
```

**Request Body:**
```json
{
  "password": "currentpass123"
}
```

**Request Parameters:**

| Parameter | Type | Required | Validation | Description |
|-----------|------|----------|------------|-------------|
| password | string | Yes | 6-20 characters | Password to validate |

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Password is valid"
}
```

**Error Responses:**

**Invalid Password (400):**
```json
{
  "status": "failed",
  "message": "Invalid password"
}
```

**Validation Error (422):**
```json
{
  "status": "failed",
  "message": "The given data was invalid.",
  "errors": {
    "password": ["The password must be at least 6 characters."]
  }
}
```

---

## Laravel Backend Analysis

### Controller: PasswordChangeController.php

**Location:** `app/Http/Controllers/PasswordChangeController.php`

**Key Features:**

1. **Password Hashing:** Uses MD5 hashing to maintain compatibility with existing system
2. **Atomic Updates:** Uses raw SQL query with WHERE clause to ensure old password verification
3. **Error Handling:** Comprehensive try-catch blocks with detailed error messages
4. **Validation:** Laravel's built-in validator for input validation

**Method 1: changePassword()**

```php
public function changePassword(Request $request)
{
    // Validates old_password and new_password
    // Hashes passwords using MD5
    // Updates password only if user_id AND old password match
    // Returns success/failure based on affected rows
}
```

**Method 2: validateCurrentPassword()**

```php
public function validateCurrentPassword(Request $request)
{
    // Validates password input
    // Hashes password using MD5
    // Checks if user exists with given password
    // Returns validation result
}
```

### Database Schema

**Table:** `user_details`

**Relevant Fields:**
- `user_id` (Primary Key)
- `user_password` (MD5 hashed password)

**Security Notes:**
- System uses MD5 hashing (legacy compatibility)
- Password field stores MD5 hash (32 characters)
- Atomic UPDATE ensures password and user_id match

---

## Frontend Integration

### Component Structure

```
src/
├── app/
│   └── dashboard/
│       └── page.tsx              # Updated to include PasswordChangeSettings
└── components/
    └── PasswordChangeSettings.tsx # New password change component
```

### Dashboard Integration

The Password Change functionality is integrated into the dashboard under the **Account Settings** section.

**Navigation Path:**
1. User logs in
2. Goes to Dashboard
3. Clicks "Account Settings" in sidebar
4. Sees Password Change form

**Dashboard Menu Item:**
```typescript
{
  title: 'Settings',
  icon: <Settings className="h-6 w-6" />,
  items: [
    { id: 'account-settings', label: 'Account Settings', icon: <Settings className="h-5 w-5" /> },
  ]
}
```

---

## Component Documentation

### PasswordChangeSettings.tsx

**Location:** `src/components/PasswordChangeSettings.tsx`

**Props:**

```typescript
interface PasswordChangeSettingsProps {
  onPasswordChanged?: () => void; // Optional callback after successful password change
}
```

**Features:**

1. **Form Fields:**
   - Current Password (with show/hide toggle)
   - New Password (with show/hide toggle)
   - Confirm Password (with show/hide toggle)

2. **Validation:**
   - Client-side validation before submission
   - Required field checks
   - Length validation (6-20 characters)
   - Password match validation
   - Old vs New password difference check

3. **Error Handling:**
   - Field-level validation errors
   - API error messages
   - Network error handling

4. **User Experience:**
   - Loading states during API calls
   - Success message on password change
   - Clear button to reset form
   - Password visibility toggles
   - Security tips section

5. **Styling:**
   - Tailwind CSS for responsive design
   - Lucide React icons
   - Color-coded success/error messages
   - Accessible form inputs

**State Management:**

```typescript
const [loading, setLoading] = useState(false);
const [showOldPassword, setShowOldPassword] = useState(false);
const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [formData, setFormData] = useState({
  old_password: '',
  new_password: '',
  confirm_password: '',
});
const [error, setError] = useState<string | null>(null);
const [success, setSuccess] = useState<string | null>(null);
const [validationErrors, setValidationErrors] = useState({});
```

**API Call Implementation:**

```typescript
const response = await fetch('http://localhost:8000/api/change-password', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    old_password: formData.old_password,
    new_password: formData.new_password,
  }),
});
```

**Validation Logic:**

```typescript
const validateForm = (): boolean => {
  // Validates:
  // - Old password presence and length
  // - New password presence and length
  // - New password different from old
  // - Passwords match
  return isValid;
};
```

---

## Security Considerations

### Password Requirements

1. **Length:** 6-20 characters
2. **Uniqueness:** Must be different from current password
3. **Matching:** New password and confirmation must match

### Security Best Practices

1. **Password Visibility Toggle:**
   - Users can toggle password visibility for convenience
   - Passwords hidden by default

2. **HTTPS Required:**
   - Always use HTTPS in production
   - Bearer token transmitted securely

3. **Token Authentication:**
   - All requests require valid Bearer token
   - Token obtained during login

4. **Client-side Validation:**
   - Reduces unnecessary API calls
   - Provides immediate feedback

5. **Server-side Validation:**
   - Final validation on server
   - Prevents bypassing client validation

6. **Password Hashing:**
   - Passwords never stored in plain text
   - MD5 hashing (legacy compatibility)

### Security Tips Displayed to Users

- Use a mix of letters, numbers, and special characters
- Avoid using personal information like birthdate or name
- Don't reuse passwords from other websites
- Change your password regularly for better security
- Never share your password with anyone

---

## Testing Guide

### Manual Testing

**Test Case 1: Successful Password Change**

1. Navigate to Dashboard > Account Settings
2. Enter correct current password
3. Enter new password (different from current)
4. Confirm new password
5. Click "Change Password"
6. Verify success message appears
7. Log out and log in with new password

**Test Case 2: Wrong Current Password**

1. Enter incorrect current password
2. Enter new password
3. Confirm new password
4. Click "Change Password"
5. Verify error: "Current password is incorrect"

**Test Case 3: Password Too Short**

1. Enter valid current password
2. Enter new password with < 6 characters
3. Verify validation error before submission

**Test Case 4: Passwords Don't Match**

1. Enter valid current password
2. Enter new password
3. Enter different confirmation password
4. Verify error: "The passwords do not match"

**Test Case 5: Same as Current Password**

1. Enter current password
2. Enter same password as new password
3. Verify error: "The new password must be different from old password"

### API Testing with cURL

**Change Password:**

```bash
# First, get authentication token
curl -X POST "http://localhost:8000/api/login" \
  -H "Content-Type: application/json" \
  -d '{"login":"your-mobile","password":"your-password"}'

# Then, change password
curl -X POST "http://localhost:8000/api/change-password" \
  -H "Authorization: Bearer {your-token}" \
  -H "Content-Type: application/json" \
  -d '{
    "old_password": "currentpass123",
    "new_password": "newpassword456"
  }'
```

**Validate Password:**

```bash
curl -X POST "http://localhost:8000/api/validate-password" \
  -H "Authorization: Bearer {your-token}" \
  -H "Content-Type: application/json" \
  -d '{"password": "currentpass123"}'
```

---

## Troubleshooting

### Common Issues

**Issue 1: "Unauthenticated" Error**

**Cause:** Bearer token missing or invalid

**Solution:**
- Ensure user is logged in
- Check token is being passed in Authorization header
- Verify token hasn't expired

**Issue 2: "Password Not Changed" Error**

**Cause:** Current password is incorrect

**Solution:**
- User should verify their current password
- Check for typos
- Ensure password hasn't been recently changed

**Issue 3: "The given data was invalid" Error**

**Cause:** Validation failed

**Solution:**
- Check password length (6-20 characters)
- Ensure new password is different from old
- Verify all required fields are filled

**Issue 4: Network Error**

**Cause:** API not reachable

**Solution:**
- Verify Laravel server is running on port 8000
- Check CORS configuration
- Ensure no firewall blocking requests

---

## Future Enhancements

### Recommended Improvements

1. **Password Strength Meter:**
   - Visual indicator of password strength
   - Real-time feedback as user types

2. **Password History:**
   - Prevent reuse of last N passwords
   - Database table to track password history

3. **Two-Factor Authentication:**
   - OTP verification before password change
   - Additional security layer

4. **Password Expiry:**
   - Force password change after X days
   - Notify users before expiry

5. **Password Recovery via Email:**
   - Alternative to mobile OTP
   - Email-based password reset

6. **Activity Log:**
   - Track password change attempts
   - Notify user of password changes

7. **Modern Hashing:**
   - Migrate from MD5 to bcrypt/Argon2
   - Better security for new passwords

8. **Rate Limiting:**
   - Prevent brute force attempts
   - Limit password change frequency

---

## Integration Checklist

- [x] Analyze API documentation (API 43, 44)
- [x] Review Laravel controller implementation
- [x] Create PasswordChangeSettings component
- [x] Add password visibility toggles
- [x] Implement client-side validation
- [x] Handle API errors gracefully
- [x] Integrate into dashboard settings
- [x] Add success/error messaging
- [x] Include security tips
- [x] Create comprehensive documentation
- [x] Test password change flow
- [ ] Production testing with real users
- [ ] Monitor for security issues

---

## Code Examples

### Using the Component

```typescript
import PasswordChangeSettings from '@/components/PasswordChangeSettings';

// Basic usage
<PasswordChangeSettings />

// With callback
<PasswordChangeSettings
  onPasswordChanged={() => {
    console.log('Password successfully changed');
    // Perform additional actions
  }}
/>
```

### API Integration Example

```typescript
// Change password
const changePassword = async (oldPassword: string, newPassword: string) => {
  const response = await fetch('http://localhost:8000/api/change-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      old_password: oldPassword,
      new_password: newPassword,
    }),
  });

  const result = await response.json();
  return result;
};

// Validate password
const validatePassword = async (password: string) => {
  const response = await fetch('http://localhost:8000/api/validate-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ password }),
  });

  const result = await response.json();
  return result;
};
```

---

## Contact & Support

For questions or issues related to this integration:

1. Check this documentation first
2. Review Laravel API documentation in `user-website-api-documentation-part2.md`
3. Test API endpoints using cURL or Postman
4. Check browser console for frontend errors
5. Review Laravel logs for backend errors

---

**Document Version:** 1.0
**Last Updated:** 2025-10-03
**Maintained By:** Development Team
**Status:** Production Ready
