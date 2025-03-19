import { redirect } from 'next/navigation';

import { paths } from '@/app/utils/paths';

export default function AdminPage() {
  redirect(paths.admin.products.all);
}
