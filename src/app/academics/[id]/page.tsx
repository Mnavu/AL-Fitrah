'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Playfair_Display } from 'next/font/google';
import { User, Calendar, Banknote, BookOpen } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
});

type CoursePageProps = {
  params: { id: string };
};

export default function CoursePage({ params }: CoursePageProps) {
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error || !data) {
          setIsNotFound(true);
        } else {
          setCourse(data);
        }
      } catch (err) {
        setIsNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [params.id]);

  if (isNotFound) {
    notFound();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 flex items-center justify-center">
        <p className="text-[#07CAC3] font-bold text-xl">Loading course details...</p>
      </div>
    );
  }

  if (!course) {
    notFound();
  }

  // --- MANUAL OVERRIDE FOR BOOK IMAGES ---
  // Note: Removed '/public' from the beginning of these paths!
  let displayBooks = course.book_images || [];
  if (displayBooks.length === 0) {
        if (course.title.includes('Aqeedah')) {
          displayBooks = ['/Back-to-Basics.jpeg'];
        } else if (course.title.includes('Sisters')) {
          displayBooks = ['/Hadith-An-Nawawi.png', '/Ladies.png'];
        } else if (course.title.includes('Children')) {
          displayBooks = ['/Nooraniyah.jpeg', '/Islamic-Studies-Kindergaten.jpeg'];
        } else if (course.title.includes('Junior')) {
          displayBooks = ['/Junior-Hadith.png'];
        } else if (course.title.includes('Marriage')) {
          displayBooks = ['/Marriage.png'];
        }
      }
    
        return (
          <div className={`min-h-screen bg-[#F8FAFC] pb-12 ${playfairDisplay.variable}`}>
            
            {course.cover_image && (
               <div className="w-full aspect-video md:aspect-[3/1] relative bg-[#0f5257]">
                  <Image src={course.cover_image} alt={course.title} fill className="object-cover opacity-60" />
               </div>
            )}
      
            <div className="max-w-5xl mx-auto px-4 py-8 relative -mt-10">
              <div className="bg-white shadow-xl rounded-xl p-6 md:p-10 mb-8 border-t-4 border-[#07CAC3] relative z-10">
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#0f5257] mb-8" style={{ fontFamily: 'var(--font-playfair-display)' }}>
                  {course.title}
                </h1>
      
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#F0FDF4] p-6 rounded-lg border border-[#B5DB82]">
                  <div className="flex items-start space-x-3">
                    <User className="w-6 h-6 text-[#045C4C] mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-[#0f5257] text-sm uppercase tracking-wider">Instructor</p>
                      <p className="text-gray-700">{course.instructor_name || 'Institute Faculty'}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-6 h-6 text-[#045C4C] mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-[#0f5257] text-sm uppercase tracking-wider">Schedule</p>
                      <p className="text-gray-700">{course.schedule || 'TBD'}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Banknote className="w-6 h-6 text-[#045C4C] mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-[#0f5257] text-sm uppercase tracking-wider">Tuition Fee</p>
                      <p className="text-gray-700 font-semibold">{course.price || 'TBD'}</p>
                    </div>
                  </div>
                </div>
              </div>
      
              <div className="mt-8 mb-12">
                <h2 className="text-3xl font-serif font-bold text-[#0f5257] mb-6">About This Program</h2>
                <div className="prose max-w-none bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-gray-700">
                  <ReactMarkdown>
                    {course.about_program || course.description || course.short_description || 'Details for this program will be updated shortly.'}
                  </ReactMarkdown>
                  
                  {course.highlights && course.highlights.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-xl font-bold text-[#045C4C] mb-4">Program Highlights</h3>
                      <ul className="space-y-2">
                        {course.highlights.map((highlight: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-[#31BC5F] mr-3 font-bold">✓</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
      
                      {/* ACTIVATED LEARNING MATERIALS SECTION */}
                      {displayBooks.length > 0 && (
                        <div className="mb-12">
                          <div className="flex items-center space-x-3 mb-6">
                            <BookOpen className="w-8 h-8 text-[#07CAC3]" />
                            <h2 className="text-3xl font-serif font-bold text-[#0f5257]">Learning Materials Used</h2>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-end">
                            {displayBooks.map((imgSrc: string, index: number) => (
                              <div key={index} className="group relative">
                                <Image 
                                  src={imgSrc} 
                                  alt={`Learning Material ${index + 1}`} 
                                  width={400}
                                  height={600}
                                  className="rounded-lg shadow-2xl group-hover:scale-105 transition-all duration-300 w-full h-auto block" 
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                            {/* CTA SECTION */}
              <div className="mt-12 pt-8 border-t border-gray-200 max-w-4xl mx-auto">
      
              {course.requires_registration ? (
                <Link
                  href={`/register/${course.id}`}
                  className="block w-full text-center bg-[#07CAC3] hover:bg-[#077B83] text-white font-bold py-5 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-xl"
                >
                  Ready to Begin? Register Now
                </Link>
              ) : (
                <div className="text-center border-2 border-[#31BC5F] text-[#31BC5F] font-bold py-5 rounded-xl bg-[#F0FDF4] text-xl">
                  Open Community Class - No Registration Required
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
    