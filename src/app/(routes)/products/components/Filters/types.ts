import { ProductType } from '@prisma/client';

export type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  type: ProductType | 'ALL';
  onTypeChange: (value: ProductType | 'ALL') => void;
  category: string;
  onCategoryChange: (value: string) => void;
  sortBy: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
  onSortChange: (
    value: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc',
  ) => void;
  categories: Array<{ id: string; name: string }>;
};
