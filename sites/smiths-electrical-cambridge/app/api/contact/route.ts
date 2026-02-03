/**
 * Contact Form API Endpoint
 *
 * POST /api/contact
 * Handles contact form submissions with validation, rate limiting, and email sending.
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateCSRFToken, escapeHtml, getClientIP } from '@/lib/csrf';
import { rateLimitMiddleware } from '@/lib/rate-limiter';
import { siteConfig } from '@/site.config';
import { BUSINESS_EMAIL, BUSINESS_NAME } from '@/lib/contact-info';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  service?: string;
  location?: string;
  message: string;
  csrfToken: string;
}

interface ContactSubmission {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  service?: string;
  location?: string;
  message: string;
  receivedAt: string;
  userAgent?: string;
  referer?: string;
  ip: string;
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request.headers);

    // Check rate limit
    if (siteConfig.features.rateLimit) {
      const rateLimitResponse = await rateLimitMiddleware(clientIP);
      if (rateLimitResponse) {
        return rateLimitResponse;
      }
    }

    // Parse request body
    let body: ContactFormData;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // Validate CSRF token
    if (!body.csrfToken) {
      return NextResponse.json({ error: 'Missing CSRF token' }, { status: 403 });
    }

    const isValidToken = await validateCSRFToken(body.csrfToken);
    if (!isValidToken) {
      return NextResponse.json(
        { error: 'Invalid or expired CSRF token', code: 'CSRF_INVALID' },
        { status: 403 }
      );
    }

    // Validate required fields
    const { name, email, message } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required', field: 'name' }, { status: 400 });
    }

    if (!email?.trim()) {
      return NextResponse.json({ error: 'Email is required', field: 'email' }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address', field: 'email' },
        { status: 400 }
      );
    }

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required', field: 'message' }, { status: 400 });
    }

    // Sanitize and prepare submission data
    const submission: ContactSubmission = {
      name: escapeHtml(name.trim()),
      email: email.trim().toLowerCase(),
      phone: body.phone ? escapeHtml(body.phone.trim()) : undefined,
      subject: body.subject ? escapeHtml(body.subject.trim()) : undefined,
      service: body.service ? escapeHtml(body.service.trim()) : undefined,
      location: body.location ? escapeHtml(body.location.trim()) : undefined,
      message: escapeHtml(message.trim()),
      receivedAt: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || undefined,
      referer: request.headers.get('referer') || undefined,
      ip: clientIP,
    };

    // Send email (if Resend is configured)
    const emailSent = await sendContactEmail(submission);

    // Log submission for debugging
    console.log('Contact form submission:', {
      name: submission.name,
      email: submission.email,
      service: submission.service,
      location: submission.location,
      receivedAt: submission.receivedAt,
      emailSent,
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message. We will get back to you within 24 hours.',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

/**
 * Send contact form email using Resend
 */
async function sendContactEmail(submission: ContactSubmission): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.log('Resend not configured - email not sent. Submission logged to console.');
    console.log('Contact submission details:', submission);
    return false;
  }

  try {
    // Send notification email to business
    const businessEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Contact Form Submission</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">New Contact Form Submission</h1>

  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Name:</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${submission.name}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${submission.email}">${submission.email}</a></td>
    </tr>
    ${
      submission.phone
        ? `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Phone:</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="tel:${submission.phone}">${submission.phone}</a></td>
    </tr>
    `
        : ''
    }
    ${
      submission.service
        ? `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Service:</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${submission.service}</td>
    </tr>
    `
        : ''
    }
    ${
      submission.location
        ? `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Location:</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${submission.location}</td>
    </tr>
    `
        : ''
    }
    ${
      submission.subject
        ? `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Subject:</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${submission.subject}</td>
    </tr>
    `
        : ''
    }
  </table>

  <h2 style="color: #374151; margin-top: 30px;">Message:</h2>
  <div style="background: #f9fafb; padding: 15px; border-radius: 8px; white-space: pre-wrap;">${submission.message}</div>

  <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">

  <p style="font-size: 12px; color: #6b7280;">
    Received: ${new Date(submission.receivedAt).toLocaleString('en-GB')}<br>
    IP: ${submission.ip}
  </p>
</body>
</html>
    `;

    // Send to business
    const businessResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: `${BUSINESS_NAME} <${process.env.RESEND_FROM_EMAIL || 'noreply@resend.dev'}>`,
        to: BUSINESS_EMAIL,
        subject: `New Contact: ${submission.subject || submission.name}`,
        html: businessEmailHtml,
      }),
    });

    if (!businessResponse.ok) {
      console.error('Failed to send business notification email:', await businessResponse.text());
    }

    // Send confirmation to customer
    const customerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Thank You for Contacting Us</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #2563eb;">Thank You for Contacting ${BUSINESS_NAME}</h1>

  <p>Dear ${submission.name},</p>

  <p>Thank you for getting in touch with us. We have received your message and will respond within 24 hours.</p>

  <h2 style="color: #374151; margin-top: 30px;">What Happens Next?</h2>
  <ol>
    <li>Our team will review your enquiry</li>
    <li>We'll prepare a tailored response or quote</li>
    <li>We'll contact you via your preferred method</li>
  </ol>

  <p>If your matter is urgent, please don't hesitate to call us directly.</p>

  <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">

  <p style="font-size: 14px; color: #6b7280;">
    This is an automated confirmation email. Please do not reply directly to this message.
  </p>
</body>
</html>
    `;

    const customerResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: `${BUSINESS_NAME} <${process.env.RESEND_FROM_EMAIL || 'noreply@resend.dev'}>`,
        to: submission.email,
        subject: `Thank you for contacting ${BUSINESS_NAME}`,
        html: customerEmailHtml,
      }),
    });

    if (!customerResponse.ok) {
      console.error('Failed to send customer confirmation email:', await customerResponse.text());
    }

    return businessResponse.ok;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}
