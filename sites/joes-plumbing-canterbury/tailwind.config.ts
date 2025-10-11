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
          primary: '#059669',      // Emerald green
          secondary: '#047857',    // Darker green
          accent: '#10b981',       // Lighter emerald
          light: '#d1fae5',        // Very light green
          background: '#f0fdf4',   // Light green tint
        },
      },
    },
  },
  plugins: [typography],
}
export default config
