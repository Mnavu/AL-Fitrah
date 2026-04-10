"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Heart, Users, Lightbulb, Mail, Send } from 'lucide-react';
import { SectionDivider } from '@/components/ui/FloralDecorations';

// Announcements Banner
const GoldAccent = ({ className }: { className?: string }) => (
  <div className={`mx-auto mt-4 h-1 w-24 rounded bg-gold ${className ?? ''}`} />
);

const AnnouncementsBanner = () => (
  <div className="sticky top-0 z-40 w-full bg-paleYellow text-primary py-5 px-6 text-center font-semibold shadow-md">
    <p className="text-lg md:text-xl"><span className="text-gold mr-8">•</span>📢 Now Enrolling: The 1 -3 Year Boys Boarding Programme. A unique blend of Tarbiyah, Ta'lim, Tahfidh and Leadership designed to forge the next generation of leaders.</p>
  </div>
);

const HeroSection = () => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    // Ensure playback continues with sound after user interaction.
    if (!nextMuted) {
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center text-white overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/Al-Fitrah_Intro.mp4?v=20260302" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-serif mb-4 drop-shadow-lg">Al-Fitrah Training Institute.</h1>
        <div/>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 justify-center">
          <Link href="/academics/south-c" className="bg-accent hover:bg-accent/90 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 shadow-lg">
            South C Campus
          </Link>
          <Link href="/academics/boys-boarding" className="border-2 border-white text-white hover:bg-white/20 backdrop-blur-sm font-bold py-3 px-8 rounded-lg text-lg transition duration-300">
            Boys Boarding Campus
          </Link>
        </div>
      </div>
      <button
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute hero video" : "Mute hero video"}
        className="absolute bottom-10 right-10 bg-white/30 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/50 transition-colors"
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>
    </section>
  );
};

const WhyChooseAlFitrah = () => (
  <section className="container mx-auto px-4 py-20">
    <h2 className="text-4xl md:text-5xl font-serif text-primary text-center mb-4">Why Choose Al-Fitrah?</h2>
    <GoldAccent />
    <p className="text-center text-primary opacity-75 mb-12 max-w-2xl mx-auto text-lg">
      A revolutionary approach to Islamic education rooted in our core pillars.
    </p>
    <div className="grid md:grid-cols-3 gap-8">
      {/* Card 1 */}
      <div className="bg-white shadow-lg rounded-lg p-8 hover:shadow-xl transition-shadow border-l-4 border-accent">
        <div className="flex justify-center mb-4">
          <Lightbulb size={40} className="text-accent" />
        </div>
        <h3 className="text-2xl font-serif text-primary mb-3 text-center">Holistic Tarbiyah</h3>
        <p className="text-primary text-center leading-relaxed">
          Moving beyond rote memorization to build character, resilience, and emotional intelligence.
        </p>
      </div>
      {/* Card 2 */}
      <div className="bg-white shadow-lg rounded-lg p-8 hover:shadow-xl transition-shadow border-l-4 border-accent">
        <div className="flex justify-center mb-4">
          <Heart size={40} className="text-accent" />
        </div>
        <h3 className="text-2xl font-serif text-primary mb-3 text-center">Authentic Knowledge</h3>
        <p className="text-primary text-center leading-relaxed">
          Curriculums strictly rooted in the Qur'an and authentic Sunnah.
        </p>
      </div>
      {/* Card 3 */}
      <div className="bg-white shadow-lg rounded-lg p-8 hover:shadow-xl transition-shadow border-l-4 border-accent">
        <div className="flex justify-center mb-4">
          <Users size={40} className="text-accent" />
        </div>
        <h3 className="text-2xl font-serif text-primary mb-3 text-center">Dedicated Mentorship</h3>
        <p className="text-primary text-center leading-relaxed">
          Expert faculty guiding students through every stage of life.
        </p>
      </div>
    </div>
  </section>
);

