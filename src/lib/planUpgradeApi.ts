/**
 * Plan Upgrade API Service
 *
 * This file contains API service functions for upgrading subscription plans
 * and processing payments through Razorpay.
 * It integrates with the Laravel backend APIs for plan upgrade operations.
 *
 * API Base URL: http://localhost:8000
 *
 * Available Endpoints:
 * 1. POST /api/plan-upgrade/create-order - Create Razorpay order
 * 2. POST /api/plan-upgrade/verify-payment - Verify payment signature
 * 3. GET /api/plan-upgrade/order-history - Get user's order history
 *
 * Razorpay Integration:
 * - Razorpay is used as the payment gateway
 * - All amounts are in INR (Indian Rupees)
 * - Payment signature is verified on backend for security
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Create Order Response Interface
 */
export interface CreateOrderResponse {
  order_id: string; // Razorpay order ID
  amount: number; // Amount in rupees
  currency: string; // Currency code (INR)
  key_id: string; // Razorpay public key ID
  plan_name: string; // Name of the plan
  po_id: number; // Plan order ID in database
}

/**
 * Order History Item Interface
 */
export interface OrderHistoryItem {
  po_id: number; // Plan order ID
  plan_name: string; // Plan name
  po_tr_amount: number; // Transaction amount
  po_date: string; // Order date (YYYY-MM-DD)
  po_time: string; // Order time (HH:MM:SS)
  po_tr_status: 'created' | 'success' | 'failed'; // Transaction status
  po_approval: number; // Approval status (0/1)
  po_gateway: string; // Payment gateway used
}

/**
 * API Response Interface
 */
interface ApiResponse<T> {
  status: 'success' | 'error' | 'failed';
  data?: T;
  message?: string;
}

/**
 * Create Razorpay Order
 *
 * Creates a Razorpay order for plan upgrade/purchase.
 * The order must be created before initiating payment.
 *
 * @param token - User authentication token
 * @param planId - ID of the plan to purchase
 * @param from - Source of purchase ('app' or 'web')
 * @returns Promise<CreateOrderResponse> - Order details including Razorpay order ID
 * @throws Error if order creation fails
 *
 * @example
 * ```typescript
 * const order = await createOrder(token, 5, 'web');
 * // Use order.order_id and order.key_id to initiate Razorpay payment
 * ```
 */
export async function createOrder(
  token: string,
  planId: number,
  from: 'app' | 'web' = 'web'
): Promise<CreateOrderResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/plan-upgrade/create-order`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        plan_id: planId,
        from: from,
      }),
    });

    // Try to get the response body even if status is not ok
    const result: ApiResponse<CreateOrderResponse> = await response.json();

    if (!response.ok) {
      // Log the full error details
      console.error('Order creation failed:', {
        status: response.status,
        statusText: response.statusText,
        result
      });
      throw new Error(result.message || `HTTP error! status: ${response.status}`);
    }

    if (result.status === 'success' && result.data) {
      return result.data;
    } else {
      throw new Error(result.message || 'Failed to create order');
    }
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

/**
 * Verify Payment
 *
 * Verifies the Razorpay payment signature and updates order status.
 * This must be called after successful payment to activate the plan.
 *
 * @param token - User authentication token
 * @param razorpayOrderId - Razorpay order ID from create order response
 * @param razorpayPaymentId - Payment ID received from Razorpay
 * @param razorpaySignature - Payment signature for verification
 * @returns Promise<{payment_id: string, order_id: string}> - Verification result
 * @throws Error if verification fails
 *
 * @example
 * ```typescript
 * const result = await verifyPayment(
 *   token,
 *   'order_xyz',
 *   'pay_abc',
 *   'signature_123'
 * );
 * console.log('Payment verified:', result.payment_id);
 * ```
 */
export async function verifyPayment(
  token: string,
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): Promise<{ payment_id: string; order_id: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/plan-upgrade/verify-payment`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
      }),
    });

    // Try to get the response body even if status is not ok
    const result: ApiResponse<{ payment_id: string; order_id: string }> = await response.json();

    if (!response.ok) {
      // Log the full error details
      console.error('Payment verification failed:', {
        status: response.status,
        statusText: response.statusText,
        result
      });
      console.error('Backend error message:', result.message);
      console.error('Full result object:', JSON.stringify(result, null, 2));
      throw new Error(result.message || `HTTP error! status: ${response.status}`);
    }

    if (result.status === 'success' && result.data) {
      return result.data;
    } else {
      throw new Error(result.message || 'Payment verification failed');
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
}

/**
 * Get Order History
 *
 * Fetches the user's order history for plan purchases.
 * Returns all orders (both successful and pending/failed).
 *
 * @param token - User authentication token
 * @returns Promise<OrderHistoryItem[]> - Array of order history items
 * @throws Error if fetching order history fails
 *
 * @example
 * ```typescript
 * const history = await getOrderHistory(token);
 * const successfulOrders = history.filter(h => h.po_tr_status === 'success');
 * console.log(`You have ${successfulOrders.length} successful orders`);
 * ```
 */
export async function getOrderHistory(token: string): Promise<OrderHistoryItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/plan-upgrade/order-history`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<OrderHistoryItem[]> = await response.json();

    if (result.status === 'success') {
      return result.data || [];
    } else {
      throw new Error(result.message || 'Failed to fetch order history');
    }
  } catch (error) {
    console.error('Error fetching order history:', error);
    throw error;
  }
}

/**
 * Helper Functions
 */

/**
 * Format Order Date
 *
 * Formats order date and time in human-readable format
 *
 * @param date - Date string (YYYY-MM-DD)
 * @param time - Time string (HH:MM:SS)
 * @returns Formatted date-time string
 *
 * @example
 * ```typescript
 * formatOrderDate('2025-10-04', '14:30:25');
 * // Returns: "Oct 4, 2025 at 2:30 PM"
 * ```
 */
export function formatOrderDate(date: string, time: string): string {
  const dateTime = new Date(`${date}T${time}`);
  return dateTime.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get Order Status Badge
 *
 * Returns a status badge configuration for order status
 *
 * @param status - Order transaction status
 * @returns Object with text and color for status badge
 *
 * @example
 * ```typescript
 * const badge = getOrderStatusBadge('success');
 * // Returns: { text: 'Successful', color: 'green' }
 * ```
 */
export function getOrderStatusBadge(status: string): {
  text: string;
  color: 'green' | 'yellow' | 'red' | 'gray';
} {
  switch (status) {
    case 'success':
      return { text: 'Successful', color: 'green' };
    case 'created':
      return { text: 'Pending', color: 'yellow' };
    case 'failed':
      return { text: 'Failed', color: 'red' };
    default:
      return { text: 'Unknown', color: 'gray' };
  }
}

/**
 * Calculate Total Amount
 *
 * Calculates total amount to be paid including all charges
 *
 * @param planPrice - Plan price
 * @param discount - Discount amount
 * @param serviceCharge - Service charge
 * @returns Total amount
 */
export function calculateTotalAmount(
  planPrice: number,
  discount: number,
  serviceCharge: number
): number {
  return planPrice - discount + serviceCharge;
}

/**
 * Is Order Successful
 *
 * Checks if an order was successful and approved
 *
 * @param order - Order history item
 * @returns Boolean indicating if order is successful
 */
export function isOrderSuccessful(order: OrderHistoryItem): boolean {
  return order.po_tr_status === 'success' && order.po_approval === 1;
}

/**
 * Format Amount
 *
 * Formats amount in Indian Rupees with currency symbol
 *
 * @param amount - Amount to format
 * @returns Formatted amount string
 */
export function formatAmount(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
