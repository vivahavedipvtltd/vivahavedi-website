# Laravel Backend Bug - Plan Upgrade Payment Verification

## 🚨 Critical Issue

**Status:** Payment verification failing
**Error:** Table 'vivahaeasy_vivahavedi.users' doesn't exist
**Impact:** Users cannot upgrade their plans

---

## Problem Description

The payment verification API endpoint is trying to update a table called `users`, but this table doesn't exist in the database. The correct table name is `user_details`.

### Error Details

**Laravel Log Entry:**
```
[2025-10-05 07:33:34] local.ERROR: Verify Payment Error: SQLSTATE[42S02]: Base table or view not found: 1146 Table 'vivahaeasy_vivahavedi.users' doesn't exist (SQL: update `users` set `plan_id` = 17, `user_plan_start` = 2025-10-05, `user_plan_end` = 2026-10-05 where `user_id` = 237947)
```

**Endpoint:** `POST /api/plan-upgrade/verify-payment`
**Controller:** `App\Http\Controllers\PlanUpgradeController`
**Method:** `verifyPayment()`

---

## Database Information

### Current Database Schema

**Database Name:** `vivahaeasy_vivahavedi`

**Correct Table Name:** `user_details` (confirmed exists in database)
**Wrong Table Name:** `users` (does not exist)

**User Details Table Structure:**
- Primary Key: `user_id`
- Contains fields: `plan_id`, `user_plan_start`, `user_plan_end`

---

## Required Fix

### File to Modify
```
vivahavedi-laravel-api/app/Http/Controllers/PlanUpgradeController.php
```

### Current Code (Lines causing error)
Look for SQL query updating `users` table:
```php
DB::table('users')
    ->where('user_id', $userId)
    ->update([
        'plan_id' => $planId,
        'user_plan_start' => $startDate,
        'user_plan_end' => $endDate
    ]);
```

### Corrected Code
```php
DB::table('user_details')  // Changed from 'users' to 'user_details'
    ->where('user_id', $userId)
    ->update([
        'plan_id' => $planId,
        'user_plan_start' => $startDate,
        'user_plan_end' => $endDate
    ]);
```

### Alternative Using Model (Recommended)

**If using Eloquent Model:**
```php
// Ensure the model uses correct table
class User extends Model
{
    protected $table = 'user_details';  // Specify correct table
    protected $primaryKey = 'user_id';

    // ... rest of model
}
```

---

## Testing After Fix

### 1. Test Payment Verification Manually

```bash
# Create a test order first
curl -X POST "http://localhost:8000/api/plan-upgrade/create-order" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {TOKEN}" \
  -d '{"plan_id": 5, "from": "web"}'

# Then verify with test data
curl -X POST "http://localhost:8000/api/plan-upgrade/verify-payment" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {TOKEN}" \
  -d '{
    "razorpay_order_id": "order_test123",
    "razorpay_payment_id": "pay_test123",
    "razorpay_signature": "test_signature"
  }'
```

### 2. Expected Response (Success)

```json
{
  "status": "success",
  "message": "Payment verified successfully",
  "data": {
    "payment_id": "pay_test123",
    "order_id": "order_test123"
  }
}
```

### 3. Check Database After Verification

```sql
SELECT user_id, plan_id, user_plan_start, user_plan_end
FROM user_details
WHERE user_id = {USER_ID};
```

Should show updated plan details.

---

## Additional Checks

### 1. Verify All User-Related Queries

Check if there are other places in the code using wrong table name:

```bash
# Search for 'users' table references in controllers
cd vivahavedi-laravel-api
grep -r "table('users')" app/Http/Controllers/
grep -r "DB::table('users')" app/Http/Controllers/
grep -r "from('users')" app/Http/Controllers/
```

### 2. Check User Model

**File:** `app/Models/User.php`

