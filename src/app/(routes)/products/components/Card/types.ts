import { ProductType } from '@prisma/client';

export type Props = {
  name: string;
  description: string | null;
  price: number;
  imageUrl: string;
  type: ProductType;
  isActive: boolean;
  category: string;
  slug: string;
};
