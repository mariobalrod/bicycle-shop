import { redirect } from 'next/navigation';

import { paths } from '@/app/utils/paths';

export default function Home() {
  redirect(paths.products.all);
}
