import { generateCsrfToken } from '../security/csrf';

export function createCsrfTokenHandler(expirationSeconds = 3600) {
  return async function GET(): Promise<Response> {
    try {
      const token = generateCsrfToken(expirationSeconds);

      return Response.json(
        {
          token,
          expiresIn: expirationSeconds,
          expiresAt: new Date(Date.now() + expirationSeconds * 1000).toISOString(),
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
  };
}
