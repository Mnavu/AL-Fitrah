"use client";
import React from 'react';

/**
 * ------------------------------------------------------------------
 * FLORAL ANIMATIONS
 * Defines the sway/float animations for the vines.
 * ------------------------------------------------------------------
 */
const FloralStyles = () => (
  <style>{`
    @keyframes sway-slow {
      0%, 100% { transform: rotate(0deg); }
      50% { transform: rotate(2deg); }
    }
    @keyframes sway-fast {
      0%, 100% { transform: rotate(0deg); }
      50% { transform: rotate(-3deg); }
    }
    @keyframes float-butterfly {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      25% { transform: translate(10px, -10px) rotate(5deg); }
      50% { transform: translate(0, -20px) rotate(0deg); }
      75% { transform: translate(-10px, -10px) rotate(-5deg); }
    }
    .leaf-sway { transform-origin: center; animation: sway-slow 6s ease-in-out infinite; }
    .vine-sway { transform-origin: bottom center; animation: sway-fast 8s ease-in-out infinite; }
    .butterfly-float { animation: float-butterfly 12s ease-in-out infinite; }
  `}</style>
);

/**
 * ------------------------------------------------------------------
 * A. CornerVines - Lush, Winding Ivy with Gold Buds (On Top)
 * ------------------------------------------------------------------
 */
export const CornerVines = () => (
  <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden" aria-hidden="true">
    <FloralStyles />
    
    {/* TOP LEFT VINE */}
    <div className="absolute top-0 left-0 w-[400px] h-[400px] -translate-x-10 -translate-y-10 opacity-30">
      <svg viewBox="0 0 400 400" className="w-full h-full text-seafoam/40">
        {/* Main Thick Branch */}
        <path d="M -20,0 Q 50,20 80,80 T 150,200 T 250,250" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M 0,-20 Q 20,50 60,100 T 120,250" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="vine-sway" />
        
        {/* Detailed Leaves (Left Cluster) */}
        <g className="leaf-sway">
          <path d="M 80,80 Q 90,60 110,70 Q 100,90 80,80 Z" fill="currentColor" />
          <path d="M 150,200 Q 170,180 190,190 Q 180,210 150,200 Z" fill="currentColor" />
          <path d="M 60,100 Q 40,110 50,130 Q 70,120 60,100 Z" fill="currentColor" />
        </g>

        {/* Gold Berries/Buds (more visible) */}
        <circle cx="250" cy="250" r="6" className="text-gold fill-current" />
        <circle cx="120" cy="250" r="5" className="text-gold fill-current" />
        <circle cx="155" cy="195" r="5" className="text-gold fill-current" />
      </svg>
    </div>

    {/* BOTTOM RIGHT VINE */}
    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] translate-x-10 translate-y-10 opacity-30">
      <svg viewBox="0 0 500 500" className="w-full h-full text-seafoam/40">
        {/* Main Branch Growing Up */}
        <path d="M 500,500 Q 400,450 350,350 T 200,200" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        
        {/* Secondary Branch */}
        <path d="M 480,500 Q 450,400 400,300" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

        {/* Detailed Leaves */}
        <g className="leaf-sway">
          <path d="M 350,350 Q 330,330 350,310 Q 370,330 350,350 Z" fill="currentColor" />
          <path d="M 200,200 Q 180,180 200,160 Q 220,180 200,200 Z" fill="currentColor" />
          <path d="M 400,300 Q 380,280 400,260 Q 420,280 400,300 Z" fill="currentColor" />
        </g>

           {/* Floating Butterfly (gold accents) */}
           <g className="text-gold butterfly-float" transform="translate(150, 150)">
             <path d="M 0,0 Q -10,-10 -20,0 Q -10,10 0,0 Z" fill="currentColor" />
             <path d="M 0,0 Q 10,-10 20,0 Q 10,10 0,0 Z" fill="currentColor" />
           </g>
      </svg>
    </div>
  </div>
);

/**
 * ------------------------------------------------------------------
 * B. SectionDivider - An Organic Horizontal Flourish
 * ------------------------------------------------------------------
 */
export const SectionDivider = () => (
  <div className="flex justify-center items-center my-20 opacity-60 text-seafoam" aria-hidden="true">
    <svg width="300" height="60" viewBox="0 0 300 60" fill="none">
      {/* Left Vine */}
      <path d="M 150,30 C 120,30 100,50 50,50 C 20,50 0,30 0,30" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M 100,40 Q 90,20 70,30 Q 90,40 100,40 Z" fill="currentColor" className="text-seafoam/50" />
      
      {/* Center Flower (gold center) */}
      <circle cx="150" cy="30" r="6" className="fill-gold text-gold" />
      <path d="M 150,30 Q 140,10 150,0 Q 160,10 150,30" fill="currentColor" />
      <path d="M 150,30 Q 140,50 150,60 Q 160,50 150,30" fill="currentColor" />
      <path d="M 150,30 Q 170,20 180,30 Q 170,40 150,30" fill="currentColor" />
      <path d="M 150,30 Q 130,20 120,30 Q 130,40 150,30" fill="currentColor" />

      {/* Right Vine */}
      <path d="M 150,30 C 180,30 200,10 250,10 C 280,10 300,30 300,30" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M 200,20 Q 210,40 230,30 Q 210,20 200,20 Z" fill="currentColor" className="text-seafoam/50" />
      {/* Small gold dot accent on the right */}
      <circle cx="240" cy="18" r="3" className="fill-gold text-gold" />
    </svg>
  </div>
);

/**
 * C. HeaderBackground Component - White with green waves and leafy florals.
 * Design: A wavy, layered background with leafy green elements, contained within navbar height.
 */
export const HeaderBackground = () => (
    <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none" aria-hidden="true"> {/* Reduced height to h-16 (64px) */}
        <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1440 64"> {/* Adjusted viewBox */}
            <defs>
                <linearGradient id="header-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{stopColor: 'white', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: 'white', stopOpacity: 1}} /> {/* Solid white background */}
                </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#header-grad)" />
            {/* Leafy Florals - Adjusted for new height */}
            <g transform="translate(100, 20) scale(0.4)"> {/* Repositioned and scaled */}
              <path d="M0,0 Q-10,-10 0,-20 Q10,-10 0,0 Z" fill="currentColor" className="text-seafoam/40 leaf-sway" />
              <path d="M-5,-5 Q-15,-15 -5,-25 Q5,-15 -5,-5 Z" fill="currentColor" className="text-seafoam/30 leaf-sway" style={{ animationDelay: '0.5s' }} />
              {/* small gold highlight */}
              <circle cx="20" cy="-10" r="3" className="fill-gold text-gold" />
            </g>
            <g transform="translate(500, 25) scale(0.6)"> {/* Repositioned and scaled */}
                <path d="M0,0 Q-15,-10 0,-25 Q15,-10 0,0 Z" fill="currentColor" className="text-seafoam/20 leaf-sway" style={{ animationDelay: '0.2s' }} />
            </g>
            <g transform="translate(900, 20) scale(0.45)"> {/* Repositioned and scaled */}
              <path d="M0,0 Q-10,-10 0,-20 Q10,-10 0,0 Z" fill="currentColor" className="text-seafoam/30 leaf-sway" style={{ animationDelay: '1s' }} />
              <path d="M5,-5 Q-5,-15 5,-25 Q15,-15 5,-5 Z" fill="currentColor" className="text-seafoam/20 leaf-sway" style={{ animationDelay: '1.2s' }} />
              <circle cx="10" cy="-12" r="2" className="fill-gold text-gold" />
            </g>
        </svg>
    </div>
);
