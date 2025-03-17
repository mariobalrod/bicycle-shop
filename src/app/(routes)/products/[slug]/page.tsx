'use client';

import clsx from 'clsx';

import { Badge } from '@/app/components/Badge';
import { apiClient } from '@/server/trpc';

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { data: product, isLoading } = apiClient.product.getBySlug.useQuery({
    slug: params.slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500">Product not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover object-center"
              width={800}
              height={800}
            />
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">
                {product.name}
              </h1>
              <Badge
                className={clsx(
                  product.isActive
                    ? '!bg-green-100 !text-green-800'
                    : '!bg-red-100 !text-red-800',
                )}
              >
                {product.isActive ? 'In stock' : 'Out of stock'}
              </Badge>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <Badge variant="secondary">
                {product.type.charAt(0).toUpperCase() +
                  product.type.slice(1).toLowerCase().replace('_', ' ')}
              </Badge>
              <Badge>{product.category.name}</Badge>
            </div>

            <p className="mt-6 text-2xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </p>

            {product.description && (
              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Description
                </h2>
                <p className="mt-2 text-gray-600">{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
