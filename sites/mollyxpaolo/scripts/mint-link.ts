#!/usr/bin/env tsx
/**
 * Print a signed share link. Run locally with the production secret and version in env:
 *
 *   MXP_LINK_SECRET=… MXP_LINK_VERSION=1 pnpm --filter mollyxpaolo mint-link -- --days 365 \
 *     --origin https://mollyxpaolo.vercel.app
 *
 * The link works until it expires or MXP_LINK_VERSION is bumped, whichever comes first.
 */
import { signToken } from '../lib/token';

function arg(name: string, fallback: string): string {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const secret = process.env.MXP_LINK_SECRET;
if (!secret) throw new Error('MXP_LINK_SECRET is required');
const version = Number(process.env.MXP_LINK_VERSION ?? '1');
const days = Number(arg('days', '365'));
const origin = arg('origin', 'http://localhost:3000').replace(/\/$/, '');
const exp = Math.floor(Date.now() / 1000) + days * 24 * 60 * 60;

signToken({ s: 'guest', v: version, exp }, secret).then((token) => {
  console.log(`${origin}/s/${token}`);
  console.log(`version ${version}, expires ${new Date(exp * 1000).toISOString()}`);
});
