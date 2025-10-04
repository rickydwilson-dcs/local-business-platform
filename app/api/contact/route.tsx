// app/api/contact/route.tsx
import { Resend } from "resend";
import { checkRateLimit } from "@/lib/rate-limiter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

type ContactPayload = {
  name: string;
  email: string;
  message: string;
  phone?: string;
  subject?: string;
  service?: string; // e.g., "access-scaffolding"
  location?: string; // e.g., "bexhill"
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request): Promise<Response> {
  // Rate limiting check using Upstash Redis
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("cf-connecting-ip") ||
    "unknown";

  const rateLimit = await checkRateLimit(ip);

  if (!rateLimit.allowed) {
    return Response.json(
      {
        error: "Something went wrong. Please call us directly on the number below.",
        retryAfter: rateLimit.retryAfter,
      },
      {
        status: 429,
        headers: {
          "Retry-After": rateLimit.retryAfter?.toString() || "300",
        },
      }
    );
  }
  try {
    const body = (await request.json()) as Partial<ContactPayload> | null;

    if (!body || typeof body !== "object") {
      return Response.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const name = (body.name ?? "").toString().trim();
    const email = (body.email ?? "").toString().trim().toLowerCase();
    const message = (body.message ?? "").toString().trim();

    // Optional fields
    const phone = body.phone?.toString().trim();
    const subject = body.subject?.toString().trim();
    const service = body.service?.toString().trim();
    const location = body.location?.toString().trim();

    // Basic validation
    const errors: string[] = [];
    if (!name) errors.push("Name is required.");
    if (!email) errors.push("Email is required.");
    if (email && !isValidEmail(email)) errors.push("Email format looks invalid.");
    if (!message) errors.push("Message is required.");

    if (errors.length) {
      return Response.json({ error: "Validation failed", details: errors }, { status: 422 });
    }

    // Build submission data
    const submission = {
      name,
      email,
      message,
      phone: phone || null,
      subject: subject || "Contact form submission",
      service: service || null,
      location: location || null,
      receivedAt: new Date().toISOString(),
      userAgent: request.headers.get("user-agent") || null,
      referer: request.headers.get("referer") || null,
      ip: request.headers.get("x-forwarded-for") || null,
    };

    // Create email subject
    const emailSubject =
      subject ||
      `New enquiry from ${name}${service ? ` - ${service}` : ""}${location ? ` (${location})` : ""}`;

    // Create email HTML content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #00607A; border-bottom: 2px solid #00607A; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Contact Details</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
          ${service ? `<p><strong>Service:</strong> ${service}</p>` : ""}
          ${location ? `<p><strong>Location:</strong> ${location}</p>` : ""}
        </div>

        <div style="margin: 20px 0;">
          <h3 style="color: #333;">Message</h3>
          <div style="background: white; padding: 20px; border-left: 4px solid #00607A; white-space: pre-wrap;">${message}</div>
        </div>

        <div style="background: #f1f3f4; padding: 15px; border-radius: 4px; margin: 20px 0; font-size: 12px; color: #666;">
          <p><strong>Submission Details:</strong></p>
          <p>Received: ${new Date().toLocaleString("en-GB")}</p>
          ${submission.referer ? `<p>From page: ${submission.referer}</p>` : ""}
          ${submission.ip ? `<p>IP: ${submission.ip}</p>` : ""}
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px;">
          <p>This email was sent from the Colossus Scaffolding contact form</p>
        </div>
      </div>
    `;

    // Send email via Resend
    try {
      // Check if Resend is configured
      if (!resend || !process.env.BUSINESS_EMAIL || !process.env.BUSINESS_NAME) {
        console.log("Email service not configured. Logging submission instead:");
        console.log("Email Subject:", emailSubject);
        console.log(
          "Business Email would be sent to:",
          process.env.BUSINESS_EMAIL || "Not configured"
        );
        console.log("Email HTML:", emailHtml);

        return Response.json(
          {
            ok: true,
            message: "Thanks! Your enquiry has been received.",
            received: submission,
          },
          { status: 200 }
        );
      }

      const emailResult = await resend.emails.send({
        from: `${process.env.BUSINESS_NAME} <noreply@email.colossus-scaffolding.co.uk>`,
        to: [process.env.BUSINESS_EMAIL!],
        replyTo: email, // Allow direct reply to customer
        subject: emailSubject,
        html: emailHtml,
      });

      console.log("Email sent successfully:", emailResult.data?.id);

      // Send confirmation email to customer
      const confirmationHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00607A;">Thank You for Your Enquiry</h2>

          <p>Hi ${name},</p>

          <p>Thank you for contacting Colossus Scaffolding. We have received your enquiry and will respond as soon as possible, typically within 24 hours.</p>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Your Enquiry Summary</h3>
            ${service ? `<p><strong>Service:</strong> ${service}</p>` : ""}
            ${location ? `<p><strong>Location:</strong> ${location}</p>` : ""}
            <p><strong>Message:</strong></p>
            <div style="white-space: pre-wrap; background: white; padding: 15px; border-radius: 4px;">${message}</div>
          </div>

          <div style="background: #00607A; color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">What Happens Next?</h3>
            <ul style="padding-left: 20px;">
              <li>We'll review your enquiry within 2-4 hours</li>
              <li>One of our scaffolding experts will contact you</li>
              <li>We'll arrange a free site survey if required</li>
              <li>You'll receive a detailed quote</li>
            </ul>
          </div>

          <p>For urgent enquiries, please call us directly.</p>

          <p>Best regards,<br>
          <strong>Colossus Scaffolding Team</strong></p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px;">
            <p>Colossus Scaffolding - Professional Scaffolding Services across South East England</p>
          </div>
        </div>
      `;

      await resend.emails.send({
        from: `${process.env.BUSINESS_NAME} <noreply@email.colossus-scaffolding.co.uk>`,
        to: [email],
        subject: `Thank you for your enquiry - ${process.env.BUSINESS_NAME}`,
        html: confirmationHtml,
      });

      return Response.json(
        {
          ok: true,
          message: "Thanks! Your enquiry has been received. Check your email for confirmation.",
          received: submission,
        },
        { status: 200 }
      );
    } catch (emailError) {
      console.error("Email sending failed:", emailError);

      // Still return success to user, but log the email failure
      return Response.json(
        {
          ok: true,
          message: "Thanks! Your enquiry has been received.",
          received: submission,
          warning: "Email notification may be delayed.",
        },
        { status: 200 }
      );
    }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unexpected error while processing request.";
    console.error("Contact form error:", err);

    return Response.json({ error: "Server error", details: message }, { status: 500 });
  }
}
