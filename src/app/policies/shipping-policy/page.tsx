import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Truck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ShippingPolicyPage() {
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
              <Truck className="h-8 w-8 text-red-500 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Delivery & Service Policy</h1>
            </div>
            <p className="text-gray-600">Last Updated: January 4, 2025</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-md p-8 prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Service Delivery Overview</h2>
              <p className="text-gray-700 mb-3">
                Vivahavedi is an online matrimonial service platform. Unlike physical products, our services are delivered digitally and instantly upon successful subscription activation. This policy outlines how our services are delivered to you.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>All services are delivered electronically through our website and mobile application</li>
                <li>There is no physical shipping or delivery of goods</li>
                <li>Service access is granted immediately upon successful payment confirmation</li>
                <li>Premium features are activated instantly after payment processing</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Service Activation Timeline</h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.1 Instant Activation</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Free Membership:</strong> Activated immediately upon successful registration</li>
                <li><strong>Paid Subscriptions:</strong> Activated within 5-10 minutes of payment confirmation</li>
                <li><strong>Premium Features:</strong> Available instantly after successful transaction</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.2 Delayed Activation</h3>
              <p className="text-gray-700 mb-3">
                In rare cases, service activation may be delayed due to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Payment gateway processing delays (up to 24 hours)</li>
                <li>Bank verification requirements for large transactions</li>
                <li>Technical issues or system maintenance</li>
                <li>Profile verification pending for safety reasons</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Service Coverage</h2>
              <p className="text-gray-700 mb-3">
                Our matrimonial services are available:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Geographic Coverage:</strong> Available across India and internationally</li>
                <li><strong>Platform Access:</strong> Accessible via web browsers and mobile devices</li>
                <li><strong>24/7 Availability:</strong> Services can be accessed anytime, anywhere with internet connection</li>
                <li><strong>Multi-device Support:</strong> Use your account on multiple devices simultaneously</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Digital Service Delivery</h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.1 What You Receive</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Access to your personalized dashboard</li>
                <li>Ability to create and manage your matrimonial profile</li>
                <li>Search and filter capabilities based on your preferences</li>
                <li>Communication tools (messaging, interest expression)</li>
                <li>Profile views and match recommendations</li>
                <li>Premium features as per your subscription plan</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.2 Service Requirements</h3>
              <p className="text-gray-700 mb-3">
                To access our services, you need:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>A valid email address and mobile number</li>
                <li>Internet connection (broadband or mobile data)</li>
                <li>Modern web browser or our mobile application</li>
                <li>Verified account credentials</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Physical Document Delivery</h2>
              <p className="text-gray-700 mb-3">
                In specific cases, we may send physical documents or materials:
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.1 Premium Services</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Assisted Matchmaking:</strong> Personalized biodata booklets may be shipped (if applicable)</li>
                <li><strong>Verification Documents:</strong> Physical verification badges or certificates (upon request)</li>
                <li><strong>Special Packages:</strong> Welcome kits or promotional materials for premium members</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.2 Shipping Details (Physical Items)</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Delivery Time:</strong> 5-7 business days for domestic shipping within India</li>
                <li><strong>International Shipping:</strong> 10-15 business days for international deliveries</li>
                <li><strong>Courier Partners:</strong> India Post, BlueDart, DTDC, or other reputed courier services</li>
                <li><strong>Shipping Charges:</strong> May apply based on location and package weight</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Service Interruptions</h2>
              <p className="text-gray-700 mb-3">
                We strive for 99.9% uptime, but service may be temporarily unavailable due to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Scheduled maintenance (notified in advance)</li>
                <li>Technical issues or server problems</li>
                <li>Force majeure events (natural disasters, government orders, etc.)</li>
                <li>Security updates or system upgrades</li>
              </ul>
              <p className="text-gray-700 mt-3">
                In case of prolonged service interruptions, subscription periods may be extended accordingly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Tracking Your Service</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Check your subscription status in the "Account Settings" section</li>
                <li>View payment history and invoice details in your dashboard</li>
                <li>Monitor service usage and remaining credits/features</li>
                <li>Receive email confirmations for all transactions</li>
                <li>Track physical shipments (if any) via courier tracking number sent to your email</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Non-Delivery or Access Issues</h2>
              <p className="text-gray-700 mb-3">
                If you face issues accessing our services after payment:
              </p>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                <li>Wait for 15-30 minutes as payment confirmation may be delayed</li>
                <li>Check your email for payment confirmation and activation details</li>
                <li>Clear browser cache or try accessing from a different device</li>
                <li>Contact our support team at support@vivahavedi.com with payment proof</li>
                <li>We will activate your service manually within 2-4 hours of verification</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Users</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Our services are accessible globally with internet connection</li>
                <li>Payment can be made in INR or equivalent foreign currency</li>
                <li>Currency conversion rates as per payment gateway provider</li>
                <li>Time zones may affect customer support response times</li>
                <li>Physical document delivery (if any) subject to international shipping regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Service Modifications</h2>
              <p className="text-gray-700">
                We reserve the right to modify, suspend, or discontinue any service or feature with prior notice to users. Active subscriptions will be honored, and refunds will be processed as per our Cancellation & Refund Policy for any discontinued services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
              <p className="text-gray-700 mb-3">
                For service delivery or access issues, please contact:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> support@vivahavedi.com</p>
                <p className="text-gray-700"><strong>Phone:</strong> +91 XXXXXXXXXX</p>
                <p className="text-gray-700"><strong>Business Hours:</strong> Monday to Saturday, 9:00 AM - 6:00 PM IST</p>
                <p className="text-gray-700"><strong>Average Response Time:</strong> 2-4 hours during business hours</p>
              </div>
            </section>

            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Note:</strong> This is a service delivery policy for digital matrimonial services. Since we do not ship physical products in most cases, traditional shipping terms do not apply. For specific queries about service activation or access, please contact our customer support team.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
