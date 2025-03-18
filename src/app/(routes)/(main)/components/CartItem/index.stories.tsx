/* eslint-disable no-console */
import type { Meta, StoryObj } from '@storybook/react';

import { CartItem } from '.';

const meta: Meta<typeof CartItem> = {
  title: 'Main/Cart/Item',
  component: CartItem,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CartItem>;

const baseItem = {
  productId: '1',
  name: 'Mountain Bike',
  price: 599.99,
  imageUrl: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7',
  quantity: 1,
};

export const Default: Story = {
  args: {
    item: baseItem,
    onUpdateQuantity: (quantity: number) =>
      console.log('Quantity updated:', quantity),
    onRemove: () => console.log('Item removed'),
  },
};

export const WithConfiguration: Story = {
  args: {
    item: {
      ...baseItem,
      configuration: {
        color: {
          id: '1',
          name: 'Red',
          propertyName: 'Color',
        },
        size: {
          id: '2',
          name: 'Large',
          propertyName: 'Size',
        },
      },
    },
    onUpdateQuantity: (quantity: number) =>
      console.log('Quantity updated:', quantity),
    onRemove: () => console.log('Item removed'),
  },
};

export const MultipleQuantity: Story = {
  args: {
    item: {
      ...baseItem,
      quantity: 3,
    },
    onUpdateQuantity: (quantity: number) =>
      console.log('Quantity updated:', quantity),
    onRemove: () => console.log('Item removed'),
  },
};
