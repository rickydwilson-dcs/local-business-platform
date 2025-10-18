// components/ui/content-card.tsx
import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/image";

interface ContentCardProps {
  title: string;
  description?: string;
  href: string;
  fallbackDescription?: string;
  badge?: string;
  image?: string;
  features?: string[];
  towns?: string[];
  subtitle?: string[];
  isHeadquarters?: boolean;
  contentType?: "services" | "locations";
}

export function ContentCard({
  title,
  description,
  href,
  fallbackDescription,
  badge,
  image,
  features,
  towns,
  subtitle,
  isHeadquarters,
  contentType = "services",
}: ContentCardProps) {
  return (
    <Link
      href={href}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group relative block cursor-pointer overflow-hidden h-full flex flex-col"
    >
      {(badge || isHeadquarters) && contentType !== "services" && (
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1 bg-brand-blue text-white text-sm font-medium rounded-full">
            {badge || (isHeadquarters ? "Headquarters" : "")}
          </span>
        </div>
      )}

      <div
        className={`relative h-48 rounded-t-2xl overflow-hidden flex items-center justify-center ${
          !(image && contentType === "services")
            ? "bg-gradient-to-br from-brand-blue/10 to-brand-blue/20"
            : ""
        }`}
      >
        {/* Subtitle pills at top */}
        {subtitle && subtitle.length > 0 && (
          <div className="absolute top-4 left-4 right-4">
            <div className="flex flex-wrap gap-2">
              {subtitle.map((item, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 bg-[#005A9E]/90 text-white text-sm font-semibold rounded-full backdrop-blur-sm shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Centered icon - only show when no image for services */}
        {!(image && contentType === "services") && (
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
        )}

        {/* Background image with overlay for services that have images */}
        {image && contentType === "services" && (
          <div className="absolute inset-0">
            <Image
              src={getImageUrl(image)}
              alt={`${title} ${contentType === "services" ? "scaffolding services" : ""}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>

        <p className="text-gray-800 text-sm leading-relaxed mb-4">
          {description ?? fallbackDescription ?? `Learn more about ${title.toLowerCase()}.`}
        </p>

        {(features || towns) && (
          <ul className="space-y-2 mb-6 flex-grow">
            {(features || towns)?.slice(0, 3).map((item, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                <span className="text-gray-700 line-clamp-1">{item}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto">
          <div className="inline-flex items-center justify-center w-full px-4 py-3 bg-[#005A9E] text-white font-semibold rounded-lg hover:bg-[#004a85] group-hover:scale-105 transition-all duration-200 text-sm focus:ring-2 focus:ring-[#005A9E] focus:ring-offset-2">
            {contentType === "services" ? "Learn More" : "View Location Info"}
          </div>
        </div>
      </div>
    </Link>
  );
}
