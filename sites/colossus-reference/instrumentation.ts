/**
 * Next.js instrumentation file
 * This file is automatically loaded by Next.js before the application starts.
 * Used to initialize NewRelic monitoring.
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // Only load NewRelic in Node.js runtime (not Edge runtime)
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Import NewRelic agent
    await import("newrelic");

    console.log("✅ NewRelic instrumentation loaded");
  }
}
