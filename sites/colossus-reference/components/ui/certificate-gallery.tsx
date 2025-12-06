import Image from "next/image";

interface Certificate {
  id: string;
  name: string;
  thumbnail: string;
  fullImage: string;
  description: string;
}

interface CertificateGalleryProps {
  certificates: Certificate[];
  onSelect: (certificate: Certificate) => void;
}

export function CertificateGallery({ certificates, onSelect }: CertificateGalleryProps) {
  if (!certificates || certificates.length === 0) {
    return (
      <div className="text-center text-gray-800 py-12">
        <p>No certificates available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {certificates.map((certificate) => (
        <button
          key={certificate.id}
          onClick={() => onSelect(certificate)}
          className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 cursor-pointer"
          aria-label={`View ${certificate.name} certificate details`}
          type="button"
        >
          <div className="relative aspect-[3/4] w-full bg-gray-100">
            <Image
              src={certificate.thumbnail}
              alt={certificate.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>

          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 text-center line-clamp-2 group-hover:text-brand-blue transition-colors duration-200">
              {certificate.name}
            </h3>
          </div>

          <div className="sr-only">{certificate.description}</div>
        </button>
      ))}
    </div>
  );
}
