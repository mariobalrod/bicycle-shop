/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';

import clsx from 'clsx';
import { Edit, Trash } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogTitle,
} from '@/app/components/AlertDialog';
import { Badge } from '@/app/components/Badge';
import { Button } from '@/app/components/Button';
import { Skeleton } from '@/app/components/Skeleton';
import { paths } from '@/globals/paths';
import { apiClient } from '@/server/trpc';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/Table';

export default function AdminPage() {
  const {
    data: products = [],
    isLoading: isLoadingProducts,
    refetch: refetchProducts,
  } = apiClient.product.getAll.useQuery();
  const deleteMutation = apiClient.product.delete.useMutation({
    onError: () => {
      toast.error('Failed to delete product');
    },
    onSuccess: async () => {
      await refetchProducts();
      toast.success('Product deleted successfully');
    },
  });

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

        <Link href={paths.admin.products.new}>
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
          {isLoadingProducts ? (
            Array.from({ length: 10 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="w-10 h-10 rounded-md" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-20 h-4 rounded-md" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-30 h-4 rounded-md" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-20 h-4 rounded-md" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-20 h-4 rounded-md" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-20 h-4 rounded-md" />
                </TableCell>
                <TableCell className="flex gap-4 justify-end">
                  <Skeleton className="w-8 h-8 rounded-md" />
                  <Skeleton className="w-8 h-8 rounded-md" />
                </TableCell>
              </TableRow>
            ))
          ) : products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                No products found
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
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
                <TableCell>
                  <Badge variant="secondary" className="!bg-white shadow-2xl">
                    {product.type.charAt(0).toUpperCase() +
                      product.type.slice(1).toLowerCase().replace('_', ' ')}
                  </Badge>
                </TableCell>
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
                  <Link href={paths.admin.products.edit(product.id)}>
                    <Button size="icon" variant="outline">
                      <Edit />
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        className="!text-destructive"
                      >
                        <Trash />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete from the database.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteMutation.isPending}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          type="button"
                          disabled={deleteMutation.isPending}
                          onClick={async () => {
                            await deleteMutation.mutateAsync({
                              id: product.id,
                            });
                          }}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
