'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { GalleryItem } from '@/lib/gallery';

export default function GalleryShowcase({ items }: { items: GalleryItem[] }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const categories = ['All', ...Array.from(new Set(items.map((item) => item.category)))];
  const visibleItems = activeCategory === 'All' ? items : items.filter((item) => item.category === activeCategory);
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
      <div className="mb-6 flex flex-wrap gap-3">
        {categories.map((category) => {
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => {
                setActiveCategory(category);
                setActiveIndex(null);
              }}
              className={`rounded-full border px-5 py-3 text-sm font-semibold transition-all ${
                isActive
                  ? 'border-[#07CAC3] bg-[#07CAC3] text-white shadow-lg shadow-[#07CAC3]/20'
                  : 'border-slate-200 bg-white text-[#0f5257] hover:border-[#07CAC3] hover:text-[#077B83]'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleItems.map((item, index) => (
          <button
            key={item.src}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group relative overflow-hidden rounded-[1.75rem] border border-white/60 bg-white text-left shadow-[0_18px_45px_rgba(15,82,87,0.10)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(15,82,87,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#07CAC3]"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                priority={index < 8}
                sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#041719]/90 via-[#041719]/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                  <p className="inline-block rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                    {item.label}
                  </p>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {activeItem && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setActiveIndex(null)}
        >
          <div
            className="relative w-full max-w-7xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              aria-label="Close gallery image"
              className="absolute right-3 top-3 z-10 rounded-full border border-white/10 bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
            >
              <X size={18} />
            </button>

            <button
              type="button"
              onClick={moveToPrevious}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={moveToNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
            >
              <ChevronRight size={20} />
            </button>

            <div className="relative min-h-[70vh] overflow-hidden rounded-[2rem] bg-black/20">
              <Image
                src={activeItem.src}
                alt={activeItem.alt}
                fill
                sizes="100vw"
                priority
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
