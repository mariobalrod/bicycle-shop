/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ProductType } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/app/components/Button';
import { Input } from '@/app/components/form/Input';
import { Label } from '@/app/components/form/Label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/app/components/form/Select';
import { Textarea } from '@/app/components/form/Textarea';
import { paths } from '@/app/utils/paths';
import { apiClient } from '@/server/trpc';

import { productSchema, type ProductFormData } from '../types';

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { refetch: refetchProducts } = apiClient.product.getAll.useQuery();
  const { data: categories = [], isLoading: isLoadingCategories } =
    apiClient.category.getAll.useQuery();

  const createProduct = apiClient.product.create.useMutation({
    onSuccess: async () => {
      await refetchProducts();
      router.push(paths.admin.products.all);
      toast.success('Product created successfully');
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      type: ProductType.BICYCLE,
      hasStock: true,
      imageUrl: '',
      categoryId: '',
    },
  });

  const imageUrl = watch('imageUrl');

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await createProduct.mutateAsync(data);
    } finally {
      setIsLoading(false);
      reset();
    }
  };

  if (isLoadingCategories) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="space-y-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            New Product
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Create a new product in your store. You can add properties later.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="imageUrl">Image</Label>
            <Input
              type="url"
              id="imageUrl"
              {...register('imageUrl')}
              className={errors.imageUrl ? 'border-red-500' : ''}
            />
            {errors.imageUrl && (
              <p className="text-sm text-red-500">{errors.imageUrl.message}</p>
            )}
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Product"
                className="w-[18.75rem] h-[18.75rem] rounded-md object-cover mt-2"
              />
            )}
          </div>

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

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="price">Price</Label>
            <Input
              type="number"
              id="price"
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              className={errors.price ? 'border-red-500' : ''}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="categoryId">Category</Label>

            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange({ target: { value } });
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select a category</SelectLabel>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categoryId && (
              <p className="text-sm text-red-500">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="type">Type</Label>

            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select
                  value={field.value}
                  defaultValue={ProductType.BICYCLE}
                  onValueChange={(value) => {
                    field.onChange({ target: { value } });
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a product type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select a product type</SelectLabel>
                      {Object.values(ProductType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() +
                            type.slice(1).toLowerCase().replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="hasStock">Status</Label>
            <Controller
              control={control}
              name="hasStock"
              render={({ field }) => (
                <Select
                  value={field.value?.toString()}
                  defaultValue="true"
                  onValueChange={(value) => {
                    field.onChange({
                      target: { value: value === 'true' },
                    });
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a value" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="true">In stock</SelectItem>
                      <SelectItem value="false">Out of stock</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.hasStock && (
              <p className="text-sm text-red-500">{errors.hasStock.message}</p>
            )}
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex justify-end gap-x-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push(paths.admin.products.all)}
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
