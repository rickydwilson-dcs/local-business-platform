import { describe, test, expect } from 'vitest';
import { fixBracketNotationProps, validateNoBracketProps, validatePropsAgainstInterface } from '../theme-component-generator';

describe('fixBracketNotationProps', () => {
  const fix = (input: string) => fixBracketNotationProps(input).content;

  test('converts hyphenated bracket notation to camelCase dot', () => {
    expect(fix(`props['post-thumbnail']`)).toBe('props.postThumbnail');
  });

  test('converts underscored bracket notation to camelCase dot', () => {
    expect(fix(`props['post_thumbnail']`)).toBe('props.postThumbnail');
  });

  test('converts PascalCase bracket notation to camelCase dot', () => {
    expect(fix(`props['PostThumbnail']`)).toBe('props.postThumbnail');
  });

  test('converts already-camelCase bracket notation to dot', () => {
    expect(fix(`props['postThumbnail']`)).toBe('props.postThumbnail');
  });

  test('handles double-quoted bracket notation', () => {
    expect(fix(`props["post-thumbnail"]`)).toBe('props.postThumbnail');
  });

  test('handles multiple occurrences in one string', () => {
    const input = `{props['heading']} and {props['sub-heading']}`;
    const result = fix(input);
    expect(result).toBe('{props.heading} and {props.subHeading}');
  });

  test('does not touch non-props bracket access', () => {
    const input = `data['post-thumbnail']`;
    expect(fix(input)).toBe(`data['post-thumbnail']`);
  });

  test('does not touch numeric index access', () => {
    expect(fix('props[0]')).toBe('props[0]');
  });

  test('does not touch dynamic key access', () => {
    expect(fix('props[key]')).toBe('props[key]');
  });

  test('counts fixes correctly', () => {
    const input = `{props['heading']} and {props['sub-heading']}`;
    const result = fixBracketNotationProps(input);
    expect(result.fixCount).toBe(2);
  });

  test('returns zero fixes for clean input', () => {
    const result = fixBracketNotationProps('props.heading');
    expect(result.fixCount).toBe(0);
  });
});

describe('validateNoBracketProps', () => {
  test('passes for dot-notation only', () => {
    expect(validateNoBracketProps('props.heading + props.body').valid).toBe(true);
  });

  test('fails for single-quoted bracket notation', () => {
    const result = validateNoBracketProps(`props['heading']`);
    expect(result.valid).toBe(false);
    expect(result.violations).toHaveLength(1);
  });

  test('fails for double-quoted bracket notation', () => {
    const result = validateNoBracketProps(`props["heading"]`);
    expect(result.valid).toBe(false);
  });

  test('reports line numbers in violations', () => {
    const input = `line1\nline2\nprops['bad']`;
    const result = validateNoBracketProps(input);
    expect(result.violations[0]).toContain('Line 3');
  });
});

describe('validatePropsAgainstInterface', () => {
  test('passes when all used props are declared', () => {
    const content = `
interface HeroProps {
  heading?: string;
  body?: string;
}
export const Hero = (props: HeroProps) => <div>{props.heading}{props.body}</div>;
`;
    expect(validatePropsAgainstInterface(content).valid).toBe(true);
  });

  test('fails when a used prop is not declared', () => {
    const content = `
interface HeroProps {
  heading?: string;
}
export const Hero = (props: HeroProps) => <div>{props.heading}{props.unknownProp}</div>;
`;
    const result = validatePropsAgainstInterface(content);
    expect(result.valid).toBe(false);
    expect(result.undeclaredProps).toContain('unknownProp');
  });

  test('passes when no interface is found', () => {
    const content = `export const Hero = () => <div>static</div>;`;
    expect(validatePropsAgainstInterface(content).valid).toBe(true);
  });
});
