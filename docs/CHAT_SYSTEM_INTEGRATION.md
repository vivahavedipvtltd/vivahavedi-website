# Chat System Integration Documentation

## Overview
This document describes the complete integration of the Chat System (API 27) into the matrimonial website. The chat feature enables real-time messaging between users with message history, unseen tracking, plan validation, and auto-polling for new messages.

---

## Table of Contents
1. [API Endpoints](#api-endpoints)
2. [Backend Architecture](#backend-architecture)
3. [Frontend Implementation](#frontend-implementation)
4. [Features](#features)
5. [Database Schema](#database-schema)
6. [Usage Guide](#usage-guide)
7. [Future Enhancements](#future-enhancements)

---

## API Endpoints

### 27.1 Send Message
- **Endpoint**: `POST /api/chat/send-message`
- **Authentication**: Required (Bearer Token)
- **Request Body**:
```json
{
  "match_id": 237915,
  "message": "Hello, how are you?"
}
```
- **Response**:
  - Existing chat: `{ "status": "success", "message": "exist_chat" }`
  - New chat: `{ "status": "success", "message": "new_chat" }` (deducts 1 chat credit)
  - Invalid plan: `{ "status": "failed", "message": "invalid_plan" }`

**Business Logic**:
- First message to a new user deducts 1 chat credit from plan
- Subsequent messages in existing chat are free
- Validates plan before allowing new chat creation
- Sends push notification to recipient

### 27.2 Load Initial Chat
- **Endpoint**: `POST /api/chat/load-initial`
- **Authentication**: Required (Bearer Token)
- **Request Body**:
```json
{
  "match_id": 237915
}
```
- **Response**:
```json
{
  "status": "success",
  "data": [
    {
      "plan_chat_id": 1,
      "user_from": 237947,
      "user_to": 237915,
      "chat_content": "Hello, how are you?",
      "chat_seen": 1,
      "chat_date": 1735200000
    }
  ]
}
```

**Features**:
- Returns last 20 messages
- Messages ordered chronologically (oldest first)
- Does not mark messages as seen

### 27.3 Load New Messages
- **Endpoint**: `POST /api/chat/load-new`
- **Authentication**: Required (Bearer Token)
- **Request Body**:
```json
{
  "match_id": 237915
}
```
- **Response**: Array of new unseen messages

**Features**:
- Returns only unseen messages sent to current user
- Automatically marks messages as seen
- Used for polling new messages

### 27.4 Load Old Messages
- **Endpoint**: `POST /api/chat/load-old`
- **Authentication**: Required (Bearer Token)
- **Request Body**:
```json
{
  "match_id": 237915,
  "last_chat_id": 10
}
```
- **Response**: Array of 20 messages before specified chat ID

**Features**:
- Pagination support for message history
- Loads 20 messages before the specified chat ID
- Marks unseen messages as seen
- Used for "load more" functionality

### 27.5 Get Chat List
- **Endpoint**: `GET /api/chat/list?page=1`
- **Authentication**: Required (Bearer Token)
- **Response**:
```json
{
  "status": "success",
  "data": [
    {
      "id": 237915,
      "name": "Aneesha",
      "photo": "http://localhost:8000/images/user_images/thumb1/237915.jpg",
      "count": 3
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 1,
    "total_count": 2,
    "per_page": 15
  }
}
```

**Features**:
- Lists all users with active chats
- Shows unseen message count per user
- Respects photo privacy settings
- Paginated results (15 per page)

### 27.6 Mark Messages as Seen
- **Endpoint**: `POST /api/chat/mark-seen`
- **Authentication**: Required (Bearer Token)
- **Request Body**:
```json
{
  "match_id": 237915
}
```
- **Response**:
```json
{
  "status": "success",
  "message": "messages_marked_seen",
  "updated_count": 5
}
```

**Features**:
- Marks all unseen messages from specific user as seen
- Returns count of updated messages
- Used when opening chat conversation

---

## Backend Architecture

### Controller
**File**: `C:\wamp64\www\vivahavedi\vivahavedi-laravel-api\app\Http\Controllers\ChatController.php`

**Key Methods**:
1. `sendMessage()` - Send chat message with plan validation
2. `loadInitialChat()` - Load last 20 messages
3. `loadNewChat()` - Load unseen messages and mark as seen
4. `loadOldChat()` - Pagination for older messages
5. `getChatList()` - Get list of chat conversations
6. `markMessagesAsSeen()` - Manually mark messages as seen
7. `sendChatNotification()` - Send FCM push notification

**Plan Validation Logic**:
```php
// Check if chat exists
$existing_chat = Chat::betweenUsers($user_id, $match_id)->first();

if (!$existing_chat) {
    // New chat - check plan
    $plan_details = PlanTaken::where('user_id', $user_id)->first();

    if (!$plan_details || $plan_details->pt_chat < 1) {
        return response()->json([
            'status' => 'failed',
            'message' => 'invalid_plan'
        ], 400);
    }

    // Deduct chat credit
    $plan_details->update(['pt_chat' => $plan_details->pt_chat - 1]);
}
```

### Model
**File**: `C:\wamp64\www\vivahavedi\vivahavedi-laravel-api\app\Models\Chat.php`

**Table**: `plan_chat`

**Fields**:
- `plan_chat_id` (Primary Key)
- `user_from` - Sender user ID
- `user_to` - Receiver user ID
- `chat_content` - Message content (max 1000 chars)
- `chat_seen` - 0 = unseen, 1 = seen
- `chat_date` - Unix timestamp

**Scopes**:
```php
// Get messages between two users
Chat::betweenUsers($user1, $user2)->get();

// Get unseen messages
Chat::unseen()->get();
```

**Relationships**:
- `sender()` - belongsTo User (user_from)
- `receiver()` - belongsTo User (user_to)

---

## Frontend Implementation

### Component Structure

#### ChatModal Component
**File**: `C:\wamp64\www\vivahavedi\matrimonial-website\src\components\ChatModal.tsx`

**Props**:
```typescript
interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchId: number;
  matchName: string;
  matchPhoto: string;
}
```

**State Management**:
```typescript
const [messages, setMessages] = useState<Message[]>([]);
const [newMessage, setNewMessage] = useState('');
const [loading, setLoading] = useState(false);
const [sending, setSending] = useState(false);
const [loadingMore, setLoadingMore] = useState(false);
const [hasMoreMessages, setHasMoreMessages] = useState(false);
```

**Key Features**:

1. **Auto-Polling for New Messages**
```typescript
const startPolling = () => {
  pollingIntervalRef.current = setInterval(() => {
    loadNewMessages();
  }, 5000); // Poll every 5 seconds
};
```

2. **Message Pagination**
```typescript
const loadOldMessages = async () => {
  const oldestMessageId = messages[0].plan_chat_id;
  // API call with last_chat_id
  // Prepend old messages to array
};
```

3. **Optimistic UI Updates**
```typescript
const sendMessage = async () => {
  // Add message to UI immediately
  const tempMessage: Message = {
    plan_chat_id: Date.now(),
    user_from: userId,
    user_to: matchId,
    chat_content: newMessage.trim(),
    chat_seen: 0,
    chat_date: Math.floor(Date.now() / 1000),
  };
  setMessages((prev) => [...prev, tempMessage]);
};
```

4. **Keyboard Shortcuts**
- `Enter` - Send message
- `Shift + Enter` - New line

5. **Message Status Indicators**
- Single checkmark (✓) - Sent
- Double checkmark (✓✓) - Seen

#### Profile Details Page Integration
**File**: `C:\wamp64\www\vivahavedi\matrimonial-website\src\app\profile\[id]\page.tsx`

**Changes Made**:
```typescript
// Import ChatModal
import ChatModal from '@/components/ChatModal';

// Add state
const [isChatOpen, setIsChatOpen] = useState(false);

// Add button
<button
  onClick={() => setIsChatOpen(true)}
  className="w-full flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
>
  <MessageCircle className="h-5 w-5 mr-2" />
  Send Message
</button>

// Add modal
<ChatModal
  isOpen={isChatOpen}
  onClose={() => setIsChatOpen(false)}
  matchId={parseInt(profileId)}
  matchName={`${profileData.basic.user_fname} ${profileData.basic.user_lname}`}
  matchPhoto={profileData.photo.photo[0] || ''}
/>
```

---

## Features

### ✅ Core Features Implemented

1. **Real-time Messaging**
   - Send and receive messages
   - Auto-polling for new messages (5-second interval)
   - Optimistic UI updates

2. **Message History**
   - Load initial 20 messages
   - Infinite scroll with "Load older messages"
   - Chronological ordering

3. **Unseen Message Tracking**
   - Auto-mark messages as seen when loaded
   - Visual indicators (checkmarks)
   - Unseen count in chat list

4. **Plan Integration**
   - First message to new user requires chat credit
   - Subsequent messages are free
   - Plan validation before chat creation

5. **User Experience**
   - Modal-based chat interface
   - Responsive design
   - Auto-scroll to bottom
   - Keyboard shortcuts
   - Loading states
   - Error handling

6. **Privacy & Security**
   - Bearer token authentication
   - Input validation (max 1000 chars)
   - Photo privacy respected
   - User existence validation

### 🔧 Technical Features

1. **Auto-Polling System**
   - Polls for new messages every 5 seconds
   - Stops polling when chat closed
   - Prevents duplicate messages

2. **Message Pagination**
   - Load 20 messages at a time
   - Efficient database queries
   - Maintains scroll position

3. **Optimistic Updates**
   - Immediately shows sent message
   - Updates with server response
   - Handles failures gracefully

4. **Time Formatting**
   - "Today" with time (< 24 hours)
   - "Yesterday" with time (< 48 hours)
   - Date with time (> 48 hours)

---

## Database Schema

### plan_chat Table
```sql
CREATE TABLE plan_chat (
  plan_chat_id INT PRIMARY KEY AUTO_INCREMENT,
  user_from INT NOT NULL,
  user_to INT NOT NULL,
  chat_content TEXT NOT NULL,
  chat_seen TINYINT(1) DEFAULT 0,
  chat_date INT NOT NULL,
  FOREIGN KEY (user_from) REFERENCES user_details(user_id),
  FOREIGN KEY (user_to) REFERENCES user_details(user_id),
  INDEX idx_users (user_from, user_to),
  INDEX idx_seen (chat_seen),
  INDEX idx_date (chat_date)
);
```

### plan_taken Table (Chat Credits)
```sql
ALTER TABLE plan_taken ADD COLUMN pt_chat INT DEFAULT 0;
```

### authorization_token Table (FCM Tokens)
```sql
CREATE TABLE authorization_token (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  fcm_token VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES user_details(user_id)
);
```

---

## Usage Guide

### For Users

1. **Starting a Chat**
   - Go to profile details page (`/profile/[id]`)
   - Click "Send Message" button
   - Type message and press Enter or click Send
   - First message deducts 1 chat credit

2. **Viewing Messages**
   - Messages auto-load when chat opens
   - New messages appear automatically (polling)
   - Click "Load older messages" for history

3. **Message Status**
   - ✓ Single check - Message sent
   - ✓✓ Double check - Message seen by recipient

### For Developers

#### Testing Chat APIs

```bash
# 1. Send Message
curl -X POST "http://localhost:8000/api/chat/send-message" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "match_id": 237915,
    "message": "Hello!"
  }'

# 2. Load Initial Chat
curl -X POST "http://localhost:8000/api/chat/load-initial" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"match_id": 237915}'

# 3. Load New Messages
curl -X POST "http://localhost:8000/api/chat/load-new" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"match_id": 237915}'

# 4. Load Old Messages
curl -X POST "http://localhost:8000/api/chat/load-old" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "match_id": 237915,
    "last_chat_id": 10
  }'

# 5. Get Chat List
curl -X GET "http://localhost:8000/api/chat/list?page=1" \
  -H "Authorization: Bearer {token}"

# 6. Mark Messages as Seen
curl -X POST "http://localhost:8000/api/chat/mark-seen" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"match_id": 237915}'
```

#### Debugging Tips

1. **Check Chat Credits**
```sql
SELECT pt_chat FROM plan_taken WHERE user_id = ?;
```

2. **View Messages Between Users**
```sql
SELECT * FROM plan_chat
WHERE (user_from = ? AND user_to = ?)
   OR (user_from = ? AND user_to = ?)
ORDER BY chat_date DESC;
```

3. **Check Unseen Messages**
```sql
SELECT COUNT(*) FROM plan_chat
WHERE user_to = ? AND chat_seen = 0;
```

---

## Future Enhancements

### Recommended Improvements

#### 1. Real-time with WebSockets
Replace polling with WebSocket connection for true real-time updates:
```typescript
// Use Socket.io or Pusher
const socket = io('http://localhost:8000');
socket.on('new-message', (message) => {
  setMessages((prev) => [...prev, message]);
});
```

#### 2. Rich Media Support
- Image sharing
- File attachments
- Voice messages
- Emoji picker

#### 3. Chat Features
- Typing indicators
- Message reactions
- Message editing/deletion
- Reply to specific message
- Forward messages
- Search in chat

#### 4. Notification Improvements
- Browser push notifications
- Sound notifications
- Desktop notifications
- Email notifications for offline users

#### 5. UI/UX Enhancements
- Message delivery status (sent, delivered, seen)
- Online/offline status
- Last seen timestamp
- Message timestamps in chat
- Grouped messages by date
- Smooth animations

#### 6. Performance Optimizations
- Virtual scrolling for large message lists
- Message caching with IndexedDB
- Lazy load images
- Compress large messages
- Debounce typing events

#### 7. Chat Management
- Block/unblock users
- Report inappropriate messages
- Clear chat history
- Archive conversations
- Pin important chats
- Mute notifications

#### 8. Admin Features
- Message moderation
- Inappropriate content detection
- Chat analytics
- User chat statistics

#### 9. Security Enhancements
- End-to-end encryption
- Message expiration
- Screenshot prevention
- Read receipts control

#### 10. Mobile Optimizations
- Native app integration
- Offline message queue
- Background sync
- Low bandwidth mode

### Migration to WebSockets

**Backend (Laravel)**:
```php
// Install Laravel WebSockets
composer require beyondcode/laravel-websockets

// Broadcast events
broadcast(new NewMessageEvent($message));
```

**Frontend (React)**:
```typescript
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const echo = new Echo({
  broadcaster: 'pusher',
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  forceTLS: true,
});

echo.private(`chat.${userId}`)
  .listen('NewMessageEvent', (e) => {
    setMessages((prev) => [...prev, e.message]);
  });
```

---

## API Configuration

### Environment Variables

**Backend (.env)**:
```env
# Laravel API
APP_URL=http://localhost:8000

# FCM for Push Notifications
FCM_SERVER_KEY=your_fcm_server_key

# WebSocket (Future)
PUSHER_APP_ID=your_app_id
PUSHER_APP_KEY=your_app_key
PUSHER_APP_SECRET=your_app_secret
```

**Frontend (.env.local)**:
```env
# API Base URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# WebSocket (Future)
NEXT_PUBLIC_PUSHER_KEY=your_app_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster
```

### CORS Configuration

**Backend (config/cors.php)**:
```php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3000'],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

---

## Troubleshooting

### Common Issues

1. **Messages not loading**
   - Check bearer token validity
   - Verify match_id exists
   - Check network tab for errors
   - Ensure API is running on port 8000

2. **Chat credit not deducted**
   - Verify plan_taken record exists
   - Check pt_chat field value
   - Review sendMessage() logic

3. **Polling not working**
   - Check if interval is cleared
   - Verify loadNewMessages() is called
   - Check browser console for errors

4. **Messages marked as seen incorrectly**
   - Review load-new and load-old logic
   - Check chat_seen field updates
   - Verify SQL queries

5. **Push notifications not sent**
   - Check FCM token exists
   - Verify FCM server key
   - Review sendChatNotification() method

### Error Codes

| Code | Message | Solution |
|------|---------|----------|
| 400 | invalid_plan | User needs chat credits |
| 401 | Unauthenticated | Token expired or invalid |
| 422 | Validation Error | Check request parameters |
| 500 | Server Error | Check Laravel logs |

---

## Testing Checklist

### Functional Testing

- [ ] Send first message (deducts credit)
- [ ] Send subsequent messages (no deduction)
- [ ] Load initial 20 messages
- [ ] Load older messages (pagination)
- [ ] Auto-load new messages (polling)
- [ ] Mark messages as seen
- [ ] Send message without plan
- [ ] Send empty message (should fail)
- [ ] Send message > 1000 chars (should fail)

### UI/UX Testing

- [ ] Modal opens/closes properly
- [ ] Messages display correctly
- [ ] Auto-scroll to bottom
- [ ] Load more button works
- [ ] Keyboard shortcuts work
- [ ] Loading states display
- [ ] Error messages show
- [ ] Responsive on mobile

### Performance Testing

- [ ] Large message history (500+ messages)
- [ ] Rapid message sending
- [ ] Multiple concurrent chats
- [ ] Slow network simulation
- [ ] Memory leak detection

---

## Deployment Guide

### Production Deployment

1. **Backend**
   - Set production API URL
   - Configure FCM credentials
   - Enable HTTPS
   - Set CORS for production domain
   - Optimize database indexes

2. **Frontend**
   - Update API_URL in .env
   - Enable production build optimizations
   - Configure CDN for assets
   - Set up error tracking (Sentry)

3. **Database**
   - Add indexes on frequently queried fields
   - Set up database backups
   - Configure connection pooling

4. **Monitoring**
   - Set up application monitoring
   - Configure error logging
   - Track API response times
   - Monitor chat usage metrics

---

## Performance Metrics

### Target Metrics

- Message send latency: < 500ms
- Message load time: < 1s
- Polling interval: 5s
- Max messages per load: 20
- Max message length: 1000 chars

### Database Optimization

```sql
-- Index for faster queries
CREATE INDEX idx_chat_users ON plan_chat(user_from, user_to);
CREATE INDEX idx_chat_seen ON plan_chat(chat_seen);
CREATE INDEX idx_chat_date ON plan_chat(chat_date);

-- Query optimization
EXPLAIN SELECT * FROM plan_chat
WHERE (user_from = ? AND user_to = ?)
   OR (user_from = ? AND user_to = ?)
ORDER BY chat_date DESC LIMIT 20;
```

---

## Support & Maintenance

### Documentation References
- Main API Docs: `user-website-api-documentation-part2.md` (Section 27)
- Profile Communication: `PROFILE_COMMUNICATION_INTEGRATION.md`
- Backend Controller: `ChatController.php`
- Frontend Component: `ChatModal.tsx`

### Contact Information
- Backend Issues: Check Laravel error logs
- Frontend Issues: Check browser console
- API Issues: Review network tab

---

**Last Updated**: 2025-10-02
**Version**: 1.0
**Status**: Integration Complete - Production Ready
**Next Steps**: Consider WebSocket implementation for real-time updates
