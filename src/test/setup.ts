import { vi } from 'vitest';

vi.mock('@/env', () => ({
  env: {
    NEXTAUTH_SECRET: 'test-secret',
    NEXTAUTH_URL: 'http://localhost:3000',
  },
}));
