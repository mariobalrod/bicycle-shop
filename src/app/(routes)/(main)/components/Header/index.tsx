'use client';

import { UserRole } from '@prisma/client';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

import { Button } from '@/app/components/Button';
import { paths } from '@/globals/paths';

export function Header({ role }: { role?: UserRole }) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex gap-6 items-end">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Bicycle Shop
            </Link>
            {role === UserRole.ADMIN && (
              <Link
                href={paths.admin.root}
                className="text-sm mb-0.5 font-medium text-gray-500 hover:text-gray-700"
              >
                Dashboard
              </Link>
            )}
            <Link
              href={paths.products.all}
              className="text-sm mb-0.5 font-medium text-gray-500 hover:text-gray-700"
            >
              Products
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {role ? (
              <Button
                type="button"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={async () => await signOut()}
                size="sm"
                variant="ghost"
              >
                Logout
              </Button>
            ) : (
              <Link href={paths.auth}>
                <Button type="button" size="sm" variant="ghost">
                  Login
                </Button>
              </Link>
            )}

            <Link href={paths.cart}>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Open cart"
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
