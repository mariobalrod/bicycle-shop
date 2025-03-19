'use client';

import { ProductType } from '@prisma/client';
import { useState } from 'react';

import { ProductCard } from '@/app/(routes)/(main)/components/ProductCard';
import { ProductFilters } from '@/app/(routes)/(main)/components/ProductFilters';
import { Skeleton } from '@/app/components/Skeleton';
import { apiClient } from '@/server/trpc';

import { Sorting } from './types';

export default function Products() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState<ProductType>();
  const [category, setCategory] = useState<string>('default');
  const [sorting, setSorting] = useState<Sorting>('createdAt-desc');

  const { data: products = [], isLoading: isLoadingProducts } =
    apiClient.product.list.useQuery({
      sortBy: sorting.split('-')[0] as 'name' | 'createdAt' | 'price',
      sortOrder: sorting.split('-')[1] as 'asc' | 'desc',
      type,
      categoryId: category === 'default' ? undefined : category,
      search,
    });
  const { data: categories = [], isLoading: isLoadingCategories } =
    apiClient.category.getAll.useQuery();

  const isLoading = isLoadingProducts || isLoadingCategories;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Explore Products</h1>
        <p className="mt-2 text-sm text-gray-500">
          Find the perfect product for your needs
        </p>
      </div>

      <div className="mb-8">
        <ProductFilters
          search={search}
          onSearchChange={setSearch}
          type={type}
          onTypeChange={setType}
          category={category}
          onCategoryChange={setCategory}
          sortBy={sorting}
          onSortChange={setSorting}
          categories={categories}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-full w-full min-h-[400px]" />
          ))
        ) : products.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No products found
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              Try adjusting your search or filter criteria to find what
              you&apos;re looking for
            </p>
          </div>
        ) : (
          products.map(({ category, ...product }) => (
            <ProductCard
              key={product.id}
              {...product}
              category={category.name}
              slug={product.slug}
            />
          ))
        )}
      </div>
    </div>
  );
}
