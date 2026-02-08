"use client";

import { useState, useEffect } from "react";

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

const services = [
  "Access Scaffolding",
  "Facade Scaffolding",
  "Edge Protection",
  "Temporary Roof Systems",
  "Industrial Scaffolding",
  "Suspended Scaffolding",
  "Scaffold Towers",
  "Other",
];

const locations = ["East Sussex", "West Sussex", "Kent", "Surrey", "Other"];

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    service: "",
    location: "",
    message: "",
    projectType: "residential",
    urgency: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [csrfToken, setCsrfToken] = useState<string>("");

  // Fetch CSRF token on component mount
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch("/api/csrf-token");
        if (response.ok) {
          const data = await response.json();
          setCsrfToken(data.token);
        }
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
      }
    };

    fetchCsrfToken();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify(formData),
      });

      // Handle CSRF token expiration
      if (response.status === 403) {
        // Token expired or invalid, fetch a new one and retry
        const tokenResponse = await fetch("/api/csrf-token");
        if (tokenResponse.ok) {
          const data = await tokenResponse.json();
          setCsrfToken(data.token);

          // Retry the submission with the new token
          const retryResponse = await fetch("/api/contact", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-csrf-token": data.token,
            },
            body: JSON.stringify(formData),
          });

          if (retryResponse.ok) {
            setSubmitStatus("success");
            setFormData({
              name: "",
              email: "",
              phone: "",
              subject: "",
              service: "",
              location: "",
              message: "",
              projectType: "residential",
              urgency: "",
            });
          } else {
            setSubmitStatus("error");
          }
        } else {
          setSubmitStatus("error");
        }
      } else if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          service: "",
          location: "",
          message: "",
          projectType: "residential",
          urgency: "",
        });
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-semibold mb-6">Request a Free Quote</h2>

      {submitStatus === "success" && (
        <div role="alert" className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-green-800 font-semibold mb-1">Thank you!</h3>
          <p className="text-green-700">
            Your enquiry has been received. We&apos;ll get back to you within 24 hours with your
            free quote.
          </p>
        </div>
      )}

      {submitStatus === "error" && (
        <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-semibold mb-1">Something went wrong</h3>
          <p className="text-red-700">Please try again or call us directly on the number below.</p>
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
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Your full name"
            />
            {errors.name && (
              <p id="name-error" role="alert" className="mt-1 text-sm text-red-600">
                {errors.name}
              </p>
            )}
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
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p id="email-error" role="alert" className="mt-1 text-sm text-red-600">
                {errors.email}
              </p>
            )}
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
            >
              <option value="">Select a service...</option>
              {services.map((service) => (
                <option key={service} value={service.toLowerCase().replace(/\s+/g, "-")}>
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
            >
              <option value="">Select location...</option>
              {locations.map((location) => (
                <option key={location} value={location.toLowerCase().replace(/\s+/g, "-")}>
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
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
            aria-required="true"
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary ${
              errors.message ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Tell us about your project: building height, access requirements, duration, special considerations, etc."
          />
          {errors.message && (
            <p id="message-error" role="alert" className="mt-1 text-sm text-red-600">
              {errors.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-primary text-white font-semibold py-4 px-6 rounded-lg hover:bg-brand-primary-hover focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Sending..." : "Send Enquiry"}
        </button>

        <p className="text-sm text-gray-800 text-center">
          * Required fields. We&apos;ll respond within 24 hours with your free quote.
        </p>
      </form>
    </div>
  );
}
