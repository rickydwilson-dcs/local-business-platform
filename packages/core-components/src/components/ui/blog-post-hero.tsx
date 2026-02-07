import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/image";

// Blog post props
interface BlogPostHeroProps {
  variant: "blog";
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

// Project props
interface ProjectHeroProps {
  variant: "project";
  title: string;
  description: string;
  category: string;
  categoryLabel: string;
  locationName: string;
  year: number;
  duration?: string;
  heroImage: string;
}

type ContentHeroProps = BlogPostHeroProps | ProjectHeroProps;

export function BlogPostHero(props: ContentHeroProps) {
  // Common rendering logic
  const { title, category, categoryLabel, heroImage } = props;

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="mx-auto w-full lg:w-[90%] px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Side */}
          <div>
            {/* Category Badge */}
            <div className="mb-6">
              {props.variant === "blog" ? (
                <Link
                  href={`/blog?category=${category}`}
                  className="inline-block px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-full hover:bg-brand-blue-hover transition-colors"
                >
                  {categoryLabel}
                </Link>
              ) : (
                <span className="inline-block px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-full">
                  {categoryLabel}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="heading-hero">{title}</h1>

            {/* Description/Excerpt */}
            <p className="text-xl text-gray-800 mb-8 leading-relaxed">
              {props.variant === "blog" ? props.excerpt : props.description}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              {props.variant === "blog" ? (
                <>
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-brand-blue rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {props.author.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{props.author.name}</p>
                      {props.author.role && (
                        <p className="text-sm text-gray-600">{props.author.role}</p>
                      )}
                    </div>
                  </div>

                  <span className="hidden sm:block text-gray-300">|</span>

                  {/* Date & Reading Time */}
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <time dateTime={props.date}>
                        {new Date(props.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </time>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{props.readingTime} min read</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Location */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{props.locationName}</span>
                  </div>

                  <span className="hidden sm:block text-gray-300">|</span>

                  {/* Year */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{props.year}</span>
                  </div>

                  {/* Duration (if provided) */}
                  {props.duration && (
                    <>
                      <span className="hidden sm:block text-gray-300">|</span>
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{props.duration}</span>
                      </div>
                    </>
                  )}
                </>
              )}
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
                  <span className="text-lg font-medium">
                    {props.variant === "blog" ? "Article Image" : "Project Image"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
