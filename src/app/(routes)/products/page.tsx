'use client';

import { ProductType } from '@prisma/client';
import { useState } from 'react';

import { apiClient } from '@/server/trpc';

import { Card } from './components/Card';
import { Filters } from './components/Filters';
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
        <Filters
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
        {products.map(({ category, ...product }) => (
          <Card
            key={product.id}
            {...product}
            category={category.name}
            slug={product.slug}
          />
        ))}
      </div>

      {products.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found</p>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading...</p>
        </div>
      )}
    </div>
  );
}
