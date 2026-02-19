'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Course } from '@/lib/types';
import { SectionDivider } from '@/components/ui/FloralDecorations';

// --- Page-specific configuration ---
const BOARDING_COURSE_ID = 'e8c1b3f9-3d6f-4c27-9d7a-d0de6d5d5a8b'; // Example UUID
const COURSE_TITLE_FOR_FETCH = '2-Year Ālimiyyah Program'; // The exact title of the course to fetch

export default function BoysBoardingCampus() {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('title', COURSE_TITLE_FOR_FETCH) // Find the course by its unique title
          .single(); // Expect only one result

        if (error) {
          throw new Error(error.message);
        }
        
        if (data) {
          setCourse(data);
        } else {
          throw new Error('The specified course could not be found.');
        }

      } catch (err: any) {
        setError(err.message || 'Failed to fetch course details.');
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <p className="text-center text-primary text-lg">Loading course details...</p>;
    }

    if (error) {
      return <p className="text-center text-crimson text-lg">Error: {error}</p>;
    }
    
    if (!course) {
        return <p className="text-center text-primary text-lg">Course details not available.</p>;
    }

    return (
      <>
        <div className="bg-white shadow-xl rounded-lg p-8 mb-12">
          <h2 className="text-4xl font-serif text-secondary mb-4">{course.title}</h2>
          <p className="text-slate text-lg mb-6">{course.description}</p>
          <div className="flex flex-wrap items-center justify-start gap-x-8 gap-y-4 mb-8">
            <p className="text-xl font-bold text-accent">
                Cost: KES {course.price ? parseFloat(course.price.toString()).toFixed(2) : 'N/A'}
            </p>
            <p className="text-lg font-semibold text-slate">
                Duration: 2 Years
            </p>
          </div>
          <Link href={`/register/${course.id}`} className="inline-block bg-primary text-white text-lg text-center py-3 px-8 rounded-md hover:bg-secondary transition duration-300 shadow-md">
            Register Now
          </Link>
        </div>

        {/* Curriculum Section */}
        <div className="mb-12">
          <h3 className="text-3xl font-serif text-primary text-center mb-6">Curriculum Overview</h3>
          <SectionDivider/>
          <div className="prose lg:prose-xl max-w-none mx-auto mt-6 text-slate">
            <p>Our comprehensive 2-year curriculum is designed to provide students with a deep and authentic understanding of the Islamic sciences. The program is structured into two years, covering foundational and advanced topics.</p>
            <h4>Year 1: Foundational Studies</h4>
            <ul>
              <li>Arabic Language (Nahw, Sarf, Balagha)</li>
              <li>Fiqh (Jurisprudence) - Hanafi School</li>
              <li>Aqeedah (Theology)</li>
              <li>Introduction to Hadith Studies</li>
              <li>Seerah (Prophetic Biography)</li>
            </ul>
            <h4>Year 2: Advanced Topics</h4>
            <ul>
              <li>Advanced Arabic & Rhetoric</li>
              <li>Usul al-Fiqh (Principles of Jurisprudence)</li>
              <li>Tafsir (Quranic Exegesis)</li>
              <li>Mustalah al-Hadith (Hadith Terminology)</li>
              <li>Comparative Fiqh</li>
            </ul>
            <p>Students will engage with classical texts under the guidance of qualified scholars, ensuring a robust and traditional learning experience.</p>
          </div>
        </div>
        
        {/* Campus Photos Section */}
        <div>
          <h3 className="text-3xl font-serif text-primary text-center mb-6">Campus Life</h3>
          <SectionDivider/>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            <Image src="/Al-Fitrah1.png" alt="Campus Photo 1" width={500} height={300} className="rounded-lg shadow-md object-cover"/>
            <Image src="/Al-Fitrah2.png" alt="Campus Photo 2" width={500} height={300} className="rounded-lg shadow-md object-cover"/>
            <Image src="/Al-Fitrah3.jpeg" alt="Campus Photo 3" width={500} height={300} className="rounded-lg shadow-md object-cover"/>
          </div>
          <p className="text-center text-slate mt-4">A serene and conducive environment for focused learning and spiritual growth.</p>
        </div>
      </>
    );
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-5xl font-serif text-primary text-center mb-12">Boys Boarding Campus</h1>
      <SectionDivider />
      {renderContent()}
    </div>
  );
}
