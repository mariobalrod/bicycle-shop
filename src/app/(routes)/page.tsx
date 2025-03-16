import { apiServer, HydrateClient } from '@/server/trpc/server';

export default async function Home() {
  const hello = await apiServer.user.hello({ text: 'from tRPC' });

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="largeTitle">Welcome: {hello.greeting}</h1>
      </main>
    </HydrateClient>
  );
}
