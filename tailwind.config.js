/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'azul-oscuro':  '#003580',
        'azul-claro':   '#0066CC',
        'azul-medio':   '#0047AB',
        'gris-claro':   '#F5F7FA',
        'gris-medio':   '#E0E4EA',
        'gris-oscuro':  '#2D3748',
        'ep-texto':     '#1A202C',
        'ep-suave':     '#4A5568',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      },
      borderRadius: {
        ep: '10px',
        'ep-lg': '16px',
      },
      boxShadow: {
        ep:    '0 2px 8px rgba(0,53,128,0.10)',
        'ep-lg': '0 8px 32px rgba(0,53,128,0.16)',
      },
    },
  },
  plugins: [],
}
