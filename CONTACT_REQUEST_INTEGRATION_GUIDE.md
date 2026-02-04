# Contact Request Feature - Frontend Integration Guide

## Overview

This guide explains how to integrate the contact request feature into profile viewing components.

## Integration Points

### 1. Profile View Contact Button

When a user tries to view contact details, the system should:
1. Check if the profile owner has contact lock enabled
2. If locked and no accepted request exists, show "Send Request" button
3. If request is pending, show "Request Pending" status
4. If request is accepted, show contact details

### Example Implementation

```typescript
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { viewContactDetails, sendContactRequest } from '@/lib/contactRequestApi';
import { Phone, Mail, MapPin, Loader2, ShieldCheck } from 'lucide-react';

interface ContactViewButtonProps {
  profileId: number;
}

const ContactViewButton = ({ profileId }: ContactViewButtonProps) => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [contactDetails, setContactDetails] = useState<any>(null);
  const [requestStatus, setRequestStatus] = useState<'none' | 'pending' | 'locked' | 'accepted'>('none');
  const [message, setMessage] = useState('');

  const handleViewContact = async () => {
    if (!token || isLoading) return;

    setIsLoading(true);
    setMessage('');

    try {
      const response = await viewContactDetails(token, profileId);

      if (response.status === 'success') {
        // Contact details retrieved successfully
        setContactDetails(response.data);
        setRequestStatus('accepted');
        setMessage('Contact details retrieved successfully');
      } else if (response.error_code === 'contact_locked') {
        // Contact is locked, need to send request
        setRequestStatus('locked');
        setMessage('This user has locked their contact details. You can send a request to view their contact information.');
      } else if (response.error_code === 'request_pending') {
        // Request is already pending
        setRequestStatus('pending');
        setMessage('Your contact request is pending approval.');
      } else {
        // Other errors
        setMessage(response.message || 'Failed to view contact details');
      }
    } catch (error) {
      console.error('Error viewing contact:', error);
      setMessage('An error occurred while viewing contact details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendRequest = async () => {
    if (!token || isLoading) return;

    if (!confirm('Do you want to send a contact request to this user?')) return;

    setIsLoading(true);
    setMessage('');

    try {
      const response = await sendContactRequest(token, profileId);

      if (response.status === 'success') {
        setRequestStatus('pending');
        setMessage('Contact request sent successfully! You will be notified when the user responds.');
      } else {
        setMessage(response.message || 'Failed to send contact request');
      }
    } catch (error) {
      console.error('Error sending request:', error);
      setMessage('An error occurred while sending contact request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>

      {/* Display contact details if available */}
      {contactDetails && requestStatus === 'accepted' && (
        <div className="space-y-3 mb-4">
          {contactDetails.mobile && (
            <div className="flex items-center space-x-3 text-gray-700">
              <Phone className="h-5 w-5 text-green-500" />
              <span className="font-medium">{contactDetails.mobile}</span>
            </div>
          )}
          {contactDetails.phone && (
            <div className="flex items-center space-x-3 text-gray-700">
              <Mail className="h-5 w-5 text-blue-500" />
              <span className="font-medium">{contactDetails.phone}</span>
            </div>
          )}
          {contactDetails.address && (
            <div className="flex items-center space-x-3 text-gray-700">
              <MapPin className="h-5 w-5 text-red-500" />
              <span className="font-medium">{contactDetails.address}</span>
            </div>
          )}
        </div>
      )}

      {/* Action buttons based on status */}
      {requestStatus === 'none' && (
        <button
          onClick={handleViewContact}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Phone className="h-5 w-5" />
              <span>View Contact Details</span>
            </>
          )}
        </button>
      )}

      {requestStatus === 'locked' && (
        <button
          onClick={handleSendRequest}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <ShieldCheck className="h-5 w-5" />
              <span>Send Contact Request</span>
            </>
          )}
        </button>
      )}

      {requestStatus === 'pending' && (
        <div className="flex items-center justify-center space-x-2 px-6 py-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="font-medium">Request Pending Approval</span>
        </div>
      )}

      {/* Message display */}
      {message && (
        <div className={`mt-4 p-4 rounded-lg ${
          requestStatus === 'accepted'
            ? 'bg-green-50 border border-green-200 text-green-800'
            : requestStatus === 'locked' || requestStatus === 'pending'
            ? 'bg-blue-50 border border-blue-200 text-blue-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <p className="text-sm">{message}</p>
        </div>
      )}

      {/* Information box */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
        <p className="font-medium mb-2">ℹ️ How it works:</p>
        <ul className="list-disc ml-5 space-y-1">
          <li>If contact is unlocked, you can view directly</li>
          <li>If contact is locked, send a request first</li>
          <li>User will review and accept/reject your request</li>
          <li>Your contact view count decreases only if request is accepted</li>
        </ul>
      </div>
    </div>
  );
};

