'use client';

import { useState, useEffect } from 'react';

interface ContactFormProps {
  services?: Array<{ slug: string; title: string }>;
  serviceAreas?: string[];
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const inputClasses = (hasError: boolean) =>
  `w-full px-4 py-3 bg-[#080807] border ${
    hasError ? 'border-error' : 'border-white/10'
  } text-white placeholder-white/30 focus:outline-none focus:border-brand-primary transition-colors`;

export function ContactForm({ services = [], serviceAreas = [] }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    service: '',
    location: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [csrfToken, setCsrfToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

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
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
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
          'x-csrf-token': csrfToken,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
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
        fetchCSRFToken();
      } else {
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

  if (submitStatus === 'success') {
    return (
      <div className="stamped-plate p-10 text-center">
        <span
          className="material-symbols-outlined text-brand-primary mb-4 inline-block"
          style={{ fontSize: '3rem', fontVariationSettings: "'FILL' 1" }}
        >
          check_circle
        </span>
        <h2 className="text-2xl font-heading font-black uppercase tracking-tight mb-2">
          Message Sent!
        </h2>
        <p className="text-white/70 mb-6">{submitMessage}</p>
        <button
          onClick={() => setSubmitStatus('idle')}
          className="inline-flex items-center justify-center bg-brand-primary text-brand-on-primary px-8 py-4 font-heading font-black uppercase tracking-widest hover:brightness-110 transition-all active:scale-95"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitStatus === 'error' && (
        <div
          role="alert"
          // eslint-disable-next-line platform/no-hardcoded-tailwind-colors -- Intentional: semantic error state tint, not a brand color
          className="bg-red-900/20 border border-red-700/50 p-4 flex items-start gap-3"
        >
          <span className="material-symbols-outlined text-error flex-shrink-0 mt-0.5">error</span>
          <div>
            <p className="text-error font-bold uppercase tracking-wide text-sm">
              Submission Failed
            </p>
            <p className="text-error text-sm">{submitMessage}</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="name"
            className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2"
          >
            Name <span className="text-brand-primary">*</span>
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
            className={inputClasses(!!errors.name)}
            placeholder="Your name"
          />
          {errors.name && (
            <p id="name-error" role="alert" className="mt-1 text-sm text-error">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2"
          >
            Email <span className="text-brand-primary">*</span>
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
            className={inputClasses(!!errors.email)}
            placeholder="your@email.com"
          />
          {errors.email && (
            <p id="email-error" role="alert" className="mt-1 text-sm text-error">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2"
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={inputClasses(false)}
            placeholder="Your phone number"
          />
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2"
          >
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={inputClasses(false)}
            placeholder="What is this regarding?"
          />
        </div>

        {services.length > 0 && (
          <div>
            <label
              htmlFor="service"
              className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2"
            >
              Service
            </label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              className={inputClasses(false)}
            >
              <option value="">Select a service</option>
              {services.map((s) => (
                <option key={s.slug} value={s.title}>
                  {s.title}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
          </div>
        )}

        {serviceAreas.length > 0 && (
          <div>
            <label
              htmlFor="location"
              className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2"
            >
              Location
            </label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={inputClasses(false)}
            >
              <option value="">Select your area</option>
              {serviceAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2"
        >
          Message <span className="text-brand-primary">*</span>
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
          className={`${inputClasses(!!errors.message)} resize-none`}
          placeholder="Tell us about your vehicle or enquiry..."
        />
        {errors.message && (
          <p id="message-error" role="alert" className="mt-1 text-sm text-error">
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center bg-brand-primary text-brand-on-primary px-8 py-4 font-heading font-black uppercase tracking-widest hover:brightness-110 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
