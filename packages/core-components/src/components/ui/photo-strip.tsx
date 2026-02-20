interface PhotoStripProps {
  /** Array of images to display */
  images: Array<{ src: string; alt: string }>;
  /** Height in pixels, default 300 */
  height?: number;
  /** How images fill their container, default 'cover' */
  objectFit?: "cover" | "contain";
}

export function PhotoStrip({
  images,
  height = 300,
  objectFit = "cover",
}: PhotoStripProps) {
  if (images.length === 0) return null;

  const displayImages = images.slice(0, 6);
  const fitClass = objectFit === "cover" ? "object-cover" : "object-contain";

  return (
    <div
      className="w-full overflow-hidden bg-black grid grid-cols-2 md:flex"
      style={{ height }}
    >
      {displayImages.map((image, index) => (
        <div key={index} className="flex-1 min-w-0">
          <img
            src={image.src}
            alt={image.alt}
            className={`w-full h-full ${fitClass}`}
          />
        </div>
      ))}
    </div>
  );
}
