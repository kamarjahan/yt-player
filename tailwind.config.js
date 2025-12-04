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
        yt: {
          base: '#0f0f0f',
          light: '#272727',
          text: '#f1f1f1',
          textSec: '#aaaaaa',
          red: '#ff0000',
          hover: '#3f3f3f',
        }
      },
      gridTemplateColumns: {
        'card': 'repeat(auto-fill, minmax(300px, 1fr))',
      },
    },
  },
  plugins: [],
}