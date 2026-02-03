/**
 * MDX Components
 * ==============
 *
 * Custom components for MDX content rendering.
 * Used by both native MDX pages and next-mdx-remote.
 *
 * CUSTOMIZATION:
 * - Add your own custom components to the mdxComponents object
 * - Customize styling to match your brand
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { MDXComponents as MDXMap } from 'mdx/types';
import { Schema } from '@/components/Schema';
import { ArticleCallout } from '@/components/ui/article-callout';

// ============================================================================
// Custom MDX Components
// ============================================================================

/**
 * Info box for callouts and highlights
 */
interface InfoBoxProps {
  type?: 'info' | 'tip' | 'warning' | 'success';
  title?: string;
  children: React.ReactNode;
}

const InfoBox: React.FC<InfoBoxProps> = ({ type = 'info', title, children }) => {
  const styles = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      title: 'text-blue-900',
    },
    tip: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-600',
      title: 'text-green-900',
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: 'text-amber-600',
      title: 'text-amber-900',
    },
    success: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      icon: 'text-emerald-600',
      title: 'text-emerald-900',
    },
  };

  const icons = {
    info: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
    tip: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    ),
    warning: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    ),
    success: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  };

  const s = styles[type];

  return (
    <div className={`${s.bg} ${s.border} border rounded-xl p-5 my-8`}>
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <svg
            className={`w-6 h-6 ${s.icon}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {icons[type]}
          </svg>
        </div>
        <div className="flex-1">
          {title && <h4 className={`font-semibold ${s.title} mb-2`}>{title}</h4>}
          <div className="text-gray-700 text-sm leading-relaxed [&>p]:my-0">{children}</div>
        </div>
      </div>
    </div>
  );
};

/**
 * Quote block with optional author attribution
 */
interface QuoteBlockProps {
  author?: string;
  role?: string;
  children: React.ReactNode;
}

const QuoteBlock: React.FC<QuoteBlockProps> = ({ author, role, children }) => {
  return (
    <blockquote className="my-8 border-l-4 border-brand-primary bg-surface-subtle rounded-r-xl p-6">
      <div className="text-surface-foreground text-lg italic leading-relaxed mb-4">{children}</div>
      {author && (
        <footer className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-brand-on-primary font-semibold">
            {author.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-surface-foreground">{author}</p>
            {role && <p className="text-sm text-surface-muted">{role}</p>}
          </div>
        </footer>
      )}
    </blockquote>
  );
};

/**
 * Image with caption
 */
interface ImageWithCaptionProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

const ImageWithCaption: React.FC<ImageWithCaptionProps> = ({
  src,
  alt,
  caption,
  width = 800,
  height = 500,
}) => {
  return (
    <figure className="my-8">
      <div className="relative rounded-xl overflow-hidden shadow-md">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto object-cover"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm text-surface-muted text-center italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

// ============================================================================
// MDX Components Map
// ============================================================================

const mdxComponents: MDXMap = {
  // Links
  a: (props) => {
    const href = typeof props.href === 'string' ? props.href : '';
    const isInternal = href.startsWith('/');
    if (isInternal) {
      return (
        <Link
          href={href}
          className="text-brand-primary hover:text-brand-primary-hover font-medium underline underline-offset-2 transition-colors"
        >
          {props.children}
        </Link>
      );
    }
    return (
      <a
        {...props}
        className="text-brand-primary hover:text-brand-primary-hover font-medium underline underline-offset-2 transition-colors"
      />
    );
  },

  // Headings
  h2: (p) => (
    <h2 className={`text-2xl sm:text-3xl font-bold text-surface-foreground mt-12 mb-6`}>
      {p.children}
    </h2>
  ),

  h3: (p) => (
    <h3 className={`text-xl font-semibold text-surface-foreground mt-8 mb-4`}>{p.children}</h3>
  ),

  // Paragraph
  p: (p) => <p className="text-surface-muted-foreground leading-relaxed my-4">{p.children}</p>,

  // Lists
  ul: (p) => <ul className="space-y-3 my-6">{p.children}</ul>,

  ol: (p) => (
    <ol className="space-y-4 my-6" style={{ counterReset: 'item' }}>
      {p.children}
    </ol>
  ),

  li: (p) => (
    <li className="flex items-start gap-3 p-4 bg-surface-subtle rounded-lg list-none">
      <div className="flex-shrink-0 w-2 h-2 bg-brand-primary rounded-full mt-2" />
      <div className="text-surface-foreground">{p.children}</div>
    </li>
  ),

  // Text formatting
  strong: (p) => <strong className="font-semibold text-surface-foreground">{p.children}</strong>,

  // Horizontal rule
  hr: () => <hr className="my-10 border-t border-surface-border" />,

  // Images
  img: (p) => {
    const { src = '', alt = '', width, height, ...rest } = p;
    const w = typeof width === 'number' ? width : 1200;
    const h = typeof height === 'number' ? height : 800;
    return <Image src={src} alt={alt} width={w} height={h} {...rest} className="rounded-xl" />;
  },

  // Schema.org component
  Schema,

  // Custom components
  InfoBox,
  QuoteBlock,
  ImageWithCaption,
  ArticleCallout,
};

export default mdxComponents;

/**
 * Hook for Next.js native MDX support
 * Required for mdx-components.tsx file at project root
 */
export function useMDXComponents(components: MDXMap): MDXMap {
  return { ...mdxComponents, ...components };
}
