import clsx from 'clsx';
import { Edit } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/app/components/Badge';
import { Button } from '@/app/components/Button';
import { apiServer } from '@/server/trpc/server';

import { Delete } from '../components/DeleteProduct';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/Table';

export default async function AdminPage() {
  const products = await apiServer.product.getAll();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="mt-2 text-sm text-gray-500">
            A list of all products in your store including their name, price,
            and type.
          </p>
        </div>

        <Link href="/admin/products/new">
          <Button>Add product</Button>
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-10 h-10 rounded-md object-cover"
                  width={40}
                  height={40}
                />
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.category.name}</TableCell>
              <TableCell>{product.type}</TableCell>
              <TableCell>
                <Badge
                  className={clsx(
                    product.hasStock
                      ? '!bg-green-100 !text-green-800'
                      : '!bg-red-100 !text-red-800',
                  )}
                >
                  {product.hasStock ? 'In stock' : 'Out of stock'}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Link href={`/admin/products/${product.id}`}>
                  <Button size="icon" variant="outline">
                    <Edit />
                  </Button>
                </Link>
                <Delete id={product.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
