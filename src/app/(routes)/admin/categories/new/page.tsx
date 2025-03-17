/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/app/components/Button';
import { Input } from '@/app/components/form/Input';
import { Label } from '@/app/components/form/Label';
import { Textarea } from '@/app/components/form/Textarea';
import { apiClient } from '@/server/trpc';

import { categorySchema, type CategoryFormData } from '../types';

export default function NewCategoryPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCategory = apiClient.category.create.useMutation({
    onSuccess: () => {
      router.push('/admin/categories');
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async (data: CategoryFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await createCategory.mutateAsync(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="space-y-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            New Category
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Create a new category for your store.
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
              onClick={() => router.push('/admin/categories')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