Ensure it has:
```php
class User extends Model
{
    protected $table = 'user_details';
    protected $primaryKey = 'user_id';
    public $incrementing = true;

    // Add fillable fields
    protected $fillable = [
        'plan_id',
        'user_plan_start',
        'user_plan_end',
        // ... other fields
    ];
}
```

---

## Related Files That May Need Updates

1. **PlanUpgradeController.php**
   - `createOrder()` method - check if it references users table
   - `verifyPayment()` method - **MAIN FIX NEEDED HERE**
   - `getOrderHistory()` method - check for users table

2. **User Model** (`app/Models/User.php`)
   - Ensure `$table = 'user_details'`
   - Ensure `$primaryKey = 'user_id'`

3. **Other Controllers**
   - Any controller updating user's plan should use `user_details`
   - Check: DashboardController, ProfileController, etc.

---

## Impact of Bug

**Current Status:**
- ✅ Order creation works (Razorpay order created successfully)
- ✅ Payment collection works (Razorpay processes payment)
- ❌ **Payment verification fails** (Cannot update user's plan)
- ❌ **Plan not activated** (User's subscription not updated)

**User Impact:**
- Users pay money but plan doesn't activate
- Requires manual intervention to activate plans
- Poor user experience
- Potential refund requests

---

## Quick Fix Steps

1. **Locate the Controller:**
   ```bash
   cd vivahavedi-laravel-api
   nano app/Http/Controllers/PlanUpgradeController.php
   # or use your preferred editor
   ```

2. **Find and Replace:**
   - Search for: `DB::table('users')`
   - Replace with: `DB::table('user_details')`

   OR

   - Search for: `->table('users')`
   - Replace with: `->table('user_details')`

3. **Test the Change:**
   ```bash
   php artisan config:clear
   php artisan cache:clear
   php artisan serve --port=8000
   ```

4. **Verify Fix:**
   - Try payment flow from frontend
   - Check Laravel logs for errors
   - Verify user's plan updated in database

---

## Prevention

### Add Table Name Constants

**Create a config file:** `config/tables.php`
```php
<?php

return [
    'users' => 'user_details',
    'plan_order' => 'plan_order',
    'plan_details' => 'plan_details',
    // ... other tables
];
```

**Use in controllers:**
```php
DB::table(config('tables.users'))
    ->where('user_id', $userId)
    ->update([...]);
```

### Use Eloquent Models

Always use Eloquent models instead of raw DB queries:
```php
$user = User::find($userId);
$user->plan_id = $planId;
$user->user_plan_start = $startDate;
$user->user_plan_end = $endDate;
$user->save();
```

---

## Verification Checklist

After fixing, verify:

- [ ] Payment verification succeeds (200 response)
- [ ] User's plan_id updated in user_details table
- [ ] user_plan_start date set correctly
- [ ] user_plan_end date set correctly (1 year from start)
- [ ] Order status updated to 'success' in plan_order
- [ ] Order approval set to 1
- [ ] No errors in Laravel logs
- [ ] Frontend receives success response
- [ ] User redirected to dashboard
- [ ] User can access premium features

---

## Contact Information

**Issue Reported By:** Frontend Development Team
**Date:** October 5, 2025
**Priority:** Critical
**Affects:** All users trying to upgrade plans

**Frontend Files (No changes needed):**
- `src/lib/planUpgradeApi.ts` - Working correctly
- `src/app/dashboard/settings/plan-upgrade/page.tsx` - Working correctly

**Backend Files (Need fixes):**
- `app/Http/Controllers/PlanUpgradeController.php` - **REQUIRES FIX**
- `app/Models/User.php` - Check table name configuration

---

## Summary

**Root Cause:** Wrong table name used in PlanUpgradeController
**Solution:** Change `users` to `user_details` in all user-related queries
**Estimated Fix Time:** 5-10 minutes
**Testing Time:** 5 minutes

This is a **simple one-line fix** that will resolve the payment verification issue completely.
