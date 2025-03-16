/* eslint-disable no-console */
import { PrismaClient, ProductType, RestrictionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Bicycle Category
  const bicycleCategory = await prisma.category.create({
    data: {
      name: 'Bicycles',
      description: 'Customizable bicycles for different purposes',
    },
  });

  // Create Options
  const frameTypeOption = await prisma.option.create({
    data: {
      name: 'Frame Type',
      description: 'The type of bicycle frame',
      categoryId: bicycleCategory.id,
    },
  });

  const frameFinishOption = await prisma.option.create({
    data: {
      name: 'Frame Finish',
      description: 'The finish of the bicycle frame',
      categoryId: bicycleCategory.id,
    },
  });

  const wheelTypeOption = await prisma.option.create({
    data: {
      name: 'Wheel Type',
      description: 'The type of wheels',
      categoryId: bicycleCategory.id,
    },
  });

  const rimColorOption = await prisma.option.create({
    data: {
      name: 'Rim Color',
      description: 'The color of the wheel rims',
      categoryId: bicycleCategory.id,
    },
  });

  const chainTypeOption = await prisma.option.create({
    data: {
      name: 'Chain Type',
      description: 'The type of chain',
      categoryId: bicycleCategory.id,
    },
  });

  // Create Option Values
  const frameTypeValues = await Promise.all([
    prisma.optionValue.create({
      data: {
        name: 'Full-suspension',
        description: 'Full suspension frame for better shock absorption',
        optionId: frameTypeOption.id,
      },
    }),
    prisma.optionValue.create({
      data: {
        name: 'Diamond',
        description: 'Classic diamond frame design',
        optionId: frameTypeOption.id,
      },
    }),
    prisma.optionValue.create({
      data: {
        name: 'Step-through',
        description: 'Easy to mount step-through frame',
        optionId: frameTypeOption.id,
      },
    }),
  ]);

  const frameFinishValues = await Promise.all([
    prisma.optionValue.create({
      data: {
        name: 'Matte',
        description: 'Matte finish for a modern look',
        optionId: frameFinishOption.id,
      },
    }),
    prisma.optionValue.create({
      data: {
        name: 'Shiny',
        description: 'Glossy finish for a classic look',
        optionId: frameFinishOption.id,
      },
    }),
  ]);

  const wheelTypeValues = await Promise.all([
    prisma.optionValue.create({
      data: {
        name: 'Road wheels',
        description: 'Lightweight wheels for road cycling',
        optionId: wheelTypeOption.id,
      },
    }),
    prisma.optionValue.create({
      data: {
        name: 'Mountain wheels',
        description: 'Sturdy wheels for mountain biking',
        optionId: wheelTypeOption.id,
      },
    }),
    prisma.optionValue.create({
      data: {
        name: 'Fat bike wheels',
        description: 'Extra wide wheels for fat bikes',
        optionId: wheelTypeOption.id,
      },
    }),
  ]);

  const rimColorValues = await Promise.all([
    prisma.optionValue.create({
      data: {
        name: 'Red',
        description: 'Red colored rims',
        optionId: rimColorOption.id,
      },
    }),
    prisma.optionValue.create({
      data: {
        name: 'Black',
        description: 'Black colored rims',
        optionId: rimColorOption.id,
      },
    }),
    prisma.optionValue.create({
      data: {
        name: 'Blue',
        description: 'Blue colored rims',
        optionId: rimColorOption.id,
      },
    }),
  ]);

  const chainTypeValues = await Promise.all([
    prisma.optionValue.create({
      data: {
        name: 'Single-speed chain',
        description: 'Chain for single-speed bicycles',
        optionId: chainTypeOption.id,
      },
    }),
    prisma.optionValue.create({
      data: {
        name: '8-speed chain',
        description: 'Chain for 8-speed bicycles',
        optionId: chainTypeOption.id,
      },
    }),
  ]);

  // Create Restrictions
  await Promise.all([
    // Mountain wheels require full-suspension frame
    prisma.optionRestriction.create({
      data: {
        optionValueId: wheelTypeValues[1].id, // Mountain wheels
        restrictedValueId: frameTypeValues[0].id, // Full-suspension
        type: RestrictionType.REQUIRED,
      },
    }),
    // Fat bike wheels are incompatible with red rims
    prisma.optionRestriction.create({
      data: {
        optionValueId: wheelTypeValues[2].id, // Fat bike wheels
        restrictedValueId: rimColorValues[0].id, // Red rims
        type: RestrictionType.INCOMPATIBLE,
      },
    }),
  ]);

  // Create Sample Products
  await prisma.product.create({
    data: {
      name: 'Mountain Explorer Pro',
      description: 'Professional mountain bike with customizable options',
      price: 1299.99,
      type: ProductType.BICYCLE,
      categories: {
        connect: { id: bicycleCategory.id },
      },
      options: {
        create: [
          {
            optionId: frameTypeOption.id,
            isRequired: true,
            values: {
              create: [
                { optionValueId: frameTypeValues[0].id, isAvailable: true },
                { optionValueId: frameTypeValues[1].id, isAvailable: true },
              ],
            },
          },
          {
            optionId: frameFinishOption.id,
            isRequired: true,
            values: {
              create: [
                { optionValueId: frameFinishValues[0].id, isAvailable: true },
                { optionValueId: frameFinishValues[1].id, isAvailable: true },
              ],
            },
          },
          {
            optionId: wheelTypeOption.id,
            isRequired: true,
            values: {
              create: [
                { optionValueId: wheelTypeValues[1].id, isAvailable: true },
                { optionValueId: wheelTypeValues[2].id, isAvailable: true },
              ],
            },
          },
          {
            optionId: rimColorOption.id,
            isRequired: true,
            values: {
              create: [
                { optionValueId: rimColorValues[1].id, isAvailable: true },
                { optionValueId: rimColorValues[2].id, isAvailable: true },
              ],
            },
          },
          {
            optionId: chainTypeOption.id,
            isRequired: true,
            values: {
              create: [
                { optionValueId: chainTypeValues[1].id, isAvailable: true },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: 'Road Master Elite',
      description: 'High-performance road bike with premium components',
      price: 1999.99,
      type: ProductType.BICYCLE,
      categories: {
        connect: { id: bicycleCategory.id },
      },
      options: {
        create: [
          {
            optionId: frameTypeOption.id,
            isRequired: true,
            values: {
              create: [
                { optionValueId: frameTypeValues[1].id, isAvailable: true },
                { optionValueId: frameTypeValues[2].id, isAvailable: true },
              ],
            },
          },
          {
            optionId: frameFinishOption.id,
            isRequired: true,
            values: {
              create: [
                { optionValueId: frameFinishValues[0].id, isAvailable: true },
                { optionValueId: frameFinishValues[1].id, isAvailable: true },
              ],
            },
          },
          {
            optionId: wheelTypeOption.id,
            isRequired: true,
            values: {
              create: [
                { optionValueId: wheelTypeValues[0].id, isAvailable: true },
              ],
            },
          },
          {
            optionId: rimColorOption.id,
            isRequired: true,
            values: {
              create: [
                { optionValueId: rimColorValues[0].id, isAvailable: true },
                { optionValueId: rimColorValues[1].id, isAvailable: true },
                { optionValueId: rimColorValues[2].id, isAvailable: true },
              ],
            },
          },
          {
            optionId: chainTypeOption.id,
            isRequired: true,
            values: {
              create: [
                { optionValueId: chainTypeValues[1].id, isAvailable: true },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect();
  });
