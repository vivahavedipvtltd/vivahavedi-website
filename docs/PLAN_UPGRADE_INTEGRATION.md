# Plan Upgrade & Razorpay Payment Integration Documentation

## Overview

This document provides comprehensive documentation for the plan upgrade functionality integrated into the Vivahavedi Matrimonial Website. The implementation includes Razorpay payment gateway integration for secure payment processing.

**Date:** October 5, 2025
**Version:** 1.0
**Laravel API Port:** 8000
**Next.js App Port:** 3000

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [API Endpoints](#api-endpoints)
3. [Frontend Implementation](#frontend-implementation)
4. [Razorpay Integration](#razorpay-integration)
5. [File Structure](#file-structure)
6. [Usage Guide](#usage-guide)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)
9. [Future Enhancements](#future-enhancements)

---

## Architecture Overview

### Components

The plan upgrade system consists of three main layers:

1. **Backend API (Laravel)** - Running on port 8000
   - Handles payment processing
   - Manages order creation and verification
   - Stores order history
   - Activates user plans

2. **Frontend (Next.js)** - Running on port 3000
   - Displays available plans
   - Handles Razorpay checkout
   - Manages payment verification
   - Shows order history

3. **Payment Gateway (Razorpay)**
   - Processes payments securely
   - Generates payment signatures
   - Handles payment callbacks

### Data Flow

```
User Selects Plan
    ↓
Create Order API (Laravel)
    ↓
Razorpay Order Created
    ↓
User Completes Payment (Razorpay Checkout)
    ↓
Payment Success Callback
    ↓
Verify Payment API (Laravel)
    ↓
Plan Activated
    ↓
User Redirected to Dashboard
```

---

## API Endpoints

### 1. Get Premium Plans

**Endpoint:** `GET http://localhost:8000/api/plan-details/premium`

**Purpose:** Fetch all premium (paid) plans available for purchase

**Authentication:** Not required (Public API)

**Request:**
```bash
curl -X GET "http://localhost:8000/api/plan-details/premium" \
  -H "Accept: application/json"
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "plan_id": 4,
      "plan_name": "SILVER",
      "plan_validity": 90,
      "plan_price": 1900,
      "plan_discount": 0,
      "plan_price_registration": 1900,
      "plan_price_service": 0,
      "plan_top_sell": "no",
      "plan_homepage": 0,
      "plan_featured": 0,
      "plan_contactview": 25,
      "plan_chat": 150,
      "plan_message": 150,
      "plan_expressintrest": 150,
      "plan_d_service": "no",
      "plan_limit_interval": 9,
      "plan_time_interval": 6,
      "interest_limit_interval": 0,
      "interest_time_interval": 0
    }
  ]
}
```

### 2. Get Plan Details by ID

**Endpoint:** `POST http://localhost:8000/api/plan-details`

**Purpose:** Fetch detailed information about a specific plan

**Authentication:** Not required (Public API)

**Request:**
```bash
curl -X POST "http://localhost:8000/api/plan-details" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"plan_id": 5}'
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "plan_id": 5,
      "plan_name": "DIAMOND",
      "plan_validity": 365,
      "plan_price": 3500,
      // ... other plan details
    }
  ]
}
```

### 3. Create Order

**Endpoint:** `POST http://localhost:8000/api/plan-upgrade/create-order`

**Purpose:** Create a Razorpay order for plan purchase

**Authentication:** Required (Bearer Token)

**Request:**
```bash
curl -X POST "http://localhost:8000/api/plan-upgrade/create-order" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "plan_id": 5,
    "from": "web"
  }'
```

**Request Parameters:**
- `plan_id` (integer, required): The ID of the plan to purchase
- `from` (string, required): Source of purchase ("app" or "web")

**Response:**
```json
{
  "status": "success",
  "message": "Order created successfully",
  "data": {
    "order_id": "order_Nk3AbCdEfGhIjK",
    "amount": 3500,
    "currency": "INR",
    "key_id": "rzp_test_xxxxx",
    "plan_name": "DIAMOND",
    "po_id": 123
  }
}
```

**Response Fields:**
- `order_id`: Razorpay order ID (use this in payment checkout)
- `amount`: Order amount in rupees
- `currency`: Currency code (INR)
- `key_id`: Razorpay public key (use in frontend)
- `plan_name`: Name of the plan
- `po_id`: Plan order ID in database

### 4. Verify Payment

**Endpoint:** `POST http://localhost:8000/api/plan-upgrade/verify-payment`

**Purpose:** Verify Razorpay payment signature and activate plan

**Authentication:** Required (Bearer Token)

**Request:**
```bash
curl -X POST "http://localhost:8000/api/plan-upgrade/verify-payment" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "razorpay_order_id": "order_Nk3AbCdEfGhIjK",
    "razorpay_payment_id": "pay_Nk3LmNoPqRsTuV",
    "razorpay_signature": "abc123def456ghi789..."
  }'
```

**Request Parameters:**
- `razorpay_order_id` (string, required): Order ID from create order response
- `razorpay_payment_id` (string, required): Payment ID from Razorpay
- `razorpay_signature` (string, required): Payment signature from Razorpay

**Response:**
```json
{
  "status": "success",
  "message": "Payment verified successfully",
  "data": {
    "payment_id": "pay_Nk3LmNoPqRsTuV",
    "order_id": "order_Nk3AbCdEfGhIjK"
  }
}
```

**What Happens on Successful Verification:**
1. Order status updated to "success"
2. Order approval set to 1
3. User's plan updated to purchased plan
4. Plan validity set for 1 year from current date

### 5. Get Order History

**Endpoint:** `GET http://localhost:8000/api/plan-upgrade/order-history`

**Purpose:** Fetch user's order history

**Authentication:** Required (Bearer Token)

**Request:**
```bash
curl -X GET "http://localhost:8000/api/plan-upgrade/order-history" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer {token}"
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "po_id": 123,
      "plan_name": "DIAMOND",
      "po_tr_amount": 3500.00,
      "po_date": "2025-10-04",
      "po_time": "14:30:25",
      "po_tr_status": "success",
      "po_approval": 1,
      "po_gateway": "razorpay"
    }
  ]
}
```

---

## Frontend Implementation

### API Helper Functions

Location: `src/lib/planDetailsApi.ts` and `src/lib/planUpgradeApi.ts`

#### Plan Details API Functions

```typescript
import {
  getPremiumPlans,
  getAllPlans,
  getPlanDetails,
  Plan
} from '@/lib/planDetailsApi';

// Fetch premium plans
const plans = await getPremiumPlans();

// Fetch all plans
const allPlans = await getAllPlans();

// Fetch specific plan
const plan = await getPlanDetails(5);
```

#### Plan Upgrade API Functions

```typescript
import {
  createOrder,
  verifyPayment,
  getOrderHistory
} from '@/lib/planUpgradeApi';

// Create order
const orderData = await createOrder(token, planId, 'web');

// Verify payment
const result = await verifyPayment(
  token,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature
);

// Get order history
const history = await getOrderHistory(token);
```

### Pages

#### 1. Packages Page

**Location:** `src/app/packages/page.tsx`

**Purpose:** Public-facing page showing all available plans

**Features:**
- Displays all plans (free and premium)
- Shows plan features and pricing
- Redirects to login if user not authenticated
- Redirects to plan upgrade page for premium plans

**URL:** `http://localhost:3000/packages`

#### 2. Plan Upgrade Page

**Location:** `src/app/dashboard/settings/plan-upgrade/page.tsx`

**Purpose:** Authenticated users can upgrade their plan

**Features:**
- Displays premium plans only
- Integrates Razorpay checkout
- Handles payment verification
- Shows success/error messages
- Redirects to dashboard on success

**URL:** `http://localhost:3000/dashboard/settings/plan-upgrade`

**Access:** Requires authentication

---

## Razorpay Integration

### Setup

1. **Razorpay Account**
   - Sign up at https://razorpay.com
   - Get API keys from Dashboard → Settings → API Keys

2. **Environment Variables (Laravel)**

   Add to `.env` file:
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. **Razorpay Script (Next.js)**

   Loaded dynamically in the component:
   ```typescript
   useEffect(() => {
     const script = document.createElement('script');
     script.src = 'https://checkout.razorpay.com/v1/checkout.js';
     script.async = true;
     script.onload = () => setRazorpayLoaded(true);
     document.body.appendChild(script);
   }, []);
   ```

### Payment Flow

```typescript
// 1. Create Order
const orderData = await createOrder(token, plan.plan_id, 'web');

// 2. Configure Razorpay
const options = {
  key: orderData.key_id,
  amount: orderData.amount * 100, // Convert to paise
  currency: orderData.currency,
  name: 'Vivahavedi Matrimony',
  description: `${orderData.plan_name} Plan Upgrade`,
  order_id: orderData.order_id,
  handler: async function (response) {
    // 3. Verify Payment
    await verifyPayment(
      token,
      response.razorpay_order_id,
      response.razorpay_payment_id,
      response.razorpay_signature
    );
  },
  theme: { color: '#ef4444' }
};

// 4. Open Razorpay Checkout
const razorpay = new window.Razorpay(options);
razorpay.open();
```

### Security

1. **Payment Signature Verification**
   - Done on backend using Razorpay SDK
   - Prevents tampering with payment data
   - Signature verified before plan activation

2. **Authentication**
   - All payment APIs require authentication
   - Users can only verify their own orders
   - Tokens validated on backend

3. **Environment Variables**
   - API credentials stored in `.env`
   - Never exposed to frontend
   - Public key sent only when needed

---

## File Structure

```
matrimonial-website/
├── src/
│   ├── app/
│   │   ├── packages/
│   │   │   └── page.tsx                      # Public packages page
│   │   └── dashboard/
│   │       └── settings/
│   │           └── plan-upgrade/
│   │               └── page.tsx               # Authenticated plan upgrade page
│   └── lib/
│       ├── planDetailsApi.ts                  # Plan details API functions
│       └── planUpgradeApi.ts                  # Plan upgrade API functions
└── PLAN_UPGRADE_INTEGRATION.md               # This documentation

vivahavedi-laravel-api/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       ├── PlanDetailsController.php      # Plan details endpoints
│   │       └── PlanUpgradeController.php      # Plan upgrade endpoints
│   └── Models/
│       ├── Plan.php                           # Plan model
│       └── PlanOrder.php                      # Order model
├── routes/
│   └── api.php                                # API routes
└── .env                                       # Razorpay credentials
```

---

## Usage Guide

### For Users

#### Viewing Plans

1. Navigate to `/packages` page
2. Browse available plans
3. Compare features and pricing
4. Click "Choose Plan" button

#### Upgrading Plan

1. Login to your account
2. Select a plan from packages page
3. You'll be redirected to plan upgrade page
4. Click "Upgrade Now" on desired plan
5. Razorpay checkout will open
6. Complete payment
7. Plan will be activated automatically

### For Developers

#### Adding a New Plan (Backend)

1. Go to Laravel admin panel or database
2. Add new record to `plan_details` table
3. Set `plan_activation = 'yes'`
4. Set pricing and features

#### Customizing Payment Success Action

Edit `src/app/dashboard/settings/plan-upgrade/page.tsx`:

```typescript
handler: async function (response: any) {
  try {
    await verifyPayment(
      token!,
      response.razorpay_order_id,
      response.razorpay_payment_id,
      response.razorpay_signature
    );

    showSuccess('Payment successful!');

    // Add custom actions here
    // Example: Send notification, update analytics, etc.

    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  } catch (error) {
    showError('Payment verification failed');
  }
}
```

#### Customizing Plan Display

Edit plan card styling in `/packages/page.tsx` or `/dashboard/settings/plan-upgrade/page.tsx`:

```typescript
<div className="bg-white rounded-2xl shadow-lg ...">
  {/* Customize plan card layout */}
</div>
```

---

## Testing

### Test Mode

Razorpay provides test mode for development:

**Test Cards:**
- Card Number: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

**Test UPI:**
- UPI ID: success@razorpay
- Result: Success

**Test Credentials (use in .env):**
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Testing Checklist

- [ ] Plans load correctly on packages page
- [ ] Authentication required for upgrade
- [ ] Razorpay checkout opens
- [ ] Test payment succeeds
- [ ] Payment verification works
- [ ] Plan activated in database
- [ ] User redirected to dashboard
- [ ] Order appears in history
- [ ] Error handling works

### Manual Testing Steps

1. **View Plans**
   ```
   http://localhost:3000/packages
   ```

2. **Login**
   ```
   http://localhost:3000/login
   ```

3. **Upgrade Plan**
   ```
   http://localhost:3000/dashboard/settings/plan-upgrade
   ```

4. **Check Order History**
   ```
   GET http://localhost:8000/api/plan-upgrade/order-history
   Headers: Authorization: Bearer {token}
   ```

---

## Troubleshooting

### Common Issues

#### 1. "Payment gateway not configured" Error

**Cause:** Razorpay credentials missing in `.env`

**Solution:**
```env
# Add to Laravel .env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### 2. Razorpay Checkout Not Opening

**Cause:** Razorpay script not loaded

**Solution:** Check browser console for script errors. Ensure internet connection is active.

#### 3. Payment Verification Failed

**Cause:** Invalid signature or order not found

**Solutions:**
- Check if order was created successfully
- Verify Razorpay credentials are correct
- Ensure order belongs to authenticated user

#### 4. CORS Errors

**Cause:** Frontend and backend on different domains

**Solution (Laravel):**
```php
// config/cors.php
'allowed_origins' => ['http://localhost:3000'],
```

#### 5. "Plan not found" Error

**Cause:** Plan doesn't exist or is not activated

**Solution:**
- Check `plan_activation = 'yes'` in database
- Verify plan_id is correct

### Debug Mode

Enable detailed error messages:

**Laravel (.env):**
```env
APP_DEBUG=true
APP_ENV=local
```

**Next.js:**
```typescript
// Add console logs in API functions
console.log('Order Data:', orderData);
console.log('Verification Result:', result);
```

---

## Future Enhancements

### Planned Features

1. **Order History Page**
   - Dedicated page to view past orders
   - Download invoices
   - Refund requests

2. **Plan Comparison**
   - Side-by-side plan comparison
   - Feature matrix
   - Recommendations based on usage

3. **Subscription Management**
   - Auto-renewal option
   - Cancel subscription
   - Upgrade/downgrade plans

4. **Payment Methods**
   - Save cards for future use
   - Multiple payment gateways
   - Wallet integration

5. **Promotional Features**
   - Discount codes
   - Referral discounts
   - Seasonal offers

### Code Improvements

1. **TypeScript Enhancements**
   - Stricter type checking
   - Better error types
   - API response interfaces

2. **Error Handling**
   - Retry mechanisms
   - Better error messages
   - Fallback options

3. **Performance**
   - Plan caching
   - Optimistic UI updates
   - Loading skeletons

4. **Testing**
   - Unit tests for API functions
   - Integration tests
   - E2E tests with Playwright

---

## API Reference Summary

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/plan-details/premium` | GET | No | Get premium plans |
| `/api/plan-details/all` | GET | No | Get all plans |
| `/api/plan-details` | POST | No | Get plan by ID |
| `/api/plan-upgrade/create-order` | POST | Yes | Create Razorpay order |
| `/api/plan-upgrade/verify-payment` | POST | Yes | Verify payment |
| `/api/plan-upgrade/order-history` | GET | Yes | Get order history |

---

## Support

For issues or questions:

1. Check this documentation
2. Review Laravel API documentation: `user-website-api-documentation-part3.md`
3. Check Razorpay documentation: https://razorpay.com/docs
4. Contact development team

---

## Known Issues

### ⚠️ Payment Verification Bug (Laravel Backend)

**Status:** Requires Laravel backend fix
**Severity:** Critical
**File:** `LARAVEL_BUG_FIX_REQUIRED.md` (detailed fix instructions)

**Issue:** The Laravel `PlanUpgradeController` uses wrong table name (`users` instead of `user_details`)

**Impact:**
- Payment collection works ✅
- Order creation works ✅
- **Payment verification fails** ❌
- Plan activation doesn't work ❌

**Fix Required:**
Laravel developer needs to change table name from `users` to `user_details` in `PlanUpgradeController.php`

**See:** `LARAVEL_BUG_FIX_REQUIRED.md` for complete fix instructions

---

## Changelog

### Version 1.0 (October 5, 2025)
- Initial implementation
- Razorpay integration
- Plan upgrade pages
- API helper functions
- Documentation created
- Bug identified in Laravel backend (requires backend fix)

---

**Last Updated:** October 5, 2025
**Maintained By:** Development Team
**Laravel API:** http://localhost:8000
**Next.js App:** http://localhost:3000
