/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        lightblue: '#00A0CC',
        'lightblue-02': '#23CAF8',
        darkblue: '#0A42A5',
        'blue-02': '#00004D',
      },
      fontFamily: {
        montserrat: ['var(--font-montserrat)', 'sans-serif'],
      },
      backgroundImage: {
        'gradient': 'linear-gradient(to right, #0a0f4b 0%, #003d80 50%, #00a2c6 100%)',
      },
      screens: {
        'client': '90rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  // Optimize for production
  ...(process.env.NODE_ENV === 'production' && {
    purge: {
      enabled: true,
      content: [
        './src/**/*.{js,ts,jsx,tsx}',
      ],
      options: {
        safelist: [
          'md:grid-cols-1',
          'md:grid-cols-2', 
          'md:grid-cols-3',
          'md:grid-cols-4',
          'md:grid-cols-5',
          'md:grid-cols-6',
        ],
      },
    },
  }),
};
