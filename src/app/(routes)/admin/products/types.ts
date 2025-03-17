import { ProductType } from '@prisma/client';
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be greater than 0'),
  type: z.nativeEnum(ProductType, {
    required_error: 'Type is required',
  }),
  isActive: z.boolean(),
  imageUrl: z.string().url('Image URL is not valid'),
  categoryId: z.string().min(1, 'Category is required'),
});

export type ProductFormData = z.infer<typeof productSchema>;
