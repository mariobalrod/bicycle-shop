import { ProductType } from '@prisma/client';

import { Sorting } from '@/app/(routes)/(main)/products/types';

export type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  type?: ProductType;
  onTypeChange: (value?: ProductType) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  sortBy: Sorting;
  onSortChange: (value: Sorting) => void;
  categories: Array<{ id: string; name: string }>;
};
