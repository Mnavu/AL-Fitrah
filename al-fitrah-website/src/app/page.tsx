'use client'

import { Parallax } from 'react-parallax';
import { FiBookOpen, FiUsers, FiGlobe } from 'react-icons/fi'; // Using more relevant icons

export default function Home() {
  return (
    <main className="bg-alfitrah-cream text-gray-800 font-lato">
      {/* Hero Section with Parallax */}
      <Parallax bgImage="/hero-bg.png" strength={600} bgImageStyle={{ objectFit: 'cover' }}>
        <section className="relative flex items-center justify-center w-full px-4 py-40 text-center text-white md:py-64 lg:py-80">
          <div className="z-10 max-w-5xl p-12 rounded-2xl bg-alfitrah-dark-blue bg-opacity-80 backdrop-blur-sm shadow-2xl border-2 border-gold">
            <h1 className="text-6xl font-extrabold text-gold md:text-8xl font-playfair animate-fade-in-down drop-shadow-lg">
              Nurturing the Fitrah.
            </h1>
            <h2 className="mt-6 text-3xl text-alfitrah-cream md:text-5xl font-lato animate-fade-in-up drop-shadow-md">
              Elevating the Soul.
            </h2>
            <button className="px-12 py-5 mt-16 text-xl font-bold text-alfitrah-dark-blue transition-all duration-300 transform rounded-full bg-alfitrah-bright-yellow hover:scale-110 hover:shadow-gold-xl shadow-lg border-2 border-transparent hover:border-deep-forest-green">
              Explore Our Courses
            </button>
          </div>
          <div className="absolute inset-0 bg-deep-forest-green opacity-50"></div>
        </section>
      </Parallax>
      
      {/* "Why Al-Fitrah" Section */}
      <section className="w-full px-4 py-24 bg-alfitrah-cream text-alfitrah-dark-blue">
        <div className="container mx-auto text-center">
          <h2 className="text-6xl font-bold font-playfair text-deep-forest-green mb-16">Why Al-Fitrah?</h2>
          <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
            <div className="p-10 transition-all duration-300 transform bg-white rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-3 border-b-8 border-gold">
              <FiBookOpen className="w-20 h-20 mx-auto mb-6 text-gold" />
              <h3 className="text-3xl font-bold font-playfair text-deep-forest-green">Experienced Instructors</h3>
              <p className="mt-5 text-lg text-gray-700">Learn from seasoned scholars and educators with decades of real-world experience.</p>
            </div>
            <div className="p-10 transition-all duration-300 transform bg-white rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-3 border-b-8 border-gold">
              <FiUsers className="w-20 h-20 mx-auto mb-6 text-gold" />
              <h3 className="text-3xl font-bold font-playfair text-deep-forest-green">Holistic Approach</h3>
              <p className="mt-5 text-lg text-gray-700">We integrate traditional knowledge with modern insights to nurture all aspects of the self.</p>
            </div>
            <div className="p-10 transition-all duration-300 transform bg-white rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-3 border-b-8 border-gold">
              <FiGlobe className="w-20 h-20 mx-auto mb-6 text-gold" />
              <h3 className="text-3xl font-bold font-playfair text-deep-forest-green">Community-Oriented</h3>
              <p className="mt-5 text-lg text-gray-700">Join a supportive and vibrant community of learners dedicated to personal growth.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="w-full px-4 py-24 bg-alfitrah-dark-blue">
        <div className="container mx-auto">
          <div className="grid items-center grid-cols-1 gap-20 md:grid-cols-2">
            <div className="animate-fade-in-left">
              <h2 className="text-6xl font-bold font-playfair text-gold">Our Story</h2>
              <p className="mt-8 text-xl text-alfitrah-cream leading-loose">
                Founded by Ustadha Amina Abdiqadir, Al-Fitrah Training Institute began as a vision to empower the Muslim community in Nairobi. With over 30 years of experience in education and counseling, Ustadha Amina established the institute to provide a safe haven where knowledge meets Tarbiyah. From a single class, we have grown into a center for transformation, helping individuals unlock their potential through the lens of the Quran and Sunnah.
              </p>
            </div>
            <div className="flex justify-center animate-fade-in-right">
              <div className="object-cover w-full h-auto max-w-lg bg-alfitrah-cream border-8 border-gold rounded-2xl shadow-2xl flex items-center justify-center p-16">
                <span className="text-alfitrah-dark-blue text-center text-xl font-semibold">Photo/Video Placeholder</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="w-full px-4 py-24 bg-alfitrah-cream text-alfitrah-dark-blue">
        <div className="container mx-auto text-center">
          <h2 className="text-6xl font-bold font-playfair text-deep-forest-green mb-16">Our Three Pillars</h2>
          <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
            <div className="p-12 transition-all duration-300 transform bg-white rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-4 hover:rotate-1 border-b-8 border-deep-forest-green">
              <h3 className="text-4xl font-bold font-playfair text-gold">The Self</h3>
              <p className="mt-5 text-lg text-gray-700">Sound knowledge for individual empowerment.</p>
            </div>
            <div className="p-12 transition-all duration-300 transform bg-white rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-4 hover:-rotate-1 border-b-8 border-gold">
              <h3 className="text-4xl font-bold font-playfair text-deep-forest-green">The Family</h3>
              <p className="mt-5 text-lg text-gray-700">Building homes on Mawaddah and Rahmah.</p>
            </div>
            <div className="p-12 transition-all duration-300 transform bg-white rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-4 hover:rotate-1 border-b-8 border-deep-forest-green">
              <h3 className="text-4xl font-bold font-playfair text-gold">The Society</h3>
              <p className="mt-5 text-lg text-gray-700">Developing leaders with social responsibility.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full px-4 py-24 bg-alfitrah-medium-blue">
        <div className="container mx-auto text-center">
          <h2 className="text-6xl font-bold font-playfair text-alfitrah-cream mb-8 drop-shadow-md">Ready to Begin Your Journey?</h2>
          <p className="text-xl text-alfitrah-light-blue mb-12">Join our community and start your transformation today.</p>
          <button className="px-16 py-6 text-2xl font-bold text-alfitrah-dark-blue transition-all duration-300 transform bg-alfitrah-bright-yellow rounded-full hover:scale-110 hover:shadow-xl shadow-lg border-2 border-alfitrah-cream hover:border-alfitrah-dark-blue">
            Register Now
          </button>
        </div>
      </section>
    </main>
  )
}