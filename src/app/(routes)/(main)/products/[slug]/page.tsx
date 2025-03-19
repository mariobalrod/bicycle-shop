'use client';

import clsx from 'clsx';
import { Minus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { ProductConfigurator } from '@/app/(routes)/(main)/components/ProductConfigurator';
import { Badge } from '@/app/components/Badge';
import { Button } from '@/app/components/Button';
import { ConfigurationOption, useCartStore } from '@/app/utils/cart';
import { paths } from '@/app/utils/paths';
import { apiClient } from '@/server/trpc';

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedConfiguration, setSelectedConfiguration] = useState<
    Record<string, ConfigurationOption>
  >({});

  const { data: product, isLoading } = apiClient.product.getBySlug.useQuery({
    slug: params.slug,
  });

  const addToCart = useCartStore((state) => state.addItem);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    if (!product) return;

    // Transform the configuration to the format expected by the cart
    const cartConfiguration = Object.entries(selectedConfiguration).reduce<
      Record<string, ConfigurationOption>
    >((acc, [propertyId, option]) => {
      acc[propertyId] = {
        id: option.id,
        name: option.name,
        propertyName: option.propertyName,
      };
      return acc;
    }, {});

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      configuration: cartConfiguration,
    });

    for (let i = 1; i < quantity; i++) {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        configuration: cartConfiguration,
      });
    }

    router.push(paths.cart);
    toast.success('Product added to cart');
  };

  const isConfigurationComplete =
    product?.properties &&
    Object.keys(selectedConfiguration).length === product.properties.length;

  if (isLoading) {
    return (
      <div className="h-full">
        <div className="container flex flex-col md:flex-row mx-auto gap-6 md:gap-12">
          <div className="w-full h-full md:w-1/2">
            <div className="w-full h-[500px] bg-gray-200 animate-pulse rounded-lg" />

            <div className="flex items-center justify-between mt-3">
              <div className="h-8 w-48 bg-gray-200 animate-pulse rounded" />
              <div className="h-6 w-20 bg-gray-200 animate-pulse rounded-full" />
            </div>

            {/* Category and price skeleton */}
            <div className="flex items-end justify-between mt-2">
              <div className="flex items-center gap-4">
                <div className="h-6 w-24 bg-gray-200 animate-pulse rounded-full" />
                <div className="h-6 w-24 bg-gray-200 animate-pulse rounded-full" />
              </div>
              <div className="h-6 w-20 bg-gray-200 animate-pulse rounded" />
            </div>

            <div className="mt-6">
              <div className="h-6 w-32 bg-gray-200 animate-pulse rounded mb-2" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
                <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
                <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded" />
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="h-6 w-32 bg-gray-200 animate-pulse rounded" />
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((j) => (
                      <div
                        key={j}
                        className="h-10 bg-gray-200 animate-pulse rounded"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t pt-8">
              <div className="h-12 w-full bg-gray-200 animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto">
          <div className="text-center py-4">
            <p className="text-gray-500">Product not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="container flex flex-col md:flex-row mx-auto gap-6 md:gap-12">
        <div className="w-full h-full md:w-1/2">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full max-h-[500px] rounded-lg object-cover aspect-square"
            width={500}
            height={500}
          />

          <div className="flex items-center justify-between mt-3">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <Badge
              className={clsx(
                product.hasStock
                  ? '!bg-green-100 !text-green-800'
                  : '!bg-red-100 !text-red-800',
              )}
            >
              {product.hasStock ? 'In stock' : 'Out of stock'}
            </Badge>
          </div>

          <div className="flex items-end justify-between mt-2">
            <div className="flex items-center gap-4">
              <Badge>{product.category.name}</Badge>
              <Badge variant="outline" className="!bg-white shadow-2xl">
                {product.type.charAt(0).toUpperCase() +
                  product.type.slice(1).toLowerCase().replace('_', ' ')}
              </Badge>
            </div>

            <p className="text-xl font-semibold text-gray-900">
              ${product.price.toFixed(2)}
            </p>
          </div>

          {product.description && (
            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900">Description</h2>
              <p className="mt-2 text-gray-600">{product.description}</p>
            </div>
          )}
        </div>

        <div className="w-full md:w-1/2">
          {product.properties && product.properties.length > 0 && (
            <div className="border-t md:border-0 pt-6 md:pt-0">
              <ProductConfigurator
                properties={product.properties}
                onConfigurationChange={setSelectedConfiguration}
                disabled={!product.hasStock}
              />
            </div>
          )}

          <div
            className={clsx(
              !product.properties.length
                ? 'border-t md:border-0 pt-8 md:pt-0'
                : 'mt-8 border-t pt-8',
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">
                Quantity
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={
                    quantity <= 1 ||
                    !product.hasStock ||
                    !isConfigurationComplete
                  }
                >
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">Decrease quantity</span>
                </Button>

                <span className="w-8 text-center">{quantity}</span>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleQuantityChange(1)}
                  disabled={!product.hasStock || !isConfigurationComplete}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Increase quantity</span>
                </Button>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={!product.hasStock || !isConfigurationComplete}
              className="w-full"
            >
              {!product.hasStock
                ? 'Out of stock'
                : !isConfigurationComplete
                  ? 'Select all options'
                  : 'Add to cart'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
