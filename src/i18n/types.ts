import { LOCALES } from './locales';

export type Locale = (typeof LOCALES)[number];
export type Messages = typeof import('./locales/en').enMessages;

declare module 'next-intl/server' {
  export function getMessages(): Promise<Messages>;
  export function getMessages(options: { locale: Locale }): Promise<Messages>;
}
