import clsx from 'clsx';
import Link from 'next/link';

import { Badge } from '@/app/components/Badge';
import { paths } from '@/globals/paths';

import { Props } from './types';

export function Card({
  name,
  description,
  price,
  imageUrl,
  type,
  hasStock,
  category,
  slug,
}: Props) {
  return (
    <Link
      href={paths.products.details(slug)}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-lg"
    >
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-200">
        <img
          src={imageUrl}
          alt={name}
          width={300}
          height={300}
          className="h-full w-full max-h-[300px] object-cover object-center group-hover:opacity-75 aspect-square"
        />
      </div>
      <div className="flex flex-1 flex-col space-y-2 p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">{name}</h3>
          <Badge
            className={clsx(
              hasStock
                ? '!bg-green-100 !text-green-800'
                : '!bg-red-100 !text-red-800',
            )}
          >
            {hasStock ? 'In stock' : 'Out of stock'}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900">
            ${price.toFixed(2)}
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {type.charAt(0).toUpperCase() +
                type.slice(1).toLowerCase().replace('_', ' ')}
            </Badge>
            <Badge>{category}</Badge>
          </div>
        </div>
      </div>
    </Link>
  );
}
