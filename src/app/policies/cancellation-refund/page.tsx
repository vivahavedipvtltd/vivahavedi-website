import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CancellationRefundPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center text-red-600 hover:text-red-700 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <div className="flex items-center mb-4">
              <FileText className="h-8 w-8 text-red-500 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Cancellation & Refund Policy</h1>
            </div>
            <p className="text-gray-600">Last Updated: January 4, 2025</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-md p-8 prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Subscription Cancellation</h2>
              <p className="text-gray-700 mb-3">
                Members may cancel their subscription at any time through their account dashboard or by contacting our customer support team.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Cancellation requests can be submitted 24/7 through your account settings</li>
                <li>Contact our support team at support@vivahavedi.com for assistance</li>
                <li>Upon cancellation, your subscription will remain active until the end of the current billing period</li>
                <li>No partial refunds will be provided for the unused portion of the subscription period</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Refund Policy</h2>
              <p className="text-gray-700 mb-3">
                At Vivahavedi, we strive to provide the best matrimonial services. Our refund policy is as follows:
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.1 Eligibility for Refunds</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>7-Day Money Back Guarantee:</strong> New members can request a full refund within 7 days of initial subscription if they are not satisfied with our services</li>
                <li><strong>Technical Issues:</strong> Full refund if our platform experiences prolonged technical issues preventing service access</li>
                <li><strong>Duplicate Payments:</strong> Immediate refund for any duplicate or erroneous charges</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.2 Non-Refundable Scenarios</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Subscriptions older than 7 days (except for technical issues on our end)</li>
                <li>Partial subscription periods after usage has begun</li>
                <li>Violation of our Terms & Conditions resulting in account suspension</li>
                <li>Personal reasons unrelated to service quality or platform functionality</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Refund Process</h2>
              <p className="text-gray-700 mb-3">
                To request a refund, please follow these steps:
              </p>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                <li>Submit a refund request via email to support@vivahavedi.com with your subscription details</li>
                <li>Include your order ID, payment details, and reason for refund</li>
                <li>Our team will review your request within 2-3 business days</li>
                <li>If approved, the refund will be processed within 5-7 business days</li>
                <li>Refunds will be credited to the original payment method used during purchase</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Subscription Auto-Renewal</h2>
              <p className="text-gray-700 mb-3">
                All subscriptions are set to auto-renew by default. To avoid unwanted charges:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Disable auto-renewal at least 24 hours before the renewal date</li>
                <li>You will receive email reminders 7 days before auto-renewal</li>
                <li>Manage auto-renewal settings in your account dashboard</li>
                <li>If auto-renewal charges occur after cancellation request, contact us immediately for a refund</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Payment Gateway Charges</h2>
              <p className="text-gray-700 mb-3">
                Please note:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Payment gateway charges (if any) are non-refundable</li>
                <li>Refunds may be subject to payment processor fees as per their policy</li>
                <li>Currency conversion charges (for international payments) are non-refundable</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Service Credits</h2>
              <p className="text-gray-700 mb-3">
                In some cases, we may offer service credits instead of monetary refunds:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Service credits can be used for future subscriptions or premium features</li>
                <li>Credits are valid for 12 months from the date of issue</li>
                <li>Service credits are non-transferable and cannot be exchanged for cash</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contact Information</h2>
              <p className="text-gray-700 mb-3">
                For any questions regarding cancellations or refunds, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> support@vivahavedi.com</p>
                <p className="text-gray-700"><strong>Phone:</strong> +91 XXXXXXXXXX</p>
                <p className="text-gray-700"><strong>Business Hours:</strong> Monday to Saturday, 9:00 AM - 6:00 PM IST</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Policy Updates</h2>
              <p className="text-gray-700">
                We reserve the right to modify this Cancellation & Refund Policy at any time. Changes will be effective immediately upon posting on our website. Continued use of our services after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This policy applies to all subscription plans and services offered by Vivahavedi. For specific queries or exceptional cases, please contact our customer support team.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
