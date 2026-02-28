# WhatsApp Template Quick Start Guide

## 🚀 Quick Reference

### Step 1: Create Template with Image Header

```bash
POST /api/admin/templates/create-with-whatsapp
Authorization: Bearer YOUR_SANCTUM_TOKEN
Content-Type: application/json

{
  "name": "Welcome Message",
  "whatsapp_template_name": "welcome_msg_v1",
  "content": "Hello {{1}}, welcome to {{2}}!",
  "language_code": "en",
  "category": "MARKETING",
  "variables": ["John", "VivahAvedi"],
  "header_type": "image",
  "header_media_url": "https://example.com/welcome-banner.jpg",
  "footer_text": "Thanks for joining us"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Template created and submitted to WhatsApp for approval",
  "data": {
    "id": 1,
    "name": "Welcome Message",
    "status": "pending",
    "whatsapp_template_name": "welcome_msg_v1"
  },
  "whatsapp": {
    "template_id": "1234567890",
    "status": "PENDING"
  }
}
```

---

### Step 2: Check Approval Status

```bash
POST /api/admin/templates/1/sync-status
Authorization: Bearer YOUR_SANCTUM_TOKEN
```

**Response (After Approval):**
```json
{
  "status": "success",
  "message": "Template status synced successfully",
  "data": {
    "id": 1,
    "status": "approved",
    "is_active": true
  }
}
```

---

### Step 3: Send Message Using Template

```php
<?php

use App\Services\WhatsAppService;
use App\Services\WhatsAppMessageMediaService;

// Upload message media with caching
$mediaService = new WhatsAppMessageMediaService();
$mediaResult = $mediaService->uploadMediaWithCache(
    'https://example.com/user-specific-image.jpg',
    'image'
);

if ($mediaResult['success']) {
    // Send template message
    $whatsappService = new WhatsAppService();
    $result = $whatsappService->sendTemplate(
        '+919876543210',  // Recipient
        'welcome_msg_v1', // Template name
        'en',             // Language
        [
            // Header component (image)
            [
                'type' => 'header',
                'parameters' => [
                    [
                        'type' => 'image',
                        'image' => ['id' => $mediaResult['media_id']]
                    ]
                ]
            ],
            // Body component (variables)
            [
                'type' => 'body',
                'parameters' => [
                    ['type' => 'text', 'text' => 'Rahul'],
                    ['type' => 'text', 'text' => 'VivahAvedi']
                ]
            ]
        ]
    );

    if ($result['success']) {
        echo "Message sent! ID: " . $result['message_id'];
        echo $mediaResult['cached'] ? " (Used cached media - FAST!)" : " (Uploaded new media)";
    }
}
```

---

## 🎯 Common Use Cases

### Use Case 1: Daily Promotional Template

```php
// Create once, use many times
$template = [
    "name" => "Daily Deal",
    "whatsapp_template_name" => "daily_deal",
    "content" => "Hi {{1}}, today's special offer: {{2}} at {{3}}% off!",
    "language_code" => "en",
    "category" => "MARKETING",
    "variables" => ["Customer", "Product Name", "50"],
    "header_type" => "image",
    "header_media_url" => "https://cdn.example.com/daily-deal-banner.jpg",
    "footer_text" => "Valid for 24 hours"
];

// After approval, send to 1000 users
$mediaService = new WhatsAppMessageMediaService();
$whatsappService = new WhatsAppService();

// First user: Uploads banner, takes 3 seconds
$mediaResult = $mediaService->uploadMediaWithCache($bannerUrl, 'image');

// Remaining 999 users: Uses cache, takes 10ms each
foreach ($users as $user) {
    $whatsappService->sendTemplate(
        $user->phone,
        'daily_deal',
        'en',
        [
            [
                'type' => 'header',
                'parameters' => [[
                    'type' => 'image',
                    'image' => ['id' => $mediaResult['media_id']]  // Same media_id, cached!
                ]]
            ],
            [
                'type' => 'body',
                'parameters' => [
                    ['type' => 'text', 'text' => $user->name],
                    ['type' => 'text', 'text' => $todayProduct],
                    ['type' => 'text', 'text' => $discount]
                ]
            ]
        ]
    );
}
```

**Performance:**
- Without cache: 1000 users × 3 seconds = **50 minutes**
- With cache: 3 seconds + (999 × 0.01 seconds) = **13 seconds**
- **Time saved: 49 minutes 47 seconds!**

---

### Use Case 2: Personalized Wedding Invitation

```php
// Create template with video header
$template = [
    "name" => "Wedding Invitation",
    "whatsapp_template_name" => "wedding_invite",
    "content" => "Dear {{1}}, You're invited to {{2}} & {{3}}'s wedding on {{4}}!",
    "language_code" => "hi",  // Hindi
    "category" => "UTILITY",
    "variables" => ["Guest Name", "Bride", "Groom", "Date"],
    "header_type" => "video",
    "header_media_url" => "https://cdn.example.com/wedding-video.mp4",
    "footer_text" => "RSVP: +91-1234567890"
];

// Send to guest list
foreach ($guests as $guest) {
    $mediaResult = $mediaService->uploadMediaWithCache($weddingVideo, 'video');
    // Video cached after first upload, reused for all guests

    $whatsappService->sendTemplate(
        $guest->phone,
        'wedding_invite',
        'hi',
        [
            [
                'type' => 'header',
                'parameters' => [[
                    'type' => 'video',
                    'video' => ['id' => $mediaResult['media_id']]
                ]]
            ],
            [
                'type' => 'body',
                'parameters' => [
                    ['type' => 'text', 'text' => $guest->name],
                    ['type' => 'text', 'text' => 'Priya'],
                    ['type' => 'text', 'text' => 'Rahul'],
                    ['type' => 'text', 'text' => '15 Dec 2025']
                ]
            ]
        ]
    );
}
```

