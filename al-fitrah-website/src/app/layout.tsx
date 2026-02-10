import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Al Fitrah Training Institute',
  description: 'Nurturing the Fitrah. Elevating the Soul.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <nav className="w-full bg-alfitrah-dark-blue p-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-alfitrah-cream">
            Al Fitrah
          </Link>
          <div>
            <Link href="/" className="text-alfitrah-cream mx-4 hover:text-gold transition-colors duration-300">
              Home
            </Link>
            <Link href="/curriculum" className="text-alfitrah-cream mx-4 hover:text-gold transition-colors duration-300">
              Curriculum
            </Link>
            <Link href="/register" className="text-alfitrah-cream mx-4 hover:text-gold transition-colors duration-300">
              Register
            </Link>
          </div>
        </nav>
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}