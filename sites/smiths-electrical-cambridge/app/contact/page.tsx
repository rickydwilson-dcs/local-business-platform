'use client';

/**
 * Contact Page
 *
 * Contact form with validation, CSRF protection, and confirmation.
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { siteConfig } from '@/site.config';
import { PHONE_DISPLAY, PHONE_TEL, BUSINESS_EMAIL, ADDRESS } from '@/lib/contact-info';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  service: string;
  location: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    service: '',
    location: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  // Fetch CSRF token on mount
  useEffect(() => {
    fetchCSRFToken();
  }, []);

  const fetchCSRFToken = async () => {
    try {
      const response = await fetch('/api/csrf-token');
      if (response.ok) {
        const data = await response.json();
        setCsrfToken(data.token);
      }
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          csrfToken,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage(data.message || 'Thank you for your message!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          service: '',
          location: '',
          message: '',
        });
        // Fetch new CSRF token for next submission
        fetchCSRFToken();
      } else {
        // Handle CSRF token expiration
        if (data.code === 'CSRF_INVALID') {
          await fetchCSRFToken();
          setSubmitMessage('Please try submitting again.');
        } else {
          setSubmitMessage(data.error || 'Something went wrong. Please try again.');
        }
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setSubmitMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbItems = [{ name: 'Contact', href: '/contact', current: true }];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-subtle border-b border-surface-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <main className="min-h-screen bg-surface-background">
        {/* Hero Section */}
        <section className="section-standard bg-gradient-to-b from-brand-primary/5 to-surface-background">
          <div className="container-standard text-center">
            <h1 className="heading-hero mb-4">Contact Us</h1>
            <p className="text-xl text-surface-muted-foreground max-w-2xl mx-auto">
              Get in touch with our team for a free quote or to discuss your requirements.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="section-standard">
          <div className="container-standard">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                {submitStatus === 'success' ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-green-800 mb-2">Message Sent!</h2>
                    <p className="text-green-700 mb-6">{submitMessage}</p>
                    <button onClick={() => setSubmitStatus('idle')} className="btn-primary">
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {submitStatus === 'error' && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-red-800 font-medium">Submission Failed</p>
                          <p className="text-red-700 text-sm">{submitMessage}</p>
                        </div>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-surface-foreground mb-2"
                        >
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-lg border ${
                            errors.name ? 'border-red-500' : 'border-surface-border'
                          } focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary`}
                          placeholder="Your name"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-surface-foreground mb-2"
                        >
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-lg border ${
                            errors.email ? 'border-red-500' : 'border-surface-border'
                          } focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary`}
                          placeholder="your@email.com"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-surface-foreground mb-2"
                        >
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-surface-border focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                          placeholder="Your phone number"
                        />
                      </div>

                      {/* Subject */}
                      <div>
                        <label
                          htmlFor="subject"
                          className="block text-sm font-medium text-surface-foreground mb-2"
                        >
                          Subject
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-surface-border focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                          placeholder="What is this regarding?"
                        />
                      </div>

                      {/* Service */}
                      <div>
                        <label
                          htmlFor="service"
                          className="block text-sm font-medium text-surface-foreground mb-2"
                        >
                          Service
                        </label>
                        <select
                          id="service"
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-surface-border focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary bg-white"
                        >
                          <option value="">Select a service</option>
                          {siteConfig.services.map((service) => (
                            <option key={service.slug} value={service.title}>
                              {service.title}
                            </option>
                          ))}
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* Location */}
                      <div>
                        <label
                          htmlFor="location"
                          className="block text-sm font-medium text-surface-foreground mb-2"
                        >
                          Location
                        </label>
                        <select
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-surface-border focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary bg-white"
                        >
                          <option value="">Select your area</option>
                          {siteConfig.serviceAreas.map((area) => (
                            <option key={area} value={area}>
                              {area}
                            </option>
                          ))}
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-surface-foreground mb-2"
                      >
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.message ? 'border-red-500' : 'border-surface-border'
                        } focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary resize-none`}
                        placeholder="Tell us about your project or enquiry..."
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact Information */}
                <div className="bg-surface-subtle rounded-lg p-6">
                  <h2 className="text-xl font-bold text-surface-foreground mb-6">
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-brand-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium text-surface-foreground">Phone</p>
                        <Link
                          href={`tel:${PHONE_TEL}`}
                          className="text-brand-primary hover:underline"
                        >
                          {PHONE_DISPLAY}
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-brand-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium text-surface-foreground">Email</p>
                        <Link
                          href={`mailto:${BUSINESS_EMAIL}`}
                          className="text-brand-primary hover:underline"
                        >
                          {BUSINESS_EMAIL}
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-brand-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium text-surface-foreground">Address</p>
                        <p className="text-surface-muted-foreground">
                          {ADDRESS.street}
                          <br />
                          {ADDRESS.locality}
                          <br />
                          {ADDRESS.region} {ADDRESS.postalCode}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-brand-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium text-surface-foreground">Hours</p>
                        <p className="text-surface-muted-foreground text-sm">
                          Mon-Fri: {siteConfig.business.hours.monday}
                          <br />
                          Sat: {siteConfig.business.hours.saturday}
                          <br />
                          Sun: {siteConfig.business.hours.sunday}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="bg-surface-subtle rounded-lg p-6">
                  <h2 className="text-xl font-bold text-surface-foreground mb-4">Quick Links</h2>
                  <ul className="space-y-2">
                    {siteConfig.services.slice(0, 5).map((service) => (
                      <li key={service.slug}>
                        <Link
                          href={`/services/${service.slug}`}
                          className="text-brand-primary hover:underline"
                        >
                          {service.title}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        href="/services"
                        className="text-brand-primary hover:underline font-medium"
                      >
                        View all services &rarr;
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
