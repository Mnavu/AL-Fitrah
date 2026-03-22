'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Course } from '@/lib/types'; // Make sure this type matches your DB!\
import { CheckCircle2, GraduationCap, BookOpen, Award, Target } from 'lucide-react';

// --- Page-specific configuration ---
// 1. UPDATED: Title exactly matches the SQL database!
const COURSE_TITLE_FOR_FETCH = 'Leadership & Mindset: 3-Year Curriculum'; 

export default function BoysBoardingCampus() {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        // 2. UPDATED: Removed .single() to prevent crashes
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('title', COURSE_TITLE_FOR_FETCH)
          .eq('is_visible', true);

        if (error) {
          throw new Error(error.message);
        }
        
        // Safely check if we got at least one result back
        if (data && data.length > 0) {
          setCourse(data[0]);
        } else {
          throw new Error('The specified course could not be found in the database.');
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
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#07CAC3] mb-4"></div>
          <p className="text-[#077B83] text-lg font-bold">Loading course details...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-20">
          <p className="text-red-500 text-lg mb-4">Error: {error}</p>
          <button onClick={() => window.location.reload()} className="bg-[#07CAC3] text-white px-6 py-2 rounded-lg">Retry</button>
        </div>
      );
    }
    
    if (!course) {
        return <p className="text-center text-[#0f5257] text-lg py-20">Course details not available.</p>;
    }

    const levels = [
      {
        level: 1,
        title: "1-YEAR PROGRAM: BEGINNER (3 Levels)",
        bg: "bg-[#f1fcf5]",
        border: "border-green-100",
        accent: "#059669",
        subjects: [
          { cat: "Aqeedah & Tawhid", items: "Al-Uṣūl ath-Thalāthah, Al-Qawā‘id al-Arba‘, Kashf ash-Shubuhāt." },
          { cat: "Fiqh & Worship", items: "Shurūṭ aṣ-Ṣalāh wa Arkānihā, ‘Umdat al-Aḥkām." },
          { cat: "Hadith & Basic Sciences", items: "Mandhūmat al-Bayqūniyyah, Nukhbat al-Fikr (Intro)." },
          { cat: "Arabic & Qur’an", items: "Matn al-Ājrūmiyyah, Tuḥfat al-Aṭfāl, Matn al-Jazariyyah." },
          { cat: "Adab & Tazkiyah", items: "Al-Adhkār wa al-Ādāb." },
        ],
        outcome: "Students complete 3 levels of beginner courses, gaining firm foundations in core beliefs, basic worship, Arabic grammar, and Islamic manners."
      },
      {
        level: 2,
        title: "2-YEAR PROGRAM: INTERMEDIATE",
        bg: "bg-[#fffbeb]",
        border: "border-yellow-100",
        accent: "#d97706",
        subjects: [
          { cat: "Year 1 Courses", items: "All foundational material and beginner courses from the 1st year program." },
          { cat: "Aqeedah & Manhaj", items: "Nawāqiḍ al-Islām, Al-‘Aqīdah al-Wāsiṭiyyah, Al-‘Aqīdah aṭ-Ṭaḥāwiyyah." },
          { cat: "Fiqh", items: "Zād al-Mustaqni‘, Bulūgh al-Marām." },
          { cat: "Usūl & Hadith Methodology", items: "Warāqāt (Uṣūl al-Fiqh), Nukhbat al-Fikr (Detailed)." },
          { cat: "Arabic & Language", items: "Continued Al-Ājrūmiyyah with application, Applied grammar exercises." },
          { cat: "Tazkiyah", items: "Lamiyyat al-Af‘āl." },
        ],
        outcome: "Covers all Year 1 details plus Year 2 intermediate courses, providing structured Fiqh understanding and stronger Aqeedah grounding."
      },
      {
        level: 3,
        title: "3-YEAR PROGRAM: ADVANCED (Mastery)",
        bg: "bg-[#eff6ff]",
        border: "border-blue-100",
        accent: "#2563eb",
        subjects: [
          { cat: "Comprehensive Coverage", items: "Complete course details and material for all 3 years: Beginner to Advanced." },
          { cat: "Aqeedah & Creed", items: "Advanced Al-‘Aqīdah aṭ-Ṭaḥāwiyyah, Advanced Al-‘Aqīdah al-Wāsiṭiyyah, Kashf ash-Shubuhāt (Refutation level)." },
          { cat: "Fiqh & Hadith", items: "Advanced Bulūgh al-Marām, Advanced ‘Umdat al-Aḥkām, Advanced Zād al-Mustaqni‘." },
          { cat: "Usūl al-Fiqh", items: "Warāqāt (with case studies)." },
          { cat: "Hadith Sciences", items: "Mandhūmat al-Bayqūniyyah (with Takhrīj), Nukhbat al-Fikr (Application)." },
          { cat: "Arabic", items: "Applied Nahw & Classical Texts." },
        ],
        outcome: "The complete 3-year curriculum. Students master classical texts, understand evidences, and are confident in teaching foundational material."
      }
    ];

    return (
      <>
        <div className="bg-white shadow-xl rounded-3xl p-8 md:p-12 mb-16 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#07CAC3] opacity-5 rounded-bl-full"></div>
          <h2 className="text-4xl md:text-5xl font-serif text-[#045C4C] mb-6">{course.title}</h2>
          <p className="text-gray-600 text-xl leading-relaxed mb-8 max-w-4xl">{course.description}</p>
          
          <div className="flex flex-wrap items-center justify-start gap-x-12 gap-y-6 mb-10">
            <div className="flex items-center gap-3">
              <div className="bg-[#07CAC3]/10 p-2 rounded-full">
                <Target className="text-[#07CAC3] w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Tuition</p>
                <p className="text-2xl font-black text-[#045C4C]">{course.price || 'TBD'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-[#07CAC3]/10 p-2 rounded-full">
                <BookOpen className="text-[#07CAC3] w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Duration</p>
                <p className="text-2xl font-black text-[#045C4C]">{course.schedule || '3 Years'}</p>
              </div>
            </div>
          </div>
          
          <Link href={`/register/${course.id}`} className="inline-block bg-[#07CAC3] text-white font-bold text-xl text-center py-4 px-10 rounded-xl hover:bg-[#077B83] transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl">
            Register Now
          </Link>
        </div>

        {/* NEW Curriculum Journey Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-4xl md:text-5xl font-serif text-[#0f5257] mb-6">The Scholarship Journey</h3>
            <p className="text-gray-600 max-w-3xl mx-auto text-xl leading-relaxed">
              A structured, leveled journey of Islamic scholarship designed to build firm foundations, strength in knowledge, and mastery of the sciences.
            </p>
          </div>
          
          
          <div className="mt-16 space-y-12">
            {levels.map((lvl) => (
              <div key={lvl.level} className={`${lvl.bg} border ${lvl.border} rounded-[2rem] p-8 md:p-14 relative overflow-hidden transition-all duration-500 hover:shadow-2xl group`}>
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <GraduationCap size={150} color={lvl.accent} />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 rounded-2xl bg-white shadow-md text-white" style={{ backgroundColor: lvl.accent }}>
                      <BookOpen size={28} />
                    </div>
                    <h4 className="text-3xl font-bold font-serif" style={{ color: lvl.accent }}>{lvl.title}</h4>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {lvl.subjects.map((sub, i) => (
                      <div key={i} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm hover:shadow-md transition-shadow">
                        <h5 className="font-bold text-[#0f5257] text-lg mb-3 flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lvl.accent }} />
                           {sub.cat}
                        </h5>
                        <p className="text-gray-600 leading-relaxed">{sub.items}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white/90 backdrop-blur-md rounded-[1.5rem] p-8 border border-white shadow-inner">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                      <div className="p-4 rounded-full bg-white shadow-md" style={{ color: lvl.accent }}>
                        <Target size={32} />
                      </div>
                      <div>
                        <span className="text-sm uppercase tracking-[0.2em] font-black block mb-2" style={{ color: lvl.accent }}>Level Outcome</span>
                        <p className="text-[#0f5257] font-bold text-2xl leading-tight">
                          {lvl.outcome}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Program Structure Details */}
        <div className="grid md:grid-cols-2 gap-10 mb-20">
            <div className="bg-[#0f5257] text-white p-10 md:p-14 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
               <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#07CAC3] opacity-10 rounded-full blur-3xl"></div>
               <div className="relative z-10">
                 <h4 className="text-3xl font-serif font-bold mb-8 flex items-center gap-3">
                   <div className="bg-[#07CAC3] p-2 rounded-lg">
                    <BookOpen className="text-white w-6 h-6" />
                   </div>
                   Methodology
                 </h4>
                 <ul className="space-y-6">
                   <li className="flex gap-4">
                     <div className="min-w-[28px] mt-1"><CheckCircle2 className="text-[#07CAC3] w-7 h-7" /></div>
                     <div>
                        <p className="text-xl font-bold text-[#07CAC3] mb-1">Text-based Learning</p>
                        <p className="text-gray-300 text-lg">Direct engagement with classical primary texts.</p>
                     </div>
                   </li>
                   <li className="flex gap-4">
                     <div className="min-w-[28px] mt-1"><CheckCircle2 className="text-[#07CAC3] w-7 h-7" /></div>
                     <div>
                        <p className="text-xl font-bold text-[#07CAC3] mb-1">Teacher Explanation (Sharḥ)</p>
                        <p className="text-gray-300 text-lg">Systematic teaching and clarification from qualified instructors.</p>
                     </div>
                   </li>
                   <li className="flex gap-4">
                     <div className="min-w-[28px] mt-1"><CheckCircle2 className="text-[#07CAC3] w-7 h-7" /></div>
                     <div>
                        <p className="text-xl font-bold text-[#07CAC3] mb-1">Memorization + Understanding</p>
                        <p className="text-gray-300 text-lg">Dual focus on retaining the text and deeply comprehending its meanings.</p>
                     </div>
                   </li>
                 </ul>
               </div>
            </div>
            
            <div className="bg-white border-4 border-[#0f5257]/5 p-10 md:p-14 rounded-[2.5rem] flex flex-col justify-center items-center text-center shadow-xl">
                <div className="bg-[#07CAC3]/10 p-6 rounded-full mb-8">
                  <Award className="text-[#07CAC3] w-20 h-20" />
                </div>
                <h4 className="text-4xl font-serif text-[#0f5257] font-bold mb-6">Certification</h4>
                <p className="text-gray-600 text-xl leading-relaxed max-w-md">
                  Students receive an official <span className="text-[#0f5257] font-bold">Al-Fitrah Training Institute Certificate</span> awarded after the successful completion of each level.
                </p>
            </div>
        </div>
        
        {/* Campus Photos Section */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-serif text-[#0f5257] mb-4">Campus Life</h3>
            <p className="text-gray-500 text-lg">A serene and conducive environment for focused learning and spiritual growth.</p>
          </div>
          <SectionDivider/>
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="group overflow-hidden rounded-3xl shadow-lg h-72 w-auto relative border-4 border-white">
              <img src="/27.jpeg" alt="Campus Photo 1" className="h-full w-auto object-contain group-hover:scale-110 transition-transform duration-700"/>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
            </div>
            <div className="group overflow-hidden rounded-3xl shadow-lg h-72 w-auto relative border-4 border-white">
              <img src="/17.jpeg" alt="Campus Photo 2" className="h-full w-auto object-contain group-hover:scale-110 transition-transform duration-700"/>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
            </div>
            <div className="group overflow-hidden rounded-3xl shadow-lg h-72 w-auto relative border-4 border-white">
              <img src="/21.jpeg" alt="Campus Photo 3" className="h-full w-auto object-contain group-hover:scale-110 transition-transform duration-700"/>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <div className="container mx-auto px-4 py-20 max-w-7xl">
        <h1 className="text-5xl md:text-7xl font-serif text-[#0f5257] font-bold text-center mb-12">Boys Boarding Campus</h1>
        <div className="mt-16">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}