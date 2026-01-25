'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import DashboardSidebar from '@/components/DashboardSidebar';
import {
  Crown,
  Check,
  Loader2,
  Star,
  MessageCircle,
  Eye,
  Heart,
  Shield,
  Zap
} from 'lucide-react';
import {
  getPremiumPlans,
  Plan,
  formatPrice,
  formatValidity,
  getPlanFeatures
} from '@/lib/planDetailsApi';
import { createOrder, verifyPayment } from '@/lib/planUpgradeApi';

// Declare Razorpay on window
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const PlanUpgradePage = () => {
  const router = useRouter();
  const { token } = useAuth();
  const { showSuccess, showError, showWarning } = useToast();

  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (token) {
      fetchPlans();
    }
  }, [token]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const premiumPlans = await getPremiumPlans();
      setPlans(premiumPlans);
    } catch (error) {
      console.error('Error fetching plans:', error);
      showError('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (plan: Plan) => {
    if (!razorpayLoaded) {
      showError('Payment gateway is loading. Please try again.');
      return;
    }

    setSelectedPlan(plan);
    setProcessingPayment(true);

    try {
      // Create order
      const orderData = await createOrder(token!, plan.plan_id, 'web');

      // Configure Razorpay options
      const options = {
        key: orderData.key_id,
        amount: orderData.amount * 100, // Convert to paise
        currency: orderData.currency,
        name: 'Vivahavedi Matrimony',
        description: `${orderData.plan_name} Plan Upgrade`,
        order_id: orderData.order_id,
        handler: async function (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
          try {
            // Verify payment
            await verifyPayment(
              token!,
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );

            showSuccess('Payment successful! Your plan has been upgraded.');

            // Redirect to dashboard after success
            setTimeout(() => {
              router.push('/dashboard');
            }, 2000);
          } catch (error) {
            console.error('Payment verification failed:', error);
            showError('Payment verification failed. Please contact support.');
          } finally {
            setProcessingPayment(false);
            setSelectedPlan(null);
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#ef4444'
        },
        modal: {
          ondismiss: function () {
            setProcessingPayment(false);
            setSelectedPlan(null);
            showWarning('Payment cancelled');
          }
        }
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error creating order:', error);
      showError('Failed to create order. Please try again.');
      setProcessingPayment(false);
      setSelectedPlan(null);
    }
  };

  const getPlanIcon = (index: number) => {
    const icons = [Shield, Star, Crown, Zap];
    const Icon = icons[index % icons.length];
    return <Icon className="h-8 w-8" />;
  };

  const getPlanColor = (index: number) => {
    const colors = [
      'from-blue-500 to-indigo-500',
      'from-yellow-500 to-orange-500',
      'from-purple-500 to-pink-500',
      'from-green-500 to-emerald-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <AuthGuard requireAuth={true} redirectTo="/login">
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />

        <div className="flex-grow flex">
          <DashboardSidebar
            activeSection="upgrade-plan"
            onSectionChange={(section) => {
              // Navigate to dashboard for sections handled there
              router.push('/dashboard');
            }}
          />

          <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              {/* Page Header */}
              <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl shadow-lg p-8 mb-8 text-white">
                <div className="flex items-center justify-center mb-4">
                  <Crown className="h-12 w-12 mr-4" />
                  <h1 className="text-4xl font-bold">Upgrade Your Plan</h1>
                </div>
                <p className="text-center text-lg text-white/90">
                  Choose the perfect plan to find your life partner
                </p>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-12 w-12 animate-spin text-red-500" />
                </div>
              )}

              {/* Plans Grid */}
              {!loading && plans.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {plans.map((plan, index) => {
                    const features = getPlanFeatures(plan);
                    const isProcessing = selectedPlan?.plan_id === plan.plan_id && processingPayment;

                    return (
                      <div
                        key={plan.plan_id}
                        className={`bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                          plan.plan_top_sell === 'yes' ? 'ring-2 ring-red-500' : ''
                        }`}
                      >
                        {/* Plan Header */}
                        <div className={`bg-gradient-to-r ${getPlanColor(index)} p-6 text-white relative`}>
                          {plan.plan_top_sell === 'yes' && (
                            <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                              POPULAR
                            </div>
                          )}
                          <div className="flex items-center justify-center mb-4">
                            {getPlanIcon(index)}
                          </div>
                          <h3 className="text-2xl font-bold text-center mb-2">
                            {plan.plan_name}
                          </h3>
                          <div className="text-center">
                            <div className="text-4xl font-bold">
                              {formatPrice(plan.plan_price)}
                            </div>
                            <div className="text-sm text-white/80 mt-1">
                              {formatValidity(plan.plan_validity)}
                            </div>
                          </div>
                        </div>

                        {/* Plan Features */}
                        <div className="p-6">
                          <div className="space-y-3 mb-6">
                            {features.map((feature, idx) => (
                              <div key={idx} className="flex items-start">
                                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700 text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>

                          {/* Quick Stats */}
                          <div className="grid grid-cols-2 gap-3 mb-6 pt-4 border-t border-gray-100">
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 text-blue-500 mr-2" />
                              <span className="text-xs text-gray-600">{plan.plan_contactview} Views</span>
                            </div>
                            <div className="flex items-center">
                              <MessageCircle className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-xs text-gray-600">{plan.plan_chat} Chats</span>
                            </div>
                            <div className="flex items-center">
                              <Heart className="h-4 w-4 text-red-500 mr-2" />
                              <span className="text-xs text-gray-600">{plan.plan_expressintrest} Interests</span>
                            </div>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-500 mr-2" />
                              <span className="text-xs text-gray-600">{plan.plan_featured} Days Featured</span>
                            </div>
                          </div>

                          {/* Upgrade Button */}
                          <button
                            onClick={() => handleUpgrade(plan)}
                            disabled={processingPayment}
                            className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                              isProcessing
                                ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                                : `bg-gradient-to-r ${getPlanColor(index)} text-white hover:shadow-lg hover:scale-105`
                            }`}
                          >
                            {isProcessing ? (
                              <span className="flex items-center justify-center">
                                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                Processing...
                              </span>
                            ) : (
                              'Upgrade Now'
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Empty State */}
              {!loading && plans.length === 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <Crown className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No Plans Available
                  </h3>
                  <p className="text-gray-600">
                    Please check back later for premium plans.
                  </p>
                </div>
              )}

              {/* Info Section */}
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <h4 className="font-bold text-blue-900 mb-3 flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Secure Payment Information
                </h4>
                <ul className="text-sm text-blue-800 space-y-2 ml-7 list-disc">
                  <li>All payments are processed securely through Razorpay</li>
                  <li>Your payment information is encrypted and secure</li>
                  <li>Plans are activated immediately after successful payment</li>
                  <li>You can view your order history in your profile</li>
                  <li>For any issues, please contact our support team</li>
                </ul>
              </div>
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </AuthGuard>
  );
};

export default PlanUpgradePage;
