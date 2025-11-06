# Photo Display Debugging Guide

## Issue: Uploaded Photos Not Displaying

### Quick Debugging Steps

1. **Open Browser Console** (F12 or Right-click → Inspect → Console)
2. **Navigate to Dashboard** (`http://localhost:3002/dashboard`)
3. **Check Console Logs** - Look for:
   - `MyPhotos Data:` - Shows the complete photo data structure
   - `Slot X: Key=Y, URL=Z` - Shows each photo slot mapping

### Expected Data Structure

The API should return:
```json
{
  "photos": {
    "0": "http://localhost:8000/images/user_images/photo1/filename.jpg",
    "1": "http://localhost:8000/images/user_images/photo1/filename.jpg",
    "2": "http://localhost:8000/images/user_images/photo2/filename.jpg",
    "3": "no",
    "4": "no",
    "5": "no"
  },
  "photo_status": "yes",
  "photo_all_status": "no"
}
```

### Common Issues and Fixes

#### 1. Photos Showing as "no" Instead of URLs

**Problem:** API returning "no" for uploaded photos
**Solution:**
- Check Laravel API is running on port 8000
- Verify photos were uploaded successfully
- Check database for uploaded photo filenames
- Run: `curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/api/my-photos`

#### 2. Image URLs are Broken/404

**Problem:** URLs point to non-existent files
**Solution:**
- Check if image files exist in Laravel public directory
- Path should be: `C:\wamp64\www\vivahavedi\vivahavedi-laravel-api\public\images\user_images\photoN\`
- Verify APP_URL in Laravel .env is set to `http://localhost:8000`
- Check APP_IMAGE_URL in Laravel .env

#### 3. CORS Errors

**Problem:** Browser blocking images from localhost:8000
**Solution:** Already configured in `next.config.ts` - should work fine

#### 4. Component Not Refreshing After Upload

**Problem:** Photos upload but UI doesn't update
**Solution:**
- Check browser console for errors
- Verify `onRefresh()` is being called (check for API call in Network tab)
- Try manually refreshing the page

### Manual Testing Steps

1. **Test Photo Upload:**
   ```bash
   # In browser console after upload, check:
   - Success message appears
   - Console shows "MyPhotos Data" with updated photos
   - Slot shows the new photo URL
   ```

2. **Test API Directly:**
   ```bash
   # Get your auth token from localStorage
   localStorage.getItem('token')

   # Test the API
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        http://localhost:8000/api/my-photos
   ```

3. **Check Image File Exists:**
   ```bash
   # Navigate to Laravel public folder
   cd C:\wamp64\www\vivahavedi\vivahavedi-laravel-api\public\images\user_images

   # List all photos
   ls -R
   ```

### Network Tab Debugging

1. Open **Network Tab** in browser DevTools
2. Filter by **Fetch/XHR**
3. Upload a photo
4. Look for:
   - `POST /api/upload-photo` - Should return 200 OK
   - `GET /api/my-photos` - Should be called after upload
5. Check the response data

### Check Laravel Backend

1. **Check Laravel Logs:**
   ```bash
   cd C:\wamp64\www\vivahavedi\vivahavedi-laravel-api
   tail -f storage/logs/laravel.log
   ```

2. **Verify Database:**
   ```sql
   -- Check user_profile_photos table
   SELECT * FROM user_profile_photos WHERE user_id = YOUR_USER_ID;
   ```

3. **Check File Permissions:**
   - Windows: Ensure IIS/Apache can read the images folder
   - Folder should have read permissions

### Quick Fix: Clear Cache and Reload

Sometimes the issue is just cached data:

1. **Clear Browser Cache:** Ctrl+Shift+Delete
2. **Hard Reload:** Ctrl+Shift+R
3. **Clear Application Storage:**
   - DevTools → Application → Local Storage → Clear
   - Login again

### Verify Image URLs Work

Open a new browser tab and directly access an image URL:
```
http://localhost:8000/images/user_images/photo1/FILENAME.jpg
```

If this doesn't load, the issue is with Laravel serving images, not the frontend.

### Expected Console Output

When working correctly, you should see:
```
MyPhotos Data: {
  photos: {
    0: "http://localhost:8000/images/...",
    1: "http://localhost:8000/images/...",
    2: "no",
    3: "no",
    4: "no",
    5: "no"
  },
  photo_status: "yes",
  photo_all_status: "no",
  ...
}

Slot 1: Key=1, URL=http://localhost:8000/images/user_images/photo1/12345_1234567890.jpg
Slot 2: Key=2, URL=null
Slot 3: Key=3, URL=null
Slot 4: Key=4, URL=null
Slot 5: Key=5, URL=null
```

### If Still Not Working

**Please provide:**
1. Browser console screenshot
2. Network tab screenshot showing API response
3. Output of: `ls C:\wamp64\www\vivahavedi\vivahavedi-laravel-api\public\images\user_images`
4. Laravel .env APP_URL and APP_IMAGE_URL values

This will help identify the exact issue.
