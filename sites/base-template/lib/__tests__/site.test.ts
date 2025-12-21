import { describe, it, expect } from 'vitest';
import { absUrl, formatPhone, slugify, telLink, mailtoLink } from '../site';

describe('site utilities', () => {
  describe('absUrl', () => {
    it('should generate absolute URL from relative path', () => {
      const url = absUrl('/contact');
      expect(url).toContain('/contact');
    });

    it('should handle paths without leading slash', () => {
      const url = absUrl('about');
      expect(url).toContain('/about');
    });
  });

  describe('formatPhone', () => {
    it('should format UK phone number', () => {
      const formatted = formatPhone('+441234567890');
      expect(formatted).toBe('01234 567 890');
    });
  });

  describe('telLink', () => {
    it('should create tel: link', () => {
      const link = telLink('+441234567890');
      expect(link).toBe('tel:+441234567890');
    });
  });

  describe('mailtoLink', () => {
    it('should create mailto: link', () => {
      const link = mailtoLink('test@example.com');
      expect(link).toBe('mailto:test@example.com');
    });

    it('should create mailto: link with subject', () => {
      const link = mailtoLink('test@example.com', 'Hello');
      expect(link).toBe('mailto:test@example.com?subject=Hello');
    });
  });

  describe('slugify', () => {
    it('should convert text to URL-friendly slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Test & Example')).toBe('test-example');
      expect(slugify('Multiple   Spaces')).toBe('multiple-spaces');
    });
  });
});
