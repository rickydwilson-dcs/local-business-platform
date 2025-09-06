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
          blue: '#4DB2E4',
          black: '#000000',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        heading: ['"Libre Caslon Display"', 'serif'],
        sans: ['Arial', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [typography],
}
export default config
