'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Course } from '@/lib/types'; // Make sure this type matches your DB!\
import { CheckCircle2, GraduationCap, BookOpen, Award, Target, Sparkles, Users, Shield, Moon, Calendar, Activity, Heart } from 'lucide-react';
import { STATIC_ASSETS } from '@/lib/assets';

// --- Page-specific configuration ---
// 1. UPDATED: Title exactly matches the SQL database!
const COURSE_TITLE_FOR_FETCH = 'Tahfidh, Tarbiyah and Leadership: 1-3 Year Curriculum'; 
const BOYS_CAMPUS_VIDEO_EMBED_URL = 'https://www.youtube.com/embed/TCWnQzPJCIY?si=-aPEyLTubMLrijub';

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
        title: "1-YEAR PROGRAM: BEGINNER (3 Semesters)",
        bg: "bg-[#f1fcf5]",
        border: "border-green-100",
        accent: "#059669",
        subjects: [
          { cat: "Quranic Excellence", items: "Embarking on a beautiful journey of mastering 10 Juz with precision, focus, and heartfelt revision." },
          { cat: "Aqeedah & Tawhid", items: "Al-Uṣūl ath-Thalāthah, Al-Qawā‘id al-Arba‘, Kashf ash-Shubuhāt." },
          { cat: "Fiqh & Worship", items: "Shurūṭ aṣ-Ṣalāh wa Arkānihā, ‘Umdat al-Aḥkām." },
          { cat: "Hadith & Basic Sciences", items: "Mandhūmat al-Bayqūniyyah, Nukhbat al-Fikr (Intro)." },
          { cat: "Arabic Language", items: "Matn al-Ājrūmiyyah, Tuḥfat al-Aṭfāl, Matn al-Jazariyyah." },
          { cat: "Adab & Tazkiyah", items: "Al-Adhkār wa al-Ādāb." },
        ],
        outcome: "Students complete 3 semesters of beginner courses, gaining firm foundations in core beliefs, basic worship, Arabic grammar, and Islamic manners."
      },
      {
        level: 2,
        title: "2-YEAR PROGRAM: INTERMEDIATE",
        bg: "bg-[#fffbeb]",
        border: "border-yellow-100",
        accent: "#d97706",
        subjects: [
          { cat: "Quranic Excellence", items: "Deepening the spiritual bond with Allah's Word, advancing to 17 Juz of steadfast memorization and thorough revision." },
          { cat: "Year 1 Courses", items: "All foundational material and beginner courses from the 1st year program." },
          { cat: "Aqeedah & Manhaj", items: "Nawāqiḍ al-Islām, Al-‘Aqīdah al-Wāsiṭiyyah, Al-‘Aqīdah aṭ-Ṭaḥāwiyyah." },
          { cat: "Fiqh", items: "Abu shuja‘, Safinatun Najah, Bulūgh al-Marām." },
          { cat: "Usūl & Hadith Methodology", items: "Warāqāt (Uṣūl al-Fiqh), Nukhbat al-Fikr (Detailed)." },
          { cat: "Arabic Language", items: "Continued Al-Ājrūmiyyah with application, Applied grammar exercises." },
          { cat: "Tazkiyah", items: "Lamiyyat al-Af‘āl." },
        ],
        outcome: "Covers all Year 1 details plus year 2 intermediate courses, providing structured Fiqh understanding and stronger Aqeedah grounding."
      },
      {
        level: 3,
        title: "3-YEAR PROGRAM: ADVANCED (Mastery)",
        bg: "bg-[#eff6ff]",
        border: "border-blue-100",
        accent: "#2563eb",
        subjects: [
          { cat: "Quranic Excellence", items: "The ultimate milestone: completing the memorization and revision of the full Quran with unwavering accuracy and mastery." },
          { cat: "Comprehensive Coverage", items: "Complete course details and material for all 3 years: Beginner to Advanced." },
          { cat: "Aqeedah & Creed", items: "Advanced Al-‘Aqīdah aṭ-Ṭaḥāwiyyah, Advanced Al-‘Aqīdah al-Wāsiṭiyyah, Kashf ash-Shubuhāt (Refutation level)." },
          { cat: "Fiqh & Hadith", items: "Advanced Bulūgh al-Marām, Advanced ‘Umdat al-Aḥkām, Advanced Abu shuja‘, Advanced Safinatun Najah‘." },
          { cat: "Usūl al-Fiqh", items: "Warāqāt (with case studies)." },
          { cat: "Hadith Sciences", items: "Mandhūmat al-Bayqūniyyah (with Takhrīj), Nukhbat al-Fikr (Application)." },
          { cat: "Arabic Language", items: "Applied Nahw & Classical Texts." },
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
            <h3 className="text-4xl md:text-5xl font-serif text-[#0f5257] mb-6">The Academic Journey</h3>
            <p className="text-gray-600 max-w-3xl mx-auto text-xl leading-relaxed">
              A structured, leveled journey of Islamic education designed to build firm foundations, strength in knowledge, and mastery of the sciences.
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

        {/* Holiday Programme Section */}
        <div className="mb-20 bg-gradient-to-br from-[#0f5257] to-[#045C4C] rounded-[3rem] p-8 md:p-16 text-white overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Moon size={200} />
          </div>
          <div className="absolute bottom-0 left-0 p-12 opacity-10">
            <Sparkles size={150} />
          </div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                   <Calendar className="text-[#07CAC3] w-6 h-6" />
                   <span className="bg-[#07CAC3] text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">April Holiday Programme Completed. Next Intake will be announced soon In shaa Allah.</span>
                </div>
                <h3 className="text-4xl md:text-6xl font-serif font-bold">4-Week Transformational Holiday Boarding Program</h3>
                <div className="flex flex-wrap items-center gap-6 mt-4">
                  <p className="text-[#07CAC3] text-2xl font-bold">For Boys (12+)</p>
                  <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/20 flex items-center gap-2">
                    <span className="text-[#07CAC3] font-bold">Tuition:</span>
                    <span className="text-xl font-black">Ksh 50,000</span>
                  </div>
                </div>
              </div>
              <Link href="/register/holiday-program" className="bg-[#07CAC3] text-white font-bold py-4 px-10 rounded-2xl hover:bg-white hover:text-[#0f5257] transition-all transform hover:scale-105 shadow-xl border-2 border-[#07CAC3]">
                Register Now
              </Link>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h4 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Shield className="text-[#07CAC3]" />
                  Program Overview
                </h4>
                <p className="text-xl text-gray-200 leading-relaxed mb-8">
                  Join us this season for a unique and transformative experience, far more than just a program. 
                  Our mission is to nurture young boys into strong, confident, and grounded Muslims, 
                  deeply connected to the Qur’an and their identity.
                </p>
                <div className="space-y-4">
                  {[
                    "Develop a deep love for the Qur’an",
                    "Strengthen their connection with Allah",
                    "Find pride and joy in being Muslim"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="text-[#07CAC3] w-6 h-6 shrink-0" />
                      <span className="text-lg">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <h4 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Heart className="text-[#07CAC3]" />
                  A Journey of Tarbiyah
                </h4>
                <p className="text-lg text-gray-200 leading-relaxed mb-6">
                  At Al-Fitrah, Tarbiyah (holistic nurturing) is at our heart. We don't just teach, we build character, instill discipline, and shape future leaders.
                </p>
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                      <p className="text-[#07CAC3] font-bold text-sm uppercase mb-1">Character</p>
                      <p className="text-white font-bold">Strong Values</p>
                   </div>
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                      <p className="text-[#07CAC3] font-bold text-sm uppercase mb-1">Manners</p>
                      <p className="text-white font-bold">Better Manners</p>
                   </div>
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                      <p className="text-[#07CAC3] font-bold text-sm uppercase mb-1">Identity</p>
                      <p className="text-white font-bold">Islamic Identity</p>
                   </div>
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                      <p className="text-[#07CAC3] font-bold text-sm uppercase mb-1">Leadership</p>
                      <p className="text-white font-bold">Shape Leaders</p>
                   </div>
                </div>
              </div>
            </div>

            <div className="mt-16">
               <h4 className="text-3xl font-serif font-bold mb-10 text-center text-[#07CAC3]">Comprehensive Curriculum</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { title: "Qur’an", desc: "Quran recitation, Tafsir of Juz Amma, Memorization & revision", icon: BookOpen },
                    { title: "Aqeedah", desc: "Strong Islamic belief, Understanding of Tawheed", icon: Shield },
                    { title: "Fiqh", desc: "Daily Islamic rulings, Practical worship (Salah, purification)", icon: CheckCircle2 },
                    { title: "Seerah", desc: "Life of Prophet Muhammad ﷺ, Lessons from his character", icon: Heart },
                    { title: "Ahadith", desc: "Essential sayings of the Prophet ﷺ, Practical application", icon: GraduationCap },
                    { title: "Akhlaq & Adab", desc: "Manners, respect, and building noble character", icon: Users },
                    { title: "Dua & Sunnah", desc: "Important daily supplications, Living a Sunnah-centered life", icon: Moon },
                    { title: "Character", desc: "Building leadership and discipline in every action", icon: Target }
                  ].map((sub, i) => (
                    <div key={i} className="bg-white/5 hover:bg-white/10 transition-colors p-6 rounded-2xl border border-white/10 group">
                      <div className="bg-[#07CAC3] w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <sub.icon className="text-white w-6 h-6" />
                      </div>
                      <h5 className="text-xl font-bold mb-2">{sub.title}</h5>
                      <p className="text-gray-300 text-sm leading-relaxed">{sub.desc}</p>
                    </div>
                  ))}
               </div>
            </div>

            <div className="mt-16 grid md:grid-cols-2 gap-12 items-center">
               <div className="order-2 md:order-1">
                  <h4 className="text-3xl font-serif font-bold mb-6">Balanced with Fun & Growth</h4>
                  <p className="text-xl text-gray-200 leading-relaxed mb-8">
                    Learning is combined with engaging activities to ensure a joyful and memorable experience in a clean, safe, and spacious environment.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {["Basketball", "Football", "Tennis"].map((sport, i) => (
                      <span key={i} className="bg-[#07CAC3]/20 border border-[#07CAC3]/30 px-6 py-2 rounded-full font-bold flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#07CAC3]" />
                        {sport}
                      </span>
                    ))}
                  </div>
               </div>
               <div className="order-1 md:order-2 bg-[#07CAC3]/10 rounded-[2rem] p-4 border border-white/10">
                  <img src={STATIC_ASSETS.boysBoarding21} alt="Activities" className="rounded-[1.5rem] w-full h-64 object-cover shadow-2xl" />
               </div>
            </div>
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
        
        {/* Daily Schedule Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-4xl md:text-5xl font-serif text-[#0f5257] mb-6">Daily Schedule</h3>
            <p className="text-gray-600 max-w-3xl mx-auto text-xl leading-relaxed">
              A structured daily routine designed to balance intensive learning, spiritual devotion, and personal growth.
            </p>
          </div>
          
          <div className="bg-white rounded-[3rem] p-4 md:p-8 shadow-2xl border border-gray-100 overflow-hidden">
            <div className="relative group">
              <img 
                src={STATIC_ASSETS.boysBoardingTimetable} 
                alt="Boys Boarding Campus Daily Timetable" 
                className="w-full h-auto rounded-[2rem] shadow-inner transition-transform duration-700"
              />
              <div className="absolute inset-0 rounded-[2rem] border-4 border-[#07CAC3]/10 pointer-events-none"></div>
            </div>
            
            <div className="mt-8 grid md:grid-cols-3 gap-6 px-4">
              <div className="flex items-start gap-4">
                <div className="bg-[#07CAC3]/10 p-3 rounded-xl">
                  <Activity className="text-[#07CAC3] w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-bold text-[#0f5257]">Structured Routine</h5>
                  <p className="text-gray-500 text-sm">Every hour is optimized for physical and spiritual development.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-[#07CAC3]/10 p-3 rounded-xl">
                  <Moon className="text-[#07CAC3] w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-bold text-[#0f5257]">Spiritual Focus</h5>
                  <p className="text-gray-500 text-sm">Built around the five daily prayers and dedicated Quran time.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-[#07CAC3]/10 p-3 rounded-xl">
                  <Users className="text-[#07CAC3] w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-bold text-[#0f5257]">Community Living</h5>
                  <p className="text-gray-500 text-sm">Developing brotherhood and leadership through shared activities.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Staff Excellence Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-4xl md:text-5xl font-serif text-[#0f5257] mb-6">Staff Excellence</h3>
            <p className="text-gray-600 max-w-3xl mx-auto text-xl leading-relaxed">
              Guided by experienced educators and spiritual mentors dedicated to nurturing the next generation of scholars.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mt-12">
            {[
              { name: "Ustadha Amina", role: "Principal", img: STATIC_ASSETS.facultyAmina },
              { name: "Sheikh Abdinasser", role: "Head of Pastoral", img: STATIC_ASSETS.sheikhAbdinassir },
              { name: "Ustadh Nasser", role: "Islamiyat & Quran Teacher", img: STATIC_ASSETS.facultyNasser },
              { name: "Ustadh Musa", role: "Arabic Teacher", img: STATIC_ASSETS.facultyMusa },
              { name: "Ustadh Abubakr", role: "Quran Teacher", img: STATIC_ASSETS.facultyAbubakr },
            ].map((staff, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="h-64 relative overflow-hidden">
                  <img 
                    src={staff.img} 
                    alt={staff.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f5257]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                    <p className="text-white text-sm font-medium italic">"{staff.role}"</p>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h4 className="text-xl font-bold text-[#0f5257] mb-1">{staff.name}</h4>
                  <p className="text-[#07CAC3] font-semibold text-sm uppercase tracking-wider">{staff.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Campus Photos Section */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h3 className="text-4xl font-serif text-[#0f5257] mb-4">Campus Life & Events</h3>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">A glimpse into the vibrant environment and meaningful events that shape our students' journey at the Boys Boarding Campus.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {[
              { img: STATIC_ASSETS.boysBoardingDSC09571, alt: "Boys Campus Event 1" },
              { img: STATIC_ASSETS.boysBoardingDSC09524, alt: "Boys Campus Event 2" },
              { img: STATIC_ASSETS.boysBoardingDSC09478, alt: "Boys Campus Activity" },
              { img: STATIC_ASSETS.boysBoardingDSC09475, alt: "Learning Environment" },
              { img: STATIC_ASSETS.boysBoarding21, alt: "Campus Facilities" },
              { img: STATIC_ASSETS.boysBoardingDSC09511, alt: "Student Engagement" },
            ].map((photo, i) => (
              <div key={i} className="group overflow-hidden rounded-3xl shadow-lg aspect-square relative border-4 border-white bg-gray-100">
                <img 
                  src={photo.img} 
                  alt={photo.alt} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <p className="text-white font-medium">{photo.alt}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/gallery" className="inline-flex items-center gap-2 text-[#07CAC3] font-bold text-lg hover:text-[#0f5257] transition-colors">
              View Full Campus Gallery
              <Sparkles className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <div className="container mx-auto px-4 py-20 max-w-7xl">
        <h1 className="text-5xl md:text-7xl font-serif text-[#0f5257] font-bold text-center mb-12">Boys Boarding Campus</h1>
        <div className="mb-12 overflow-hidden rounded-[2rem] border border-[#041719] bg-gradient-to-br from-[#041719] via-[#0b2b2e] to-[#041719] p-3 shadow-[0_28px_80px_rgba(4,23,25,0.35)]">
          <div className="aspect-video overflow-hidden rounded-[1.5rem] border border-white/10 bg-black">
            <iframe
              className="h-full w-full"
              src={BOYS_CAMPUS_VIDEO_EMBED_URL}
              title="Boys Boarding Campus YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
        <div className="mt-16">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
