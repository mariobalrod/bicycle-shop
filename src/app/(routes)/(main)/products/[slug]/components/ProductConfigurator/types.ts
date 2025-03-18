import { ProductProperty, ProductPropertyOption } from '@prisma/client';

export type Props = {
  properties: (ProductProperty & {
    options: (ProductPropertyOption & {
      incompatibleWith: ProductPropertyOption[];
      incompatibleWithMe: ProductPropertyOption[];
    })[];
  })[];
  onConfigurationChange: (configuration: Record<string, string>) => void;
  disabled?: boolean;
};
