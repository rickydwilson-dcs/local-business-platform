import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// jsdom does not implement IntersectionObserver (jsdom/jsdom#2032 — still open
// as of jsdom 27, which is the version pinned here). Every browser this site
// targets has it, and `components/home/home-behaviour.tsx` uses it for the
// latched `.panel` reveals, so rendering the homepage in a test throws without
// this. A no-op stub is the right shape: jsdom has no layout engine, so it
// could never report a real intersection anyway — the reveal behaviour is
// verified in a real browser, not here. Do NOT replace this with a guard in
// the component; that would silently disable reveals in production too.
class NoopIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '0px';
  readonly thresholds: ReadonlyArray<number> = [];
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

if (typeof globalThis.IntersectionObserver === 'undefined') {
  globalThis.IntersectionObserver =
    NoopIntersectionObserver as unknown as typeof IntersectionObserver;
}

// jsdom does not implement scrolling: calling `window.scrollTo` logs
// "Not implemented: Window's scrollTo() method" to the virtual console for
// every test that touches it. `ContactForm` calls it to bring the
// confirmation panel under the fixed header on submit, so three tests print
// that line. Stubbed to a no-op — jsdom has no layout to scroll, so there is
// nothing to assert either way, and the noise would otherwise sit in the
// output where a real error should stand out.
if (typeof window !== 'undefined') {
  window.scrollTo = (() => {}) as typeof window.scrollTo;
}

// Cleanup after each test case
afterEach(() => {
  cleanup();
});
