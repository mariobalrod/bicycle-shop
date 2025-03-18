/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';

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
import { Button } from '@/app/components/Button';
import { Skeleton } from '@/app/components/Skeleton';
import { paths } from '@/app/utils/paths';
import { apiClient } from '@/server/trpc';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/Table';

export default function CategoriesPage() {
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    refetch: refetchCategories,
  } = apiClient.category.getAll.useQuery();
  const deleteMutation = apiClient.category.delete.useMutation({
    onError: () => {
      toast.error('Failed to delete category');
    },
    onSuccess: async () => {
      await refetchCategories();
      toast.success('Category deleted successfully');
    },
  });

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

        <Link href={paths.admin.categories.new}>
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
          {isLoadingCategories ? (
            Array.from({ length: 10 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="w-20 h-4 rounded-md" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-30 h-4 rounded-md" />
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
          ) : categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No categories found
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>{category.products.length}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Link href={paths.admin.categories.edit(category.id)}>
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
                              id: category.id,
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
