# WhatsApp Template & Media Architecture Documentation

## Overview

This document explains the **correct architectural implementation** of WhatsApp template creation and message sending with media headers, based on Meta's WhatsApp Business Cloud API specifications.

---

## Critical Concept: Two Separate Media Workflows

**THE MOST IMPORTANT RULE:**
WhatsApp has **TWO DISTINCT, NON-INTERCHANGEABLE** media upload APIs:

| Purpose | API Used | Returns | Valid For | Service |
|---------|----------|---------|-----------|---------|
| **Template Creation** | Resumable Upload API | `header_handle` | Template approval process ONLY | `WhatsAppTemplateMediaService` |
| **Message Sending** | Standard Media API | `media_id` | 30 days, reusable for messages | `WhatsAppMessageMediaService` |

**❌ NEVER:**
- Use `media_id` from Standard API for template creation
- Use `header_handle` from Resumable API for message sending
- Conflate these two workflows in the same service

---

## Architecture Components

### 1. Template Creation Workflow

#### Service: `WhatsAppTemplateMediaService`

**Purpose:** Upload sample media for Meta's template review process.

**Process:**
```
User Uploads Image/Video/Document
    ↓
Download to temp location (if URL)
    ↓
Create Upload Session: POST /{WABA_ID}/uploads
    ↓
Upload File Data: POST /{UPLOAD_SESSION_ID}
    ↓
Receive header_handle (in response field 'h')
    ↓
Use in template creation payload under example.header_handle
```

**Endpoint:**  `POST /admin/templates/create-with-whatsapp`

**Request Example:**
```json
{
  "name": "Summer Promotion",
  "whatsapp_template_name": "summer_promo_2025",
  "content": "Hi {{1}}, check out our summer sale!",
  "language_code": "en",
  "category": "MARKETING",
  "variables": ["John"],
  "header_type": "image",
  "header_media_url": "https://example.com/banner.jpg",
  "footer_text": "Valid until June 30"
}
```

**How It Works:**
1. `TemplateController@createWithWhatsApp` receives request
2. Uses `WhatsAppTemplateMediaService` to upload via **Resumable Upload API**
3. Gets `header_handle` (e.g., `"4::aW1hZ2UvanBlZw==..."`)
4. Builds template components with `header_handle` in `example` object:
   ```json
   {
     "type": "HEADER",
     "format": "IMAGE",
     "example": {
       "header_handle": ["4::aW1hZ2UvanBlZw==..."]
     }
   }
   ```
5. Submits to `/{WABA_ID}/message_templates`
6. Template enters review (15 min - 24 hours)
7. Once approved, ready for use in messages

**Key Files:**
- Service: `app/Services/WhatsAppTemplateMediaService.php`
- Controller: `app/Http/Controllers/Admin/TemplateController.php` (lines 252-508)
- Model: `app/Models/Template.php`

---

### 2. Message Sending Workflow

#### Service: `WhatsAppMessageMediaService`

**Purpose:** Upload actual media for sending to users, with intelligent caching.

**Process:**
```
Need to send message with image
    ↓
Calculate SHA256 hash of image file
    ↓
Check whatsapp_media_assets table
    ↓
├─ CACHE HIT (hash exists, not expired)
│   ↓
│   Use cached media_id (FAST, no API call)
│   Increment usage counter
│
└─ CACHE MISS (hash not found or expired)
    ↓
    Upload via Standard Media API: POST /{PHONE_NUMBER_ID}/media
    ↓
    Receive media_id (valid for 30 days)
    ↓
    Cache: Store hash + media_id + expiration
    ↓
    Use media_id in message
```

**Usage Example:**
```php
use App\Services\WhatsAppMessageMediaService;

$mediaService = new WhatsAppMessageMediaService();

// Upload with automatic caching
$result = $mediaService->uploadMediaWithCache(
    'https://example.com/user-photo.jpg',
    'image'
);

if ($result['success']) {
    $mediaId = $result['media_id'];
    $isCached = $result['cached'];  // true = from cache (fast), false = new upload

    // Send template message with this media_id
    $whatsappService = new WhatsAppService();
    $whatsappService->sendTemplate($phone, 'template_name', 'en', [
        [
            'type' => 'header',
            'parameters' => [
                [
                    'type' => 'image',
                    'image' => ['id' => $mediaId]
                ]
            ]
        ]
    ]);
}
```

**Performance Optimization:**
- **First request:** Downloads image, uploads to WhatsApp, caches media_id (~2-5 seconds)
- **Subsequent requests (same image):** Retrieves media_id from cache (~10ms)
- **Result:** 200-500x performance improvement for repeated media!

