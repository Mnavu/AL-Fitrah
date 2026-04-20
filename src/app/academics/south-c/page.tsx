'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import CourseCard from '@/components/CourseCard';
import { Section, Course } from '@/lib/types';
import { STATIC_ASSETS } from '@/lib/assets';

export default function SouthCCampus() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSectionsAndCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('sections')
        .select('*, courses(*)')
        .neq('name', 'Brothers Boarding Program')
        .order('order', { ascending: true });

      if (fetchError) throw fetchError;
      
      // Filter out courses where is_visible is explicitly false
      const visibleSections = (data || []).map((section: any) => ({
        ...section,
        courses: (section.courses || []).filter((course: any) => course.is_visible !== false)
      }));

      setSections(visibleSections);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch academic programs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSectionsAndCourses();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#07CAC3] mx-auto mb-4"></div>
        <p className="text-[#07CAC3] font-bold text-xl">Loading South C Campus...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-xl">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-100">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Connection Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => fetchSectionsAndCourses()}
            className="bg-[#07CAC3] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#045C4C] transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const getSectionImage = (sectionName: string, index: number) => {
    const name = sectionName.toLowerCase();
    if (name.includes('sisters')) {
      return STATIC_ASSETS.sistersSessionMain;
    }
    if (name.includes('junior')) {
      return STATIC_ASSETS.juniorClassSession;
    }
    if (name.includes('adult')) {
      return STATIC_ASSETS.sistersSessionAlt;
    }
    if (name.includes('children') || name.includes('baby')) {
      return STATIC_ASSETS.babyClassSession;
    }
    if (name.includes('senior')) {
      return STATIC_ASSETS.seniorClassSession;
    }
    if (name.includes('counselling') || name.includes('support')) {
      return STATIC_ASSETS.consultation;
    }
    if (name.includes('online') || name.includes('global')) {
      return STATIC_ASSETS.onlineProgram;
    }
    // Default alternating images for other sections
    return index % 2 === 0 ? STATIC_ASSETS.juniorClassSession : STATIC_ASSETS.seniorClassSession;
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* 1. Hero Banner: Campus Overview */}
      <div className="relative w-full h-[300px] md:h-[450px] bg-[#0f5257]">
        <Image 
          src={STATIC_ASSETS.juniorClassHero} 
          alt="Al-Fitrah South C Campus"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f5257]/90 to-transparent" />
        <div className="absolute inset-0 flex items-center px-4">
          <div className="container mx-auto max-w-6xl">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-4">South C Campus</h1>
            <p className="text-xl md:text-2xl text-[#91E0CD] font-medium max-w-xl">
              Excellence in education, rooted in tradition, and focused on the future.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {sections.length > 0 ? (
          sections.map((section, idx) => (
            <div key={section.id} className="mb-24 last:mb-0">
              {/* 2. Section Layout: Image alongside Title/Description */}
              <div className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center mb-12`}>
                <div className="md:w-1/2 w-full flex justify-center">
                  <div className="relative h-64 md:h-72 w-auto max-w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gray-100 flex items-center justify-center">
                    <img 
                      src={getSectionImage(section.name, idx)} 
                      alt={section.name}
                      className="h-full w-auto object-contain hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
                <div className="md:w-1/2 w-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-1 w-12 bg-[#07CAC3]" />
                    <span className="text-[#07CAC3] font-bold tracking-widest uppercase text-sm">Program Category</span>
                  </div>
                  <h2 className="text-4xl font-serif text-[#0f5257] font-bold mb-6 leading-tight">
                    {section.name}
                  </h2>
                  {section.description && (
                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                      {section.description}
                    </p>
                  )}
                </div>
              </div>

              {/* 3. Courses Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {section.courses && section.courses.length > 0 ? (
                  section.courses.map((course: Course) => (
                    <CourseCard key={course.id} course={course} />
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                    <p className="text-gray-400">Current schedules are being finalized. Check back soon.</p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
            <p className="text-[#0f5257] text-2xl font-serif">Our academic catalog is being updated.</p>
          </div>
        )}
      </div>
    </div>
  );
}
