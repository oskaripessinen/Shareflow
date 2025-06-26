/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC',
        surface: '#FFFFFF',
        primary: '#3B82F6',
        primaryDark: '#1E40AF',
        secondary: '#60A5FA ',
        accent: '#10B981',
        danger: '#EF4444',
        muted: '#00000099',
        default: '#000000DE',
        text: {
          DEFAULT: '#000000DE',
          muted: '#00000099',
          danger: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Poppins_400Regular'],
        semibold: ['Poppins_600SemiBold'],
        bold: ['Poppins_700Bold'],
      },
    },
  },
  plugins: [],
};
