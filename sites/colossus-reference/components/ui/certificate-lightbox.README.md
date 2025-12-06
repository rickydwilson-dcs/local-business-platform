# Certificate Lightbox Component

A fully accessible, keyboard-navigable modal lightbox for displaying certificate images in the Local Business Platform.

## Features

- **Full Accessibility**: ARIA labels, focus management, screen reader support
- **Keyboard Navigation**: ESC to close, Left/Right arrows to navigate
- **Responsive Design**: Full-screen optimized for mobile devices
- **Smooth Animations**: Fade-in overlay and scale-in content animations
- **User-Friendly Controls**:
  - Click outside to close
  - Close button (X)
  - Navigation arrows for prev/next
  - Position indicator (e.g., "2 of 5")
- **Focus Management**: Automatically returns focus to trigger element on close
- **TypeScript**: Fully typed with proper interfaces
- **Tailwind CSS**: Follows project styling standards with utility classes

## Installation

The component is located at:

```
sites/colossus-reference/components/ui/certificate-lightbox.tsx
```

Styles are automatically included from:

```
sites/colossus-reference/app/globals.css
```

## Basic Usage

```tsx
import { useState } from "react";
import { CertificateLightbox } from "@/components/ui/certificate-lightbox";

function MyComponent() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const certificates = [
    {
      id: "cert-1",
      name: "CHAS Accreditation",
      thumbnail: "/certificates/chas-thumb.jpg",
      fullImage: "/certificates/chas-full.jpg",
      description: "CHAS accreditation certificate",
    },
    // ... more certificates
  ];

  return (
    <>
      <button onClick={() => setIsOpen(true)}>View Certificates</button>

      <CertificateLightbox
        certificates={certificates}
        selectedIndex={selectedIndex}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onNavigate={setSelectedIndex}
      />
    </>
  );
}
```

## Interface

### Certificate

```typescript
interface Certificate {
  id: string; // Unique identifier
  name: string; // Certificate name/title
  thumbnail: string; // Path to thumbnail image
  fullImage: string; // Path to full-size image
  description: string; // Certificate description
}
```

### CertificateLightboxProps

```typescript
interface CertificateLightboxProps {
  certificates: Certificate[]; // Array of certificates
  selectedIndex: number; // Current certificate index (0-based)
  isOpen: boolean; // Whether lightbox is visible
  onClose: () => void; // Callback when lightbox closes
  onNavigate: (index: number) => void; // Callback when navigating
}
```

## Keyboard Shortcuts

| Key           | Action               |
| ------------- | -------------------- |
| `Escape`      | Close lightbox       |
| `Left Arrow`  | Previous certificate |
| `Right Arrow` | Next certificate     |

## Accessibility Features

1. **ARIA Attributes**:
   - `role="dialog"` on overlay
   - `aria-modal="true"` for modal behavior
   - `aria-label` for lightbox title
   - `aria-describedby` for description
   - `aria-live` for position updates

2. **Focus Management**:
   - Automatically focuses close button when opened
   - Traps focus within lightbox while open
   - Returns focus to trigger element on close

3. **Screen Readers**:
   - Announces certificate name
   - Announces position (e.g., "2 of 5")
   - Provides descriptive labels for all controls

4. **Keyboard Navigation**:
   - All controls accessible via keyboard
   - Visual focus indicators
   - Logical tab order

## Styling

The component uses Tailwind CSS utility classes defined in `app/globals.css`:

### Main Classes

- `.lightbox-overlay` - Full-screen backdrop
- `.lightbox-content` - Modal container
- `.lightbox-header` - Header with title and close button
- `.lightbox-image-container` - Image display area
- `.lightbox-nav-button` - Navigation arrows
- `.lightbox-description` - Description area

### Customization

To customize styles, edit the utility classes in `app/globals.css` under the "Certificate Lightbox System" section.

## Responsive Behavior

- **Mobile (< 640px)**: Full-screen overlay, smaller padding, compact controls
- **Tablet (640px - 1024px)**: Optimized spacing, medium-sized controls
- **Desktop (> 1024px)**: Maximum width of 6xl (1152px), larger controls

## Performance Considerations

1. **Image Optimization**: Uses Next.js `Image` component with:
   - `priority` flag for LCP optimization
   - Responsive `sizes` attribute
   - `object-contain` for proper aspect ratio

2. **Body Scroll**: Automatically prevents body scroll when open

3. **Event Cleanup**: Properly removes event listeners on unmount

4. **Animations**: Lightweight CSS animations (fade-in, scale-in)

## Example Implementation

See `certificate-lightbox.example.tsx` for complete implementation examples including:

- Certificate gallery grid
- Inline trigger button
- State management patterns

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires ES6+ support
- Graceful degradation for older browsers

## Best Practices

1. **Image Sizes**: Provide high-quality full images (min 1200px width)
2. **Thumbnails**: Use optimized thumbnails (~400px width)
3. **Descriptions**: Keep descriptions concise (1-2 sentences)
4. **Certificate Count**: Works best with 3-10 certificates
5. **Alt Text**: Certificate names serve as alt text

## Troubleshooting

### Lightbox not closing

- Check that `onClose` callback is properly setting `isOpen` to `false`
- Verify no z-index conflicts with other elements

### Images not loading

- Verify image paths are correct and accessible
- Check Next.js Image configuration in `next.config.js`

### Focus not returning

- Ensure trigger element is still in DOM when lightbox closes
- Check that no other code is manipulating focus

## Related Components

- `mobile-menu.tsx` - Similar overlay pattern
- `service-gallery.tsx` - Image gallery implementation

## Contributing

When modifying this component:

1. Follow TypeScript strict mode
2. Use Tailwind CSS only (no inline styles)
3. Maintain accessibility features
4. Test keyboard navigation
5. Update this README
6. Run `npm run type-check` and `npm run build` before committing