export default ContactViewButton;
```

### 2. Usage in Profile Page

```typescript
// In your profile page component (e.g., /app/profile/[id]/page.tsx)

import ContactViewButton from '@/components/ContactViewButton';

export default function ProfilePage({ params }: { params: { id: string } }) {
  const profileId = parseInt(params.id);

  return (
    <div className="container mx-auto py-8">
      {/* ... other profile content ... */}

      <div className="mt-8">
        <ContactViewButton profileId={profileId} />
      </div>

      {/* ... more profile content ... */}
    </div>
  );
}
```

### 3. Dashboard Integration

The contact requests appear in the dashboard automatically:

**Navigate to:** `/dashboard?section=contacted`

The `CommunicationViewsSection` component now handles contact requests:
- **"Contacted Me" tab:** Shows received contact requests (pending)
- **"Contacted by Me" tab:** Shows sent contact requests with status

### 4. Notification Badges

Update the dashboard sidebar to show notification badges:

```typescript
// In DashboardSidebar.tsx

import { useCommunicationStats } from '@/hooks/useDashboardData';

const DashboardSidebar = () => {
  const { token } = useAuth();
  const { data: stats } = useCommunicationStats(token);

  const totalContactNotifications =
    (stats?.contact_requests_received || 0) +
    (stats?.contact_responses_received || 0);

  return (
    <aside className="sidebar">
      {/* ... other menu items ... */}

      <Link
        href="/dashboard?section=contacted"
        className="sidebar-link relative"
      >
        Contacted
        {totalContactNotifications > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {totalContactNotifications}
          </span>
        )}
      </Link>

      {/* ... more menu items ... */}
    </aside>
  );
};
```

## API Functions Available

### From `contactRequestApi.ts`:

1. **`lockUnlockContactView(token, lock)`** - Toggle contact lock on/off
2. **`sendContactRequest(token, matchId)`** - Send contact request
3. **`cancelContactRequest(token, requestId)`** - Cancel pending request
4. **`respondToContactRequest(token, requestId, action)`** - Accept/reject request
5. **`viewContactDetails(token, matchId)`** - View contact details (handles locked status)

### From `useDashboardData.ts` (SWR Hooks):

1. **`useSentContactRequests(token, page)`** - Get sent requests with pagination
2. **`useReceivedContactRequests(token, page)`** - Get received requests with pagination
3. **`useCommunicationStats(token)`** - Get notification counts

## Components Available

1. **`ContactRequestCard`** - Displays a contact request with accept/reject/cancel buttons
2. **`PrivacySettings`** - Updated with contact lock toggle
3. **`CommunicationViewsSection`** - Updated to handle contact requests

## Flow Diagram

```
User A (Contact Locked) ←→ User B

1. User B views User A's profile
2. Clicks "View Contact Details"
3. System checks: Contact Locked? → Yes
4. Button changes to "Send Contact Request"
5. User B clicks "Send Request"
6. Request stored in database (pending)
7. User A sees notification badge in dashboard
8. User A navigates to "Contacted Me" tab
9. User A sees User B's request with Accept/Reject buttons
10. User A clicks "Accept"
11. User B's contact count decreases
12. User B sees notification badge
13. User B navigates to "Contacted by Me" tab
14. User B sees "ACCEPTED" status with contact details displayed
```

## Testing Checklist

- [ ] Enable contact lock in Privacy Settings
- [ ] Another user tries to view contact (should show request option)
- [ ] Send contact request
- [ ] Check "Contacted Me" section shows request
- [ ] Accept the request
- [ ] Check contact count decreased
- [ ] Check "Contacted by Me" section shows accepted status with contact details
- [ ] Try cancelling a pending request
- [ ] Try rejecting a request
- [ ] Check notification badges update correctly

## Best Practices

1. **Always check token existence** before API calls
2. **Use loading states** to prevent double-clicks
3. **Show clear messages** about request status
4. **Use confirmation dialogs** for irreversible actions (reject, cancel)
5. **Call `mutate()`** after actions to refresh SWR cache
6. **Handle all error codes** from API responses
7. **Show user-friendly messages** for all states

## Error Handling

Common error codes from API:

- `contact_locked` - Contact is locked, send request
- `request_pending` - Request already sent
- `same_gender` - Cannot request same gender
- `already_send` - Duplicate request
- `already_accepted` - Request was already accepted
- `plan_expired` - User's plan expired
- `no_contact_views` - No contact views remaining

## Next Steps

1. Integrate `ContactViewButton` into profile pages
2. Add notification badges to dashboard sidebar
3. Test the complete flow
4. Monitor user feedback
5. Add analytics tracking for feature usage

---

**Last Updated:** February 4, 2026
**Version:** 1.0
