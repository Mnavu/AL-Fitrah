'use client';

import React from 'react';
import Link from 'next/link';
import { Course } from '@/lib/types';

interface CourseCardProps {
  // We use any here temporarily in case your types file hasn't been updated to accept string prices yet
  course: any; 
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const coursePath = course.slug || course.id;

  return (
    <div className="bg-white shadow-md rounded-xl p-6 flex flex-col justify-between border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div>
        {/* IMPORTANT: Make sure this link matches your folder structure! */}
        {/* If your detail page is in src/app/academics/[id], change this to /academics/${course.id} */}
        <Link href={`/academics/${coursePath}`}>
          <h3 className="text-2xl font-serif text-[#0f5257] mb-3 hover:text-[#07CAC3] transition-colors cursor-pointer">
            {course.title}
          </h3>
        </Link>
        
        {/* Safely display the short description */}
        {(course.short_description || course.description) && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {course.short_description || course.description}
          </p>
        )}
        
        {/* NO MORE MATH RENDER! Safely display the exact text from the database */}
        <div className="mb-4">
          <span className="inline-block bg-[#F0FDF4] text-[#045C4C] border border-[#B5DB82] px-3 py-1 rounded-md font-bold text-sm">
            {course.price && course.price !== 'Free' ? course.price : 'Open / Free'}
          </span>
        </div>
      </div>
      
      <div className="mt-4 flex flex-col gap-3">
        <Link 
          href={`/academics/${coursePath}`} 
          className="bg-[#0f5257] text-white text-center py-3 px-4 rounded-lg hover:bg-[#045C4C] transition duration-300 font-medium shadow-sm"
        >
          Learn More
        </Link>
        
        {course.requires_registration && (
          <Link 
            href={`/register/${coursePath}`} 
            className="border-2 border-[#07CAC3] text-[#077B83] text-center py-3 px-4 rounded-lg hover:bg-[#07CAC3] hover:text-white transition duration-300 font-bold shadow-sm"
          >
            Quick Enroll
          </Link>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
