export default function Curriculum() {
  return (
    <main className="bg-alfitrah-cream text-gray-800 font-lato">
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-6xl font-bold text-center font-playfair text-deep-forest-green mb-16 animate-fade-in-down">Our Curriculum</h1>
        <div className="grid grid-cols-1 gap-16 mt-12 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Nooraniyah Track */}
          <div className="transition-all duration-300 transform bg-white rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-3 overflow-hidden border-b-8 border-gold animate-fade-in-up">
            <div className="p-8 bg-gold">
              <h2 className="text-3xl font-bold font-playfair text-alfitrah-dark-blue">Nooraniyah Track</h2>
            </div>
            <div className="p-8">
              <p className="mt-4 font-semibold text-deep-forest-green">Teacher: Ust. Nahla</p>
              <ul className="mt-4 space-y-3 text-gray-700 text-lg">
                <li><strong>Kids:</strong> 7-9am</li>
                <li><strong>Juniors:</strong> 11-12pm</li>
                <li><strong>Seniors:</strong> 3-4:15pm</li>
                <li><strong>Adults:</strong> Sat-Sun 1-3pm</li>
              </ul>
            </div>
          </div>

          {/* Back to Basics */}
          <div className="transition-all duration-300 transform bg-white rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-3 overflow-hidden border-b-8 border-deep-forest-green animate-fade-in-up delay-100">
            <div className="p-8 bg-alfitrah-dark-blue">
              <h2 className="text-3xl font-bold font-playfair text-gold">Back to Basics</h2>
            </div>
            <div className="p-8">
              <p className="mt-4 font-semibold text-gold">Juniors & Seniors</p>
              <p className="text-gray-700 text-lg">Daily 5-7pm</p>
              <p className="mt-4 font-semibold text-deep-forest-green">Subjects:</p>
              <ul className="mt-2 space-y-2 text-gray-700 text-lg">
                <li>Aqeedah</li>
                <li>Tafseer</li>
                <li>Hadith</li>
                <li>Seerah</li>
                <li>Fiqh</li>
                <li>Manners</li>
              </ul>
            </div>
          </div>

          {/* Specialty */}
          <div className="transition-all duration-300 transform bg-white rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-3 overflow-hidden border-b-8 border-gold animate-fade-in-up delay-200">
            <div className="p-8 bg-gold">
              <h2 className="text-3xl font-bold font-playfair text-alfitrah-dark-blue">Specialty</h2>
            </div>
            <div className="p-8">
              <ul className="mt-4 space-y-3 text-gray-700 text-lg">
                <li>
                  <strong>Arabic:</strong> 1-year intensive
                  <p className="text-sm text-gray-600 mt-1">Mon-Wed 5-7pm, Ust. Nasir</p>
                </li>
                <li><strong>Counselling</strong></li>
                <li><strong>Marriage</strong></li>
                <li><strong>Parenting</strong></li>
              </ul>
            </div>
          </div>

          {/* Immersive */}
          <div className="transition-all duration-300 transform bg-white rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-3 overflow-hidden border-b-8 border-deep-forest-green animate-fade-in-up delay-300">
            <div className="p-8 bg-alfitrah-dark-blue">
              <h2 className="text-3xl font-bold font-playfair text-gold">Immersive</h2>
            </div>
            <div className="p-8">
              <ul className="mt-4 space-y-3 text-gray-700 text-lg">
                <li><strong>Holiday Programme:</strong> 13-17 yrs</li>
                <li><strong>Boys-Boarding School:</strong> 13-20 yrs</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}