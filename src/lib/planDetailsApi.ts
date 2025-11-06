/**
 * Plan Details API Service
 *
 * This file contains API service functions for fetching subscription plans.
 * It integrates with the Laravel backend APIs for plan management.
 *
 * API Base URL: http://127.0.0.1:8000
 *
 * Available Endpoints:
 * 1. GET /api/plan-details/popular - Get popular/top selling plans
 * 2. GET /api/plan-details/all - Get all active plans
 * 3. GET /api/plan-details/premium - Get premium (non-default) plans
 * 4. POST /api/plan-details - Get plan details by ID
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Plan Interface
 * Represents a subscription plan with all its features
 */
export interface Plan {
  plan_id: number;
  plan_name: string;
  plan_validity: number; // Validity in days
  plan_price: number; // Total price
  plan_discount: number; // Discount amount
  plan_price_registration: number; // Registration fee
  plan_price_service: number; // Service charge
  plan_top_sell: string; // "yes" or "no"
  plan_homepage: number; // Homepage display days
  plan_featured: number; // Featured display days
  plan_contactview: number; // Contact view limit
  plan_chat: number; // Chat limit
  plan_message: number; // Message limit
  plan_expressintrest: number; // Express interest limit
  plan_d_service: string; // Doorstep service "yes" or "no"
  plan_limit_interval: number; // Limit interval count
  plan_time_interval: number; // Time interval in hours
  interest_limit_interval: number; // Interest limit interval
  interest_time_interval: number; // Interest time interval
}

/**
 * API Response Interface
 * Generic response structure for all API calls
 */
interface ApiResponse<T> {
  status: 'success' | 'error' | 'failed';
  data?: T;
  message?: string;
}

/**
 * Get Popular Plans
 *
 * Fetches all popular/top selling plans.
 * These are plans marked with plan_top_sell = 'yes'
 *
 * @returns Promise<Plan[]> - Array of popular plans
 * @throws Error if the API call fails or returns an error
 *
 * @example
 * ```typescript
 * const popularPlans = await getPopularPlans();
 * console.log(`Found ${popularPlans.length} popular plans`);
 * ```
 */
export async function getPopularPlans(): Promise<Plan[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/plan-details/popular`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store', // Disable caching to get fresh data
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<Plan[]> = await response.json();

    if (result.status === 'success' && result.data) {
      return result.data;
    } else {
      throw new Error(result.message || 'Failed to fetch popular plans');
    }
  } catch (error) {
    console.error('Error fetching popular plans:', error);
    throw error;
  }
}

/**
 * Get All Plans
 *
 * Fetches all active plans available for subscription.
 * Includes both free and paid plans.
 *
 * @returns Promise<Plan[]> - Array of all active plans
 * @throws Error if the API call fails or returns an error
 *
 * @example
 * ```typescript
 * const allPlans = await getAllPlans();
 * const freePlans = allPlans.filter(p => p.plan_price === 0);
 * const paidPlans = allPlans.filter(p => p.plan_price > 0);
 * ```
 */
export async function getAllPlans(): Promise<Plan[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/plan-details/all`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store', // Disable caching to get fresh data
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<Plan[]> = await response.json();

    if (result.status === 'success' && result.data) {
      return result.data;
    } else {
      throw new Error(result.message || 'Failed to fetch plans');
    }
  } catch (error) {
    console.error('Error fetching all plans:', error);
    throw error;
  }
}

/**
 * Get Premium Plans
 *
 * Fetches all premium (non-default) plans.
 * Excludes the free/default plan.
 *
 * @returns Promise<Plan[]> - Array of premium plans
 * @throws Error if the API call fails or returns an error
 *
 * @example
 * ```typescript
 * const premiumPlans = await getPremiumPlans();
 * premiumPlans.forEach(plan => {
 *   console.log(`${plan.plan_name}: ₹${plan.plan_price}`);
 * });
 * ```
 */
export async function getPremiumPlans(): Promise<Plan[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/plan-details/premium`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store', // Disable caching to get fresh data
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<Plan[]> = await response.json();

    if (result.status === 'success' && result.data) {
      return result.data;
    } else {
      throw new Error(result.message || 'Failed to fetch premium plans');
    }
  } catch (error) {
    console.error('Error fetching premium plans:', error);
    throw error;
  }
}

/**
 * Get Plan Details by ID
 *
 * Fetches detailed information about a specific plan using its ID.
 *
 * @param planId - The ID of the plan to fetch
 * @returns Promise<Plan> - The plan details
 * @throws Error if the API call fails, plan not found, or returns an error
 *
 * @example
 * ```typescript
 * const plan = await getPlanDetails(5);
 * console.log(`Plan: ${plan.plan_name}, Price: ₹${plan.plan_price}`);
 * ```
 */
export async function getPlanDetails(planId: number): Promise<Plan> {
  try {
    const response = await fetch(`${API_BASE_URL}/plan-details`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ plan_id: planId }),
      cache: 'no-store', // Disable caching to get fresh data
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<Plan[]> = await response.json();

    if (result.status === 'success' && result.data && result.data.length > 0) {
      return result.data[0]; // API returns array, we return first element
    } else {
      throw new Error(result.message || 'Plan not found');
    }
  } catch (error) {
    console.error('Error fetching plan details:', error);
    throw error;
  }
}

/**
 * Helper Functions
 */

/**
 * Format Plan Price
 *
 * Formats plan price in Indian Rupees with currency symbol
 *
 * @param price - The price to format
 * @returns Formatted price string
 *
 * @example
 * ```typescript
 * formatPrice(3500); // Returns "₹3,500"
 * formatPrice(0); // Returns "Free"
 * ```
 */
export function formatPrice(price: number): string {
  if (price === 0) {
    return 'Free';
  }
  return `₹${price.toLocaleString('en-IN')}`;
}

/**
 * Format Plan Validity
 *
 * Formats plan validity period in human-readable format
 *
 * @param days - Number of days
 * @returns Formatted validity string
 *
 * @example
 * ```typescript
 * formatValidity(365); // Returns "1 Year"
 * formatValidity(90); // Returns "3 Months"
 * formatValidity(30); // Returns "1 Month"
 * formatValidity(15); // Returns "15 Days"
 * ```
 */
export function formatValidity(days: number): string {
  if (days >= 365) {
    const years = Math.floor(days / 365);
    return years === 1 ? '1 Year' : `${years} Years`;
  } else if (days >= 30) {
    const months = Math.floor(days / 30);
    return months === 1 ? '1 Month' : `${months} Months`;
  } else {
    return days === 1 ? '1 Day' : `${days} Days`;
  }
}

/**
 * Calculate Discount Percentage
 *
 * Calculates the discount percentage from original and discounted prices
 *
 * @param originalPrice - Original price before discount
 * @param discountAmount - Discount amount
 * @returns Discount percentage
 *
 * @example
 * ```typescript
 * calculateDiscountPercentage(5000, 1500); // Returns 30
 * ```
 */
export function calculateDiscountPercentage(
  originalPrice: number,
  discountAmount: number
): number {
  if (originalPrice === 0) return 0;
  return Math.round((discountAmount / originalPrice) * 100);
}

/**
 * Get Plan Features
 *
 * Extracts and formats key features of a plan
 *
 * @param plan - The plan object
 * @returns Array of feature strings
 *
 * @example
 * ```typescript
 * const features = getPlanFeatures(plan);
 * // Returns: ["100 Contact Views", "200 Messages", "200 Chats", ...]
 * ```
 */
export function getPlanFeatures(plan: Plan): string[] {
  const features: string[] = [];

  if (plan.plan_contactview > 0) {
    features.push(`${plan.plan_contactview} Contact Views`);
  }

  if (plan.plan_message > 0) {
    features.push(`${plan.plan_message} Messages`);
  }

  if (plan.plan_chat > 0) {
    features.push(`${plan.plan_chat} Chats`);
  }

  if (plan.plan_expressintrest > 0) {
    features.push(`${plan.plan_expressintrest} Express Interests`);
  }

  if (plan.plan_featured > 0) {
    features.push(`Featured for ${plan.plan_featured} days`);
  }

  if (plan.plan_homepage > 0) {
    features.push(`Homepage listing for ${plan.plan_homepage} days`);
  }

  if (plan.plan_d_service === 'yes') {
    features.push('Doorstep Service Included');
  }

  return features;
}

/**
 * Is Plan Popular
 *
 * Checks if a plan is marked as popular/top selling
 *
 * @param plan - The plan object
 * @returns Boolean indicating if plan is popular
 */
export function isPlanPopular(plan: Plan): boolean {
  return plan.plan_top_sell === 'yes';
}

/**
 * Sort Plans by Price
 *
 * Sorts plans array by price (ascending or descending)
 *
 * @param plans - Array of plans
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array of plans
 */
export function sortPlansByPrice(
  plans: Plan[],
  order: 'asc' | 'desc' = 'asc'
): Plan[] {
  return [...plans].sort((a, b) => {
    return order === 'asc'
      ? a.plan_price - b.plan_price
      : b.plan_price - a.plan_price;
  });
}

/**
 * Sort Plans by Validity
 *
 * Sorts plans array by validity period (ascending or descending)
 *
 * @param plans - Array of plans
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array of plans
 */
export function sortPlansByValidity(
  plans: Plan[],
  order: 'asc' | 'desc' = 'asc'
): Plan[] {
  return [...plans].sort((a, b) => {
    return order === 'asc'
      ? a.plan_validity - b.plan_validity
      : b.plan_validity - a.plan_validity;
  });
}
