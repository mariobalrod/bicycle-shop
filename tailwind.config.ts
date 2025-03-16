import { type Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['var(--font-inter)'],
      },
      fontSize: {
        'size-largeTitle': '2.5rem',
        'size-title1': '1.75rem',
        'size-title2': '1.5rem',
        'size-title3': '1.25rem',
        'size-headline': '1.0625rem',
        'size-subHeadline': '0.9375rem',
        'size-body1': '1.0625rem',
        'size-body2': '0.9375rem',
        'size-footNote': '0.8125rem',
        'size-overline': '0.6875rem',
        'size-caption': '0.6875rem',
        'tremor-label': ['0.8125rem', { lineHeight: '1.25rem' }],
        'tremor-content': ['0.9375rem', { lineHeight: '1.5rem' }],
      },
      lineHeight: {
        largeTitle: '3rem',
        title1: '2.25rem',
        title2: '2rem',
        title3: '1.75rem',
        headline: '1.5rem',
        subHeadline: '1.25rem',
        body1: '1.5rem',
        body2: '1.5rem',
        footNote: '1.25rem',
        overline: '1rem',
        caption: '1rem',
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
    },
  },
  plugins: [],
} satisfies Config;
