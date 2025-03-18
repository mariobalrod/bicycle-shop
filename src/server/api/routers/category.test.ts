import { Category, PrismaClient, UserRole } from '@prisma/client';
import { type Session } from 'next-auth';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { categoryRouter } from './category';

const mockCategory: Category = {
  id: '1',
  name: 'Test Category',
  slug: 'test-category',
  description: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockSession: Session = {
  user: { id: '1', role: UserRole.ADMIN },
  expires: new Date().toISOString(),
};

const mockFindMany = vi.fn().mockImplementation(() => Promise.resolve([]));
const mockFindUnique = vi.fn().mockImplementation(() => Promise.resolve(null));
const mockCreate = vi
  .fn()
  .mockImplementation(() => Promise.resolve(mockCategory));
const mockUpdate = vi
  .fn()
  .mockImplementation(() => Promise.resolve(mockCategory));
const mockDelete = vi
  .fn()
  .mockImplementation(() => Promise.resolve(mockCategory));

const mockDb = {
  category: {
    findMany: mockFindMany,
    findUnique: mockFindUnique,
    create: mockCreate,
    update: mockUpdate,
    delete: mockDelete,
  },
} as unknown as PrismaClient;

describe('categoryRouter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all categories with their products', async () => {
      const mockCategories = [mockCategory];
      mockFindMany.mockResolvedValue(mockCategories);

      const ctx = {
        db: mockDb,
        session: null,
        headers: new Headers(),
      };

      const caller = categoryRouter.createCaller(ctx);
      const result = await caller.getAll();

      expect(result).toEqual(mockCategories);
      expect(mockFindMany).toHaveBeenCalledWith({
        include: { products: true },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('getById', () => {
    it('should return a category by id', async () => {
      mockFindUnique.mockResolvedValue(mockCategory);

      const ctx = {
        db: mockDb,
        session: null,
        headers: new Headers(),
      };

      const caller = categoryRouter.createCaller(ctx);
      const result = await caller.getById({ id: '1' });

      expect(result).toEqual(mockCategory);
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { products: true },
      });
    });
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const input = {
        name: 'New Category',
        description: 'Test Description',
      };

      mockCreate.mockResolvedValue(mockCategory);

      const ctx = {
        db: mockDb,
        session: mockSession,
        headers: new Headers(),
      };

      const caller = categoryRouter.createCaller(ctx);
      const result = await caller.create(input);

      expect(result).toEqual(mockCategory);
      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          ...input,
          slug: 'new-category',
        },
      });
    });
  });

  describe('update', () => {
    it('should update an existing category', async () => {
      const input = {
        id: '1',
        name: 'Updated Category',
        description: 'Updated Description',
      };

      mockUpdate.mockResolvedValue(mockCategory);

      const ctx = {
        db: mockDb,
        session: mockSession,
        headers: new Headers(),
      };

      const caller = categoryRouter.createCaller(ctx);
      const result = await caller.update(input);

      expect(result).toEqual(mockCategory);
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          name: input.name,
          description: input.description,
          slug: 'updated-category',
        },
      });
    });
  });

  describe('delete', () => {
    it('should delete a category', async () => {
      mockDelete.mockResolvedValue(mockCategory);

      const ctx = {
        db: mockDb,
        session: mockSession,
        headers: new Headers(),
      };

      const caller = categoryRouter.createCaller(ctx);
      const result = await caller.delete({ id: '1' });

      expect(result).toEqual(mockCategory);
      expect(mockDelete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
