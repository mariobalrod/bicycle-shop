import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Bicycle Shop
          </Link>
          <button
            className="flex items-center gap-2 rounded-full bg-white p-2 text-gray-600 hover:bg-gray-100"
            aria-label="Open cart"
          >
            <ShoppingCart className="h-6 w-6" />
            <span className="sr-only">Cart</span>
          </button>
        </div>
      </div>
    </header>
  );
}
