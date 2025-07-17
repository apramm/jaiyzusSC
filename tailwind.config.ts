import type { Config } from "tailwindcss";

export default {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Custom dark mode greys
        dark: {
          bg: '#1a1a1a',
          surface: '#2a2a2a', 
          border: '#3a3a3a',
          text: '#e5e5e5',
          muted: '#a3a3a3'
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
