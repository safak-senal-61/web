/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Eğer Next.js App Router kullanıyorsanız bu kalsın
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Eğer src dizini kullanıyorsanız bu kalsın
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'form-bg': '#1e293b', // slate-800
        'text-light': '#f1f5f9', // slate-100
        'text-medium': '#94a3b8', // slate-400
        'text-dark': '#64748b', // slate-500
        'brand-primary': '#3b82f6', // blue-500
        'brand-secondary': '#2563eb', // blue-600
        'input-bg': '#334155', // slate-700
        'input-border': '#475569', // slate-600
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: { // keyframes burada kalacak
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  safelist: [ // safelist'i buraya taşıyın (theme ve plugins ile aynı seviyede)
    {
      pattern: /^(bg|text|border)-(red|green|blue|yellow|purple)-(300|400|500)$/,
      variants: ['hover', 'group-hover'],
    },
    {
      pattern: /border-(red|green|blue|yellow|purple)-500\/50/,
      variants: ['hover'],
    }
  ],
  plugins: [],
}