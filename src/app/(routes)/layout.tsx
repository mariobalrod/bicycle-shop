import '@/app/styles/globals.css';
import { type Metadata } from 'next';

import { inter } from '@/app/styles/fonts';
import { TRPCReactProvider } from '@/server/trpc';

export const metadata: Metadata = {
  title: 'Bicycle Shop',
  description: 'Description of the Bicycle Shop',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
