// components/ui/content-card.tsx
import Link from "next/link";
import Image from "next/image";

interface ContentCardProps {
  title: string;
  description?: string;
  href: string;
  fallbackDescription?: string;
  badge?: string;
  image?: string;
  features?: string[];
  towns?: string[];
  isHeadquarters?: boolean;
  contentType?: 'services' | 'locations';
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
  isHeadquarters,
  contentType = 'services'
}: ContentCardProps) {
  return (
    <Link
      href={href}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group relative block cursor-pointer overflow-hidden"
    >
      {(badge || isHeadquarters) && (
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1 bg-brand-blue text-white text-sm font-medium rounded-full">
            {badge || (isHeadquarters ? "Headquarters" : "")}
          </span>
        </div>
      )}
      
      <div className="relative h-48 bg-gray-200 rounded-t-2xl overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={`${title} ${contentType === 'services' ? 'scaffolding services' : ''}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-gray-400 text-center">
              {contentType === 'services' ? (
                <>
                  <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Service Image</span>
                </>
              ) : (
                <>
                  <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Location Image</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col h-full">
        {contentType === 'locations' && (
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-blue/10 rounded-lg">
              <svg className="w-6 h-6 text-brand-blue" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
        
        <h2 className={`font-serif font-bold text-gray-900 mb-3 line-clamp-1 ${contentType === 'locations' ? 'text-xl' : 'text-xl'}`}>
          {title}
        </h2>
        
        <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-2 flex-grow-0">
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

        <div className="inline-flex items-center gap-2 text-brand-blue group-hover:text-brand-blue-hover font-semibold text-sm transition-colors mt-auto">
          {contentType === 'services' ? `Learn About ${title}` : 'View Local Info'}
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}