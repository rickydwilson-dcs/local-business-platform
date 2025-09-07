// app/api/contact/route.tsx
/* eslint-disable @typescript-eslint/consistent-type-definitions */

export const runtime = "nodejs";            // Explicit runtime for Vercel/Next 15
export const dynamic = "force-dynamic";     // Ensure the route always runs on request

type ContactPayload = {
  name: string;
  email: string;
  message: string;
  phone?: string;
  subject?: string;
  service?: string;   // e.g., "access-scaffolding"
  location?: string;  // e.g., "bexhill"
};

function isValidEmail(email: string): boolean {
  // Simple, safe email check (keeps ESLint happy; no heavy regex)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request): Promise<Response> {
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

    // TODO: hook in your mail/CRM provider here (e.g., SendGrid, SES, HubSpot, etc.)
    // Example shape you might send downstream:
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

    // For now, just acknowledge. Avoid console.log in lambdas unless needed.
    // If you want to debug locally, uncomment:
    // console.log("Contact submission:", submission);

    return Response.json(
      {
        ok: true,
        message: "Thanks! Your enquiry has been received.",
        received: submission,
      },
      { status: 200 }
    );
  } catch (err) {
    // Narrow error type without using `any`
    const message =
      err instanceof Error ? err.message : "Unexpected error while processing request.";
    return Response.json(
      { error: "Server error", details: message },
      { status: 500 }
    );
  }
}

// Optional: allow preflight/CORS if you ever post from another origin.
// Remove if not needed.
/*
export async function OPTIONS(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}
*/
