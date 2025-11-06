import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Scale, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsConditionsPage() {
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
              <Scale className="h-8 w-8 text-red-500 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Terms And Conditions</h1>
            </div>
            <p className="text-gray-600">Last Updated: January 4, 2025</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-md p-8 prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to vivahavedi.com</h2>
              <p className="text-gray-700">
                The service for adults to find their life partner online operated by vivahavedi.com. By using the vivahavedi.com Website you agree to be bound by these Terms of Use (this &ldquo;Agreement&rdquo;), whether or not you register as a member (&ldquo;Member&rdquo;). If you wish to become a Member and communicate with other Members and make use of the vivahavedi.com service, read these Terms of Use and indicate your acceptance of them by following the instructions in the Registration process.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Eligibility</h2>
              <p className="text-gray-700">
                You must be eighteen or over to register as a member of vivahavedi.com or use the Website. Membership in the Service is void where prohibited. By using the Website, you represent and warrant that you have the right, authority, and capacity to enter into this Agreement and to abide by all of the terms and conditions of this Agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Term</h2>
              <p className="text-gray-700">
                This Agreement will remain in full force and effect while you use the Website and/or are a Member. You may terminate your membership at any time, for any reason by following the instructions on the Resign pages in Account Settings, or upon receipt by vivahavedi.com of your written or email notice of termination. vivahavedi.com may terminate your membership for any reason, effective upon sending notice to you at the email address you provide in your application for membership, or such other email address as you may later provide to vivahavedi.com. If vivahavedi.com terminates your membership in the Service because you have breached the Agreement, you will not be entitled to any refund of unused subscription fees. Even after membership is terminated, this Agreement will remain in effect. Even after this Agreement is terminated, certain provisions will remain in effect, including sections 4, 5, 7 and 9-14 of this Agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Non Commercial Use by Members</h2>
              <p className="text-gray-700">
                The Website is for the personal use of individual Members only and may not be used in connection with any commercial endeavors. Organizations, companies, and/or businesses may not become Members of vivahavedi.com and should not use the Service or the Website for any purpose. Illegal and/or unauthorized uses of the Website, including unauthorized framing of or linking to the Website will be investigated, and appropriate legal action will be taken, including without limitation, civil, criminal, and injunctive redress.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Proprietary Rights</h2>
              <p className="text-gray-700">
                vivahavedi.com owns and retains all proprietary rights in the Website and the Service. The Website contains the copyrighted material, trademarks, and other proprietary information of vivahavedi.com, and its licensors. Except for that information which is in the public domain or for which you have been given written permission, you may not copy, modify, publish, transmit, distribute, perform, display, or sell any such proprietary information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Content Posted on the Site</h2>
              <p className="text-gray-700 mb-3">
                vivahavedi.com may review and delete any content, in each case in whole or in part, that in the sole judgment of vivahavedi.com violates this Agreement or which might be offensive, illegal, or that might violate the rights, harm, or threaten the safety of Members.
              </p>
              <p className="text-gray-700 mb-3">
                You are solely responsible for the content that you publish or display (hereinafter, &ldquo;post&rdquo;) on the Service or any material or information that you transmit to other Members.
              </p>
              <p className="text-gray-700 mb-3">
                You may not post on the Service, or transmit to other Members, any defamatory, inaccurate, abusive, obscene, profane, offensive, sexually oriented, threatening, harassing, racially offensive, or illegal material, or any material that infringes or violates another party&apos;s rights (including, but not limited to, intellectual property rights, and rights of privacy and publicity). You may not provide inaccurate, misleading or false information to vivahavedi.com or to any other Member.
              </p>
              <p className="text-gray-700 mb-3">The following is a partial list of the kind of Content that is illegal or prohibited on the Website:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Content that is patently offensive to the online community, such as content that promotes racism, bigotry, hatred or physical harm of any kind against any group or individual</li>
                <li>Content that harasses or advocates harassment of another person</li>
                <li>Content that involves the transmission of &ldquo;junk mail,&rdquo; &ldquo;chain letters,&rdquo; or unsolicited mass mailing or &ldquo;spamming&rdquo;</li>
                <li>Content that provides information that is false or misleading or promotes illegal activities or conduct</li>
                <li>Content that exploits people under the age of 18 in a sexual or violent manner, or solicits personal information from anyone under 18</li>
                <li>Content that provides instructional information about illegal activities such as making or buying illegal weapons or drugs</li>
                <li>Content that solicits passwords or personal identifying information for commercial or unlawful purposes from other users</li>
                <li>Content that involves commercial activities and/or sales without our prior written consent such as contests, sweepstakes, barter, advertising, or pyramid schemes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Subscription</h2>
              <p className="text-gray-700">
                Users signing up for multiple subscriptions on vivahavedi.com can have a maximum of only 1 vivahavedi.com profile.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Refund Policy</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>A.</strong> All membership payments towards vivahavedi.com are not refundable.</li>
                <li><strong>B.</strong> Membership cannot be transferred to any other person.</li>
                <li><strong>C.</strong> The payment made cannot be assigned or adjusted to any other product of the company.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Member Disputes</h2>
              <p className="text-gray-700">
                You are solely responsible for your interactions with other vivahavedi.com Members. vivahavedi.com reserves the right, but has no obligation, to monitor disputes between you and other Members.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Privacy</h2>
              <p className="text-gray-700">
                Use of the Website and/or the Service is also governed by our Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Disclaimers</h2>
              <p className="text-gray-700 mb-3">
                vivahavedi.com is not responsible for any incorrect or inaccurate Content posted on the Website or in connection with the Service, whether caused by users of the Website, Members or by any of the equipment or programming associated with or utilized in the Service.
              </p>
              <p className="text-gray-700 mb-3">
                vivahavedi.com is not responsible for the conduct, whether online or offline, of any user of the Website or Member of the Service.
              </p>
              <p className="text-gray-700">
                vivahavedi.com assumes no responsibility for any error, omission, interruption, deletion, defect, delay in operation or transmission, communications line failure, theft or destruction or unauthorized access to, or alteration of, user or Member communications. vivahavedi.com is not responsible for any problems or technical malfunction of any telephone network or lines, computer online systems, servers or providers, computer equipment, software, failure of email or players on account of technical problems or traffic congestion on the Internet or at any Website or combination thereof, including injury or damage to users and/or Members or to any other person&apos;s computer related to or resulting from participating or downloading materials in connection with the Web and/or in connection with the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Limitation on Liability</h2>
              <p className="text-gray-700">
                In no event will vivahavedi.com be liable to you or any third person for any indirect, consequential, exemplary, incidental, special or punitive damages, including also lost profits arising from your use of the Website or the Service, even if vivahavedi.com has been advised of the possibility of such damages. Notwithstanding anything to the contrary contained herein, vivahavedi.com&apos;s liability to you for any cause whatsoever, and regardless of the form of the action, will at all times be limited to the amount paid, if any, by you to vivahavedi.com for the Service during the term of membership.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Disputes</h2>
              <p className="text-gray-700">
                If there is any dispute about or involving the Website and/or the Service, by using the Website, you agree that the dispute will be governed by the laws of the State of Kerala, India without regard to its conflict of law provisions. You agree to personal jurisdiction by and venue in the state and federal courts of the State of Kerala, India.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Indemnity</h2>
              <p className="text-gray-700">
                You agree to indemnify and hold vivahavedi.com, its subsidiaries, affiliates, officers, agents, and other partners and employees, harmless from any loss, liability, claim, or demand, including reasonable attorneys&apos; fees, made by any third party due to or arising out of your use of the Service in violation of this Agreement and/or arising from a breach of this Agreement and/or any breach of your representations and warranties set forth above.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Other</h2>
              <p className="text-gray-700">
                This Agreement, accepted upon use of the Website and further affirmed by becoming a Member of the Service, contains the entire agreement between you and vivahavedi.com regarding the use of the Website and/or the Service. If any provision of this Agreement is held invalid, the remainder of this Agreement shall continue in full force and effect.
              </p>
            </section>

            <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Important:</strong> By using vivahavedi.com, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions and our Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
