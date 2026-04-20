import GalleryShowcase from '@/components/gallery/GalleryShowcase';
import { getGalleryItems } from '@/lib/gallery';

export default async function GalleryPage() {
  const galleryItems = await getGalleryItems();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="container mx-auto max-w-7xl px-4 py-6 md:py-10">
        <GalleryShowcase items={galleryItems} />
      </div>
    </div>
  );
}
