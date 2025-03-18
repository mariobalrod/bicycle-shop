import { redirect } from 'next/navigation';

import { paths } from '@/globals/paths';

export default function Home() {
  redirect(paths.products.all);
}
