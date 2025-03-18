'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';

import { Button } from '@/app/components/Button';
import { paths } from '@/globals/paths';

export function Header() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 items-center justify-between">
          <div className="flex py-4 md:py-0 md:gap-6 items-start gap-2 md:items-center flex-col md:flex-row">
            <Link href={paths.admin.root}>
              <span className="text-xl font-bold">My Store</span>
            </Link>

            <div className="flex gap-4 items-center">
              <Link
                href={paths.admin.products.all}
                className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Products
              </Link>
              <Link
                href={paths.admin.categories.all}
                className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Categories
              </Link>
              <Link
                href={paths.admin.orders.all}
                className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Orders
              </Link>
            </div>
          </div>
          <Button
            type="button"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={async () => await signOut()}
            size="sm"
            variant="ghost"
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
