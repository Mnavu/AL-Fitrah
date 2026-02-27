/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          mint: '#91E0CD',
          turquoise: '#07CAC3',
          teal: '#077B83',
          forest: '#0f5257',
          green: '#31BC5F',
          leaf: '#B5DB82',
        },
        gold: '#D4AF37',
        primary: '#0f5257',
        secondary: '#F1F5F9',
        accent: '#07CAC3',
        canvas: '#F8FAFC',
        paleYellow: '#FEFCE8',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
