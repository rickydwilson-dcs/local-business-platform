/**
 * CSRF Token Generation API
 *
 * Generates CSRF tokens for client-side use in forms and API requests.
 * Tokens are required for all state-changing operations to prevent CSRF attacks.
 *
 * @endpoint GET /api/csrf-token
 * @returns JSON with CSRF token and expiration time
 */

import { generateCsrfToken } from '@platform/core-components/lib/security/csrf';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(): Promise<Response> {
  try {
    // Generate token with 1 hour expiration
    const token = generateCsrfToken(3600);

    return Response.json(
      {
        token,
        expiresIn: 3600,
        expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          Pragma: 'no-cache',
        },
      }
    );
  } catch (error) {
    console.error('CSRF token generation error:', error);
    return Response.json({ error: 'Failed to generate CSRF token' }, { status: 500 });
  }
}
