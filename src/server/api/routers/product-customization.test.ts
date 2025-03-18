import {
  PrismaClient,
  ProductProperty,
  ProductPropertyOption,
  UserRole,
} from '@prisma/client';
import { type Session } from 'next-auth';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { productCustomizationRouter } from './product-customization';

const mockProperty: ProductProperty = {
  id: '1',
  name: 'Test Property',
  productId: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockOption: ProductPropertyOption = {
  id: '1',
  name: 'Test Option',
  propertyId: '1',
  hasStock: true,
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
  .mockImplementation(() => Promise.resolve(mockProperty));
const mockUpdate = vi
  .fn()
  .mockImplementation(() => Promise.resolve(mockProperty));
const mockDelete = vi
  .fn()
  .mockImplementation(() => Promise.resolve(mockProperty));
const mockCreateOption = vi
  .fn()
  .mockImplementation(() => Promise.resolve(mockOption));
const mockUpdateOption = vi
  .fn()
  .mockImplementation(() => Promise.resolve(mockOption));
const mockDeleteOption = vi
  .fn()
  .mockImplementation(() => Promise.resolve(mockOption));

const mockDb = {
  productProperty: {
    findMany: mockFindMany,
    findUnique: mockFindUnique,
    create: mockCreate,
    update: mockUpdate,
    delete: mockDelete,
  },
  productPropertyOption: {
    create: mockCreateOption,
    update: mockUpdateOption,
    delete: mockDeleteOption,
  },
} as unknown as PrismaClient;

describe('productCustomizationRouter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProductProperties', () => {
    it('should return all properties for a product', async () => {
      const mockProperties = [mockProperty];
      mockFindMany.mockResolvedValue(mockProperties);

      const ctx = {
        db: mockDb,
        session: null,
        headers: new Headers(),
      };

      const caller = productCustomizationRouter.createCaller(ctx);
      const result = await caller.getProductProperties({ productId: '1' });

      expect(result).toEqual(mockProperties);
      expect(mockFindMany).toHaveBeenCalledWith({
        where: { productId: '1' },
        include: {
          options: {
            include: {
              incompatibleWith: true,
              incompatibleWithMe: true,
            },
            orderBy: {
              name: 'asc',
            },
          },
        },
      });
    });
  });

  describe('createPropertyWithOptions', () => {
    it('should create a new property with options', async () => {
      const input = {
        productId: '1',
        name: 'New Property',
        options: ['Option 1', 'Option 2'],
      };

      mockCreate.mockResolvedValue({
        ...mockProperty,
        options: [
          { ...mockOption, name: 'Option 1' },
          { ...mockOption, name: 'Option 2' },
        ],
      });

      const ctx = {
        db: mockDb,
        session: mockSession,
        headers: new Headers(),
      };

      const caller = productCustomizationRouter.createCaller(ctx);
      const result = await caller.createPropertyWithOptions(input);

      expect(result).toEqual({
        ...mockProperty,
        options: [
          { ...mockOption, name: 'Option 1' },
          { ...mockOption, name: 'Option 2' },
        ],
      });
      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          productId: input.productId,
          name: input.name,
          options: {
            create: input.options.map((name) => ({ name })),
          },
        },
        include: {
          options: true,
        },
      });
    });
  });

  describe('addPropertyOption', () => {
    it('should add a new option to a property', async () => {
      const input = {
        propertyId: '1',
        name: 'New Option',
      };

      mockCreateOption.mockResolvedValue(mockOption);

      const ctx = {
        db: mockDb,
        session: mockSession,
        headers: new Headers(),
      };

      const caller = productCustomizationRouter.createCaller(ctx);
      const result = await caller.addPropertyOption(input);

      expect(result).toEqual(mockOption);
      expect(mockCreateOption).toHaveBeenCalledWith({
        data: {
          propertyId: input.propertyId,
          name: input.name,
        },
      });
    });
  });

  describe('createOptionIncompatibility', () => {
    it('should create incompatibility between two options', async () => {
      const input = {
        optionId1: '1',
        optionId2: '2',
      };

      mockUpdateOption.mockResolvedValue(mockOption);

      const ctx = {
        db: mockDb,
        session: mockSession,
        headers: new Headers(),
      };

      const caller = productCustomizationRouter.createCaller(ctx);
      const result = await caller.createOptionIncompatibility(input);

      expect(result).toEqual({ success: true });
      expect(mockUpdateOption).toHaveBeenCalledTimes(2);
      expect(mockUpdateOption).toHaveBeenCalledWith({
        where: { id: input.optionId1 },
        data: {
          incompatibleWith: {
            connect: { id: input.optionId2 },
          },
        },
      });
    });
  });

  describe('removeOptionIncompatibility', () => {
    it('should remove incompatibility between two options', async () => {
      const input = {
        optionId1: '1',
        optionId2: '2',
      };

      mockUpdateOption.mockResolvedValue(mockOption);

      const ctx = {
        db: mockDb,
        session: mockSession,
        headers: new Headers(),
      };

      const caller = productCustomizationRouter.createCaller(ctx);
      const result = await caller.removeOptionIncompatibility(input);

      expect(result).toEqual({ success: true });
      expect(mockUpdateOption).toHaveBeenCalledTimes(2);
      expect(mockUpdateOption).toHaveBeenCalledWith({
        where: { id: input.optionId1 },
        data: {
          incompatibleWith: {
            disconnect: { id: input.optionId2 },
          },
        },
      });
    });
  });

  describe('updatePropertyName', () => {
    it('should update a property name', async () => {
      const input = {
        propertyId: '1',
        name: 'Updated Property',
      };

      mockUpdate.mockResolvedValue({ ...mockProperty, name: input.name });

      const ctx = {
        db: mockDb,
        session: mockSession,
        headers: new Headers(),
      };

      const caller = productCustomizationRouter.createCaller(ctx);
      const result = await caller.updatePropertyName(input);

      expect(result).toEqual({ ...mockProperty, name: input.name });
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: input.propertyId },
        data: { name: input.name },
      });
    });
  });

  describe('updateOptionName', () => {
    it('should update an option name', async () => {
      const input = {
        optionId: '1',
        name: 'Updated Option',
      };

      mockUpdateOption.mockResolvedValue({ ...mockOption, name: input.name });

      const ctx = {
        db: mockDb,
        session: mockSession,
        headers: new Headers(),
      };

      const caller = productCustomizationRouter.createCaller(ctx);
      const result = await caller.updateOptionName(input);

      expect(result).toEqual({ ...mockOption, name: input.name });
      expect(mockUpdateOption).toHaveBeenCalledWith({
        where: { id: input.optionId },
        data: { name: input.name },
      });
    });
  });

  describe('deleteProperty', () => {
    it('should delete a property', async () => {
      const input = {
        propertyId: '1',
      };

      mockDelete.mockResolvedValue(mockProperty);

      const ctx = {
        db: mockDb,
        session: mockSession,
        headers: new Headers(),
      };

      const caller = productCustomizationRouter.createCaller(ctx);
      const result = await caller.deleteProperty(input);

      expect(result).toEqual(mockProperty);
      expect(mockDelete).toHaveBeenCalledWith({
        where: { id: input.propertyId },
      });
    });
  });

  describe('deleteOption', () => {
    it('should delete an option', async () => {
      const input = {
        optionId: '1',
      };

      mockDeleteOption.mockResolvedValue(mockOption);

      const ctx = {
        db: mockDb,
        session: mockSession,
        headers: new Headers(),
      };

      const caller = productCustomizationRouter.createCaller(ctx);
      const result = await caller.deleteOption(input);

      expect(result).toEqual(mockOption);
      expect(mockDeleteOption).toHaveBeenCalledWith({
        where: { id: input.optionId },
      });
    });
  });

  describe('updateOptionStock', () => {
    it('should update option stock status', async () => {
      const input = {
        optionId: '1',
        hasStock: false,
      };

      mockUpdateOption.mockResolvedValue({
        ...mockOption,
        hasStock: input.hasStock,
      });

      const ctx = {
        db: mockDb,
        session: mockSession,
        headers: new Headers(),
      };

      const caller = productCustomizationRouter.createCaller(ctx);
      const result = await caller.updateOptionStock(input);

      expect(result).toEqual({ ...mockOption, hasStock: input.hasStock });
      expect(mockUpdateOption).toHaveBeenCalledWith({
        where: { id: input.optionId },
        data: { hasStock: input.hasStock },
      });
    });
  });
});
