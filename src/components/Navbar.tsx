'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { HeaderBackground } from './ui/FloralDecorations';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  // Close mobile menu on link click
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  }

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
        <HeaderBackground />
        <div className="relative z-10 container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/Logo.png"
              alt="Al-Fitrah Institute Logo"
              width={150}
              height={60}
              className="h-auto w-auto max-h-16"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink href="/">Home</NavLink>
            <DropdownNavLink title="Academics">
              <DropdownLink href="/academics/boys-boarding">Boys Boarding Campus</DropdownLink>
              <DropdownLink href="/academics/south-c">South C Campus</DropdownLink>
            </DropdownNavLink>
            <NavLink href="/graduates">Graduates</NavLink>
            <NavLink href="/contact">Contact Us</NavLink>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} aria-label="Toggle menu">
              {isMobileMenuOpen ? <X className="h-6 w-6 text-primary" /> : <Menu className="h-6 w-6 text-primary" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg pb-4">
          <div className="flex flex-col items-center space-y-4">
            <NavLink href="/" onClick={closeMobileMenu}>Home</NavLink>
            <MobileDropdown onLinkClick={closeMobileMenu} />
            <NavLink href="/graduates" onClick={closeMobileMenu}>Graduates</NavLink>
            <NavLink href="/contact" onClick={closeMobileMenu}>Contact Us</NavLink>
          </div>
        </div>
      )}
    </>
  );
}

// Standard NavLink
function NavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link href={href} className="text-primary hover:text-secondary font-medium transition-colors duration-200 px-2 py-1" onClick={onClick}>
      {children}
    </Link>
  );
}

// Dropdown Link for Desktop
function DropdownLink({ href, children }: { href: string; children: React.ReactNode; }) {
  return (
    <Link href={href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-secondary">
      {children}
    </Link>
  );
}

// Desktop Dropdown Component (click to open, click outside to close)
function DropdownNavLink({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleDocClick);
    return () => document.removeEventListener('mousedown', handleDocClick);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen((s) => !s)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="text-primary hover:text-secondary font-medium transition-colors duration-200 px-2 py-1 flex items-center"
      >
        {title}
        <ChevronDown className={`h-4 w-4 ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

// Mobile Dropdown Component
function MobileDropdown({ onLinkClick }: { onLinkClick: () => void }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-full text-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-primary hover:text-secondary font-medium transition-colors duration-200 px-2 py-1 flex items-center justify-center w-full">
                Academics
                <ChevronDown className={`h-4 w-4 ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="pt-2 pb-1 space-y-2 bg-gray-50">
                    <Link href="/academics/boys-boarding" onClick={onLinkClick} className="block text-primary hover:text-secondary">Boys Boarding Campus</Link>
                    <Link href="/academics/south-c" onClick={onLinkClick} className="block text-primary hover:text-secondary">South C Campus</Link>
                </div>
            )}
        </div>
    );

  }
