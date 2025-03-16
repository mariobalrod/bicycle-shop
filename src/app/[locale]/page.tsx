import { getMessages } from 'next-intl/server';

import { Locale } from '@/i18n/types';
import { apiServer, HydrateClient } from '@/server/trpc/server';

export default async function Home({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  const hello = await apiServer.user.hello({ text: 'from tRPC' });
  const messages = await getMessages({ locale });

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="largeTitle">
          {messages.Index.title}: {hello.greeting}
        </h1>
      </main>
    </HydrateClient>
  );
}
