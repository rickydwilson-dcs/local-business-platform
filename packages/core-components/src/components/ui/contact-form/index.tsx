'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface ExtraFieldConfig {
  name: string;
  label: string;
  type: 'select' | 'text' | 'textarea';
  options?: string[];
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
}

interface ContactFormProps {
  services?: Array<{ slug: string; title: string }> | string[];
  serviceAreas?: string[];
  extraFields?: ExtraFieldConfig[];
  variant?: 'standard' | 'detailed';
  darkMode?: boolean;
  className?: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export function ContactForm({
  services = [],
  serviceAreas = [],
  extraFields = [],
  variant = 'standard',
  darkMode = false,
  className,
}: ContactFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      service: '',
      location: '',
      message: '',
    };
    for (const field of extraFields) {
      initial[field.name] = field.defaultValue ?? '';
    }
    return initial;
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
          'x-csrf-token': csrfToken,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus('success');
        setSubmitMessage(data.message || 'Thank you for your message!');
        // Reset form
        const resetData: Record<string, string> = {
          name: '',
          email: '',
          phone: '',
          subject: '',
          service: '',
          location: '',
          message: '',
        };
        for (const field of extraFields) {
          resetData[field.name] = field.defaultValue ?? '';
        }
        setFormData(resetData);
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

  // Style helpers based on darkMode
  const inputBgClass = darkMode
    ? 'bg-surface-inverse text-white placeholder-surface-muted-foreground'
    : 'bg-surface-background';
  const inputBorderClass = darkMode ? 'border-surface-card-border' : 'border-surface-border';
  const labelClass = darkMode ? 'text-surface-muted-foreground' : 'text-surface-foreground';
  const requiredMarkerClass = darkMode ? 'text-brand-primary' : 'text-error';

  const inputClasses = (fieldName: string) =>
    `w-full px-4 py-3 rounded-lg border ${
      errors[fieldName as keyof FormErrors] ? 'border-error' : inputBorderClass
    } ${inputBgClass} focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary`;

  const selectClasses = `w-full px-4 py-3 rounded-lg border ${inputBorderClass} ${
    darkMode ? 'bg-surface-inverse text-white' : 'bg-surface-background'
  } focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary`;

  // Detailed variant wraps in a card
  const isDetailed = variant === 'detailed';

  // Success state
  /* eslint-disable platform/no-hardcoded-tailwind-colors -- Intentional: form submission state feedback */
  if (submitStatus === 'success') {
    if (isDetailed) {
      return (
        <div className={className}>
          <div className="bg-surface-card rounded-2xl shadow-lg p-8">
            <div role="alert" className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-green-800 font-semibold mb-1">Thank you!</h3>
              <p className="text-green-700">{submitMessage}</p>
            </div>
            <button
              onClick={() => setSubmitStatus('idle')}
              className="mt-4 btn-primary"
            >
              Send Another Message
            </button>
          </div>
        </div>
      );
    }

    const bgColorClass = darkMode ? 'bg-green-900/20' : 'bg-green-50';
    const borderColorClass = darkMode ? 'border-green-700/50' : 'border-green-200';

    return (
      <div className={`${bgColorClass} border ${borderColorClass} rounded-lg p-8 text-center ${className ?? ''}`}>
        <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-success mb-2">Message Sent!</h2>
        <p className="text-success mb-6">{submitMessage}</p>
        <button
          onClick={() => setSubmitStatus('idle')}
          className={darkMode ? 'btn-primary-dark' : 'btn-primary'}
        >
          Send Another Message
        </button>
      </div>
    );
  }
  /* eslint-enable platform/no-hardcoded-tailwind-colors */

  // Resolve services for the dropdown
  const serviceOptions: Array<{ value: string; label: string }> = services.map((s) =>
    typeof s === 'string'
      ? { value: s.toLowerCase().replace(/\s+/g, '-'), label: s }
      : { value: s.title, label: s.title }
  );

