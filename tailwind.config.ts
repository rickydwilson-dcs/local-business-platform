import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#00607A',
          'blue-hover': '#005266',
          'blue-light': '#0074a3',
          black: '#000000',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['GeistSans', 'Arial', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [typography],
}
export default config
