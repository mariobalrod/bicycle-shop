import { createNavigation } from 'next-intl/navigation';

import { DEFAULT_LOCALE, LOCALES } from '@/i18n/locales';

export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'always',
});
