'use client';

import { UserRole } from '@prisma/client';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { Badge } from '@/app/components/Badge';
import { Button } from '@/app/components/Button';
import { useCartStore } from '@/app/store/cart';
import { paths } from '@/globals/paths';

export function Header({ role }: { role?: UserRole }) {
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  // Hydration handling
  useEffect(() => {
    setMounted(true);
  }, []);

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

            <Link href={paths.cart} className="relative">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Open cart"
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="sr-only">Cart</span>
              </Button>
              {mounted && totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 !bg-primary !text-white h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs">
                  {totalItems}
                </Badge>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
