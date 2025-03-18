/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';

import { Product } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';
import { Trash } from 'lucide-react';
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
import { apiClient } from '@/server/trpc';
import { buildQueryKey } from '@/utils/buildQueryKey';

export function Delete({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const deleteMutation = apiClient.product.delete.useMutation({
    onError: () => {
      toast.error('Failed to delete product');
    },
    onSuccess: async () => {
      await queryClient.setQueryData(
        buildQueryKey(['product', 'getAll']),
        (old: Product[] | undefined) => {
          if (!old) return [];
          return old.filter((product) => product.id !== id);
        },
      );

      toast.success('Product deleted successfully');
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="outline" className="!text-destructive">
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete from the
            database.
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
              await deleteMutation.mutateAsync({ id });
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
