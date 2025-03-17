'use client';

import { ProductType } from '@prisma/client';
import { useState } from 'react';

import { apiClient } from '@/server/trpc';

import { Card } from './components/Card';
import { Filters } from './components/Filters';

export default function Products() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState<ProductType | 'ALL'>('ALL');
  const [category, setCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<
    'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'
  >('name-asc');

  const { data: products = [], isLoading: isLoadingProducts } =
    apiClient.product.getAll.useQuery();
  const { data: categories = [], isLoading: isLoadingCategories } =
    apiClient.category.getAll.useQuery();

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesType = type === 'ALL' || product.type === type;
      const matchesCategory =
        category === 'ALL' || product.categoryId === category;
      return matchesSearch && matchesType && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

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
          sortBy={sortBy}
          onSortChange={setSortBy}
          categories={categories}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map(({ category, ...product }) => (
          <Card
            key={product.id}
            {...product}
            category={category.name}
            slug={product.slug}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && !isLoading && (
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
