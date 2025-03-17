import { ProductType } from '@prisma/client';

import { Input } from '@/app/components/form/Input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/app/components/form/Select';

import { Props } from './types';

export function Filters({
  search,
  onSearchChange,
  type,
  onTypeChange,
  category,
  onCategoryChange,
  sortBy,
  onSortChange,
  categories,
}: Props) {
  return (
    <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center">
      <div className="w-full max-w-md">
        <Input
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-4 w-full max-w-xl">
        <Select
          value={type ?? 'default'}
          onValueChange={(value) => {
            onTypeChange(
              value !== 'default' ? (value as ProductType) : undefined,
            );
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Product type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Product type</SelectLabel>
              <SelectItem value="default">All</SelectItem>
              {Object.values(ProductType).map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() +
                    type.slice(1).toLowerCase().replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Category</SelectLabel>
              <SelectItem value="default">All</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort by</SelectLabel>
              <SelectItem value="createdAt-desc">
                Date: Newest to oldest
              </SelectItem>
              <SelectItem value="createdAt-asc">
                Date: Oldest to newest
              </SelectItem>
              <SelectItem value="price-asc">Price: Low to high</SelectItem>
              <SelectItem value="price-desc">Price: High to low</SelectItem>
              <SelectItem value="name-asc">Name: A-Z</SelectItem>
              <SelectItem value="name-desc">Name: Z-A</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
