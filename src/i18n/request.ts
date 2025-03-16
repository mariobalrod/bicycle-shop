import { getRequestConfig } from 'next-intl/server';

import { DEFAULT_LOCALE, enMessages, esMessages } from './locales';
import { Locale, Messages } from './types';

const messagesMap: Record<Locale, Messages> = {
  en: enMessages,
  es: esMessages,
};

// eslint-disable-next-line import/no-default-export
export default getRequestConfig(({ locale }) => {
  const validLocale =
    locale && locale in messagesMap ? (locale as Locale) : DEFAULT_LOCALE;

  return {
    locale: validLocale,
    messages: messagesMap[validLocale],
  };
});
