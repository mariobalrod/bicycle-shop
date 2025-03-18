/* eslint-disable no-console */
import { ProductProperty, ProductPropertyOption } from '@prisma/client';
import type { Meta, StoryObj } from '@storybook/react';

import { ProductConfigurator } from '.';

const meta: Meta<typeof ProductConfigurator> = {
  title: 'Main/Products/Configurator',
  component: ProductConfigurator,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProductConfigurator>;

const mockDate = new Date();

type ExtendedProductPropertyOption = ProductPropertyOption & {
  incompatibleWith: ProductPropertyOption[];
  incompatibleWithMe: ProductPropertyOption[];
};

type ExtendedProductProperty = ProductProperty & {
  options: ExtendedProductPropertyOption[];
};

const baseProperties: ExtendedProductProperty[] = [
  {
    id: '1',
    name: 'Color',
    createdAt: mockDate,
    updatedAt: mockDate,
    productId: 'mock-product-id',
    options: [
      {
        id: 'color-1',
        name: 'Red',
        hasStock: true,
        createdAt: mockDate,
        updatedAt: mockDate,
        propertyId: '1',
        incompatibleWith: [],
        incompatibleWithMe: [],
      },
      {
        id: 'color-2',
        name: 'Blue',
        hasStock: true,
        createdAt: mockDate,
        updatedAt: mockDate,
        propertyId: '1',
        incompatibleWith: [],
        incompatibleWithMe: [],
      },
      {
        id: 'color-3',
        name: 'Black',
        hasStock: false,
        createdAt: mockDate,
        updatedAt: mockDate,
        propertyId: '1',
        incompatibleWith: [],
        incompatibleWithMe: [],
      },
    ],
  },
  {
    id: '2',
    name: 'Size',
    createdAt: mockDate,
    updatedAt: mockDate,
    productId: 'mock-product-id',
    options: [
      {
        id: 'size-1',
        name: 'Small',
        hasStock: true,
        createdAt: mockDate,
        updatedAt: mockDate,
        propertyId: '2',
        incompatibleWith: [],
        incompatibleWithMe: [],
      },
      {
        id: 'size-2',
        name: 'Medium',
        hasStock: true,
        createdAt: mockDate,
        updatedAt: mockDate,
        propertyId: '2',
        incompatibleWith: [],
        incompatibleWithMe: [],
      },
      {
        id: 'size-3',
        name: 'Large',
        hasStock: true,
        createdAt: mockDate,
        updatedAt: mockDate,
        propertyId: '2',
        incompatibleWith: [],
        incompatibleWithMe: [],
      },
    ],
  },
];

export const Default: Story = {
  args: {
    properties: baseProperties,
    onConfigurationChange: (config) =>
      console.log('Configuration changed:', config),
  },
};

export const Disabled: Story = {
  args: {
    properties: baseProperties,
    onConfigurationChange: (config) =>
      console.log('Configuration changed:', config),
    disabled: true,
  },
};
