'use client';

import { NextIntlClientProvider } from 'next-intl';

import { Locale, Messages } from '@/i18n/types';
import { TRPCReactProvider } from '@/server/trpc';

type ProvidersProps = {
  children: React.ReactNode;
  locale: Locale;
  messages: Messages;
};

export function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TRPCReactProvider>{children}</TRPCReactProvider>
    </NextIntlClientProvider>
  );
}
