/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Sora"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        parchment: {
          50: '#fffef9',
          100: '#fdfaf2',
          200: '#f4efe6',
          300: '#e6dfd4',
          400: '#d1c9ba',
          500: '#b5ad9e',
          600: '#847c6f',
          700: '#5c564c',
          800: '#3a3630',
          900: '#1f1d1a',
        },
        sienna: {
          50: '#fef3ee',
          100: '#fde3d6',
          200: '#f9c3aa',
          300: '#f49a74',
          400: '#e8683b',
          500: '#d4552a',
          600: '#b94420',
          700: '#99361c',
          800: '#7b2e1c',
          900: '#66291c',
        },
        sage: {
          50: '#f0f7f5',
          500: '#4a9484',
          600: '#3a7a6c',
          700: '#2d6356',
        },
      },
    },
  },
  plugins: [],
};
