/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // The New Al-Fitrah Palette
        brand: {
          mint: '#91E0CD',      // Lightest background accent
          turquoise: '#07CAC3', // Bright popping accent
          teal: '#077B83',      // Mid-tone blue/green
          forest: '#077b83',    // Darkest anchor color (updated to requested shade)
          green: '#31BC5F',     // Vibrant true green
          leaf: '#B5DB82',      // Soft yellow-green
        },
        // Centralized gold token for accents
        gold: '#D4AF37',
        // Functional Mapping for the Developer
        primary: {
          DEFAULT: '#077b83', // Use updated dark green (now #077b83) for main branding/text
          light: '#077b83',   // Use the same requested shade for lighter primary elements
        },
        accent: {
          DEFAULT: '#B5DB82', // Use soft yellow-green for all buttons and links
          green: '#31BC5F',
        },
        surface: {
          DEFAULT: '#F8FAFC', // Keep main background clean off-white
          tint: '#91E0CD',    // Use Mint for section backgrounds instead of gray
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
