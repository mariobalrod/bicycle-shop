import '@/app/styles/globals.css';
import { type Metadata } from 'next';
import { getMessages } from 'next-intl/server';

import { inter } from '@/app/styles/fonts';
import { LOCALES } from '@/i18n/locales';
import { Locale } from '@/i18n/types';

import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Bicycle Shop',
  description: 'Description of the Bicycle Shop',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className={`${inter.variable}`}>
      <body>
        <Providers locale={locale} messages={messages}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
