'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Playfair_Display } from 'next/font/google';
import { User, Calendar, Banknote } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
});

type CoursePageProps = {
  params: {
    id: string;
  };
};

export default function CoursePage({ params }: CoursePageProps) {
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error || !data) {
        notFound();
      }
      setCourse(data);
      setLoading(false);
    };

    fetchCourse();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary/15 py-12 px-4 flex items-center justify-center">
        <p className="text-primary text-lg">Loading course details...</p>
      </div>
    );
  }

  if (!course) {
    notFound();
  }

  return (
    <div className={`min-h-screen bg-secondary/15 pb-28 ${playfairDisplay.variable}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Card */}
        <div className="bg-secondary/30 border-l-4 border-primary rounded-lg p-6 md:p-8 mb-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6" style={{ fontFamily: 'var(--font-playfair-display)' }}>
            {course.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <User className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-primary text-sm">Instructor</p>
                <p className="text-slate">{course.instructor}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-primary text-sm">Schedule</p>
                <p className="text-slate">{course.schedule}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Banknote className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-primary text-sm">Price</p>
                <p className="text-slate">Ksh {course.price.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Syllabus Section */}
        <div className="mt-8 mb-12">
          <h2 className="text-3xl font-serif font-bold text-primary mb-6">Course Syllabus</h2>
          <div className="prose max-w-none bg-white rounded-lg p-8 shadow-sm border border-seafoam/30 prose-headings:text-primary prose-p:text-slate prose-li:text-slate prose-strong:text-primary prose-a:text-accent">
            <ReactMarkdown>
              {course.full_syllabus || 'No syllabus available'}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Sticky Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-seafoam/30 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {course.requires_registration ? (
            <Link
              href={`/register/${course.id}`}
              className="block w-full text-center bg-accent hover:bg-accent/90 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105 shadow-md"
            >
              📝 Register for this Course
            </Link>
          ) : (
            <div className="text-center border-2 border-primary text-primary font-semibold py-3 rounded-lg bg-secondary/20">
              ✅ Open Class - No Registration Required. Join us freely!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Revalidate every hour
export const revalidate = 3600;

// This function can be used to generate static paths if needed
// export async function generateStaticParams() {
//   const supabase = createClient();
//   const { data: courses } = await supabase.from('courses').select('id');
//   return courses?.map(({ id }) => ({ id: id.toString() })) || [];
// }