  // Resolve service areas for the dropdown
  const areaOptions: Array<{ value: string; label: string }> = serviceAreas.map((area) =>
    typeof area === 'string'
      ? { value: area, label: area }
      : { value: area, label: area }
  );

  // Render an extra field
  const renderExtraField = (field: ExtraFieldConfig) => {
    if (field.type === 'select') {
      return (
        <div key={field.name}>
          <label htmlFor={field.name} className={`block text-sm font-medium ${labelClass} mb-2`}>
            {field.label}{field.required ? <span className={requiredMarkerClass}> *</span> : ''}
          </label>
          <select
            id={field.name}
            name={field.name}
            value={formData[field.name] ?? ''}
            onChange={handleChange}
            className={selectClasses}
          >
            {!field.defaultValue && <option value="">Select...</option>}
            {(field.options ?? []).map((opt) => (
              <option key={opt} value={opt.toLowerCase().replace(/\s+/g, '-')}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (field.type === 'textarea') {
      return (
        <div key={field.name}>
          <label htmlFor={field.name} className={`block text-sm font-medium ${labelClass} mb-2`}>
            {field.label}{field.required ? <span className={requiredMarkerClass}> *</span> : ''}
          </label>
          <textarea
            id={field.name}
            name={field.name}
            value={formData[field.name] ?? ''}
            onChange={handleChange}
            rows={4}
            className={`${inputClasses(field.name)} resize-none`}
            placeholder={field.placeholder}
          />
        </div>
      );
    }

    // text
    return (
      <div key={field.name}>
        <label htmlFor={field.name} className={`block text-sm font-medium ${labelClass} mb-2`}>
          {field.label}{field.required ? <span className={requiredMarkerClass}> *</span> : ''}
        </label>
        <input
          type="text"
          id={field.name}
          name={field.name}
          value={formData[field.name] ?? ''}
          onChange={handleChange}
          className={inputClasses(field.name)}
          placeholder={field.placeholder}
        />
      </div>
    );
  };

  // Error banner
  /* eslint-disable platform/no-hardcoded-tailwind-colors -- Intentional: form submission state feedback */
  const errorBanner = submitStatus === 'error' && (
    <div
      role="alert"
      className={`${darkMode ? 'bg-red-900/20 border-red-700/50' : 'bg-red-50 border-red-200'} border rounded-lg p-4 flex items-start gap-3`}
    >
      <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-error font-medium">Submission Failed</p>
        <p className="text-error text-sm">{submitMessage}</p>
      </div>
    </div>
  );
  /* eslint-enable platform/no-hardcoded-tailwind-colors */

  // ---- Detailed variant (colossus-style card wrapper) ----
  if (isDetailed) {
    return (
      <div className={`bg-surface-card rounded-2xl shadow-lg p-8 ${className ?? ''}`}>
        <h2 className="text-2xl font-semibold mb-6">Request a Free Quote</h2>

        {/* eslint-disable platform/no-hardcoded-tailwind-colors -- Intentional: form submission state feedback */}
        {submitStatus === 'error' && (
          <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-red-800 font-semibold mb-1">Something went wrong</h3>
            <p className="text-red-700">Please try again or call us directly on the number below.</p>
          </div>
        )}
        {/* eslint-enable platform/no-hardcoded-tailwind-colors */}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name + Email */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-surface-secondary mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                aria-required="true"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary ${
                  errors.name ? 'border-error' : 'border-surface-subtle'
                }`}
                placeholder="Your full name"
              />
              {errors.name && (
                <p id="name-error" role="alert" className="mt-1 text-sm text-error">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-surface-secondary mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary ${
                  errors.email ? 'border-error' : 'border-surface-subtle'
                }`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p id="email-error" role="alert" className="mt-1 text-sm text-error">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Phone + first extra field (or just phone) */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-surface-secondary mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-surface-subtle rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                placeholder="01234 567890"
              />
            </div>
            {extraFields.length > 0 && renderExtraField(extraFields[0])}
          </div>

          {/* Service + Location */}
          {(serviceOptions.length > 0 || areaOptions.length > 0) && (
            <div className="grid md:grid-cols-2 gap-6">
              {serviceOptions.length > 0 && (
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-surface-secondary mb-2">
                    Service Required
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-surface-subtle rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  >
                    <option value="">Select a service...</option>
                    {serviceOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {areaOptions.length > 0 && (
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-surface-secondary mb-2">
                    Location/County
                  </label>
                  <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-surface-subtle rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  >
                    <option value="">Select location...</option>
                    {areaOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Remaining extra fields */}
          {extraFields.length > 1 && (
            <div className="grid md:grid-cols-2 gap-6">
              {extraFields.slice(1).map(renderExtraField)}
            </div>
          )}

          {/* Subject */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-surface-secondary mb-2">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-surface-subtle rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              placeholder="e.g. Quote for house renovation scaffolding"
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-surface-secondary mb-2">
              Project Details *
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary ${
                errors.message ? 'border-error' : 'border-surface-subtle'
              }`}
              placeholder="Tell us about your project..."
            />
            {errors.message && (
              <p id="message-error" role="alert" className="mt-1 text-sm text-error">{errors.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-primary text-white font-semibold py-4 px-6 rounded-lg hover:bg-brand-primary-hover focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'Send Enquiry'}
          </button>

          <p className="text-sm text-surface-foreground text-center">
            * Required fields. We&apos;ll respond within 24 hours.
          </p>
        </form>
      </div>
    );
  }

  // ---- Standard variant (base-template / dj-fox style) ----
  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className ?? ''}`}>
      {errorBanner}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className={`block text-sm font-medium ${labelClass} mb-2`}>
            Name <span className={requiredMarkerClass}>*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={inputClasses('name')}
            placeholder="Your name"
          />
          {errors.name && <p id="name-error" role="alert" className="mt-1 text-sm text-error">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className={`block text-sm font-medium ${labelClass} mb-2`}>
            Email <span className={requiredMarkerClass}>*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={inputClasses('email')}
            placeholder="your@email.com"
          />
          {errors.email && <p id="email-error" role="alert" className="mt-1 text-sm text-error">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className={`block text-sm font-medium ${labelClass} mb-2`}>
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={inputClasses('phone')}
            placeholder="Your phone number"
          />
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className={`block text-sm font-medium ${labelClass} mb-2`}>
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={inputClasses('subject')}
            placeholder="What is this regarding?"
          />
        </div>

        {/* Service — only rendered if services provided */}
        {serviceOptions.length > 0 && (
          <div>
            <label htmlFor="service" className={`block text-sm font-medium ${labelClass} mb-2`}>
              Service
            </label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              className={selectClasses}
            >
              <option value="">Select a service</option>
              {serviceOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
          </div>
        )}

        {/* Location — only rendered if serviceAreas provided */}
        {areaOptions.length > 0 && (
          <div>
            <label htmlFor="location" className={`block text-sm font-medium ${labelClass} mb-2`}>
              Location
            </label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={selectClasses}
            >
              <option value="">Select your area</option>
              {areaOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
          </div>
        )}

        {/* Extra fields in grid */}
        {extraFields.map(renderExtraField)}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className={`block text-sm font-medium ${labelClass} mb-2`}>
          Message <span className={requiredMarkerClass}>*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={6}
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
          className={`${inputClasses('message')} resize-none`}
          placeholder="Tell us about your project or enquiry..."
        />
        {errors.message && <p id="message-error" role="alert" className="mt-1 text-sm text-error">{errors.message}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-4 text-lg font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
          darkMode ? 'bg-brand-primary text-white hover:bg-brand-primary-hover' : 'btn-primary'
        }`}
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
