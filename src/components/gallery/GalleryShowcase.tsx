'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Camera, ChevronLeft, ChevronRight, MapPin, X } from 'lucide-react';

type GalleryItem = {
  src: string;
  alt: string;
  title: string;
  origin: string;
  fileName: string;
  featured: boolean;
};

export default function GalleryShowcase({ items }: { items: GalleryItem[] }) {
  const [activeOrigin, setActiveOrigin] = useState('All');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const origins = ['All', ...Array.from(new Set(items.map((item) => item.origin)))];
  const visibleItems = activeOrigin === 'All' ? items : items.filter((item) => item.origin === activeOrigin);
  const activeItem = activeIndex !== null ? visibleItems[activeIndex] : null;

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveIndex(null);
      }

      if (event.key === 'ArrowRight') {
        setActiveIndex((currentIndex) => {
          if (currentIndex === null) {
            return currentIndex;
          }

          return (currentIndex + 1) % visibleItems.length;
        });
      }

      if (event.key === 'ArrowLeft') {
        setActiveIndex((currentIndex) => {
          if (currentIndex === null) {
            return currentIndex;
          }

          return (currentIndex - 1 + visibleItems.length) % visibleItems.length;
        });
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, visibleItems.length]);

  const openLightbox = (index: number) => {
    setActiveIndex(index);
  };

  const moveToPrevious = () => {
    setActiveIndex((currentIndex) => {
      if (currentIndex === null) {
        return currentIndex;
      }

      return (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    });
  };

  const moveToNext = () => {
    setActiveIndex((currentIndex) => {
      if (currentIndex === null) {
        return currentIndex;
      }

      return (currentIndex + 1) % visibleItems.length;
    });
  };

  return (
    <>
      <div className="mb-10 flex flex-wrap gap-3">
        {origins.map((origin) => {
          const count = origin === 'All' ? items.length : items.filter((item) => item.origin === origin).length;
          const isActive = activeOrigin === origin;

          return (
            <button
              key={origin}
              type="button"
              onClick={() => {
                setActiveOrigin(origin);
                setActiveIndex(null);
              }}
              className={`rounded-full border px-5 py-3 text-sm font-semibold transition-all ${
                isActive
                  ? 'border-[#07CAC3] bg-[#07CAC3] text-white shadow-lg shadow-[#07CAC3]/20'
                  : 'border-slate-200 bg-white text-[#0f5257] hover:border-[#07CAC3] hover:text-[#077B83]'
              }`}
            >
              {origin} <span className="ml-2 opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      {visibleItems.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-16 text-center text-[#045C4C]/70">
          No images found for this origin yet.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleItems.map((item, index) => (
            <button
              key={item.src}
              type="button"
              onClick={() => openLightbox(index)}
              className={`group relative overflow-hidden rounded-[2rem] border border-white/60 bg-white text-left shadow-[0_24px_60px_rgba(15,82,87,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(15,82,87,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#07CAC3] ${
                item.featured ? 'xl:col-span-2' : ''
              }`}
            >
              <div className="absolute inset-0 rounded-[2rem] border border-[#07CAC3]/10" />
              <div className={`relative overflow-hidden ${item.featured ? 'aspect-[16/10]' : 'aspect-[4/5] md:aspect-[4/3]'}`}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  priority={index < 4}
                  sizes={
                    item.featured
                      ? '(min-width: 1280px) 66vw, (min-width: 768px) 50vw, 100vw'
                      : '(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw'
                  }
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#041719]/95 via-[#041719]/25 to-transparent opacity-30 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                  <div className="translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#91E0CD] backdrop-blur-sm">
                      <MapPin size={12} />
                      {item.origin}
                    </div>
                    <p className="mt-3 font-serif text-2xl text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-white/70">{item.fileName}</p>
                  </div>
                </div>
                <div className="absolute right-4 top-4 rounded-full border border-white/15 bg-white/10 p-3 text-white/90 backdrop-blur-sm transition-transform duration-500 group-hover:scale-110">
                  <Camera size={18} />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {activeItem && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-[#041719]/85 p-4 backdrop-blur-sm"
          onClick={() => setActiveIndex(null)}
        >
          <div
            className="relative w-full max-w-6xl rounded-[2rem] border border-white/10 bg-[#062428] p-4 text-white shadow-2xl md:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              aria-label="Close gallery image"
              className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
            >
              <X size={18} />
            </button>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div className="relative min-h-[45vh] overflow-hidden rounded-[1.5rem] bg-black/20 lg:min-h-[72vh]">
                <Image
                  src={activeItem.src}
                  alt={activeItem.alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </div>

              <div className="flex flex-col justify-between gap-6 p-2">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#91E0CD]">
                    <MapPin size={12} />
                    {activeItem.origin}
                  </div>
                  <h3 className="mt-4 font-serif text-3xl">{activeItem.title}</h3>
                  <p className="mt-2 text-sm text-white/70">{activeItem.fileName}</p>
                  <p className="mt-6 text-base leading-relaxed text-white/80">
                    This frame was pulled directly from the `public` folder and tagged by origin so visitors can immediately tell where the image belongs.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <button
                    type="button"
                    onClick={moveToPrevious}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-5 py-4 font-semibold transition-colors hover:bg-white/20"
                  >
                    <ChevronLeft size={18} />
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={moveToNext}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#07CAC3] px-5 py-4 font-semibold text-[#062428] transition-colors hover:bg-[#91E0CD]"
                  >
                    Next
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
