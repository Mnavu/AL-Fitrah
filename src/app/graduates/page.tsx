'use client';

import Image from 'next/image';
import { Award, Camera, Home } from 'lucide-react';
import Link from 'next/link';

export default function GraduatesPage() {
  // Generate array for images 1-15
  const images = Array.from({ length: 15 }, (_, i) => i + 1);

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-[#0f5257] py-24 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#07CAC3]/20 text-[#91E0CD] font-bold text-sm uppercase tracking-wider mb-6">
            <Award size={20} />
            Our Legacy
          </div>
          <h1 className="text-5xl md:text-7xl font-serif text-white font-bold mb-6">Hall of Graduates</h1>
          <p className="text-[#91E0CD] max-w-2xl mx-auto text-xl leading-relaxed">
            Celebrating the dedication, growth, and success of our previous classes at Al-Fitrah Training Institute.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="bg-[#07CAC3] p-2 rounded-lg text-white">
              <Camera size={24} />
            </div>
            <h2 className="text-3xl font-serif text-[#0f5257] font-bold">Class Gallery</h2>
          </div>
          <Link href="/" className="flex items-center gap-2 text-[#077B83] hover:text-[#07CAC3] font-bold transition-colors">
            <Home size={20} />
            Back Home
          </Link>
        </div>
{/* Image Gallery - Flexible Width, Fixed Height */}
<div className="flex flex-wrap justify-center gap-6">
  {images.map((num) => (
    <div key={num} className="group relative h-80 rounded-3xl overflow-hidden shadow-lg border-4 border-white bg-gray-200 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
      <img
        src={`/${num}.jpg`}
        alt={`Graduate Photo ${num}`}
        className="h-full w-auto object-cover transition-transform duration-700 group-hover:scale-110 block"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f5257]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
        <div className="text-white">
           <p className="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">Al-Fitrah Alumni</p>
           <h3 className="text-lg font-serif font-bold">Successfully Graduated</h3>
        </div>
      </div>
    </div>
  ))}
</div>

        {/* Footer Note */}
        <div className="mt-20 text-center bg-white p-12 rounded-[3rem] shadow-sm border border-gray-100">
          <Award size={48} className="text-[#D4AF37] mx-auto mb-6 opacity-50" />
          <p className="text-[#0f5257] text-2xl font-serif italic max-w-3xl mx-auto">
            "The best of people are those who are most beneficial to others."
          </p>
          <div className="mt-8 flex justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#07CAC3]"></div>
            <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>
            <div className="w-2 h-2 rounded-full bg-[#07CAC3]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