---

### Use Case 3: Document-Based Notification

```php
// Send invoice template with PDF
$template = [
    "name" => "Invoice Template",
    "whatsapp_template_name" => "invoice_notification",
    "content" => "Dear {{1}}, Your invoice #{{2}} is ready. Amount: ₹{{3}}",
    "language_code" => "en",
    "category" => "UTILITY",
    "variables" => ["Customer", "INV-001", "5000"],
    "header_type" => "document",
    "header_media_url" => "https://cdn.example.com/sample-invoice.pdf",
    "footer_text" => "Thank you for your business"
];

// Send personalized invoice
$pdfUrl = generateInvoicePDF($order);  // Generate unique PDF per order
$mediaResult = $mediaService->uploadMediaWithCache($pdfUrl, 'document');
// Each PDF is unique, so won't be cached (which is correct)

$whatsappService->sendTemplate(
    $customer->phone,
    'invoice_notification',
    'en',
    [
        [
            'type' => 'header',
            'parameters' => [[
                'type' => 'document',
                'document' => [
                    'id' => $mediaResult['media_id'],
                    'filename' => "Invoice-{$order->id}.pdf"
                ]
            ]]
        ],
        [
            'type' => 'body',
            'parameters' => [
                ['type' => 'text', 'text' => $customer->name],
                ['type' => 'text', 'text' => $order->invoice_number],
                ['type' => 'text', 'text' => $order->total_amount]
            ]
        ]
    ]
);
```

---

## 🔍 Key Differences Summary

| Action | Service | API Used | Returns | Use For |
|--------|---------|----------|---------|---------|
| **Create Template** | `WhatsAppTemplateMediaService` | Resumable Upload | `header_handle` | Meta approval only |
| **Send Message** | `WhatsAppMessageMediaService` | Standard Media | `media_id` (cached 30 days) | Actual delivery |

---

## 📊 Cache Performance Monitoring

```php
// Check cache statistics
use App\Models\WhatsAppMediaAsset;

$stats = WhatsAppMediaAsset::valid()
    ->selectRaw('
        media_type,
        COUNT(*) as total_cached,
        AVG(usage_count) as avg_reuse,
        MAX(usage_count) as max_reuse,
        SUM(usage_count) as total_uses
    ')
    ->groupBy('media_type')
    ->get();

foreach ($stats as $stat) {
    echo "{$stat->media_type}:\n";
    echo "  Cached items: {$stat->total_cached}\n";
    echo "  Average reuse: {$stat->avg_reuse}\n";
    echo "  Most reused: {$stat->max_reuse} times\n";
    echo "  Total uses: {$stat->total_uses}\n\n";
}

// Output example:
// image:
//   Cached items: 25
//   Average reuse: 45.2
//   Most reused: 352 times
//   Total uses: 1,130
```

---

## 🛠️ Maintenance Commands

```php
// Create scheduled task in app/Console/Kernel.php
protected function schedule(Schedule $schedule)
{
    // Clean up expired cache daily at 2 AM
    $schedule->call(function () {
        $deleted = (new WhatsAppMessageMediaService())->cleanupExpiredCache();
        Log::info("Cleaned up {$deleted} expired media cache entries");
    })->daily()->at('02:00');
}
```

---

## ⚠️ Common Mistakes to Avoid

### ❌ Mistake 1: Using media_id for template creation
```php
// WRONG!
$uploadService = new WhatsAppMediaUploadService();
$result = $uploadService->uploadMediaDirect($path, $name, $mime);
$mediaId = $result['handle'];  // This is media_id, not header_handle!

// Template creation will FAIL
```

### ✅ Correct:
```php
$templateService = new WhatsAppTemplateMediaService();
$result = $templateService->uploadMediaForTemplateCreation($url, 'image');
$headerHandle = $result['header_handle'];  // Correct!
```

---

### ❌ Mistake 2: Not using cache for repeated media
```php
// WRONG - uploads every time!
foreach ($users as $user) {
    $uploadService = new WhatsAppMediaUploadService();
    $result = $uploadService->uploadMediaDirect($sameBannerPath, ...);
    // Slow! Takes 3 seconds × 1000 users = 50 minutes
}
```

### ✅ Correct:
```php
$mediaService = new WhatsAppMessageMediaService();
foreach ($users as $user) {
    $result = $mediaService->uploadMediaWithCache($sameBannerUrl, 'image');
    // Fast! First = 3s, rest = 10ms each
}
```

---

### ❌ Mistake 3: Forcing upload unnecessarily
```php
// WRONG - defeats caching!
$result = $mediaService->uploadMediaWithCache($url, 'image', true);  // forceUpload=true
```

### ✅ Correct:
```php
$result = $mediaService->uploadMediaWithCache($url, 'image');  // Let cache work
```

---

## 📞 Need Help?

1. **Check logs:** `storage/logs/laravel.log`
2. **Verify .env configuration**
3. **Read full docs:** `docs/WHATSAPP_TEMPLATE_ARCHITECTURE.md`
4. **Test with Postman:** Use provided examples above

---

**Pro Tip:** Start with text-only templates, then add media headers once you understand the flow!
