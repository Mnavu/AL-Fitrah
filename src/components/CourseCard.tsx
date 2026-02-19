'use client';

import React from 'react';
import Link from 'next/link';
import { Course } from '@/lib/types'; // Import the Course interface

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-5 flex flex-col justify-between border border-seafoam/30 hover:shadow-xl transition-shadow duration-300">
      <div>
        <Link href={`/courses/${course.id}`}>
          <h3 className="text-2xl font-serif text-primary mb-2 hover:text-secondary transition-colors cursor-pointer">
            {course.title}
          </h3>
        </Link>
        {course.description && (
          <p className="text-slate text-sm mb-4 line-clamp-2">
            {course.description}
          </p>
        )}
        
        {course.price !== null && course.price > 0 && (
          <p className="text-lg font-bold text-accent mb-4">
            KES {parseFloat(course.price.toString()).toLocaleString()}
          </p>
        )}
        {(course.price === null || course.price === 0) && (
          <p className="text-md font-semibold text-seafoam mb-4">Free</p>
        )}
      </div>
      
      <div className="mt-4 flex flex-col gap-2">
        <Link 
          href={`/courses/${course.id}`} 
          className="bg-primary text-white text-center py-2 px-4 rounded-md hover:bg-secondary transition duration-300 font-medium"
        >
          Learn More
        </Link>
        
        {course.requires_registration && (
          <Link 
            href={`/register/${course.id}`} 
            className="border-2 border-accent text-accent text-center py-2 px-4 rounded-md hover:bg-accent hover:text-white transition duration-300 font-medium"
          >
            Quick Enroll
          </Link>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
