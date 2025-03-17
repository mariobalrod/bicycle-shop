'use client';

import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

import { Button } from '@/app/components/Button';

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex gap-6 items-end">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Bicycle Shop
            </Link>
            <Link
              href="/admin"
              className="text-sm mb-0.75 font-medium text-gray-500 hover:text-gray-700"
            >
              Admin
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Button
              type="button"
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={async () => await signOut()}
              size="sm"
              variant="ghost"
            >
              Logout
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-label="Open cart"
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="sr-only">Cart</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
