import { redirect } from 'next/navigation';

import { paths } from '@/globals/paths';
import { getServerAuthSession } from '@/server/auth';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  if (session) {
    redirect(paths.admin.root);
  }

  return children;
}
