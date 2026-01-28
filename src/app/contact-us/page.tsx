'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Building2 } from 'lucide-react';
import { getHomeContactDetails, getBranches, formatPhoneNumber, type ContactDetails, type Branch } from '@/lib/contactUsApi';
import { contactUsSchema } from '@/lib/validation';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // API data states
  const [contactDetails, setContactDetails] = useState<ContactDetails | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  // Fetch contact details and branches on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        setDataError(null);

        // Fetch contact details and branches in parallel
        const [details, branchList] = await Promise.all([
          getHomeContactDetails(),
          getBranches()
        ]);

        setContactDetails(details);
        setBranches(branchList);
      } catch (err) {
        console.error('Error fetching contact data:', err);
        setDataError('Unable to load contact information. Please try again later.');
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Validate form using Zod schema
    const result = contactUsSchema.safeParse(formData);

    if (!result.success) {
      const firstError = result.error.issues[0];
      setError(firstError.message);
      setLoading(false);
      return;
    }

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });

      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                We&apos;re here to help! Get in touch with our team
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information & Form Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>

                {dataLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                  </div>
                ) : dataError ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm">{dataError}</p>
                  </div>
                ) : contactDetails ? (
                  <>
                    {/* Email */}
                    <div className="flex items-start mb-6">
                      <div className="bg-red-100 rounded-full p-3 mr-4">
                        <Mail className="h-6 w-6 text-red-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                        <a href={`mailto:${contactDetails.email}`} className="text-gray-600 hover:text-red-500">
                          {contactDetails.email}
                        </a>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start mb-6">
                      <div className="bg-red-100 rounded-full p-3 mr-4">
                        <Phone className="h-6 w-6 text-red-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                        <a href={`tel:+91${contactDetails.mobile}`} className="text-gray-600 hover:text-red-500">
                          {formatPhoneNumber(contactDetails.mobile)}
                        </a>
                        <p className="text-sm text-gray-500 mt-1">Mon-Sun: 9:30 AM - 5:30 PM (Closed on Sat)</p>
                      </div>
                    </div>

                    {/* Company Name */}
                    <div className="flex items-start mb-6">
                      <div className="bg-red-100 rounded-full p-3 mr-4">
                        <Building2 className="h-6 w-6 text-red-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Company</h3>
                        <p className="text-gray-600">{contactDetails.name}</p>
                      </div>
                    </div>
                  </>
                ) : null}

                {/* Office Hours */}
                <div className="flex items-start">
                  <div className="bg-red-100 rounded-full p-3 mr-4">
                    <Clock className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Office Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 9:30 AM - 5:30 PM<br />
                      Saturday: Closed<br />
                      Sunday: 9:30 AM - 5:30 PM
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Help */}
              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Need Quick Help?</h3>
                <p className="text-gray-700 mb-4">
                  Check out our FAQ section for answers to common questions.
                </p>
                <Link
                  href="/"
                  className="text-red-500 hover:text-red-600 font-medium inline-flex items-center"
                >
                  Visit FAQ
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

                {/* Success Message */}
                {success && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-medium">
                      Thank you for contacting us! We&apos;ll get back to you soon.
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  {/* Email & Phone */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="+91 1234567890"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="profile">Profile Related</option>
                      <option value="payment">Payment & Billing</option>
                      <option value="feedback">Feedback & Suggestions</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                      placeholder="Write your message here..."
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Branches Section */}
        {branches.length > 0 && (
          <div className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Branches</h2>
                <p className="text-lg text-gray-600">
                  Visit us at any of our branch locations across India
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {branches.map((branch) => (
                  <div key={branch.id} className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                    {/* Branch Image */}
                    <div className="h-48 bg-gray-200 overflow-hidden relative">
                      <Image
                        src={branch.image || '/placeholder-office.jpg'}
                        alt={`${branch.name} Office`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>

                    {/* Branch Details */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{branch.name}</h3>

                      <div className="space-y-3">
                        {/* Phone */}
                        <div className="flex items-start">
                          <Phone className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-gray-700 text-sm">
                              <a href={`tel:${branch.phone}`} className="hover:text-red-500">
                                {branch.phone}
                              </a>
                            </p>
                            {branch.service && (
                              <p className="text-gray-600 text-sm">
                                Service: <a href={`tel:${branch.service}`} className="hover:text-red-500">{branch.service}</a>
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-start">
                          <Mail className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                          <a href={`mailto:${branch.email}`} className="text-gray-700 text-sm hover:text-red-500">
                            {branch.email}
                          </a>
                        </div>

                        {/* Address */}
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700 text-sm whitespace-pre-line">
                            {branch.address}
                          </p>
                        </div>

                        {/* Map Link */}
                        {branch.map && branch.map !== '#' && (
                          <a
                            href={branch.map}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-red-500 hover:text-red-600 font-medium text-sm mt-2"
                          >
                            View on Map
                            <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
