import Link from 'next/link';

import { Button } from '@/app/components/Button';
import { apiServer } from '@/server/trpc/server';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/Table';

export default async function CategoriesPage() {
  const categories = await apiServer.category.getAll();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
          <p className="mt-2 text-sm text-gray-500">
            A list of all categories in your store including their name and
            description.
          </p>
        </div>

        <Link href="/admin/categories/new">
          <Button>Add category</Button>
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Products</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.description}</TableCell>
              <TableCell>{category.products.length}</TableCell>
              <TableCell className="text-right">
                <Link
                  href={`/admin/categories/${category.id}`}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Edit
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
