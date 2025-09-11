import Link from "next/link";

interface GridItem {
  slug: string;
  title: string;
  description?: string;
  href?: string;
  isHeadquarters?: boolean;
  towns?: string[];
}

interface CardGridProps {
  items: GridItem[];
  basePath: string;
  linkText?: string;
  showPlaceholderImage?: boolean;
  imageIcon?: "location" | "image";
}

export function CardGrid({
  items = [], // Default to empty array
  basePath,
  linkText = "Learn More",
  showPlaceholderImage = true,
  imageIcon = "image"
}: CardGridProps) {
  // Return early if no items
  if (!items || items.length === 0) {
    return (
      <div className="text-center text-gray-600">
        <p>No items found.</p>
      </div>
    );
  }

  const getIcon = () => {
    if (imageIcon === "location") {
      return (
        <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
      </svg>
    );
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.slug}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow relative group"
        >
          {item.isHeadquarters && (
            <span className="absolute -top-2 -right-2 px-2 py-1 bg-brand-blue text-white text-xs rounded-full z-10">
              Headquarters
            </span>
          )}

          {showPlaceholderImage && (
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                {getIcon()}
                <span className="text-sm">
                  {imageIcon === "location" ? "Location Image" : "Image Coming Soon"}
                </span>
              </div>
            </div>
          )}

          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              <Link
                href={item.href || `${basePath}/${item.slug}`}
                className="hover:text-brand-blue transition-colors"
              >
                {item.title}
              </Link>
            </h2>

            <p className="text-gray-600 mb-4">
              {item.description || `Learn more about ${item.title.toLowerCase()}.`}
            </p>

            {item.towns && (
              <div className="mb-4">
                <h4 className="font-semibold text-sm text-gray-900 mb-2">Key Towns & Cities:</h4>
                <div className="flex flex-wrap gap-1">
                  {item.towns.map((town, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded border">
                      {town}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Link
              href={item.href || `${basePath}/${item.slug}`}
              className="inline-flex items-center text-brand-blue hover:text-brand-blue-hover font-medium"
            >
              {linkText} →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
