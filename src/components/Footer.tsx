

export default function Footer() {
  return (
    <footer className="bg-primary text-white border-t border-gold py-8">
      <div className="container mx-auto px-4 text-center">
        {/* thin gold line */}
        
        <p>&copy; {new Date().getFullYear()} Al-Fitrah Training Institute. All rights reserved.</p>
        <div className="mt-4">
          <a href="#" className="text-white hover:text-gold mx-2">Privacy Policy</a>
          <span className="text-white">|</span>
          <a href="#" className="text-white hover:text-gold mx-2">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
