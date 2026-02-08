import Image from "next/image";
import { generateImageAlt } from "@/lib/image";

interface ServiceGalleryProps {
  images?: string[];
  title?: string;
  description?: string;
  placeholderCount?: number;
  serviceName?: string;
  locationName?: string;
}

export function ServiceGallery({
  images = [],
  title = "Project Gallery",
  description = "View our professional installations and completed projects.",
  placeholderCount = 6,
  serviceName = "Project",
  locationName,
}: ServiceGalleryProps) {
  // If no images provided, use placeholders
  const displayImages = images.length > 0 ? images : Array(placeholderCount).fill(null);

  return (
    <section className="section-standard bg-white">
      <div className="container-standard">
        <div className="mx-auto w-full lg:w-[90%] text-center mb-12">
          <h2 className="heading-section">{title}</h2>
          {description && <p className="text-body-lg">{description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayImages.map((src, i) => (
            <div
              key={i}
              className="relative h-64 rounded-2xl overflow-hidden bg-gray-200 shadow-lg group"
            >
              {src ? (
                <Image
                  src={src}
                  alt={generateImageAlt(`${serviceName} gallery image ${i + 1}`, locationName)}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-gray-400 text-center">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium">Project Photo</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
