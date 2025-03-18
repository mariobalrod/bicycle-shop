import { ProductType } from '@prisma/client';
import type { Meta, StoryObj } from '@storybook/react';

import { ProductCard } from '.';

const meta = {
  title: 'Main/Products/Card',
  component: ProductCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'Mountain Bike Pro',
    description: 'High-performance mountain bike for professional riders',
    price: 1299.99,
    imageUrl:
      'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=500&h=500&fit=crop',
    type: ProductType.BICYCLE,
    hasStock: true,
    category: 'Mountain',
    slug: 'mountain-bike-pro',
  },
};

export const OutOfStock: Story = {
  args: {
    name: 'Road Bike Elite',
    description: 'Lightweight road bike for competitive cycling',
    price: 2499.99,
    imageUrl:
      'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=500&h=500&fit=crop',
    type: ProductType.BICYCLE,
    hasStock: false,
    category: 'Road',
    slug: 'road-bike-elite',
  },
};
