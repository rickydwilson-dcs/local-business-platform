import Image from "next/image";

interface ServiceGalleryProps {
  images: string[];
  title?: string;
}

export function ServiceGallery({ images, title = "Gallery" }: ServiceGalleryProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-center">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((src, i) => (
            <div key={i} className="relative h-64 rounded-lg overflow-hidden">
              <Image
                src={src}
                alt={`Gallery image ${i + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
