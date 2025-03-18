import { ProductPropertyOption, type ProductProperty } from '@prisma/client';

import { ConfigurationOption } from '@/app/store/cart';

export type Props = {
  properties: (ProductProperty & {
    options: (ProductPropertyOption & {
      incompatibleWith: ProductPropertyOption[];
      incompatibleWithMe: ProductPropertyOption[];
    })[];
  })[];
  onConfigurationChange: (
    configuration: Record<string, ConfigurationOption>,
  ) => void;
  disabled?: boolean;
};
