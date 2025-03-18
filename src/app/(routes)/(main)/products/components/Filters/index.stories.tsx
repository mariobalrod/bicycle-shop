/* eslint-disable no-console */
import { ProductType } from '@prisma/client';
import type { Meta, StoryObj } from '@storybook/react';

import { Filters } from '.';

const meta = {
  title: 'Products/Filters',
  component: Filters,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Filters>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockCategories = [
  { id: '1', name: 'Mountain' },
  { id: '2', name: 'Road' },
  { id: '3', name: 'Urban' },
  { id: '4', name: 'Electric' },
];

export const Default: Story = {
  args: {
    search: '',
    onSearchChange: (value) => console.log('Search changed:', value),
    type: undefined,
    onTypeChange: (value) => console.log('Type changed:', value),
    category: 'default',
    onCategoryChange: (value) => console.log('Category changed:', value),
    sortBy: 'price-asc',
    onSortChange: (value) => console.log('Sort changed:', value),
    categories: mockCategories,
  },
};

export const WithFilters: Story = {
  args: {
    search: 'mountain',
    onSearchChange: (value) => console.log('Search changed:', value),
    type: ProductType.BICYCLE,
    onTypeChange: (value) => console.log('Type changed:', value),
    category: '1',
    onCategoryChange: (value) => console.log('Category changed:', value),
    sortBy: 'price-desc',
    onSortChange: (value) => console.log('Sort changed:', value),
    categories: mockCategories,
  },
};
