'use client'

const Footer = () => {
  return (
    <footer className="w-full bg-alfitrah-dark-blue text-alfitrah-cream p-10 mt-auto">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h3 className="text-2xl font-bold font-playfair text-alfitrah-cream">Al Fitrah Training Institute</h3>
          <p className="mt-4 text-md">Nurturing the Fitrah. Elevating the Soul.</p>
        </div>
        <div>
          <h3 className="text-2xl font-bold font-playfair text-alfitrah-cream">Contact Us</h3>
          <ul className="mt-4 space-y-3">
            <li><a href="https://wa.me/YOUR_WHATSAPP_NUMBER" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors duration-300">WhatsApp</a></li>
            <li><a href="mailto:YOUR_EMAIL_ADDRESS" className="hover:text-gold transition-colors duration-300">Email</a></li>
            <li><a href="tel:YOUR_PHONE_NUMBER" className="hover:text-gold transition-colors duration-300">Phone</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-2xl font-bold font-playfair text-alfitrah-cream">Curriculum QR Code</h3>
          <div className="mt-4 p-3 bg-alfitrah-cream inline-block rounded-lg shadow-md">
            {/* Placeholder for QR Code Image */}
            <div className="w-32 h-32 bg-alfitrah-cream flex items-center justify-center text-alfitrah-dark-blue text-center text-sm">
              QR Code Image Here
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer