import createMiddleware from 'next-intl/middleware';

import { DEFAULT_LOCALE, LOCALES } from './i18n/locales';

// eslint-disable-next-line import/no-default-export
export default createMiddleware({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localeDetection: true,
  localePrefix: 'always',
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
