import { PrismaClient, Product, ProductType, UserRole } from '@prisma/client';
import { type Session } from 'next-auth';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { productRouter } from './product';

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  slug: 'test-product',
  imageUrl: 'https://example.com/image.jpg',
  description: null,
  price: 100,
  type: ProductType.BICYCLE,
  hasStock: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  categoryId: '1',
};

const mockProductDetail: Product = {
  id: '1',
  name: 'Test Product',
  slug: 'test-product',
  imageUrl: 'https://example.com/image.jpg',
  description: null,
  price: 100,
  type: ProductType.BICYCLE,
  hasStock: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  categoryId: '1',
};

const mockSession: Session = {
  user: { id: '1', role: UserRole.ADMIN },
  expires: new Date().toISOString(),
};

const mockFindMany = vi.fn().mockImplementation(() => Promise.resolve([]));
const mockFindUnique = vi.fn().mockImplementation(() => Promise.resolve(null));
const mockCreate = vi
  .fn()
  .mockImplementation(() => Promise.resolve(mockProduct));
const mockUpdate = vi
  .fn()
  .mockImplementation(() => Promise.resolve(mockProduct));
const mockDelete = vi
  .fn()
  .mockImplementation(() => Promise.resolve(mockProduct));

const mockDb = {
  product: {
    findMany: mockFindMany,
    findUnique: mockFindUnique,
    create: mockCreate,
    update: mockUpdate,
    delete: mockDelete,
  },
} as unknown as PrismaClient;

describe('productRouter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all products with their categories', async () => {
      const mockProducts = [mockProduct];
      mockFindMany.mockResolvedValue(mockProducts);

      const ctx = {
        db: mockDb,
        session: null,
        headers: new Headers(),
      };

      const caller = productRouter.createCaller(ctx);
      const result = await caller.getAll();

      expect(result).toEqual(mockProducts);
      expect(mockFindMany).toHaveBeenCalledWith({
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('list with filters', () => {
    it('should return all products with filters applied', async () => {
      const mockProducts = [mockProduct];
      mockFindMany.mockResolvedValue(mockProducts);

      const ctx = {
        db: mockDb,
        session: null,
        headers: new Headers(),
      };

      const caller = productRouter.createCaller(ctx);
      const result = await caller.list({
        categoryId: '1',
        type: ProductType.BICYCLE,
        hasStock: true,
        search: 'test',
      });

      expect(result).toEqual(mockProducts);
      expect(mockFindMany).toHaveBeenCalledWith({
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        where: {
          categoryId: '1',
          type: ProductType.BICYCLE,
          hasStock: true,
          name: { contains: 'test', mode: 'insensitive' },
        },
        take: 10,
        skip: 0,
      });
    });
  });

  describe('getBySlug', () => {
    it('should return a product by slug', async () => {
      mockFindUnique.mockResolvedValue(mockProductDetail);

      const ctx = {
        db: mockDb,
        session: null,
        headers: new Headers(),
      };

      const caller = productRouter.createCaller(ctx);
      const result = await caller.getBySlug({ slug: 'test-product' });

      expect(result).toEqual(mockProductDetail);
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { slug: 'test-product' },
        include: {
          category: true,
          properties: {
            include: {
              options: {
                include: { incompatibleWith: true, incompatibleWithMe: true },
              },
            },
          },
        },
      });
    });
  });

  describe('getById', () => {
    it('should return a product by id', async () => {
      mockFindUnique.mockResolvedValue(mockProductDetail);

      const ctx = {
        db: mockDb,
        session: null,
        headers: new Headers(),
      };

      const caller = productRouter.createCaller(ctx);
      const result = await caller.getById({ id: '1' });

      expect(result).toEqual(mockProductDetail);
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          category: true,
          properties: {
            include: {
              options: {
                include: { incompatibleWith: true, incompatibleWithMe: true },
              },
            },
          },
        },
      });
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const input = {
        name: 'New Product',
        description: 'Test Description',
        price: 100,
        type: ProductType.BICYCLE,
        imageUrl: 'https://example.com/image.jpg',
        categoryId: '1',
      };

      mockCreate.mockResolvedValue(mockProduct);

      const ctx = {
        db: mockDb,
        session: mockSession,
        headers: new Headers(),
      };

      const caller = productRouter.createCaller(ctx);
      const result = await caller.create(input);

      expect(result).toEqual(mockProduct);
      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          ...input,
          slug: 'new-product',
          hasStock: true,
        },
      });
    });
  });

  describe('update', () => {
    it('should update an existing product', async () => {
      const input = {
        id: '1',
        name: 'Updated Product',
        description: 'Updated Description',
        price: 200,
        type: ProductType.BICYCLE,
        imageUrl: 'https://example.com/updated-image.jpg',
        hasStock: true,
      };

      mockUpdate.mockResolvedValue(mockProduct);

      const ctx = {
        db: mockDb,
        session: mockSession,
        headers: new Headers(),
      };

      const caller = productRouter.createCaller(ctx);
      const result = await caller.update(input);

      expect(result).toEqual(mockProduct);
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          name: input.name,
          description: input.description,
          price: input.price,
          type: input.type,
          imageUrl: input.imageUrl,
          hasStock: input.hasStock,
          slug: 'updated-product',
        },
      });
    });
  });

  describe('delete', () => {
    it('should delete a product', async () => {
      mockDelete.mockResolvedValue(mockProduct);

      const ctx = {
        db: mockDb,
        session: mockSession,
        headers: new Headers(),
      };

      const caller = productRouter.createCaller(ctx);
      const result = await caller.delete({ id: '1' });

      expect(result).toEqual(mockProduct);
      expect(mockDelete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
