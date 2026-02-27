import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Course } from '@/lib/types';
import { Calendar, Clock, ArrowLeft, CheckCircle } from 'lucide-react';

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  // Prevent build crash if env vars are missing during static generation
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
        <p className="text-gray-600">Database credentials are missing.</p>
      </div>
    );
  }

  // Fetch course details from Supabase
  const { data: course, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Course not found</h1>
        <Link href="/academics/south-c" className="text-primary hover:underline flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
        </Link>
      </div>
    );
  }


  const typedCourse = course as Course;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Banner */}
      <section className="bg-[#0f5257] py-16 text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link 
            href="/academics/south-c" 
            className="inline-flex items-center text-[#91E0CD] hover:text-[#07CAC3] mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
          </Link>
          <h1 className="text-5xl font-serif text-[#07CAC3] mb-4 leading-tight">
            {typedCourse.title}
          </h1>
          <p className="text-2xl text-[#91E0CD] opacity-90 italic">
            Led by {typedCourse.instructor_name || 'Expert Faculty'}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column: Main Content */}
          <div className="lg:w-2/3">
            <div className="mb-12">
              <h2 className="text-3xl font-serif text-[#0f5257] mb-6">About This Program</h2>
              <div className="text-xl leading-relaxed text-[#045C4C] whitespace-pre-wrap">
                {typedCourse.description || "No description available for this course yet."}
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-2xl font-serif text-[#0f5257] mb-6">Program Highlights</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-[#07CAC3] mr-3 mt-1 flex-shrink-0" />
                  <span className="text-lg text-[#045C4C]">Comprehensive curriculum focusing on core classical disciplines.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-[#07CAC3] mr-3 mt-1 flex-shrink-0" />
                  <span className="text-lg text-[#045C4C]">Interactive learning environment with direct access to instructors.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-[#07CAC3] mr-3 mt-1 flex-shrink-0" />
                  <span className="text-lg text-[#045C4C]">Modern pedagogical approaches combined with traditional wisdom.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Sticky Card */}
          <div className="lg:w-1/3">
            <div className="sticky top-24 bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
              <div className="mb-8">
                <p className="text-slate-500 text-sm uppercase tracking-wider font-semibold mb-1">Tuition Fee</p>
                <div className="text-4xl font-bold text-[#0f5257]">
                  {typedCourse.price !== null && typedCourse.price > 0 ? (
                    `KES ${parseFloat(typedCourse.price.toString()).toLocaleString()}`
                  ) : (
                    <span className="text-[#045C4C]">Free</span>
                  )}
                </div>
              </div>

              <div className="space-y-6 mb-10">
                <div className="flex items-center text-slate-700">
                  <Calendar className="w-6 h-6 text-[#07CAC3] mr-4" />
                  <div>
                    <p className="text-sm text-slate-500">Schedule</p>
                    <p className="text-lg font-medium">{typedCourse.schedule || "Flexible Timing"}</p>
                  </div>
                </div>
                <div className="flex items-center text-slate-700">
                  <Clock className="w-6 h-6 text-[#07CAC3] mr-4" />
                  <div>
                    <p className="text-sm text-slate-500">Program Duration</p>
                    <p className="text-lg font-medium">Seasonal Enrollment</p>
                  </div>
                </div>
              </div>

              {typedCourse.requires_registration ? (
                <Link 
                  href={`/register/${typedCourse.id}`}
                  className="block w-full text-center bg-[#07CAC3] text-[#0f5257] py-4 rounded-xl text-xl font-bold hover:bg-[#91E0CD] transition-all transform hover:-translate-y-1 shadow-lg"
                >
                  Enroll Now
                </Link>
              ) : (
                <button 
                  disabled
                  className="block w-full text-center border-2 border-[#045C4C] text-[#045C4C] py-4 rounded-xl text-xl font-bold bg-white cursor-default"
                >
                  Open Class - Free to Attend
                </button>
              )}
              
              <p className="mt-6 text-center text-slate-400 text-sm">
                Limited spots available. Secure your place early.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