const CorePillars = () => (
  <section className="bg-secondary py-20">
    <div className="container mx-auto px-4">
      <h2 className="text-4xl md:text-5xl font-serif text-primary text-center mb-4">Our Core Pillars</h2>
      <GoldAccent />
      <p className="text-center text-primary opacity-75 mb-12 max-w-2xl mx-auto text-lg">
        Comprehensive programs designed for every stage of your Islamic journey.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Pillar 1 */}
        <Link href="/academics/south-c" className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-t-4 border-primary">
          <h3 className="text-xl font-serif text-primary mb-3">Children & Youth</h3>
          <p className="text-sm text-primary mb-4">
            Nooraniyah, Tajweed, and the Tarbiyah Foundation Youth Program (TFYP).
          </p>
          <span className="text-accent font-semibold text-sm">Learn More →</span>
        </Link>
        {/* Pillar 2 */}
        <Link href="/academics/south-c" className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-t-4 border-primary">
          <h3 className="text-xl font-serif text-primary mb-3">Sisters Program</h3>
          <p className="text-sm text-primary mb-4">
            Empowering women through sacred knowledge and weekend halaqas.
          </p>
          <span className="text-accent font-semibold text-sm">Learn More →</span>
        </Link>
        {/* Pillar 3 */}
        <Link href="/academics/south-c" className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-t-4 border-primary">
          <h3 className="text-xl font-serif text-primary mb-3">Adult Education</h3>
          <p className="text-sm text-primary mb-4">
            Marriage courses, parenting, and advanced Islamic sciences.
          </p>
          <span className="text-accent font-semibold text-sm">Learn More →</span>
        </Link>
        {/* Pillar 4 */}
        <Link href="/academics/boys-boarding" className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-t-4 border-primary">
          <h3 className="text-xl font-serif text-primary mb-3">Boys Boarding</h3>
          <p className="text-sm text-primary mb-4">
            2-Year Intensive Leadership & Mindset Hifdh Program.
          </p>
          <span className="text-accent font-semibold text-sm">Learn More →</span>
        </Link>
        {/* Pillar 5 */}
        <Link href="/academics/south-c" className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-t-4 border-primary">
          <h3 className="text-xl font-serif text-primary mb-3">Counselling</h3>
          <p className="text-sm text-primary mb-4">
            Faith-based counseling with expert guidance.
          </p>
          <span className="text-accent font-semibold text-sm">Learn More →</span>
        </Link>
      </div>
    </div>
  </section>
);

