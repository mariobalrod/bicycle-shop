import type { Meta, StoryObj } from '@storybook/react';

import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '.';

const meta = {
  title: 'Admin/Table',
  component: Table,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockProducts = [
  {
    id: '1',
    name: 'Mountain Bike Pro',
    price: 1299.99,
    stock: 15,
    category: 'Mountain',
  },
  {
    id: '2',
    name: 'Road Bike Elite',
    price: 2499.99,
    stock: 8,
    category: 'Road',
  },
  {
    id: '3',
    name: 'Urban Commuter',
    price: 899.99,
    stock: 20,
    category: 'Urban',
  },
];

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of products in the store.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Category</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockProducts.map((product) => (
          <TableRow key={product.id}>
            <TableCell>{product.name}</TableCell>
            <TableCell>${product.price.toFixed(2)}</TableCell>
            <TableCell>{product.stock}</TableCell>
            <TableCell>{product.category}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total Products</TableCell>
          <TableCell>{mockProducts.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

export const Empty: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of products in the store.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Category</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={4} className="text-center">
            No products found
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