**Key Files:**
- Service: `app/Services/WhatsAppMessageMediaService.php`
- Model: `app/Models/WhatsAppMediaAsset.php`
- Migration: `database/migrations/2025_10_16_141233_create_whatsapp_media_assets_table.php`

---

## Database Schema

### Table: `whatsapp_media_assets`

Caches `media_id` values to avoid redundant uploads.

```sql
CREATE TABLE whatsapp_media_assets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    file_hash VARCHAR(64) UNIQUE NOT NULL,     -- SHA256 hash
    media_id VARCHAR(255) NOT NULL,            -- WhatsApp media ID
    media_type VARCHAR(20) NOT NULL,           -- 'image', 'video', 'document'
    mime_type VARCHAR(100),                    -- 'image/jpeg', etc.
    file_size INT UNSIGNED,                    -- Bytes
    file_url TEXT,                             -- Original URL
    expires_at TIMESTAMP NOT NULL,             -- 30 days from upload
    usage_count INT DEFAULT 0,                 -- Times reused
    last_used_at TIMESTAMP,                    -- Last usage
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    INDEX (file_hash),
    INDEX (expires_at),
    INDEX (media_type)
);
```

---

## API Endpoints

### Template Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/admin/templates/create-with-whatsapp` | Create template with Resumable Upload API |
| GET | `/admin/templates` | List all templates |
| GET | `/admin/templates/{id}` | Get single template |
| POST | `/admin/templates/{id}/sync-status` | Sync approval status from WhatsApp |
| DELETE | `/admin/templates/{id}` | Delete template |

### Key Parameters for Template Creation

```json
{
  "name": "Local display name",
  "whatsapp_template_name": "api_name_lowercase",
  "content": "Body text with {{1}} variables",
  "language_code": "en",
  "category": "MARKETING|UTILITY|AUTHENTICATION",
  "variables": ["example", "values"],
  "header_type": "none|text|image|video|document",

  // For text header:
  "header_text": "Header Text (max 60 chars)",

  // For media headers (ONE OF):
  "header_media_url": "https://url-to-media.com/file.jpg",
  "header_media_local_path": "/absolute/path/to/file.jpg",
  "header_handle_direct": "pre-obtained-handle",

  "footer_text": "Footer text (max 60 chars)",
  "formatting_data": { /* bold, italic, etc. */ }
}
```

---

## Testing Guide

### 1. Test Template Creation with Image Header

```bash
# Test endpoint
POST /admin/templates/create-with-whatsapp

# Sample request
curl -X POST http://127.0.0.1:8000/api/admin/templates/create-with-whatsapp \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Template",
    "whatsapp_template_name": "test_template_001",
    "content": "Hello {{1}}, welcome to our service!",
    "language_code": "en",
    "category": "MARKETING",
    "variables": ["John"],
    "header_type": "image",
    "header_media_url": "https://example.com/test-image.jpg",
    "footer_text": "Thank you"
  }'
```

**Expected Flow:**
1. ✅ Downloads image from URL
2. ✅ Uploads via Resumable Upload API to `/{WABA_ID}/uploads`
3. ✅ Gets `header_handle` from response
4. ✅ Creates template with `header_handle` in example
5. ✅ Returns `status: 'pending'`
6. ⏳ Wait 15-60 minutes for Meta approval

**Check Status:**
```bash
POST /admin/templates/{id}/sync-status
```

### 2. Test Message Sending with Cached Media

```php
// First send - uploads and caches
$mediaService = new WhatsAppMessageMediaService();
$result = $mediaService->uploadMediaWithCache($imageUrl, 'image');
// Result: cached = false, ~3 seconds

// Second send - uses cache
$result = $mediaService->uploadMediaWithCache($imageUrl, 'image');
// Result: cached = true, ~10ms
```

**Verify Cache:**
```sql
SELECT * FROM whatsapp_media_assets;
-- Check: file_hash, media_id, expires_at, usage_count
```

### 3. Test Cache Expiration

```php
// Clean up expired entries
$mediaService = new WhatsAppMessageMediaService();
$deleted = $mediaService->cleanupExpiredCache();
echo "Deleted {$deleted} expired entries";
```

---

## Troubleshooting

### Error: "No header handle (h) returned in response"

**Cause:** Resumable Upload API endpoint issue.

**Solutions:**
1. Verify `WHATSAPP_BUSINESS_ACCOUNT_ID` is correct (not phone number ID)
2. Check access token has `whatsapp_business_management` permission
3. Ensure file meets requirements (JPEG/PNG, max 5MB for images)
4. Try alternative: Use `header_handle_direct` with pre-uploaded handle from WhatsApp Manager

### Error: "Automated media upload failed"

**Cause:** Using wrong API endpoint.

**Fix:** Already fixed! Now using `WhatsAppTemplateMediaService` with Resumable Upload API.

### Template Stuck in "Pending"

