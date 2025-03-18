import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/Tabs';

import { BasicDetails } from './BasicDetails';
import { ProductProperties } from './Properties';

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="mx-auto max-w-2xl">
      <Tabs defaultValue="basic-details" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic-details">Basic Details</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
        </TabsList>

        <TabsContent value="basic-details">
          <BasicDetails productId={params.id} />
        </TabsContent>

        <TabsContent value="properties">
          <ProductProperties productId={params.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
