# Plan Details API Integration Documentation

## Overview

This document provides comprehensive documentation for the Plan Details API integration in the Next.js frontend application. The integration connects to the Laravel backend APIs to fetch and display subscription plans.

**Created:** January 2025
**Last Updated:** January 2025
**Version:** 1.0.0

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [API Endpoints](#api-endpoints)
3. [Implementation Files](#implementation-files)
4. [Data Flow](#data-flow)
5. [API Service Functions](#api-service-functions)
6. [Frontend Integration](#frontend-integration)
7. [Error Handling](#error-handling)
8. [Testing](#testing)
9. [Future Enhancements](#future-enhancements)
10. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

### Technology Stack

**Backend:**
- **Framework:** Laravel (PHP)
- **Database:** MySQL
- **API Type:** RESTful JSON API
- **Port:** 8000 (http://127.0.0.1:8000)

**Frontend:**
- **Framework:** Next.js 14+ (React)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **HTTP Client:** Native Fetch API

### System Architecture

```
┌─────────────────────────────────────┐
│         Next.js Frontend            │
│      (Port: 3000 or similar)        │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Packages Page             │   │
│  │   (/packages)               │   │
│  └─────────────────────────────┘   │
│              ↓                      │
│  ┌─────────────────────────────┐   │
│  │   API Service Layer         │   │
│  │   (planDetailsApi.ts)       │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
              ↓ HTTP/JSON
┌─────────────────────────────────────┐
│        Laravel Backend              │
│         (Port: 8000)                │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  PlanDetailsController      │   │
│  └─────────────────────────────┘   │
│              ↓                      │
│  ┌─────────────────────────────┐   │
│  │   Models & Database         │   │
│  │   - Plan                    │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## API Endpoints

### 1. Get Popular Plans

Fetches all popular/top selling plans.

**Endpoint:** `GET /api/plan-details/popular`

**Request:**
- **Method:** GET
- **Headers:**
  - `Accept: application/json`
- **Authentication:** Not required (Public API)

**Success Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "plan_id": 5,
      "plan_name": "DIAMOND",
      "plan_validity": 365,
      "plan_price": 3500,
      "plan_discount": 0,
      "plan_price_registration": 3500,
      "plan_price_service": 0,
      "plan_top_sell": "yes",
      "plan_homepage": 0,
      "plan_featured": 300,
      "plan_contactview": 100,
      "plan_chat": 200,
      "plan_message": 200,
      "plan_expressintrest": 200,
      "plan_d_service": "no",
      "plan_limit_interval": 20,
      "plan_time_interval": 6,
      "interest_limit_interval": 0,
      "interest_time_interval": 0
    }
  ]
}
```

**Response Fields:**
- `plan_id` (integer): Unique plan identifier
- `plan_name` (string): Name of the plan (e.g., "DIAMOND", "GOLD", "SILVER")
- `plan_validity` (integer): Validity period in days
- `plan_price` (integer): Total plan price in rupees
- `plan_discount` (integer): Discount amount
- `plan_price_registration` (integer): Registration fee
- `plan_price_service` (integer): Additional service charge
- `plan_top_sell` (string): "yes" if top selling, "no" otherwise
- `plan_homepage` (integer): Homepage display days
- `plan_featured` (integer): Featured profile display days
- `plan_contactview` (integer): Number of contact views allowed
- `plan_chat` (integer): Number of chats allowed
- `plan_message` (integer): Number of messages allowed
- `plan_expressintrest` (integer): Number of express interests allowed
- `plan_d_service` (string): "yes" if doorstep service included
- `plan_limit_interval` (integer): Limit interval count
- `plan_time_interval` (integer): Time interval in hours
- `interest_limit_interval` (integer): Interest limit interval
- `interest_time_interval` (integer): Interest time interval

**Database Table:** `plan_details`

**Query Filter:** `plan_top_sell = 'yes' AND plan_activation = 'yes'`

---

### 2. Get All Plans

Fetches all active plans (including free and paid).

**Endpoint:** `GET /api/plan-details/all`

**Request:**
- **Method:** GET
- **Headers:**
  - `Accept: application/json`
- **Authentication:** Not required (Public API)

**Success Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "plan_id": 1,
      "plan_name": "Free Plan",
      "plan_validity": 365,
      "plan_price": 0,
      "plan_discount": 0,
      "plan_price_registration": 0,
      "plan_price_service": 0,
      "plan_top_sell": "",
      "plan_homepage": 0,
      "plan_featured": 0,
      "plan_contactview": 0,
      "plan_chat": 0,
      "plan_message": 0,
      "plan_expressintrest": 100,
      "plan_d_service": "no",
      "plan_limit_interval": 0,
      "plan_time_interval": 0,
      "interest_limit_interval": 0,
      "interest_time_interval": 0
    }
  ]
}
```

**Database Table:** `plan_details`

**Query Filter:** `plan_activation = 'yes'`

---

### 3. Get Premium Plans

Fetches all premium (non-default/paid) plans.

**Endpoint:** `GET /api/plan-details/premium`

**Request:**
- **Method:** GET
- **Headers:**
  - `Accept: application/json`
- **Authentication:** Not required (Public API)

**Success Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "plan_id": 4,
      "plan_name": "SILVER",
      "plan_validity": 90,
      "plan_price": 1900,
      // ... other fields
    }
  ]
}
```

**Database Table:** `plan_details`

**Query Filter:** `plan_default = 'no' AND plan_activation = 'yes'`

---

### 4. Get Plan Details by ID

Fetches detailed information about a specific plan.

**Endpoint:** `POST /api/plan-details`

**Request:**
- **Method:** POST
- **Headers:**
  - `Accept: application/json`
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "plan_id": 5
  }
  ```
- **Authentication:** Not required (Public API)

**Success Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "plan_id": 5,
      "plan_name": "DIAMOND",
      // ... all fields
    }
  ]
}
```

**Error Response (404):**
```json
{
  "status": "error",
  "message": "Plan not found"
}
```

**Error Response (422):**
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": {
    "plan_id": ["The plan id field is required."]
  }
}
```

---

## Implementation Files

### 1. API Service Layer

**File:** `src/lib/planDetailsApi.ts`

**Purpose:** Provides reusable API service functions for fetching plan data.

**Exports:**

**Main Functions:**
- `getPopularPlans()` - Fetch popular/top selling plans
- `getAllPlans()` - Fetch all active plans
- `getPremiumPlans()` - Fetch premium (paid) plans
- `getPlanDetails(planId)` - Fetch specific plan by ID

**Helper Functions:**
- `formatPrice(price)` - Format price in Indian Rupees
- `formatValidity(days)` - Format validity period
- `calculateDiscountPercentage(original, discount)` - Calculate discount %
- `getPlanFeatures(plan)` - Extract key features
- `isPlanPopular(plan)` - Check if plan is popular
- `sortPlansByPrice(plans, order)` - Sort plans by price
- `sortPlansByValidity(plans, order)` - Sort plans by validity

**Interfaces:**
```typescript
interface Plan {
  plan_id: number;
  plan_name: string;
  plan_validity: number;
  plan_price: number;
  plan_discount: number;
  plan_price_registration: number;
  plan_price_service: number;
  plan_top_sell: string;
  plan_homepage: number;
  plan_featured: number;
  plan_contactview: number;
  plan_chat: number;
  plan_message: number;
  plan_expressintrest: number;
  plan_d_service: string;
  plan_limit_interval: number;
  plan_time_interval: number;
  interest_limit_interval: number;
  interest_time_interval: number;
}
```

### 2. Frontend Page

**File:** `src/app/packages/page.tsx`

**Purpose:** Display subscription plans with features comparison and pricing.

**Features:**
- Fetches and displays premium plans
- Visual plan cards with pricing and features
- Popular plan badges
- Feature comparison table
- Responsive design
- Loading states and error handling
- FAQ section

---

## Data Flow

### Initial Page Load

1. **User navigates to `/packages`**
   - Next.js renders the Packages page component

2. **useEffect Hook Triggers**
   - Calls `fetchPlans()` function on component mount

3. **API Call**
   ```typescript
   const premiumPlans = await getPremiumPlans();
   ```

4. **API Request**
   - `GET http://127.0.0.1:8000/api/plan-details/premium`

5. **Backend Processing**
   - Laravel routes request to `PlanDetailsController`
   - Controller queries `plan_details` table
   - Filters: `plan_default = 'no' AND plan_activation = 'yes'`
   - Returns JSON response

6. **Frontend Updates**
   - Updates state with fetched plans
   - Renders plan cards in grid layout
   - Displays features comparison table

### State Management

```typescript
// Loading state - shows spinner
const [loading, setLoading] = useState(true);

// Plans data state
const [plans, setPlans] = useState<Plan[]>([]);

// Error state - shows error message
const [error, setError] = useState<string | null>(null);
```

---

## API Service Functions

### getPopularPlans()

**Purpose:** Fetches popular/top selling plans.

**Usage:**
```typescript
import { getPopularPlans } from '@/lib/planDetailsApi';

const popularPlans = await getPopularPlans();
console.log(`Found ${popularPlans.length} popular plans`);
```

**Return Type:** `Promise<Plan[]>`

---

### getAllPlans()

**Purpose:** Fetches all active plans (free + paid).

**Usage:**
```typescript
import { getAllPlans } from '@/lib/planDetailsApi';

const allPlans = await getAllPlans();
const freePlans = allPlans.filter(p => p.plan_price === 0);
const paidPlans = allPlans.filter(p => p.plan_price > 0);
```

**Return Type:** `Promise<Plan[]>`

---

### getPremiumPlans()

**Purpose:** Fetches premium (paid) plans only.

**Usage:**
```typescript
import { getPremiumPlans } from '@/lib/planDetailsApi';

const premiumPlans = await getPremiumPlans();
premiumPlans.forEach(plan => {
  console.log(`${plan.plan_name}: ₹${plan.plan_price}`);
});
```

**Return Type:** `Promise<Plan[]>`

---

### getPlanDetails(planId)

**Purpose:** Fetches specific plan by ID.

**Usage:**
```typescript
import { getPlanDetails } from '@/lib/planDetailsApi';

const plan = await getPlanDetails(5);
console.log(`Plan: ${plan.plan_name}, Price: ₹${plan.plan_price}`);
```

**Parameters:**
- `planId` (number): The plan ID to fetch

**Return Type:** `Promise<Plan>`

---

### Helper Functions

#### formatPrice(price)

Formats plan price with currency symbol.

**Example:**
```typescript
formatPrice(3500); // Returns "₹3,500"
formatPrice(0);    // Returns "Free"
```

#### formatValidity(days)

Formats validity period in human-readable format.

**Example:**
```typescript
formatValidity(365); // Returns "1 Year"
formatValidity(90);  // Returns "3 Months"
formatValidity(30);  // Returns "1 Month"
formatValidity(15);  // Returns "15 Days"
```

#### getPlanFeatures(plan)

Extracts key features from plan object.

**Example:**
```typescript
const features = getPlanFeatures(plan);
// Returns: [
//   "100 Contact Views",
//   "200 Messages",
//   "200 Chats",
//   "200 Express Interests",
//   "Featured for 300 days"
// ]
```

---

## Frontend Integration

### Component Structure

```typescript
export default function PackagesPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);
        const premiumPlans = await getPremiumPlans();
        setPlans(premiumPlans);
      } catch (err) {
        setError('Unable to load plans...');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    // JSX rendering
  );
}
```

### UI States

#### Loading State
```typescript
{loading && (
  <div className="flex justify-center py-20">
    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600"></div>
    <p>Loading plans...</p>
  </div>
)}
```

#### Error State
```typescript
{error && (
  <div className="bg-red-50 border border-red-200 rounded-lg p-8">
    <p className="text-red-600">{error}</p>
    <button onClick={() => window.location.reload()}>Retry</button>
  </div>
)}
```

#### Success State - Plan Cards
```typescript
{plans.map((plan) => (
  <div key={plan.plan_id} className="bg-white rounded-2xl shadow-lg">
    {/* Plan header with price */}
    <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-8">
      <h3>{plan.plan_name}</h3>
      <span>{formatPrice(plan.plan_price)}</span>
      <p>Valid for {formatValidity(plan.plan_validity)}</p>
    </div>

    {/* Plan features */}
    <div className="p-8">
      <ul>
        {getPlanFeatures(plan).map(feature => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
      <button>Choose Plan</button>
    </div>
  </div>
))}
```

---

## Error Handling

### API Service Layer

**Network Errors:**
```typescript
try {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
} catch (error) {
  console.error('Error fetching plans:', error);
  throw error;
}
```

**API Error Responses:**
```typescript
const result = await response.json();
if (result.status === 'success' && result.data) {
  return result.data;
} else {
  throw new Error(result.message || 'Failed to fetch plans');
}
```

### Frontend Component

**Error Display:**
```typescript
catch (err) {
  console.error('Error fetching plans:', err);
  setError('Unable to load subscription plans. Please try again later.');
}
```

---

## Testing

### Manual Testing Checklist

1. **Plans Loading**
   - [ ] Navigate to `/packages`
   - [ ] Verify loading spinner appears
   - [ ] Verify plans display correctly
   - [ ] Verify popular badges show on top-selling plans
   - [ ] Verify pricing displays correctly

2. **Features Display**
   - [ ] Verify all plan features are listed
   - [ ] Verify feature comparison table works
   - [ ] Verify doorstep service indicator shows correctly
   - [ ] Verify validity period formats correctly

3. **Error Handling**
   - [ ] Stop Laravel server and verify error message displays
   - [ ] Verify retry button works
   - [ ] Restart server and verify plans load

4. **Responsive Design**
   - [ ] Test on mobile (< 768px)
   - [ ] Test on tablet (768px - 1024px)
   - [ ] Test on desktop (> 1024px)
   - [ ] Verify plan grid adjusts correctly

### API Testing

**Using cURL:**

```bash
# Test premium plans
curl -X GET "http://127.0.0.1:8000/api/plan-details/premium" \
  -H "Accept: application/json"

# Test popular plans
curl -X GET "http://127.0.0.1:8000/api/plan-details/popular" \
  -H "Accept: application/json"

# Test plan details by ID
curl -X POST "http://127.0.0.1:8000/api/plan-details" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"plan_id": 5}'
```

---

## Future Enhancements

### Planned Features

1. **Payment Integration**
   - Integrate Razorpay payment gateway
   - Add "Choose Plan" button functionality
   - Implement order creation and verification

2. **Plan Comparison**
   - Add side-by-side comparison tool
   - Highlight differences between plans
   - Show value proposition

3. **Dynamic Pricing**
   - Show discounted prices
   - Display limited-time offers
   - Implement coupon code system

4. **User Recommendations**
   - Suggest plans based on user profile
   - Show most popular choice
   - Display recently upgraded users

5. **Plan Filtering**
   - Filter by price range
   - Filter by validity period
   - Filter by features

---

## Troubleshooting

### Common Issues

#### 1. API Connection Failed

**Symptom:** Error message "Unable to load subscription plans"

**Solutions:**
```bash
# Start Laravel backend
cd C:\wamp64\www\vivahavedi\vivahavedi-laravel-api
php artisan serve --port=8000

# Verify backend is running
curl http://127.0.0.1:8000/api/plan-details/premium
```

#### 2. No Plans Displayed

**Symptom:** "No plans available" message shows

**Possible Causes:**
- No plans in database with `plan_activation = 'yes'`
- Database connection issue
- Plans have `plan_default = 'yes'` (for premium endpoint)

**Solutions:**
- Check database for active plans
- Verify `plan_activation` field values
- Check Laravel logs for errors

#### 3. Incorrect Pricing Display

**Symptom:** Prices show as "NaN" or incorrect format

**Solution:**
- Verify `plan_price` is numeric in database
- Check `formatPrice()` function
- Ensure proper type conversion

---

## Maintenance Notes

### Regular Checks

1. **Weekly:**
   - Verify all API endpoints are responsive
   - Check plan data accuracy
   - Monitor API response times

2. **Monthly:**
   - Review and update plan pricing
   - Update featured plans
   - Verify feature descriptions

3. **Quarterly:**
   - Review API documentation for changes
   - Optimize API calls if needed
   - Update helper functions if required

---

## Contact

For questions or issues related to this integration:

**Development Team:**
- Email: dev@vivahavedi.com

**API Documentation:**
- Location: `C:\wamp64\www\vivahavedi\vivahavedi-laravel-api\user-website-api-documentation-part3.md`
- Sections: Plan Details APIs (Lines 177-497)

**Related Files:**
- Backend Controller: `app/Http/Controllers/PlanDetailsController.php`
- Backend Model: `app/Models/Plan.php`
- Frontend Service: `src/lib/planDetailsApi.ts`
- Frontend Page: `src/app/packages/page.tsx`

---

**Document Version:** 1.0.0
**Last Updated:** January 2025
**Author:** Development Team
