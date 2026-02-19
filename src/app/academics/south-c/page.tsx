'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { SectionDivider } from '@/components/ui/FloralDecorations';
import CourseCard from '@/components/CourseCard';
import { Section, Course } from '@/lib/types'; // Import types

export default function SouthCCampus() { // Renamed component
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSectionsAndCourses = async () => {
      try {
        setLoading(true);
        
        // Fetch sections and their associated courses
        const { data, error } = await supabase
          .from('sections')
          .select('*, courses!inner(*)') // Use !inner to only get sections that have courses
          .order('order', { ascending: true });

        if (error) {
          throw error;
        }

        // Filter out boarding programs (boys/brothers boarding) from South C campus
        const filteredSections = data.map(section => ({
          ...section,
          courses: section.courses.filter(course => 
            course.title !== '2-Year Ālimiyyah Program' && 
            !course.title.includes('Boarding') &&
            !course.title.includes('Intensive Leadership')
          ),
        }));

        setSections(filteredSections);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch academic programs');
      } finally {
        setLoading(false);
      }
    };

    fetchSectionsAndCourses();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-primary">
        <p>Loading academic programs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-crimson">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-5xl font-serif text-primary text-center mb-8">South C Campus</h1>
      <SectionDivider />

      {sections.length > 0 ? (
        sections.map((section) => (
          <div key={section.id} className="mb-6">
            <div className="relative flex items-center justify-center my-2">
              <SectionDivider className="absolute left-0 top-1/2 transform -translate-y-1/2 h-6 w-auto opacity-75" />
              <h2 className="text-2xl font-serif text-secondary text-center z-10 px-4 bg-white">
                {section.name}
              </h2>
              <SectionDivider className="absolute right-0 top-1/2 transform -translate-y-1/2 h-6 w-auto opacity-75 flip-x" />
            </div>
            
            {section.description && (
              <p className="text-center text-slate mb-4 max-w-2xl mx-auto text-xs">{section.description}</p>
            )}

            {section.courses && section.courses.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {section.courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <p className="text-center text-slate text-lg mt-8">No courses available in this section yet. Please check back later!</p>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-primary text-lg">No academic programs available at the moment. Please check back later!</p>
      )}
    </div>
  );
}
