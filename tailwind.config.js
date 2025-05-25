/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC',
        surface: '#FFFFFF',
        primary: '#3B82F6',
        secondary: '#60A5FA ',
        accent: '#10B981',
        danger: '#EF4444',
        text: {
          DEFAULT: '#111827',
          muted: '#CBD5E1',
          danger: '#EF4444',
        },
      },
      fontFamily: {
        'sans': ['Poppins_400Regular'],
        'semibold': ['Poppins_600SemiBold'],
        'bold': ['Poppins_700Bold'],
      },
    },
  },
  plugins: [],
};
