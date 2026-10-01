import { getGallery } from '@/lib/data';
import { Gallery } from '@/components/gallery';

// Rendered per request (behind the passcode proxy); the curation read inside is cached and
// invalidated by admin saves.
export const dynamic = 'force-dynamic';

export default async function Home() {
  return <Gallery data={await getGallery()} />;
}
