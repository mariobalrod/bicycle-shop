/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/app/components/Button';
import { Input } from '@/app/components/form/Input';
import { Label } from '@/app/components/form/Label';
import { Textarea } from '@/app/components/form/Textarea';
import { paths } from '@/app/utils/paths';
import { apiClient } from '@/server/trpc';

import { categorySchema, type CategoryFormData } from '../types';

export default function CategoryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { refetch: refetchCategories } = apiClient.category.getAll.useQuery();
  const { data: category, isLoading: isLoadingCategory } =
    apiClient.category.getById.useQuery({
      id: params.id,
    });

  const updateCategory = apiClient.category.update.useMutation({
    onSuccess: async () => {
      await refetchCategories();
      router.push(paths.admin.categories.all);
      toast.success('Category updated successfully');
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const defaultValues = useMemo(() => {
    return {
      name: category?.name ?? '',
      description: category?.description ?? '',
    };
  }, [category]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await updateCategory.mutateAsync({
        id: params.id,
        ...data,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingCategory) {
    return <div>Loading...</div>;
  }

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="space-y-12">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Category Details
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Edit the details of your category.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              {...register('name')}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              {...register('description')}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex justify-end gap-x-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push(paths.admin.categories.all)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