**Causes:**
- Policy violation (misleading content, incorrect category)
- Missing required fields
- Template quality issues

**Actions:**
1. Check WhatsApp Business Manager for rejection reasons
2. Use `syncStatus()` to update local database
3. Review Meta's template policies

### Cache Not Working

**Check:**
```php
// Verify model is imported
use App\Models\WhatsAppMediaAsset;

// Check table exists
php artisan migrate:status

// Manually verify
$hash = WhatsAppMediaAsset::generateFileHash($imageUrl);
$cached = WhatsAppMediaAsset::findValidByHash($hash);
```

---

## Performance Metrics

### Before Optimization (No Caching)
- Every message sending: 2-5 seconds per media upload
- 100 messages with same image: 200-500 seconds total
- High API call volume → potential rate limiting

### After Optimization (With Caching)
- First message: 2-5 seconds (upload + cache)
- Subsequent 99 messages: ~10ms each (~1 second total)
- **Total time savings: 199-499 seconds (99.5% reduction)**
- Reduced API calls: 100 → 1

---

## Best Practices

### 1. Template Creation
✅ **DO:**
- Use descriptive, lowercase names with underscores
- Provide example variable values that make sense
- Test with small images first (< 1MB)
- Use appropriate categories (MARKETING for promotions)

❌ **DON'T:**
- Use generic names like "template1"
- Create templates without proper variable examples
- Upload huge files (stay under 5MB for images)
- Mix up media_id and header_handle

### 2. Message Sending
✅ **DO:**
- Use `WhatsAppMessageMediaService` for all message media
- Let the caching system work automatically
- Periodically clean up expired cache entries
- Monitor cache hit rate for performance insights

❌ **DON'T:**
- Use `forceUpload = true` unnecessarily
- Delete cached entries manually
- Upload unique images for every user (defeats caching)

### 3. Media Management
✅ **DO:**
- Host media on fast, reliable CDN
- Compress images before upload (maintain quality)
- Use consistent image dimensions
- Keep file URLs stable (don't change URLs frequently)

❌ **DON'T:**
- Use slow hosting providers
- Upload uncompressed RAW images
- Change image URLs for same content (breaks cache)

---

## Maintenance Tasks

### Daily
```php
// Clean up expired cache entries
php artisan schedule:run
// Or manually:
(new WhatsAppMessageMediaService())->cleanupExpiredCache();
```

### Weekly
```sql
-- Check cache performance
SELECT
    media_type,
    COUNT(*) as total,
    AVG(usage_count) as avg_reuse,
    MAX(usage_count) as max_reuse
FROM whatsapp_media_assets
WHERE expires_at > NOW()
GROUP BY media_type;
```

### Monthly
- Review template quality ratings in WhatsApp Manager
- Archive unused templates
- Analyze cache hit rates
- Optimize frequently used media files

---

## Migration from Old System

If you have existing code using the old `WhatsAppMediaUploadService`:

**For Template Creation:**
```php
// OLD (WRONG):
$uploadService = new WhatsAppMediaUploadService();
$result = $uploadService->uploadMediaForTemplate($url, $type);
$mediaHandle = $result['handle'];  // This is actually media_id, NOT header_handle!

// NEW (CORRECT):
$templateMediaService = new WhatsAppTemplateMediaService();
$result = $templateMediaService->uploadMediaForTemplateCreation($url, $type);
$headerHandle = $result['header_handle'];  // Actual header_handle for template
```

**For Message Sending:**
```php
// OLD:
$uploadService = new WhatsAppMediaUploadService();
$result = $uploadService->uploadMediaDirect($path, $name, $mime);
// No caching, always uploads

// NEW:
$messageMediaService = new WhatsAppMessageMediaService();
$result = $messageMediaService->uploadMediaWithCache($path, $type);
// Automatic caching, reuses media_id
```

---

## Additional Resources

- **WhatsApp Business API Documentation:**
  https://developers.facebook.com/docs/whatsapp/cloud-api/

- **Template Components Reference:**
  https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/components/

- **Media Requirements:**
  https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media/

- **Resumable Upload API:**
  https://developers.facebook.com/docs/graph-api/guides/upload

---

## Support

For issues or questions:
1. Check logs: `storage/logs/laravel.log`
2. Verify configuration in `.env`:
   ```
   WHATSAPP_ACCESS_TOKEN=your_token
   WHATSAPP_PHONE_NUMBER_ID=your_phone_id
   WHATSAPP_BUSINESS_ACCOUNT_ID=your_waba_id
   WHATSAPP_API_VERSION=v18.0
   ```
3. Review this documentation
4. Check WhatsApp Business Manager for template status

---

**Last Updated:** October 16, 2025
**Version:** 2.0 - Corrected Architecture Implementation
