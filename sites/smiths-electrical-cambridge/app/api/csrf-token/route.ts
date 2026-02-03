/**
 * CSRF Token API Endpoint
 *
 * GET /api/csrf-token
 * Returns a new CSRF token for form submissions.
 */

import { NextResponse } from 'next/server';
import { generateCSRFToken } from '@/lib/csrf';

export async function GET() {
  try {
    const tokenData = await generateCSRFToken();

    return NextResponse.json({
      token: tokenData.token,
      expires: tokenData.expires,
    });
  } catch (error) {
    console.error('Failed to generate CSRF token:', error);
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
  }
}
