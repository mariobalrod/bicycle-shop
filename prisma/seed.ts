/* eslint-disable no-console */
import { PrismaClient, ProductType, UserRole } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await hash('Test123.', 10);
  await prisma.user.upsert({
    where: { email: 'marcus@gmail.com' },
    update: {},
    create: {
      email: 'marcus@gmail.com',
      name: 'Marcus',
      role: UserRole.ADMIN,
      password: adminPassword,
    },
  });

  // Create customer user
  const customerPassword = await hash('Test123.', 10);
  await prisma.user.upsert({
    where: { email: 'customer@gmail.com' },
    update: {},
    create: {
      email: 'customer@gmail.com',
      name: 'Customer User',
      role: UserRole.USER,
      password: customerPassword,
    },
  });

  // Create Mountain Sports Category
  const mountainSportsCategory = await prisma.category.upsert({
    where: { slug: 'mountain-sports' },
    update: {},
    create: {
      name: 'Mountain Sports',
      description: 'Mountain sports equipment',
      slug: 'mountain-sports',
    },
  });

  // Create Road Cycling Category
  const roadCyclingCategory = await prisma.category.upsert({
    where: { slug: 'road-cycling' },
    update: {},
    create: {
      name: 'Road Cycling',
      description: 'Road cycling equipment and bikes',
      slug: 'road-cycling',
    },
  });

  // Create Urban Cycling Category
  const urbanCyclingCategory = await prisma.category.upsert({
    where: { slug: 'urban-cycling' },
    update: {},
    create: {
      name: 'Urban Cycling',
      description: 'Urban and commuter bikes',
      slug: 'urban-cycling',
    },
  });

  const existingProducts = await prisma.product.findMany();
  if (existingProducts.length > 0) {
    console.log('Products already exist, skipping product seeding');
    return;
  }

  // Create Sample Products
  await prisma.product.create({
    data: {
      name: 'Mountain Explorer Pro',
      slug: 'mountain-explorer-pro',
      description: 'Professional mountain bike with customizable options',
      price: 1299.99,
      type: ProductType.BICYCLE,
      imageUrl:
        'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?q=80&w=1000',
      category: {
        connect: { id: mountainSportsCategory.id },
      },
    },
  });

  await prisma.product.create({
    data: {
      name: 'Road Master Elite',
      slug: 'road-master-elite',
      description: 'High-performance road bike with premium components',
      price: 1999.99,
      type: ProductType.BICYCLE,
      imageUrl:
        'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1000',
      category: {
        connect: { id: roadCyclingCategory.id },
      },
    },
  });

  // New Products
  await prisma.product.create({
    data: {
      name: 'Urban Commuter Deluxe',
      slug: 'urban-commuter-deluxe',
      description: 'Comfortable and stylish city bike for daily commuting',
      price: 899.99,
      type: ProductType.BICYCLE,
      imageUrl:
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890?q=80&w=1000',
      category: {
        connect: { id: urbanCyclingCategory.id },
      },
    },
  });

  await prisma.product.create({
    data: {
      name: 'Trail Blazer X',
      slug: 'trail-blazer-x',
      description: 'Aggressive mountain bike for advanced trails',
      price: 1599.99,
      type: ProductType.BICYCLE,
      imageUrl:
        'https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?q=80&w=1000',
      category: {
        connect: { id: mountainSportsCategory.id },
      },
    },
  });

  // Helper function to create properties and options for a product
  async function createPropertiesForProduct(
    productSlug: string,
    properties: Array<{
      name: string;
      options: string[];
      incompatibilities?: Array<{
        option: string;
        incompatibleWith: string[];
      }>;
    }>,
  ) {
    const product = await prisma.product.findUnique({
      where: { slug: productSlug },
    });

    if (!product) return;

    interface CreatedOption {
      id: string;
      name: string;
      propertyId: string;
    }

    const createdOptions: Record<string, CreatedOption> = {};

    for (const property of properties) {
      const existingProperty = await prisma.productProperty.findFirst({
        where: {
          name: property.name,
          productId: product.id,
        },
      });

      if (existingProperty) continue;

      const productProperty = await prisma.productProperty.create({
        data: {
          name: property.name,
          productId: product.id,
        },
      });

      // Create options for this property
      for (const optionName of property.options) {
        const option = await prisma.productPropertyOption.create({
          data: {
            name: optionName,
            propertyId: productProperty.id,
          },
        });
        createdOptions[optionName] = option;
      }
    }

    // Add incompatibilities after all options are created
    for (const property of properties) {
      if (property.incompatibilities) {
        for (const incompatibility of property.incompatibilities) {
          const option = createdOptions[incompatibility.option];
          const incompatibleOptions = incompatibility.incompatibleWith
            .map((name) => createdOptions[name])
            .filter((opt): opt is CreatedOption => opt !== undefined);

          if (option && incompatibleOptions.length > 0) {
            await prisma.productPropertyOption.update({
              where: { id: option.id },
              data: {
                incompatibleWith: {
                  connect: incompatibleOptions.map((opt) => ({ id: opt.id })),
                },
              },
            });
          }
        }
      }
    }
  }

  // Create properties for Road Master Elite
  await createPropertiesForProduct('road-master-elite', [
    {
      name: 'Frame Material',
      options: ['Carbon Fiber', 'Aluminum', 'Steel'],
    },
    {
      name: 'Handlebar Style',
      options: ['Drop Bar', 'Aero Bar', 'Flat Bar'],
      incompatibilities: [
        {
          option: 'Aero Bar',
          incompatibleWith: ['Flat Bar'],
        },
      ],
    },
    {
      name: 'Tire Width',
      options: ['23mm', '25mm', '28mm', '32mm'],
    },
    {
      name: 'Groupset',
      options: ['Shimano 105', 'Ultegra', 'Dura-Ace'],
    },
    {
      name: 'Brake Type',
      options: ['Rim Brakes', 'Disc Brakes'],
      incompatibilities: [
        {
          option: 'Disc Brakes',
          incompatibleWith: ['23mm'], // Disc brakes typically need wider tires
        },
      ],
    },
  ]);

  // Create properties for Urban Commuter Deluxe
  await createPropertiesForProduct('urban-commuter-deluxe', [
    {
      name: 'Frame Style',
      options: ['Step-Through', 'Traditional', 'Mixte'],
    },
    {
      name: 'Gear System',
      options: [
        'Single Speed',
        'Internal Hub 3-Speed',
        'Internal Hub 7-Speed',
        'Derailleur System',
      ],
    },
    {
      name: 'Accessories',
      options: ['Front Basket', 'Rear Rack', 'Fenders', 'Lights Package'],
    },
    {
      name: 'Tire Style',
      options: ['Puncture Resistant', 'Standard City', 'Comfort Plus'],
    },
    {
      name: 'Color Scheme',
      options: ['Classic Black', 'Urban Grey', 'Navy Blue', 'Forest Green'],
    },
  ]);

  // Create properties for Trail Blazer X
  await createPropertiesForProduct('trail-blazer-x', [
    {
      name: 'Suspension Type',
      options: ['Full Suspension', 'Hardtail'],
    },
    {
      name: 'Fork Travel',
      options: ['100mm', '120mm', '140mm', '160mm'],
      incompatibilities: [
        {
          option: '160mm',
          incompatibleWith: ['Hardtail'], // Long travel forks typically not used with hardtails
        },
      ],
    },
    {
      name: 'Wheel Size',
      options: ['27.5"', '29"', '27.5" Plus'],
    },
    {
      name: 'Drivetrain',
      options: ['1x11 Speed', '1x12 Speed', '2x10 Speed'],
    },
    {
      name: 'Brake System',
      options: [
        'Hydraulic Disc 180mm',
        'Hydraulic Disc 200mm',
        'Hydraulic Disc 203mm',
      ],
    },
  ]);

  // Create Product Properties and Options for Mountain Explorer Pro
  const mountainExplorerPro = await prisma.product.findUnique({
    where: { slug: 'mountain-explorer-pro' },
  });

  if (mountainExplorerPro) {
    // Frame Type Property
    const frameTypeProperty = await prisma.productProperty.create({
      data: {
        name: 'Frame Type',
        productId: mountainExplorerPro.id,
      },
    });

    const [diamond, stepThrough, fullSuspension] = await Promise.all([
      prisma.productPropertyOption.create({
        data: {
          name: 'Diamond',
          propertyId: frameTypeProperty.id,
        },
      }),
      prisma.productPropertyOption.create({
        data: {
          name: 'Step-through',
          propertyId: frameTypeProperty.id,
        },
      }),
      prisma.productPropertyOption.create({
        data: {
          name: 'Full-suspension',
          propertyId: frameTypeProperty.id,
        },
      }),
    ]);

    // Frame Finish Property
    const frameFinishProperty = await prisma.productProperty.create({
      data: {
        name: 'Frame Finish',
        productId: mountainExplorerPro.id,
      },
    });

    await Promise.all([
      prisma.productPropertyOption.create({
        data: {
          name: 'Matte',
          propertyId: frameFinishProperty.id,
        },
      }),
      prisma.productPropertyOption.create({
        data: {
          name: 'Shiny',
          propertyId: frameFinishProperty.id,
        },
      }),
    ]);

    // Wheels Property
    const wheelsProperty = await prisma.productProperty.create({
      data: {
        name: 'Wheels',
        productId: mountainExplorerPro.id,
      },
    });

    const [mountainWheels, fatBikeWheels] = await Promise.all([
      prisma.productPropertyOption.create({
        data: {
          name: 'Mountain wheels',
          propertyId: wheelsProperty.id,
        },
      }),
      prisma.productPropertyOption.create({
        data: {
          name: 'Fat bike wheels',
          propertyId: wheelsProperty.id,
        },
      }),
    ]);

    // Rim Color Property
    const rimColorProperty = await prisma.productProperty.create({
      data: {
        name: 'Rim Color',
        productId: mountainExplorerPro.id,
      },
    });

    const redRim = await prisma.productPropertyOption.create({
      data: {
        name: 'Red',
        propertyId: rimColorProperty.id,
      },
    });

    await Promise.all([
      prisma.productPropertyOption.create({
        data: {
          name: 'Black',
          propertyId: rimColorProperty.id,
        },
      }),
      prisma.productPropertyOption.create({
        data: {
          name: 'Blue',
          propertyId: rimColorProperty.id,
        },
      }),
    ]);

    // Chain Property
    const chainProperty = await prisma.productProperty.create({
      data: {
        name: 'Chain',
        productId: mountainExplorerPro.id,
      },
    });

    await Promise.all([
      prisma.productPropertyOption.create({
        data: {
          name: 'Single-speed chain',
          propertyId: chainProperty.id,
        },
      }),
      prisma.productPropertyOption.create({
        data: {
          name: '8-speed chain',
          propertyId: chainProperty.id,
        },
      }),
    ]);

    // Add incompatibilities
    // Diamond and Step-through frames are incompatible with mountain wheels
    await Promise.all([
      // Diamond frame incompatibilities
      prisma.productPropertyOption.update({
        where: { id: diamond.id },
        data: {
          incompatibleWith: {
            connect: [{ id: mountainWheels.id }],
          },
        },
      }),
      // Step-through frame incompatibilities
      prisma.productPropertyOption.update({
        where: { id: stepThrough.id },
        data: {
          incompatibleWith: {
            connect: [{ id: mountainWheels.id }],
          },
        },
      }),
      // Full suspension frame is optimized for mountain wheels, so it's incompatible with fat bike wheels
      prisma.productPropertyOption.update({
        where: { id: fullSuspension.id },
        data: {
          incompatibleWith: {
            connect: [{ id: fatBikeWheels.id }],
          },
        },
      }),
      // Fat bike wheels can't have red rims
      prisma.productPropertyOption.update({
        where: { id: fatBikeWheels.id },
        data: {
          incompatibleWith: {
            connect: [{ id: redRim.id }],
          },
        },
      }),
    ]);
  }

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
