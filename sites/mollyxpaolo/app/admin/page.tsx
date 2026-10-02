import { getAdminData } from '@/lib/data';
import { Curate } from '@/components/curate';

export const metadata = { title: 'Curate · Molly × Paolo' };
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const { photos, chapters, curation, mediaBase } = await getAdminData();
  return <Curate mediaBase={mediaBase} initial={curation} photos={photos} chapters={chapters} />;
}
