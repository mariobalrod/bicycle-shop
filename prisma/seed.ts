/* eslint-disable no-console */
import { PrismaClient, ProductType, UserRole } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await hash('Admin123.', 10);
  await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      email: 'admin@gmail.com',
      name: 'Admin User',
      role: UserRole.ADMIN,
      password: adminPassword,
    },
  });

  // Create customer user
  const customerPassword = await hash('Customer123.', 10);
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
        'https://i.postimg.cc/KzSg7mht/Explorer-Pro-Lateral-Vermelho-rabeira-azul-scaled.webp',
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
        'https://i.postimg.cc/DwNGZqCj/bicicleta-gravel-reacondicionada-ktm-strada-master-campagnolo-ekar-13v-fulcrum-rapid-red-3.avif',
      category: {
        connect: { id: mountainSportsCategory.id },
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
