import { PrismaClient, User, UserRole } from '@prisma/client';
import { type Session } from 'next-auth';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { userRouter } from './user';

const mockUser: User = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  password: 'test-password',
  role: UserRole.USER,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockSession: Session = {
  user: { id: '1', role: UserRole.USER },
  expires: new Date().toISOString(),
};

const mockFindFirst = vi
  .fn()
  .mockImplementation(() => Promise.resolve(mockUser));

const mockDb = {
  user: {
    findFirst: mockFindFirst,
  },
} as unknown as PrismaClient;

describe('userRouter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('me', () => {
    it('should return undefined when no user is logged in', async () => {
      mockFindFirst.mockResolvedValue(null);

      const ctx = {
        db: mockDb,
        session: null,
        headers: new Headers(),
      };

      const caller = userRouter.createCaller(ctx);
      const result = await caller.me();

      expect(result).toBeUndefined();
      expect(mockFindFirst).not.toHaveBeenCalled();
    });

    it('should return user data when user is logged in', async () => {
      mockFindFirst.mockResolvedValue(mockUser);

      const ctx = {
        db: mockDb,
        session: mockSession,
        headers: new Headers(),
      };

      const caller = userRouter.createCaller(ctx);
      const result = await caller.me();

      expect(result).toEqual(mockUser);
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
