'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Check, Sparkles, Crown, Shield, MessageCircle, Eye, Heart, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import {
  getAllPlans,
  formatPrice,
  formatValidity,
  getPlanFeatures,
  isPlanPopular,
  type Plan
} from '@/lib/planDetailsApi';

export default function PackagesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { showWarning } = useToast();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);
        const allPlans = await getAllPlans();
        setPlans(allPlans);
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError('Unable to load subscription plans. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSelectPlan = (plan: Plan) => {
    if (!isAuthenticated) {
      showWarning('Please login to choose a plan');
      router.push('/login');
      return;
    }

    // If it's a free plan, redirect to register
    if (plan.plan_price === 0) {
      router.push('/register');
      return;
    }

    // Redirect to plan upgrade page
    router.push('/dashboard/settings/plan-upgrade');
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select the perfect plan to find your life partner
            </p>
          </div>
        </div>

        {/* Plans Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading plans...</p>
              </div>
            </div>
          ) : error ? (
            <div className="max-w-md mx-auto bg-white border border-red-200 rounded-lg p-8 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : plans.length === 0 ? (
            <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-600">No plans available at the moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {plans.map((plan) => {
                const features = getPlanFeatures(plan);
                const isPopular = isPlanPopular(plan);

                return (
                  <div
                    key={plan.plan_id}
                    className="relative bg-white rounded-xl shadow-sm border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg"
                  >
                    {/* Popular Badge */}
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="inline-flex items-center bg-red-500 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-md">
                          <Sparkles className="h-3 w-3 mr-1" />
                          POPULAR
                        </span>
                      </div>
                    )}

                    {/* Plan Content */}
                    <div className="p-8">
                      {/* Plan Name */}
                      <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
                        {plan.plan_name}
                      </h3>

                      {/* Validity */}
                      <p className="text-center text-sm text-gray-500 mb-6">
                        {formatValidity(plan.plan_validity)}
                      </p>

                      {/* Price */}
                      <div className="text-center mb-8">
                        <div className="flex items-baseline justify-center">
                          <span className="text-5xl font-bold text-gray-900">
                            {plan.plan_price === 0 ? (
                              'Free'
                            ) : (
                              <>
                                <span className="text-2xl">₹</span>
                                {plan.plan_price.toLocaleString('en-IN')}
                              </>
                            )}
                          </span>
                        </div>
                        {plan.plan_price_service > 0 && (
                          <p className="text-xs text-gray-500 mt-2">
                            + ₹{plan.plan_price_service} service charge
                          </p>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="border-t border-gray-200 mb-6"></div>

                      {/* Features */}
                      <ul className="space-y-3 mb-8">
                        {features.map((feature, idx) => (
                          <li key={idx} className="flex items-start text-sm">
                            <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Quick Stats */}
                      {plan.plan_price > 0 && (
                        <div className="grid grid-cols-2 gap-2 mb-6 pt-4 border-t border-gray-100">
                          <div className="text-center p-2 bg-blue-50 rounded-lg">
                            <Eye className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                            <div className="text-xs font-semibold text-gray-700">{plan.plan_contactview}</div>
                            <div className="text-xs text-gray-500">Views</div>
                          </div>
                          <div className="text-center p-2 bg-green-50 rounded-lg">
                            <MessageCircle className="h-4 w-4 text-green-500 mx-auto mb-1" />
                            <div className="text-xs font-semibold text-gray-700">{plan.plan_chat}</div>
                            <div className="text-xs text-gray-500">Chats</div>
                          </div>
                          <div className="text-center p-2 bg-red-50 rounded-lg">
                            <Heart className="h-4 w-4 text-red-500 mx-auto mb-1" />
                            <div className="text-xs font-semibold text-gray-700">{plan.plan_expressintrest}</div>
                            <div className="text-xs text-gray-500">Interests</div>
                          </div>
                          <div className="text-center p-2 bg-yellow-50 rounded-lg">
                            <Star className="h-4 w-4 text-yellow-500 mx-auto mb-1" />
                            <div className="text-xs font-semibold text-gray-700">{plan.plan_featured}</div>
                            <div className="text-xs text-gray-500">Featured</div>
                          </div>
                        </div>
                      )}

                      {/* CTA Button */}
                      <button
                        onClick={() => handleSelectPlan(plan)}
                        className="w-full py-3 rounded-lg font-semibold transition-all duration-200 bg-gradient-to-r from-red-500 to-pink-500 hover:shadow-lg hover:scale-105 text-white"
                      >
                        {plan.plan_price === 0 ? 'Get Started Free' : 'Choose Plan'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Simple FAQ */}
          {!loading && !error && plans.length > 0 && (
            <div className="mt-16 max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Frequently Asked Questions
              </h2>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-200">
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Can I upgrade my plan anytime?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Yes, you can upgrade to a higher plan at any time. The remaining balance will be adjusted accordingly.
                  </p>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Are payments secure?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    All payments are processed through secure payment gateways with SSL encryption for your safety.
                  </p>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    What happens when my plan expires?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    After expiry, your account will revert to the free plan. You can renew or upgrade at any time.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
