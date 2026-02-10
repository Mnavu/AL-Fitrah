'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [course, setCourse] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase
      .from('registrations')
      .insert([{ name, email, course }])

    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Registration successful! Please check your email for payment instructions.')
      setName('')
      setEmail('')
      setCourse('')
    }

    setLoading(false)
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-alfitrah-dark-blue font-lato">
      <div className="w-full max-w-lg mx-auto bg-white rounded-xl shadow-2xl overflow-hidden animate-fade-in-up border-2 border-gold">
        <div className="p-10 bg-gold">
          <h1 className="text-4xl font-bold text-center font-playfair text-alfitrah-dark-blue">Register for a Course</h1>
        </div>
        <form onSubmit={handleRegister} className="p-10 space-y-8">
          <div className="animate-fade-in-up delay-100">
            <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="block w-full px-5 py-3 text-lg placeholder-gray-500 bg-alfitrah-cream border-2 border-alfitrah-light-green rounded-lg focus:outline-none focus:ring-2 focus:ring-alfitrah-medium-blue focus:border-alfitrah-medium-blue transition-all duration-300"
            />
          </div>
          <div className="animate-fade-in-up delay-200">
            <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full px-5 py-3 text-lg placeholder-gray-500 bg-alfitrah-cream border-2 border-alfitrah-light-green rounded-lg focus:outline-none focus:ring-2 focus:ring-alfitrah-medium-blue focus:border-alfitrah-medium-blue transition-all duration-300"
            />
          </div>
          <div className="animate-fade-in-up delay-300">
            <label htmlFor="course" className="block text-lg font-medium text-gray-700 mb-2">
              Course
            </label>
            <select
              id="course"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
              className="block w-full px-5 py-3 text-lg text-gray-700 bg-alfitrah-cream border-2 border-alfitrah-light-green rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-alfitrah-medium-blue focus:border-alfitrah-medium-blue transition-all duration-300"
            >
              <option value="" disabled>Select a course</option>
              <option value="Nooraniyah Track">Nooraniyah Track</option>
              <option value="Back to Basics">Back to Basics</option>
              <option value="Specialty - Arabic">Specialty - Arabic</option>
              <option value="Specialty - Counselling">Specialty - Counselling</option>
              <option value="Specialty - Marriage">Specialty - Marriage</option>
              <option value="Specialty - Parenting">Specialty - Parenting</option>
              <option value="Immersive - Holiday Programme">Immersive - Holiday Programme</option>
              <option value="Immersive - Boys-Boarding School">Immersive - Boys-Boarding School</option>
            </select>
          </div>
          <div className="animate-fade-in-up delay-400">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-4 text-xl font-bold text-alfitrah-dark-blue transition-all duration-300 transform rounded-full bg-alfitrah-light-green hover:bg-alfitrah-lime-green hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-alfitrah-medium-blue shadow-lg border-2 border-alfitrah-dark-blue"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
        {message && (
          <p className="px-10 pb-6 text-center text-deep-forest-green animate-fade-in-up">{message}</p>
        )}
      </div>
    </main>
  )
}
