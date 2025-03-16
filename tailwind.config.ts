import { type Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['var(--font-inter)'],
      },
    },
  },
  plugins: [],
} satisfies Config;
