import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/image";

interface BlogPostCardProps {
  slug: string;
  title: string;
  excerpt: string;
  heroImage?: string;
  date: string;
  readingTime?: number;
  category?: string;
  categoryLabel?: string;
}

export function BlogPostCard({
  slug,
  title,
  excerpt,
  heroImage,
  date,
  readingTime,
  category,
  categoryLabel,
}: BlogPostCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Link
      href={`/blog/${slug}`}
      className="group relative bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-brand-blue/10 to-brand-blue/20">
        {heroImage ? (
          <Image
            src={getImageUrl(heroImage)}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-brand-blue/20 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-brand-blue"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Category Badge */}
        {categoryLabel && (
          <div className="absolute top-4 left-4">
            <span className="inline-block px-3 py-1 bg-brand-blue/90 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
              {categoryLabel}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Meta */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <time dateTime={date}>{formattedDate}</time>
          {readingTime && (
            <>
              <span>·</span>
              <span>{readingTime} min read</span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-blue transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
          {excerpt}
        </p>

        {/* CTA */}
        <div className="mt-auto">
          <span className="inline-flex items-center text-brand-blue font-semibold text-sm group-hover:gap-2 transition-all">
            Read article
            <svg
              className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
