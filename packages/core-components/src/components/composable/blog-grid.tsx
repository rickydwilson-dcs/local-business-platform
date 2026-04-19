import Link from "next/link";
import Image from "next/image";
import type { LayoutParams } from "./layout-params";

export interface BlogGridSlots {
  showSectionHeading: boolean;
  showCategory: boolean;
  showDate: boolean;
  showAuthor: boolean;
  showExcerpt: boolean;
  showReadingTime: boolean;
  showCta: boolean;
}

export const BLOG_GRID_DEFAULT_SLOTS: BlogGridSlots = {
  showSectionHeading: true,
  showCategory: true,
  showDate: true,
  showAuthor: false,
  showExcerpt: true,
  showReadingTime: false,
  showCta: false,
};

interface BlogPost {
  slug: string;
  title: string;
  excerpt?: string;
  date?: string;
  category?: string;
  heroImage?: string;
  author?: string;
  readingTime?: number;
  featured?: boolean;
}

interface BlogGridProps {
  slots?: Partial<BlogGridSlots>;
  layout?: Pick<LayoutParams, "columns" | "background">;
  data: Record<string, unknown>;
  className?: string;
}

function formatDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  const day = parsed.getDate();
  const month = parsed.toLocaleString("en-GB", { month: "short" });
  const year = parsed.getFullYear();
  return `${day} ${month} ${year}`;
}

export function BlogGrid({ slots: slotOverrides, layout, data, className }: BlogGridProps) {
  const slots = { ...BLOG_GRID_DEFAULT_SLOTS, ...slotOverrides };
  const d = data as Record<string, string | undefined>;

  const bg =
    layout?.background === "inverse"
      ? "bg-surface-inverse text-surface-inverse-foreground"
      : layout?.background === "subtle"
        ? "bg-surface-subtle text-surface-foreground"
        : "bg-surface-background text-surface-foreground";

  const cols = layout?.columns ?? 3;
  const gridCols =
    cols === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  const posts = Array.isArray(data.posts) ? (data.posts as BlogPost[]) : [];
  const ctaText = typeof data.ctaText === "string" ? data.ctaText : undefined;
  const ctaHref = typeof data.ctaHref === "string" ? data.ctaHref : undefined;

  return (
    <section className={`${bg} ${className ?? ""}`} data-component="BlogGrid">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {slots.showSectionHeading && (d.heading || d.subheading) && (
          <div className="mb-12 text-center">
            {d.heading && (
              <h2 data-slot="heading" className="text-h2 mb-4">
                {d.heading}
              </h2>
            )}
            {d.subheading && (
              <p data-slot="subheading" className="text-surface-muted-foreground text-lg">
                {d.subheading}
              </p>
            )}
          </div>
        )}

        <div className={`grid gap-8 ${gridCols}`}>
          {posts.map((post) => (
            <article
              key={post.slug}
              className="bg-surface-card border-surface-border overflow-hidden rounded-lg border"
            >
              {post.heroImage && (
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={post.heroImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="space-y-3 p-6">
                {slots.showCategory && post.category && (
                  <span
                    data-slot="category"
                    className="bg-brand-primary/10 text-brand-primary inline-block rounded-full px-3 py-1 text-xs font-semibold"
                  >
                    {post.category}
                  </span>
                )}
                {slots.showDate && post.date && (
                  <time
                    dateTime={post.date}
                    data-slot="date"
                    className="text-surface-muted-foreground text-xs"
                  >
                    {formatDate(post.date)}
                  </time>
                )}
                <h3 data-slot="title" className="text-surface-foreground text-xl font-bold">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                {slots.showExcerpt && post.excerpt && (
                  <p
                    data-slot="excerpt"
                    className="text-surface-muted-foreground line-clamp-2 text-sm"
                  >
                    {post.excerpt}
                  </p>
                )}
                {slots.showAuthor && post.author && (
                  <p data-slot="author" className="text-surface-muted-foreground text-sm">
                    {post.author}
                  </p>
                )}
                {slots.showReadingTime && typeof post.readingTime === "number" && (
                  <p data-slot="readingTime" className="text-surface-muted-foreground text-xs">
                    {post.readingTime} min read
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>

        {slots.showCta && ctaText && ctaHref && (
          <div className="mt-12 text-center">
            <Link
              href={ctaHref}
              data-slot="cta"
              className="bg-brand-primary text-brand-on-primary hover:bg-brand-primary/90 inline-block rounded-md px-6 py-3 font-semibold transition-colors"
            >
              {ctaText}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
