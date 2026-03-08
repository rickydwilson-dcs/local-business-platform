/**
 * Contact Route Factory
 *
 * Creates a standardised POST handler for contact form submissions.
 * Sites call createContactHandler() with their config and export the result as POST.
 *
 * Normalisation decisions:
 * - Uses raw fetch() to Resend API (no SDK dependency)
 * - Always returns { success: true } on success (not { ok: true })
 * - Uses Response.json() (not NextResponse.json())
 * - Accepts Request (not NextRequest)
 * - Collects all validation errors into a details array
 */

import { validateCsrfToken } from '../security/csrf';
import { escapeHtml } from '../security/html-escape';
import { extractClientIp } from '../security/ip-utils';
import { checkRateLimit } from '../rate-limiter';

interface ContactRouteConfig {
  siteSlug: string;
  businessName: string;
  businessEmail: string;
  fromEmail: string;
  themeColors: {
    brandPrimary: string;
    textPrimary: string;
    background: string;
    textMuted: string;
  };
  rateLimit: boolean;
}

interface ContactSubmission {
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  service: string | null;
  location: string | null;
  message: string;
  receivedAt: string;
  userAgent: string | null;
  referer: string | null;
  ip: string;
  extraFields: Record<string, string>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function createContactHandler(config: ContactRouteConfig) {
  return async function POST(request: Request): Promise<Response> {
    try {
      // CSRF token validation
      const csrfError = validateCsrfToken(request);
      if (csrfError) {
        return csrfError;
      }

      // Rate limiting
      const ip = extractClientIp(request);

      if (config.rateLimit) {
        const rateLimit = await checkRateLimit(ip, {
          endpoint: '/api/contact',
          siteSlug: config.siteSlug,
        });

        if (!rateLimit.allowed) {
          return Response.json(
            {
              error: 'Too many requests. Please try again later or call us directly.',
              retryAfter: rateLimit.retryAfter,
            },
            {
              status: 429,
              headers: {
                'Retry-After': rateLimit.retryAfter?.toString() || '300',
              },
            }
          );
        }
      }

      // Parse request body
      let body: Record<string, unknown>;
      try {
        body = await request.json();
      } catch {
        return Response.json({ error: 'Invalid request body' }, { status: 400 });
      }

      if (!body || typeof body !== 'object') {
        return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
      }

      // Honeypot: silently reject bots that fill hidden fields
      if (body.website) {
        return Response.json({ success: true, message: 'Thank you for your message.' });
      }

      const name = (body.name as string ?? '').toString().trim();
      const email = (body.email as string ?? '').toString().trim().toLowerCase();
      const message = (body.message as string ?? '').toString().trim();
      const phone = body.phone ? (body.phone as string).toString().trim() : null;
      const subject = body.subject ? (body.subject as string).toString().trim() : null;
      const service = body.service ? (body.service as string).toString().trim() : null;
      const location = body.location ? (body.location as string).toString().trim() : null;

      // Collect all validation errors
      const errors: string[] = [];
      if (!name) errors.push('Name is required.');
      if (name.length > 100) errors.push('Name must be 100 characters or less.');
      if (!email) errors.push('Email is required.');
      if (email.length > 254) errors.push('Email must be 254 characters or less.');
      if (email && !EMAIL_REGEX.test(email)) errors.push('Email format looks invalid.');
      if (!message) errors.push('Message is required.');
      if (message.length > 2000) errors.push('Message must be 2000 characters or less.');
      if (phone && phone.length > 30) errors.push('Phone must be 30 characters or less.');
      if (subject && subject.length > 200) errors.push('Subject must be 200 characters or less.');
      if (service && service.length > 100) errors.push('Service must be 100 characters or less.');
      if (location && location.length > 100) errors.push('Location must be 100 characters or less.');

      if (errors.length) {
        return Response.json({ error: 'Validation failed', details: errors }, { status: 422 });
      }

      // Collect any extra fields beyond the standard ones
      const standardFields = new Set(['name', 'email', 'phone', 'subject', 'service', 'location', 'message', 'website']);
      const extraFields: Record<string, string> = {};
      for (const [key, val] of Object.entries(body)) {
        if (!standardFields.has(key) && typeof val === 'string') {
          extraFields[key] = val.trim().slice(0, 200);
        }
      }

      // Build submission data
      const submission: ContactSubmission = {
        name,
        email,
        phone,
        subject: subject || 'Contact form submission',
        service,
        location,
        message,
        receivedAt: new Date().toISOString(),
        userAgent: request.headers.get('user-agent') || null,
        referer: request.headers.get('referer') || null,
        ip: ip !== 'unknown' ? ip : 'unknown',
        extraFields,
      };

      // Send email
      const emailSent = await sendContactEmail(submission, config);

      if (process.env.NODE_ENV === 'development') {
        console.log('Contact form submission received', { receivedAt: submission.receivedAt, emailSent });
      }

      return Response.json({
        success: true,
        message: 'Thank you for your message. We will get back to you within 24 hours.',
      });
    } catch (error) {
      console.error('Contact form error:', error);
      return Response.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
  };
}

async function sendContactEmail(
  submission: ContactSubmission,
  config: ContactRouteConfig
): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Resend not configured - email not sent. Submission logged to console.');
      console.log('Contact submission details:', submission);
    }
    return false;
  }

  try {
    const { themeColors: colors, businessName, businessEmail, fromEmail } = config;

    // HTML-escape all user inputs
    const safe = {
      name: escapeHtml(submission.name),
      email: escapeHtml(submission.email),
      phone: submission.phone ? escapeHtml(submission.phone) : null,
      service: submission.service ? escapeHtml(submission.service) : null,
      location: submission.location ? escapeHtml(submission.location) : null,
      message: escapeHtml(submission.message),
      subject: submission.subject ? escapeHtml(submission.subject) : null,
      referer: submission.referer ? escapeHtml(submission.referer) : null,
      ip: submission.ip !== 'unknown' ? escapeHtml(submission.ip) : null,
    };

    // Extra fields rows
    const extraFieldRows = Object.entries(submission.extraFields)
      .map(
        ([key, val]) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">${escapeHtml(key)}:</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(val)}</td>
    </tr>`
      )
      .join('');

    const emailSubject = submission.subject !== 'Contact form submission'
      ? escapeHtml(submission.subject)
      : `New enquiry from ${safe.name}${safe.service ? ` - ${safe.service}` : ''}${safe.location ? ` (${safe.location})` : ''}`;

    // Business notification email
    const businessEmailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>New Contact Form Submission</title></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: ${colors.brandPrimary}; border-bottom: 2px solid ${colors.brandPrimary}; padding-bottom: 10px;">New Contact Form Submission</h1>

  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Name:</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${safe.name}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${safe.email}">${safe.email}</a></td>
    </tr>
    ${safe.phone ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Phone:</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="tel:${safe.phone}">${safe.phone}</a></td></tr>` : ''}
    ${safe.service ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Service:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safe.service}</td></tr>` : ''}
    ${safe.location ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Location:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safe.location}</td></tr>` : ''}
    ${safe.subject && submission.subject !== 'Contact form submission' ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Subject:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safe.subject}</td></tr>` : ''}
    ${extraFieldRows}
  </table>

  <h2 style="color: ${colors.textPrimary}; margin-top: 30px;">Message:</h2>
  <div style="background: ${colors.background}; padding: 15px; border-radius: 8px; white-space: pre-wrap;">${safe.message}</div>

  <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
  <p style="font-size: 12px; color: ${colors.textMuted};">
    Received: ${new Date(submission.receivedAt).toLocaleString('en-GB')}<br>
    ${safe.ip ? `IP: ${safe.ip}<br>` : ''}
    ${safe.referer ? `From: ${safe.referer}` : ''}
  </p>
</body>
</html>`;

    // Send to business
    const businessResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: `${businessName} <${fromEmail}>`,
        to: businessEmail,
        replyTo: submission.email,
        subject: `New Contact: ${emailSubject}`,
        html: businessEmailHtml,
      }),
    });

    if (!businessResponse.ok) {
      console.error('Failed to send business notification email:', await businessResponse.text());
    }

    // Customer confirmation email
    const customerEmailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Thank You for Contacting Us</title></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: ${colors.brandPrimary};">Thank You for Contacting ${escapeHtml(businessName)}</h1>

  <p>Dear ${safe.name},</p>
  <p>Thank you for getting in touch with us. We have received your message and will respond within 24 hours.</p>

  <h2 style="color: ${colors.textPrimary}; margin-top: 30px;">What Happens Next?</h2>
  <ol>
    <li>Our team will review your enquiry</li>
    <li>We'll prepare a tailored response or quote</li>
    <li>We'll contact you via your preferred method</li>
  </ol>

  <p>If your matter is urgent, please don't hesitate to call us directly.</p>

  <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
  <p style="font-size: 14px; color: ${colors.textMuted};">
    This is an automated confirmation email. Please do not reply directly to this message.
  </p>
</body>
</html>`;

    const customerResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: `${businessName} <${fromEmail}>`,
        to: submission.email,
        subject: `Thank you for contacting ${businessName}`,
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
