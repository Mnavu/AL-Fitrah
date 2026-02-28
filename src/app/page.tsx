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
  <div className="sticky top-0 z-30 w-full bg-paleYellow text-primary py-3 px-4 text-center font-semibold shadow-md">
    <p className="text-sm md:text-base"><span className="text-gold mr-2">•</span>📢 Now Enrolling: Islamic Tarbiyah Holiday Program & The 8-Week Sisters Transformational Series!</p>
  </div>
);

const HeroSection = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [needsPlay, setNeedsPlay] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const tryAutoplay = async () => {
      try {
        await video.play();
        setNeedsPlay(false);
      } catch {
        setNeedsPlay(true);
      }
    };
    tryAutoplay();
  }, []);

  const handlePlay = async () => {
    const video = videoRef.current;
    if (!video) return;
    setIsMuted(false);
    try {
      await video.play();
      setNeedsPlay(false);
    } catch {
      setNeedsPlay(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    // Ensure playback continues with sound after user interaction.
    if (!nextMuted) {
      videoRef.current.play().catch(() => {
        setNeedsPlay(true);
      });
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
        controls
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/Al-Fitrah_Intro.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black opacity-40"></div>
      {needsPlay && (
        <button
          type="button"
          onClick={handlePlay}
          className="absolute inset-0 z-20 m-auto h-12 w-44 rounded-full bg-white/80 text-primary font-semibold shadow-lg backdrop-blur-sm"
        >
          Tap to Play
        </button>
      )}
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
    const [needsPlayJourney, setNeedsPlayJourney] = useState(false);

    useEffect(() => {
        const video = videoRefJourney.current;
        if (!video) return;
        video.playbackRate = 2;

        const tryAutoplay = async () => {
            try {
                await video.play();
                setNeedsPlayJourney(false);
            } catch {
                setNeedsPlayJourney(true);
            }
        };

        tryAutoplay();
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
          <div className="relative w-full max-w-4xl">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              preload="auto"
              controls
              ref={videoRefJourney} 
              onLoadedMetadata={() => {
                  if (videoRefJourney.current) {
                      videoRefJourney.current.playbackRate = 2;
                  }
              }}
              className="w-full rounded-lg shadow-lg">
              <source src="/SLIDESHOW.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {needsPlayJourney && (
              <button
                type="button"
                onClick={async () => {
                  const video = videoRefJourney.current;
                  if (!video) return;
                  try {
                    await video.play();
                    setNeedsPlayJourney(false);
                  } catch {
                    setNeedsPlayJourney(true);
                  }
                }}
                className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40 text-white font-semibold"
              >
                Tap to Play
              </button>
            )}
          </div>
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
      <CorePillars />
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
