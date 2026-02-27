'use client';

import { useState } from 'react';
import { Phone, MessageCircle, Mail, MapPin, Globe, Instagram, Facebook } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 1. Insert into messages table
      const { error: messageError } = await supabase
        .from('messages')
        .insert([formData]);

      if (messageError) throw messageError;

      // 2. Notify admin
      await supabase
        .from('notifications')
        .insert([{
          message: `New Inquiry from ${formData.name}: ${formData.subject}`
        }]);

      toast.success('Message Sent Successfully!', {
        description: 'We will get back to you shortly. Asalamu Alaikum!',
      });

      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error('Failed to send message', {
        description: error.message || 'Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickContactMethods = [
    {
      icon: Phone,
      label: 'Call Us',
      display: '0798 748 885',
      href: 'tel:+254798748885',
      color: 'bg-secondary/10',
      borderColor: 'border-seafoam/30',
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp Us',
      display: 'Chat on WhatsApp',
      href: 'https://wa.me/254798748885',
      color: 'bg-secondary/10',
      borderColor: 'border-seafoam/30',
      external: true,
    },
    {
      icon: Mail,
      label: 'Email Us',
      display: 'alfitrah.institute@gmail.com',
      href: 'mailto:alfitrah.institute@gmail.com',
      color: 'bg-secondary/10',
      borderColor: 'border-seafoam/30',
    },
    {
      icon: Globe,
      label: 'Visit Website',
      display: 'www.al-fitrah.com',
      href: 'https://al-fitrah.com',
      color: 'bg-secondary/10',
      borderColor: 'border-seafoam/30',
      external: true,
    },
  ];

  const campuses = [
    {
      name: 'South C Campus (Main)',
      programs: ['Short Courses', 'Community Classes', 'Daily Madrassah', 'Sisters Program', 'Adult Education'],
      address: '159 Muhoho Avenue',
      details: 'Opposite MoW Sports Club South C, Nairobi',
      mapsURL: 'https://maps.google.com/?q=159+Muhoho+Avenue+South+C+Nairobi',
      phone: '0798 748 885',
    },
    {
      name: 'Boys Boarding Campus',
      programs: ['2-Year Intensive Leadership & Hifdh Program'],
      address: 'Muiri Gardens, Karen',
      details: 'Nairobi',
      mapsURL: 'https://maps.google.com/?q=Muiri+Gardens+Karen+Nairobi',
      phone: '0798 748 885',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="pt-12 pb-8 px-4 bg-gradient-to-br from-secondary/15 to-secondary/25">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-primary">
            Get in Touch
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto text-primary">
            We're here to help! Reach out to us through any of our convenient contact methods or visit one of our campuses.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-20">
        {/* Quick Contact Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-4 text-center text-primary">
            Quick Contact Methods
          </h2>
          <p className="text-center mb-12 opacity-75 text-primary">
            Choose your preferred way to reach us—instant and convenient!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickContactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <a
                  key={index}
                  href={method.href}
                  target={method.external ? '_blank' : undefined}
                  rel={method.external ? 'noopener noreferrer' : undefined}
                  className="bg-white border-2 border-seafoam/30 rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer text-center group shadow-md"
                >
                  <div className="mb-4 flex justify-center">
                      <Icon
                      size={40}
                      className="text-primary group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-primary">
                    {method.label}
                  </h3>
                  <p className="text-sm md:text-base font-semibold break-words text-accent">
                    {method.display}
                  </p>
                </a>
              );
            })}
          </div>
        </section>

        {/* Campus Locations Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-4 text-center text-primary">
            Our Campuses
          </h2>
          <p className="text-center mb-12 opacity-75 text-primary">
            Visit us at one of our two strategic locations in Nairobi
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {campuses.map((campus, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow border-t-4 border-primary">
                {/* Campus Header */}
                    <div className="p-6 bg-primary">
                  <h3 className="text-2xl font-bold text-white mb-2">{campus.name}</h3>
                  <p className="text-secondary/90 text-sm">Programs Offered</p>
                </div>

                {/* Campus Content */}
                <div className="p-6">
                  {/* Programs */}
                  <div className="mb-6">
                    <ul className="space-y-2">
                      {campus.programs.map((prog, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="mr-3 text-lg text-accent">✓</span>
                          <span className="font-medium text-primary">
                            {prog}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Address */}
                  <div className="mb-6 pb-6 border-b-2 border-seafoam/30">
                    <div className="flex items-start mb-2">
                      <MapPin size={20} className="mr-3 mt-1 flex-shrink-0 text-accent" />
                      <div>
                        <p className="font-bold text-primary">
                          {campus.address}
                        </p>
                        <p className="text-sm opacity-75 text-slate">
                          {campus.details}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="mb-6 pb-6 border-b-2 border-seafoam/30">
                    <div className="flex items-center">
                      <Phone size={20} className="mr-3 flex-shrink-0 text-accent" />
                      <a
                        href={`tel:+254798748885`}
                        className="font-semibold transition-colors text-primary hover:text-accent"
                      >
                        {campus.phone}
                      </a>
                    </div>
                  </div>

                  {/* Get Directions Button */}
                    <a
                    href={campus.mapsURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-lg font-bold text-white text-center block transition-all duration-300 hover:shadow-lg transform hover:scale-105 bg-accent hover:bg-accent/90"
                  >
                    Get Directions 📍
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="mb-20">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 border-t-4 border-primary">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center text-primary">
              Send Us a Message
            </h2>
            <p className="text-center mb-8 opacity-75 text-primary">
              Have questions? Fill out the form below and we'll get back to you as soon as possible.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-bold mb-2 text-primary">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-lg border-2 border-seafoam/30 focus:border-primary focus:outline-none"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-bold mb-2 text-primary">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-lg border-2 border-seafoam/30 focus:border-primary focus:outline-none"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-bold mb-2 text-primary">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 rounded-lg border-2 border-seafoam/30 focus:border-primary focus:outline-none"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-bold mb-2 text-primary">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this about?"
                    className="w-full px-4 py-3 rounded-lg border-2 border-seafoam/30 focus:border-primary focus:outline-none"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-bold mb-2 text-primary">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please share your inquiry or feedback..."
                  className="w-full px-4 py-3 rounded-lg border-2 border-seafoam/30 focus:border-primary focus:outline-none resize-none"
                  required
                  disabled={isSubmitting}
                ></textarea>
              </div>

                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-3 rounded-lg font-bold text-white text-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 bg-accent hover:bg-accent/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
            </form>
          </div>
        </section>

        {/* Social Media Section */}
        <section className="text-center">
            <h2 className="text-3xl font-bold mb-8 text-primary">
            Follow Us On Social Media
          </h2>
          <div className="flex justify-center gap-8">
            <a
              href="https://instagram.com/alfitrah_ke"
              target="_blank"
              rel="noopener noreferrer"
              className="transform transition-all duration-300 hover:scale-110"
            >
              <Instagram size={40} className="text-accent" />
            </a>
            <a
              href="https://facebook.com/alfitrah.training.institute"
              target="_blank"
              rel="noopener noreferrer"
              className="transform transition-all duration-300 hover:scale-110"
            >
              <Facebook size={40} className="text-accent" />
            </a>
          </div>
          <p className="mt-6 text-sm opacity-75 text-primary">
            Instagram: <span className="font-semibold">@alfitrah_ke</span> | Facebook: <span className="font-semibold">Al-Fitrah Training Institute</span>
          </p>
        </section>
      </div>
    </div>
  );
}
