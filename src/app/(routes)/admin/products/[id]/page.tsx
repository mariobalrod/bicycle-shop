/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ProductType } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

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
import { apiClient } from '@/server/trpc';

import { productSchema, type ProductFormData } from '../types';

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: product, isLoading: isLoadingProduct } =
    apiClient.product.getById.useQuery({
      id: params.id,
    });

  const updateProduct = apiClient.product.update.useMutation({
    onSuccess: () => {
      router.push('/admin');
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name,
      description: product?.description ?? '',
      price: product?.price,
      type: product?.type,
      isActive: product?.isActive,
      imageUrl: product?.imageUrl,
      categoryId: product?.categoryId,
    },
  });

  const imageUrl = watch('imageUrl');

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await updateProduct.mutateAsync({
        id: params.id,
        ...data,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProduct) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="space-y-12">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Product Details
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Edit the details of your product.
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
                alt={product.name}
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
            <Label htmlFor="type">Type</Label>
            <Select
              defaultValue={product.type}
              onValueChange={async (value) =>
                await register('type').onChange({ target: { value } })
              }
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
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="isActive">Status</Label>
            <Select
              defaultValue={product.isActive.toString()}
              onValueChange={async (value) =>
                await register('isActive').onChange({
                  target: { value: value === 'true' },
                })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a value" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.isActive && (
              <p className="text-sm text-red-500">{errors.isActive.message}</p>
            )}
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex justify-end gap-x-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/admin')}
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
