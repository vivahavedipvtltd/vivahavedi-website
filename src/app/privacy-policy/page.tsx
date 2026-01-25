import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
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
              <Shield className="h-8 w-8 text-red-500 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            </div>
            <p className="text-gray-600">Last Updated: January 4, 2025</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-md p-8 prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-700">
                At Vivahavedi, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our matrimonial services.
              </p>
              <p className="text-gray-700 mt-3">
                By using Vivahavedi services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1.1 Personal Information</h3>
              <p className="text-gray-700 mb-3">When you register on Vivahavedi, we collect the following personal information:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Basic Details: Name, date of birth, gender, contact details (email, phone number)</li>
                <li>Profile Information: Height, weight, physical attributes, education, occupation, income</li>
                <li>Family Details: Family type, family status, family values, family income</li>
                <li>Religious & Cultural Information: Religion, caste, sub-caste, mother tongue, horoscope details</li>
                <li>Partner Preferences: Age range, height, education, occupation, location preferences</li>
                <li>Photos and Documents: Profile pictures, ID proof for verification</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1.2 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Device Information: IP address, browser type, operating system, device identifiers</li>
                <li>Usage Data: Pages visited, time spent, features used, search queries</li>
                <li>Location Data: Approximate location based on IP address</li>
                <li>Cookies and Similar Technologies: Login session data, preferences, analytics</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1.3 Information from Third Parties</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Social Media: If you register using social media accounts, we receive basic profile information</li>
                <li>Payment Processors: Transaction details and payment status</li>
                <li>Verification Services: ID verification and background check information (with your consent)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.1 Primary Uses</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Matchmaking Services:</strong> To display your profile to potential matches and show you compatible profiles</li>
                <li><strong>Account Management:</strong> To create and maintain your account, verify your identity</li>
                <li><strong>Communication:</strong> To facilitate contact between members, send notifications about matches</li>
                <li><strong>Personalization:</strong> To customize your experience and improve match recommendations</li>
                <li><strong>Customer Support:</strong> To respond to your queries, requests, and provide assistance</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.2 Secondary Uses</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Service Improvement:</strong> To analyze usage patterns and enhance our platform</li>
                <li><strong>Marketing:</strong> To send promotional offers, new features, and service updates (you can opt-out)</li>
                <li><strong>Security:</strong> To detect and prevent fraud, unauthorized access, and illegal activities</li>
                <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our terms</li>
                <li><strong>Research & Analytics:</strong> To understand user behavior and improve matchmaking algorithms</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing and Disclosure</h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.1 With Other Members</h3>
              <p className="text-gray-700 mb-3">Your profile information is visible to other members based on:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Your privacy settings and photo visibility preferences</li>
                <li>Your membership plan (free vs. premium features)</li>
                <li>Match compatibility and preferences</li>
                <li>Contact information is shared only when you choose to connect</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.2 With Service Providers</h3>
              <p className="text-gray-700 mb-3">We share information with trusted third-party service providers who assist us:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Payment processors for subscription payments</li>
                <li>SMS and email service providers for notifications</li>
                <li>Cloud storage providers for data hosting</li>
                <li>Analytics and advertising partners</li>
                <li>Customer support platforms</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.3 Legal Requirements</h3>
              <p className="text-gray-700">We may disclose your information when required by law or to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
                <li>Comply with legal processes, court orders, or government requests</li>
                <li>Enforce our Terms of Service and protect our rights</li>
                <li>Protect the safety and security of our users and the public</li>
                <li>Prevent fraud, illegal activities, or policy violations</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.4 Business Transfers</h3>
              <p className="text-gray-700">
                In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new entity. We will notify you of any such change.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.1 Security Measures</h3>
              <p className="text-gray-700 mb-3">We implement industry-standard security measures to protect your data:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>SSL/TLS encryption for data transmission</li>
                <li>Encrypted storage of sensitive information</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Secure payment processing through certified gateways</li>
                <li>Regular backups and disaster recovery procedures</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.2 Your Responsibility</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Keep your password confidential and secure</li>
                <li>Do not share your login credentials with anyone</li>
                <li>Log out from shared or public devices</li>
                <li>Report any suspicious activity immediately</li>
                <li>Be cautious when sharing personal information with other members</li>
              </ul>

              <p className="text-gray-700 mt-4">
                <strong>Note:</strong> While we use reasonable efforts to protect your information, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Privacy Rights and Choices</h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.1 Access and Update</h3>
              <p className="text-gray-700">You have the right to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
                <li>Access and view your personal information</li>
                <li>Update or correct inaccurate information</li>
                <li>Download a copy of your data</li>
                <li>Modify your profile details at any time</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.2 Privacy Settings</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Profile Visibility:</strong> Control who can view your profile</li>
                <li><strong>Photo Privacy:</strong> Lock/unlock your photos for specific members</li>
                <li><strong>Contact Information:</strong> Choose when to share phone number and email</li>
                <li><strong>Search Settings:</strong> Hide your profile from search results</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.3 Communication Preferences</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Opt-out of promotional emails and SMS</li>
                <li>Manage notification preferences</li>
                <li>Unsubscribe from marketing communications</li>
                <li>Control match alert frequency</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.4 Account Deletion</h3>
              <p className="text-gray-700">
                You can request account deletion at any time. Upon deletion:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
                <li>Your profile will be removed from the platform</li>
                <li>Your data will be deleted within 30 days (except as required by law)</li>
                <li>Some information may be retained for legal, security, or fraud prevention purposes</li>
                <li>Deletion is permanent and cannot be reversed</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies and Tracking Technologies</h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.1 Types of Cookies We Use</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for website functionality, login sessions</li>
                <li><strong>Performance Cookies:</strong> Collect information about how you use our site</li>
                <li><strong>Functionality Cookies:</strong> Remember your preferences and settings</li>
                <li><strong>Advertising Cookies:</strong> Deliver relevant ads and track campaign effectiveness</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.2 Managing Cookies</h3>
              <p className="text-gray-700">
                You can control cookies through your browser settings. However, disabling cookies may affect website functionality and your user experience.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Third-Party Links and Services</h2>
              <p className="text-gray-700 mb-3">
                Our website may contain links to third-party websites, social media platforms, or services. We are not responsible for the privacy practices of these third parties.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Read third-party privacy policies before providing information</li>
                <li>We do not control third-party data collection practices</li>
                <li>Social media integrations are governed by their respective policies</li>
                <li>Payment processors have their own privacy and security policies</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children&apos;s Privacy</h2>
              <p className="text-gray-700">
                Vivahavedi services are intended for adults aged 18 and above. We do not knowingly collect personal information from children under 18. If we discover that we have collected information from a child under 18, we will delete it immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Data Retention</h2>
              <p className="text-gray-700 mb-3">We retain your personal information for as long as:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Your account is active</li>
                <li>Needed to provide you services</li>
                <li>Required by law or for legal purposes</li>
                <li>Necessary for fraud prevention and security</li>
              </ul>
              <p className="text-gray-700 mt-3">
                After account deletion, some data may be retained in backup systems for up to 90 days before permanent deletion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. International Data Transfers</h2>
              <p className="text-gray-700">
                Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy and applicable laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to Privacy Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
                <li>Posting the updated policy on our website</li>
                <li>Sending email notifications to registered users</li>
                <li>Displaying a prominent notice on the platform</li>
              </ul>
              <p className="text-gray-700 mt-3">
                Your continued use of our services after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Vivahavedi Matrimonial Services</strong></p>
                <p className="text-gray-700"><strong>Email:</strong> privacy@vivahavedi.com</p>
                <p className="text-gray-700"><strong>Support:</strong> info@vivahavedi.com</p>
                <p className="text-gray-700"><strong>Phone:</strong> +91 9995699944</p>
                <p className="text-gray-700"><strong>Address:</strong> Kerala, India</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Governing Law</h2>
              <p className="text-gray-700">
                This Privacy Policy is governed by the laws of India. Any disputes arising from this policy shall be subject to the exclusive jurisdiction of the courts in Kerala, India.
              </p>
            </section>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Your Privacy Matters:</strong> We are committed to protecting your privacy and maintaining the confidentiality of your personal information. By using Vivahavedi, you trust us with your data, and we take that responsibility seriously.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
