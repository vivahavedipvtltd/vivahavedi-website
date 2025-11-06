# Plan Upgrade Troubleshooting Guide

## Common Errors and Solutions

### Error: HTTP 500 - Payment Verification Failed

**Symptom:** Console shows `HTTP error! status: 500` when trying to verify payment

**Possible Causes:**

#### 1. Razorpay Credentials Not Configured

**Check Laravel `.env` file:**
```bash
# Navigate to Laravel project
cd C:\wamp64\www\vivahavedi\vivahavedi-laravel-api

# Check if Razorpay credentials exist
grep RAZORPAY .env
```

**Solution:**
Add the following to your Laravel `.env` file:
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Get Razorpay Credentials:**
1. Sign up at https://razorpay.com
2. Go to Dashboard → Settings → API Keys
3. Generate Test Keys for development
4. Copy Key ID and Key Secret

#### 2. Razorpay SDK Not Installed

**Check if Razorpay PHP SDK is installed:**
```bash
cd C:\wamp64\www\vivahavedi\vivahavedi-laravel-api
composer show razorpay/razorpay
```

**Solution - Install Razorpay SDK:**
```bash
composer require razorpay/razorpay
```

#### 3. Database Connection Issues

**Test Laravel database connection:**
```bash
php artisan tinker
>>> DB::connection()->getPdo();
```

**Solution:**
Check database configuration in Laravel `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=root
DB_PASSWORD=
```

#### 4. Missing plan_order Table

**Check if table exists:**
```sql
USE your_database_name;
SHOW TABLES LIKE 'plan_order';
```

**If table doesn't exist, check migrations:**
```bash
php artisan migrate:status
php artisan migrate
```

---

### Error: HTTP 500 - Order Creation Failed

**Check Laravel logs:**
```bash
# View latest errors
tail -n 50 C:\wamp64\www\vivahavedi\vivahavedi-laravel-api\storage\logs\laravel.log
```

**Common Issues:**

1. **Plan not found:**
   - Ensure the plan exists in `plan_details` table
   - Check `plan_activation = 'yes'`

2. **Invalid plan_id:**
   - Verify the plan ID you're trying to purchase exists

3. **Database permission issues:**
   - Check user has INSERT permission on `plan_order` table

---

### Error: Payment Gateway Not Configured

**Symptom:** Error message says "Payment gateway not configured"

**Solution:**
1. Check `.env` file has both:
   ```env
   RAZORPAY_KEY_ID=...
   RAZORPAY_KEY_SECRET=...
   ```

2. Restart Laravel server:
   ```bash
   php artisan config:clear
   php artisan cache:clear
   php artisan serve --port=8000
   ```

---

### Error: CORS Issues

**Symptom:** Browser console shows CORS error

**Solution:**
Update Laravel `config/cors.php`:
```php
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3000'],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

---

### Error: Razorpay Checkout Not Opening

**Symptom:** Clicking "Upgrade Now" does nothing

**Check Console for:**
1. `Razorpay is not defined` - Script not loaded
2. Network errors - Backend API issues

**Solution:**
1. Check internet connection (Razorpay script loads from CDN)
2. Verify order creation succeeds before checkout
3. Check browser console for JavaScript errors

---

## Debugging Steps

### 1. Check Backend API

**Test order creation manually:**
```bash
curl -X POST "http://localhost:8000/api/plan-upgrade/create-order" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"plan_id": 5, "from": "web"}'
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Order created successfully",
  "data": {
    "order_id": "order_xxxxx",
    "amount": 3500,
    "currency": "INR",
    "key_id": "rzp_test_xxxxx",
    "plan_name": "DIAMOND",
    "po_id": 123
  }
}
```

### 2. Check Frontend Console

**Open browser console (F12):**
- Look for network errors
- Check API responses
- Verify Razorpay script loaded

### 3. Enable Debug Mode

**Laravel - Enable debug mode:**
```env
APP_DEBUG=true
APP_ENV=local
```

**Check detailed error in response:**
```javascript
// In browser console, after error occurs
// You should see detailed error message logged
```

### 4. Test with Razorpay Test Mode

**Use test credentials:**
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Test Card:**
- Number: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

---

## Quick Fixes

### Fix 1: Clear All Caches
```bash
# Laravel
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Next.js
npm run build
# or
rm -rf .next
npm run dev
```

### Fix 2: Restart Servers
```bash
# Stop Laravel server (Ctrl+C)
# Stop Next.js server (Ctrl+C)

# Start Laravel
cd C:\wamp64\www\vivahavedi\vivahavedi-laravel-api
php artisan serve --port=8000

# Start Next.js (in new terminal)
cd C:\wamp64\www\vivahavedi\matrimonial-website
npm run dev
```

### Fix 3: Check Environment Variables
```bash
# Laravel
php artisan tinker
>>> config('services.razorpay.key_id')
>>> config('services.razorpay.key_secret')
```

Should show your Razorpay credentials, not null.

**If null, add to `config/services.php`:**
```php
'razorpay' => [
    'key_id' => env('RAZORPAY_KEY_ID'),
    'key_secret' => env('RAZORPAY_KEY_SECRET'),
],
```

---

## Verification Checklist

Before testing payment:

- [ ] Laravel server running on port 8000
- [ ] Next.js server running on port 3000
- [ ] Razorpay credentials in Laravel `.env`
- [ ] Razorpay SDK installed (`composer show razorpay/razorpay`)
- [ ] Database accessible
- [ ] `plan_details` table has active plans
- [ ] `plan_order` table exists
- [ ] CORS configured for localhost:3000
- [ ] Browser has internet connection (for Razorpay script)
- [ ] Using test mode credentials

---

## Testing Flow

### Step-by-step testing:

1. **Load packages page:**
   ```
   http://localhost:3000/packages
   ```
   ✅ Should show plans

2. **Login:**
   ```
   http://localhost:3000/login
   ```
   ✅ Should login successfully

3. **Go to upgrade page:**
   ```
   http://localhost:3000/dashboard/settings/plan-upgrade
   ```
   ✅ Should show premium plans

4. **Click "Upgrade Now"**
   ✅ Should create order
   ✅ Should open Razorpay checkout

5. **Complete test payment:**
   - Card: 4111 1111 1111 1111
   - CVV: 123
   - Expiry: 12/25
   ✅ Should verify payment
   ✅ Should activate plan
   ✅ Should redirect to dashboard

---

## Contact Support

If issues persist after trying all solutions:

1. Check Laravel logs:
   ```
   C:\wamp64\www\vivahavedi\vivahavedi-laravel-api\storage\logs\laravel.log
   ```

2. Check browser console (F12)

3. Provide:
   - Error message
   - Laravel log excerpt
   - Browser console errors
   - Steps to reproduce

---

## Additional Resources

- **Razorpay Docs:** https://razorpay.com/docs
- **Laravel Docs:** https://laravel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **API Documentation:** `user-website-api-documentation-part3.md`
- **Integration Guide:** `PLAN_UPGRADE_INTEGRATION.md`
