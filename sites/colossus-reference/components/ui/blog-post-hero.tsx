import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/image";

interface BlogPostHeroProps {
  title: string;
  excerpt: string;
  category: string;
  categoryLabel: string;
  date: string;
  readingTime: number;
  author: {
    name: string;
    role?: string;
  };
  heroImage?: string;
}

export function BlogPostHero({
  title,
  excerpt,
  category,
  categoryLabel,
  date,
  readingTime,
  author,
  heroImage,
}: BlogPostHeroProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="mx-auto w-full lg:w-[90%] px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Side */}
          <div>
            {/* Category Badge */}
            <div className="mb-6">
              <Link
                href={`/blog?category=${category}`}
                className="inline-block px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-full hover:bg-brand-blue-hover transition-colors"
              >
                {categoryLabel}
              </Link>
            </div>

            {/* Title */}
            <h1 className="heading-hero">{title}</h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-800 mb-8 leading-relaxed">{excerpt}</p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brand-blue rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {author.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{author.name}</p>
                  {author.role && <p className="text-sm text-gray-600">{author.role}</p>}
                </div>
              </div>

              <span className="hidden sm:block text-gray-300">|</span>

              {/* Date & Reading Time */}
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <time dateTime={date}>{formattedDate}</time>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{readingTime} min read</span>
                </div>
              </div>
            </div>
          </div>

          {/* Image Side */}
          <div className="relative">
            {heroImage ? (
              <Image
                src={getImageUrl(heroImage)}
                alt={title}
                width={600}
                height={400}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="rounded-2xl shadow-lg w-full object-cover"
                priority
                quality={65}
              />
            ) : (
              <div className="relative h-[400px] bg-gradient-to-br from-brand-blue/10 to-brand-blue/20 rounded-2xl shadow-lg flex items-center justify-center">
                <div className="text-gray-400 text-center">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-lg font-medium">Article Image</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
