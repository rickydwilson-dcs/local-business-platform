'use client';

import { useState } from 'react';
import Link from 'next/link';
import Schema from '@/components/Schema';
import Breadcrumbs from '@/components/ui/breadcrumbs';

type FormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  service: string;
  location: string;
  message: string;
  projectType: string;
  urgency: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    service: '',
    location: '',
    message: '',
    projectType: 'residential',
    urgency: ''
  });

  const breadcrumbItems = [
    { name: "Contact", href: "/contact", current: true }
  ];

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const services = [
    'Access Scaffolding',
    'Facade Scaffolding',
    'Edge Protection',
    'Temporary Roof Systems',
    'Industrial Scaffolding',
    'Suspended Scaffolding',
    'Scaffold Towers',
    'Other'
  ];

  const locations = [
    'East Sussex',
    'West Sussex',
    'Kent',
    'Surrey',
    'London',
    'Essex',
    'Other'
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          service: '',
          location: '',
          message: '',
          projectType: 'residential',
          urgency: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b">
        <div className="mx-auto w-full lg:w-[90%] px-6 py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Contact Colossus Scaffolding
        </h1>
        <p className="text-xl text-gray-600 mx-auto w-full lg:w-[90%]">
          Get a free quote today. Professional scaffolding services across the South East UK.
          TG20:21 compliant, fully insured, and CHAS accredited.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6">Request a Free Quote</h2>

            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="text-green-800 font-semibold mb-1">Thank you!</h3>
                <p className="text-green-700">
                  Your enquiry has been received. We&apos;ll get back to you within 24 hours with your free quote.
                </p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-red-800 font-semibold mb-1">Something went wrong</h3>
                <p className="text-red-700">
                  Please try again or call us directly on the number below.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Your full name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                    placeholder="01234 567890"
                  />
                </div>

                <div>
                  <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-2">
                    Project Type
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                  </select>
                </div>
              </div>

              {/* Project Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                    Service Required
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                  >
                    <option value="">Select a service...</option>
                    {services.map(service => (
                      <option key={service} value={service.toLowerCase().replace(/\s+/g, '-')}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location/County
                  </label>
                  <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                  >
                    <option value="">Select location...</option>
                    {locations.map(location => (
                      <option key={location} value={location.toLowerCase().replace(/\s+/g, '-')}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                  placeholder="e.g. Quote for house renovation scaffolding"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Details *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue ${
                    errors.message ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Tell us about your project: building height, access requirements, duration, special considerations, etc."
                />
                {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-blue text-white font-semibold py-4 px-6 rounded-lg hover:bg-brand-blue-hover focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Enquiry'}
              </button>

              <p className="text-sm text-gray-600 text-center">
                * Required fields. We&apos;ll respond within 24 hours with your free quote.
              </p>
            </form>
          </div>
        </div>

        {/* Contact Information */}
        <div className="lg:col-span-1">
          <div className="space-y-8">
            {/* Main Contact Info */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6">Get In Touch</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">📞 Phone</h3>
                  <p className="text-lg text-brand-blue font-semibold">
                    <a href="tel:01424466661" className="hover:underline">
                      01424 466 661
                    </a>
                  </p>
                  <p className="text-sm text-gray-600">
                    Mon-Fri: 7:30am - 6:00pm<br />
                    Sat: 8:00am - 4:00pm<br />
                    Emergency call-outs available
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">📧 Email</h3>
                  <p className="text-brand-blue">
                    <a href="mailto:info@colossusscaffolding.com" className="hover:underline">
                      info@colossusscaffolding.com
                    </a>
                  </p>
                  <p className="text-sm text-gray-600">We respond within 24 hours</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">📍 Service Areas</h3>
                  <p className="text-gray-700">
                    East Sussex, West Sussex, Kent, Surrey, London & Essex
                  </p>
                  <p className="text-sm text-gray-600">
                    <Link href="/locations" className="text-brand-blue hover:underline">
                      View All Coverage Areas
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6">Quick Links</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Our Services</h3>
                  <ul className="space-y-1">
                    <li>
                      <Link href="/services/access-scaffolding" className="text-brand-blue hover:underline">
                        Access Scaffolding
                      </Link>
                    </li>
                    <li>
                      <Link href="/services/facade-scaffolding" className="text-brand-blue hover:underline">
                        Facade Scaffolding
                      </Link>
                    </li>
                    <li>
                      <Link href="/services/edge-protection" className="text-brand-blue hover:underline">
                        Edge Protection
                      </Link>
                    </li>
                    <li>
                      <Link href="/services" className="text-brand-blue hover:underline font-medium">
                        View All Scaffolding Services
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Why Choose Us */}
            <div className="bg-brand-black text-brand-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6">Why Choose Colossus?</h2>

              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-brand-blue mr-3">✓</span>
                  <div>
                    <span className="font-semibold">TG20:21 Compliant</span>
                    <p className="text-sm text-gray-300">All scaffolds meet latest safety standards</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-blue mr-3">✓</span>
                  <div>
                    <span className="font-semibold">Fully Insured</span>
                    <p className="text-sm text-gray-300">£10M public liability coverage</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-blue mr-3">✓</span>
                  <div>
                    <span className="font-semibold">CHAS Accredited</span>
                    <p className="text-sm text-gray-300">Proven health & safety record</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-brand-blue mr-3">✓</span>
                  <div>
                    <span className="font-semibold">Free Site Surveys</span>
                    <p className="text-sm text-gray-300">No-obligation quotes</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      </div>

      <Schema
        service={{
          id: "/contact#service",
          url: "/contact",
          name: "Contact Colossus Scaffolding",
          description: "Get in touch for scaffolding quotes, site surveys, and general enquiries across the South East UK.",
          serviceType: "Contact",
          areaServed: ["South East UK", "East Sussex", "West Sussex", "Kent", "Surrey", "London", "Essex"]
        }}
        org={{
          name: "Colossus Scaffolding",
          url: "/",
          logo: "/Colossus-Scaffolding-Logo.svg"
        }}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Contact", url: "/contact" }
        ]}
        faqs={[
          {
            question: "How quickly can you provide a quote?",
            answer: "We typically provide quotes within 24-48 hours after a free site survey."
          },
          {
            question: "Do you offer emergency scaffolding?",
            answer: "Yes, we provide emergency scaffolding services subject to availability for urgent make-safe work."
          },
          {
            question: "What information do you need for a quote?",
            answer: "We need project details including building height, access requirements, duration, and any special considerations."
          },
          {
            question: "Are site surveys really free?",
            answer: "Yes, we provide completely free, no-obligation site surveys and detailed quotations for all projects."
          }
        ]}
      />
    </>
  );
}
