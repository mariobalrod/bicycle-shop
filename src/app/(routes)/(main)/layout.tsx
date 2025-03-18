import { getServerAuthSession } from '@/server/auth';

import { Header } from './components/Header';

export default async function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  return (
    <div className="min-h-screen bg-gray-50">
      <Header role={session?.user?.role} />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