const OurApproach = () => (
  <section className="bg-white py-20 border-t border-secondary">
    <div className="container mx-auto px-4 max-w-[1440px]">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-serif text-primary mb-6">Our Approach</h2>
        <GoldAccent />
        <div className="mt-10 max-w-6xl mx-auto">
          <p className="text-xl text-primary leading-relaxed mb-8">
            At Al-Fitrah, we understand that every parent/guardian and or teacher desires something beautiful for their children, a strong connection with Allah, noble character, and a sincere love for Islam. But one common question always arises:
          </p>
          <div className="bg-paleYellow p-8 rounded-xl border-2 border-accent/20 relative max-w-5xl mx-auto">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full border border-accent/20 text-accent font-serif italic">The Question</span>
            <p className="text-2xl md:text-3xl font-serif text-primary italic leading-tight">
              "How do we teach Islam to children in a way they truly understand, love, and enjoy?"
            </p>
          </div>
          <p className="text-lg text-primary mt-10 leading-relaxed opacity-90">
            Teaching young minds is a responsibility filled with reward, but it can also feel overwhelming.
            Where do we begin? How much should we teach? And most importantly, how do we make it something they look forward to, not something they feel pressured by?
          </p>
          <p className="text-xl font-bold text-primary mt-8">
            At Al-Fitrah Training Institute, we believe that learning Islam should be alive, engaging, and heart-centered, not dry or difficult.
          </p>
        </div>
      </div>


      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-12">
          <div className="bg-secondary/30 p-8 rounded-2xl border-l-4 border-accent">
            <h3 className="text-2xl font-serif text-primary mb-4">Nurturing Hearts Before Minds</h3>
            <p className="text-primary leading-relaxed mb-4">
              We don’t just teach information, we build Iman, identity, and character. Children learn best when they feel:
            </p>
            <ul className="grid grid-cols-3 gap-2 text-center">
              {['Safe', 'Loved', 'Inspired'].map((item) => (
                <li key={item} className="bg-white py-2 rounded-lg border border-accent/20 text-accent font-semibold text-sm">
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-primary leading-relaxed mt-4 text-sm opacity-80 italic">
              Our environment is designed to be warm, welcoming, and uplifting, where every child feels a sense of belonging.
            </p>
          </div>

          <div className="bg-secondary/30 p-8 rounded-2xl border-l-4 border-accent">
            <h3 className="text-2xl font-serif text-primary mb-4">Simple and Meaningful</h3>
            <p className="text-primary leading-relaxed mb-4">
              We break down Islamic concepts into easy, relatable lessons that children can connect to their daily lives. We focus on:
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-3 text-primary"><span className="w-1.5 h-1.5 rounded-full bg-accent" /> Small, consistent learning</li>
              <li className="flex items-center gap-3 text-primary"><span className="w-1.5 h-1.5 rounded-full bg-accent" /> Practical examples</li>
              <li className="flex items-center gap-3 text-primary"><span className="w-1.5 h-1.5 rounded-full bg-accent" /> Real-life application</li>
            </ul>
            <p className="mt-4 font-serif text-primary italic">"Because Islam is not just to be memorized, it is to be lived."</p>
          </div>
        </div>

        <div className="space-y-12">
          <div className="bg-secondary/30 p-8 rounded-2xl border-l-4 border-accent">
            <h3 className="text-2xl font-serif text-primary mb-4">Stories and Connection</h3>
            <p className="text-primary leading-relaxed mb-4">
              Children love stories, and Islam is rich with them. From the lives of the Prophets to the companions, we bring lessons to life through:
            </p>
            <div className="flex flex-wrap gap-3">
              {['Storytelling', 'Reflection', 'Discussion'].map((tag) => (
                <span key={tag} className="bg-accent/10 text-accent px-4 py-1 rounded-full text-sm font-medium border border-accent/20">
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-4 text-primary leading-relaxed text-sm opacity-80">
              This helps children not only understand Islam, but feel it deeply.
            </p>
          </div>

          <div className="bg-secondary/30 p-8 rounded-2xl border-l-4 border-accent">
            <h3 className="text-2xl font-serif text-primary mb-4">Building Character and Identity</h3>
            <p className="text-primary leading-relaxed mb-4">
              Our goal is not just knowledgeable children—but confident young Muslims. We focus on:
            </p>
            <ul className="space-y-1">
              {['Good manners (Akhlaq)', 'Respect and kindness', 'Responsibility and discipline', 'Love for Allah and His Messenger ﷺ'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-primary">
                  <Heart size={14} className="text-accent fill-accent/20" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-20 bg-primary text-white p-8 md:p-12 rounded-3xl shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 transition-transform group-hover:rotate-0">
          <Lightbulb size={120} />
        </div>
        <div className="relative z-10">
          <h3 className="text-3xl font-serif mb-6">Creating Joy in Learning</h3>
          <p className="text-lg mb-10 opacity-90 max-w-3xl">
            When children enjoy learning, they remember it for life. We incorporate a positive, motivating atmosphere so that every class becomes something they are excited to attend.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Interactive sessions', 'Group activities', 'Gentle encouragement', 'Motivating atmosphere'].map((item) => (
              <div key={item} className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 text-center text-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-20 text-center">
        <h3 className="text-3xl font-serif text-primary mb-6">A Space for Growth, Sisterhood, and Community</h3>
        <p className="text-xl text-primary leading-relaxed max-w-4xl mx-auto opacity-90">
          Al-Fitrah is more than a place of learning, it is a living community. A place where hearts connect, friendships grow, and faith is strengthened. We aim to create an environment where children don’t just learn Islam, they love being Muslim.
        </p>
      </div>

      <div className="mt-20 pt-16 border-t border-accent/20 text-center">
        <p className="text-2xl font-serif text-primary italic mb-10 max-w-5xl mx-auto">
          "Teaching Islam to children does not have to be complicated. With the right approach, the right environment, and sincere intention, it becomes a beautiful journey—for both the child and the teacher."
        </p>
        <div className="inline-block bg-accent text-white px-10 py-4 rounded-full text-xl font-serif shadow-lg">
          At Al-Fitrah Training Institute, we are committed to making that journey easy, meaningful, and full of barakah.
        </div>
      </div>
    </div>
  </section>
);
/*
const WaqfSection = () => {
  const [showWaqfModal, setShowWaqfModal] = useState(false);

  return (
    <>
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary opacity-90"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
          backgroundRepeat: 'repeat'
        }}></div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-serif mb-4">Build Our Permanent Home</h2>
          <GoldAccent />
          <p className="text-xl md:text-2xl font-semibold mb-2">The Al-Fitrah Waqf</p>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Help us secure a lasting legacy. We are raising funds to purchase a permanent facility, eliminating rental risks and expanding our capacity to serve women, youth, and children.
          </p>
            <button
              onClick={() => setShowWaqfModal(true)}
              className="bg-accent hover:bg-accent/90 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 shadow-lg"
            >
              Support the Waqf
            </button>
        </div>
      </section>

      {showWaqfModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-serif text-primary mb-4">Support the Waqf</h3>
            <p className="text-primary mb-6">
              Your generous contribution helps secure a permanent home for Al-Fitrah.
            </p>
            <div className="bg-secondary p-4 rounded-lg mb-6">
              <p className="text-sm font-semibold text-primary mb-2">Paybill Details:</p>
              <p className="text-primary font-mono">Business Code: <strong>400000</strong></p>
              <p className="text-primary font-mono">Account: <strong>Al-Fitrah Waqf</strong></p>
            </div>
            <div className="space-y-3">
                <Link href="/contact" className="block w-full bg-primary text-white py-2 rounded-lg text-center hover:bg-primary transition ring-2 ring-gold ring-offset-2 ring-offset-black/20">
                Donate via Website
              </Link>
              <button
                onClick={() => setShowWaqfModal(false)}
                className="w-full border-2 border-primary text-primary py-2 rounded-lg hover:bg-secondary transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
*/
const UpcomingEvents = () => (
  <section className="bg-white py-24 overflow-hidden relative">
    {/* Decorative background element */}
    <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
    <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full -ml-48 -mb-48 blur-3xl"></div>
    
    <div className="container mx-auto px-4 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-serif text-primary mb-4">Upcoming Campus Events</h2>
        <GoldAccent />
        <p className="text-xl text-primary opacity-80 max-w-2xl mx-auto">
          Join us for special gatherings, seminars, and community celebrations across our campuses.
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="bg-secondary/40 rounded-[2.5rem] overflow-hidden shadow-2xl border border-accent/20 flex flex-col md:flex-row items-stretch group hover:shadow-accent/10 transition-all duration-500">
          {/* Event Image */}
          <div className="md:w-1/2 relative h-80 md:h-auto overflow-hidden">
            <img 
              src="/Ladies.jpg" 
              alt="Eid Gala" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
            <div className="absolute bottom-6 left-6">
              <span className="bg-accent text-white px-4 py-1 rounded-full text-sm font-bold tracking-wider uppercase">
                Sisters Program
              </span>
            </div>
          </div>

          {/* Event Content */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-accent font-bold mb-4">
              <Calendar size={20} />
              <span>Next Eid - Date TBC</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-serif text-primary mb-6">Upcoming Eid Gala</h3>
            <p className="text-lg text-primary leading-relaxed mb-8 opacity-90">
              A celebration of sisterhood and joy. Our annual Eid Gala returns with inspiring talks, activities, and a chance to connect with the community. Registration is now open.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/academics/south-c" 
                className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-center hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20"
              >
                View on South C Campus
              </Link>
              <Link 
                href="/register/eid-gala-2026" 
                className="bg-accent text-white px-8 py-4 rounded-xl font-bold text-center hover:bg-accent/90 transition-all shadow-lg hover:shadow-accent/20"
              >
                Register Now
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-primary/60 font-medium">
            Stay tuned for more events at our Karen and Boys Boarding campuses.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const FacultySection = () => (
  <section className="bg-white py-20">
    <div className="container mx-auto px-4">
      <h2 className="text-4xl md:text-5xl font-serif text-primary text-center mb-12">Our Esteemed Faculty</h2>
      <div/>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Faculty 1 */}
        <div className="text-center">
          <div className="w-44 h-44 rounded-full mx-auto mb-6 relative overflow-hidden ring-4 ring-[#07CAC3]/30 shadow-lg">
            <img src="/UstAmina.jpg" // 👈 Make sure to put the photo in your 'public' folder
              alt="Ustadha Amina" className="w-full h-full object-cover"/>
          </div>
          <h3 className="text-2xl font-serif text-primary mb-2">Ustadha Amina Abdiqadir</h3>
          <p className="text-accent font-semibold mb-3">Founder & Lead Instructor</p>
          <p className="text-primary text-sm leading-relaxed">
            Tarbiyah, Sisters Programs, and Faith-Based Counselling. Over 15 years of dedicated service.
          </p>
        </div>
        {/* Faculty 2 */}
        <div className="text-center">
          <div className="w-44 h-44 rounded-full mx-auto mb-6 relative overflow-hidden ring-4 ring-[#07CAC3]/30 shadow-lg">
            <img src="/UstNasser.jpeg" // 👈 Make sure to put the photo in your 'public' folder
              alt="Ustadh Nasser" className="w-full h-full object-cover"/>
          </div>
          <h3 className="text-2xl font-serif text-primary mb-2">Ustadh Nasser Abdulaziz</h3>
          <p className="text-accent font-semibold mb-3">Lead Instructor</p>
          <p className="text-primary text-sm leading-relaxed">
            Quranic Sciences and Tafsir. Specializing in classical Quranic methodology.
          </p>
        </div>
        {/* Faculty 3 */}
        <div className="text-center">
          <div className="w-44 h-44 rounded-full mx-auto mb-6 relative overflow-hidden ring-4 ring-[#07CAC3]/30 shadow-lg">
            <img src="/UstMusa.jpeg" // 👈 Make sure to put the photo in your 'public' folder
              alt="Ustadh Musa" className="w-full h-full object-cover"/>
          </div>
          <h3 className="text-2xl font-serif text-primary mb-2">Ustadh Musa Anis</h3>
          <p className="text-accent font-semibold mb-3">Senior Instructor</p>
          <p className="text-primary text-sm leading-relaxed">
            Arabic Language and Islamic Jurisprudence.
          </p>
        </div>
        <div className="text-center">
          <div className="w-44 h-44 rounded-full mx-auto mb-6 relative overflow-hidden ring-4 ring-[#07CAC3]/30 shadow-lg">
            <img src="/UstNahla.png" // 👈 Make sure to put the photo in your 'public' folder
              alt="Ustadha Nahla Rashid" className="w-full h-full object-cover"/>
          </div>
          <h3 className="text-2xl font-serif text-primary mb-2">Ustadha Nahla Rashid</h3>
          <p className="text-accent font-semibold mb-3">Nooraniyah Instructor</p>
          <p className="text-primary text-sm leading-relaxed">
            Tajweed Basics. Ensuring you are able to read the Quran correctly.
          </p>
        </div>
        <div className="text-center">
          <div className="w-44 h-44 rounded-full mx-auto mb-6 relative overflow-hidden ring-4 ring-[#07CAC3]/30 shadow-lg">
            <img src="/UstMariam.png" 
              alt="Ustadha Mariam" className="w-full h-full object-cover"/>
          </div>
          <h3 className="text-2xl font-serif text-primary mb-2">Ustadha Mariam</h3>
          <p className="text-accent font-semibold mb-3">Aqeeda and Hadith Instructor</p>
          <p className="text-primary text-sm leading-relaxed">
            She leads the Aqeedah and Hadith modules for our children's programs.
          </p>
        </div>
        <div className="text-center">
          <div className="w-44 h-44 rounded-full mx-auto mb-6 relative overflow-hidden ring-4 ring-[#07CAC3]/30 shadow-lg">
            <img src="/UstAbubakr.png" 
              alt="Ustadh Abubakr" className="w-full h-full object-cover"/>
          </div>
          <h3 className="text-2xl font-serif text-primary mb-2">Ustadh Abubakr</h3>
          <p className="text-accent font-semibold mb-3">Quran Instructor</p>
          <p className="text-primary text-sm leading-relaxed">
            Our Qur'an instructor specializes in the Nooraniyah method, to ensure an accurate connection to the Book of Allah.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const InstitutionalPartnerships = () => (
  <section className="bg-primary py-20">
    <div className="container mx-auto px-4 text-center text-white">
      <h2 className="text-4xl md:text-5xl font-serif mb-4">Elevate Your School's Islamic Curriculum</h2>
      <GoldAccent />
      <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
        Al-Fitrah offers bespoke curriculum upgrades and teacher training for Islamic schools. Transition from rote memorization to holistic Tarbiyah.
      </p>
      <Link href="/contact" className="inline-block bg-accent hover:bg-accent/90 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300">
        Partner With Us
      </Link>
    </div>
  </section>
);

const TestimonialsSection = () => (
  <section className="container mx-auto px-4 py-20">
    <h2 className="text-4xl md:text-5xl font-serif text-primary text-center mb-12">What Parents & Students Say</h2>
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-secondary rounded-lg p-8 border-l-4 border-accent">
        <p className="text-primary mb-4 italic text-lg">
          "The Youth Program completely transformed my son's perspective on his Islamic identity. He's more engaged and grounded."
        </p>
        <p className="font-semibold text-primary">— Amina M., Parent</p>
      </div>
      <div className="bg-secondary rounded-lg p-8 border-l-4 border-accent">
        <p className="text-primary mb-4 italic text-lg">
          "The Sisters Program gave me the confidence to practice my faith authentically. The mentorship is invaluable."
        </p>
        <p className="font-semibold text-primary">— Zainab R., Student</p>
      </div>
    </div>
  </section>
);

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
    setEmail('');
  };

  return (
    <section className="bg-gradient-to-r from-secondary to-secondary py-16">
      <div className="container mx-auto px-4 text-center max-w-2xl">
        <h3 className="text-3xl font-serif text-primary mb-3">Stay Connected</h3>
        <p className="text-primary mb-6">
          Subscribe to receive updates on new short courses, free community lectures, and exclusive Islamic resources.
        </p>
        <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-4 py-3 rounded-lg border-2 border-accent focus:outline-none"
          />
          <button
            type="submit"
            className="bg-accent hover:bg-accent/90 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center gap-2"
          >
            <Send size={18} /> Subscribe
          </button>
        </form>
            {subscribed && (
              <p className="text-gold mt-4 font-semibold">✓ Successfully subscribed!</p>
            )}
      </div>
    </section>
  );
};

const AboutUsContent = () => {
    const videoRefJourney = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRefJourney.current) {
            videoRefJourney.current.playbackRate = 2;
        }
    }, []);

    return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-4xl font-serif text-primary text-center mb-12">About Al-Fitrah Training Institute</h2>

      {/* Mission & Vision */}
      <section className="mb-16 grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-3xl font-serif text-primary mb-4">Our Mission: Tarbiyah (Holistic Development)</h3>
          <p className="text-lg text-primary leading-relaxed">
            At Al-Fitrah Training Institute, our mission is rooted in Tarbiyah – the holistic development of individuals
            according to Islamic principles. We strive to nurture intellectual growth, spiritual purification,
            and moral excellence, preparing our students to be exemplary citizens and leaders in their communities.
          </p>
        </div>
        <div>
          <h3 className="text-3xl font-serif text-primary mb-4">Our Vision</h3>
          <p className="text-lg text-primary leading-relaxed">
            To be a leading educational institution that inspires a deep understanding of Islamic knowledge
            and its application in contemporary life, fostering a generation committed to faith, service, and excellence.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="mb-16">
        <h3 className="text-3xl font-serif text-primary text-center mb-12">Our Journey: 15 Years of Excellence</h3>
        <div className="flex justify-center mb-8">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              preload="auto"
              ref={videoRefJourney} 
              onLoadedMetadata={() => {
                  if (videoRefJourney.current) {
                      videoRefJourney.current.playbackRate = 2;
                  }
              }}
              className="w-full rounded-lg shadow-lg">
              <source src="/SLIDESHOW.mp4?v=20260302" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
        </div>
        <div className="relative wrap overflow-hidden p-10 h-full">
          <div className="border-2-2 absolute border-opacity-20 border-accent h-full border" style={{ left: '50%' }}></div>
          {/* Timeline Item 1 */}
          <div className="mb-8 flex justify-between flex-row-reverse items-center w-full left-timeline">
            <div className="order-1 w-5/12"></div>
            <div className="order-1 w-5/12 px-1 py-4 text-right">
              <p className="mb-3 text-base text-gold">1995</p>
              <h4 className="mb-3 font-bold text-lg md:text-2xl text-primary">Founding of the Institute</h4>
              <p className="text-sm md:text-base leading-snug text-primary text-opacity-100">
                Al-Fitrah Training Institute was established with a vision to provide authentic Islamic education.
              </p>
            </div>
          </div>
          {/* Timeline Item 2 */}
          <div className="mb-8 flex justify-between items-center w-full right-timeline">
            <div className="order-1 w-5/12 px-1 py-4 text-left">
              <p className="mb-3 text-base text-gold">2005</p>
              <h4 className="mb-3 font-bold text-lg md:text-2xl text-primary">Expansion of Curriculum</h4>
              <p className="text-sm md:text-base leading-snug text-primary text-opacity-100">
                Introduced advanced programs in Quranic sciences and classical Arabic.
              </p>
            </div>
          </div>
          {/* Timeline Item 3 */}
          <div className="mb-8 flex justify-between flex-row-reverse items-center w-full left-timeline">
            <div className="order-1 w-5/12"></div>
            <div className="order-1 w-5/12 px-1 py-4 text-right">
              <p className="mb-3 text-base text-gold">2015</p>
              <h4 className="mb-3 font-bold text-lg md:text-2xl text-primary">Community Outreach Programs</h4>
              <p className="text-sm md:text-base leading-snug text-primary text-opacity-100">
                Launched initiatives to serve the broader community through educational workshops and seminars.
              </p>
            </div>
          </div>
          {/* Timeline Item 4 */}
          <div className="mb-8 flex justify-between items-center w-full right-timeline">
            <div className="order-1 w-5/12 px-1 py-4 text-left">
              <p className="mb-3 text-base text-gold">2025</p>
              <h4 className="mb-3 font-bold text-lg md:text-2xl text-primary">Celebrating 15 Years</h4>
              <p className="text-sm md:text-base leading-snug text-primary text-opacity-100">
                A milestone celebration of thirty years dedicated to empowering lives through knowledge and faith.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


export default function Home() {
  return (
    <>
      <AnnouncementsBanner />
      <HeroSection />
      <WhyChooseAlFitrah />
      <SectionDivider />
      <OurApproach />
      <CorePillars />
      <UpcomingEvents />
      {/*<WaqfSection />*/}
      <FacultySection />
      <TestimonialsSection />
      <InstitutionalPartnerships />
      <NewsletterSection />
      <SectionDivider />
      <AboutUsContent />
    </>
  );
}
