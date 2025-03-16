import { useEffect, useState } from 'react';

import { keysOf } from '@/utils/keysOf';

export const sizes = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  desktop: 1440,
  '2xl': 1536,
} as const;

export const minWidthQuery = (width: number) =>
  `@media (min-width: ${width}px)`;

export const from = keysOf(sizes).reduce(
  (acc, key) => ({
    ...acc,
    [key]: minWidthQuery(sizes[key]),
  }),
  {} as { [key in keyof typeof sizes]: string },
);

export const useMediaQuery = (query: string): boolean | undefined => {
  const mediaQuery = query.replace('@media', '').trim();
  const [match, setMatch] = useState<boolean>();

  useEffect(() => {
    setMatch(() => window.matchMedia(mediaQuery).matches);

    const mediaQueryList = window.matchMedia(mediaQuery);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatch(event.matches);
    };

    mediaQueryList.addEventListener('change', handleChange);

    return () => mediaQueryList.removeEventListener('change', handleChange);
  }, [mediaQuery]);

  return match;
};
