import Link from 'next/link';
import { Camera, Images, Sparkles } from 'lucide-react';
import GalleryShowcase from '@/components/gallery/GalleryShowcase';
import { getGalleryItems } from '@/lib/gallery';

export default async function GalleryPage() {
  const galleryItems = await getGalleryItems();
  const origins = Array.from(new Set(galleryItems.map((item) => item.origin)));

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <section className="relative overflow-hidden bg-[#0f5257] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(7,202,195,0.25),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(145,224,205,0.18),transparent_28%)]" />
        <div className="relative container mx-auto max-w-6xl px-4 py-20 md:py-24">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold tracking-[0.2em] text-[#91E0CD]">
              <Camera size={16} />
              Gallery
            </div>
            <h1 className="font-serif text-4xl leading-tight md:text-6xl">
              Every image in the `public` folder, surfaced in one interactive gallery.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl">
              Hover each frame to see the origin of the photo, then open it in the lightbox to browse the collection without leaving the page.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3 max-w-4xl">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-3xl font-bold text-[#91E0CD]">{galleryItems.length}</p>
              <p className="mt-1 text-sm uppercase tracking-[0.2em] text-white/70">Images Found</p>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-3xl font-bold text-[#91E0CD]">{origins.length}</p>
              <p className="mt-1 text-sm uppercase tracking-[0.2em] text-white/70">Origins Tagged</p>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-3xl font-bold text-[#91E0CD]">Auto</p>
              <p className="mt-1 text-sm uppercase tracking-[0.2em] text-white/70">Synced With Public</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="mb-12 grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#F0FDF4] px-4 py-2 text-sm font-semibold text-[#077B83]">
              <Images size={16} />
              Auto-Generated From Local Assets
            </div>
            <h2 className="mt-5 font-serif text-3xl text-[#0f5257] md:text-4xl">Beautiful frames, hover labels, and full-screen browsing.</h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[#045C4C]/80">
              Any supported image you place in `public/` will appear here on the next build. The gallery groups images by inferred origin, then adds hover overlays so visitors can tell whether a photo belongs to a graduation, sisters gala, junior class, faculty portrait, or another collection.
            </p>
          </div>

          <div className="rounded-[2rem] bg-[#062428] p-8 text-white shadow-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-[#91E0CD]">
              <Sparkles size={16} />
              Quick Note
            </div>
            <p className="mt-5 text-base leading-relaxed text-white/80">
              The page ignores videos and helper scripts in `public/`. Only image files are rendered into gallery frames.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-[#07CAC3] px-5 py-3 font-semibold text-[#062428] transition-colors hover:bg-[#91E0CD]"
            >
              Contact The Institute
            </Link>
          </div>
        </div>

        <GalleryShowcase items={galleryItems} />
      </section>
    </div>
  );
}
