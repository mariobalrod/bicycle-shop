import { describe, it, expect } from 'vitest';

import { buildQueryKey } from './index';

describe('buildQueryKey', () => {
  it('should return an array with query and an object with type when no input is provided', () => {
    const query = ['users'];
    const result = buildQueryKey(query);

    expect(result).toEqual([query, { type: 'query' }]);
  });

  it('should return an array with query and an object with input and type when input is provided', () => {
    const query = ['users'];
    const input = { id: 1, name: 'John' };
    const result = buildQueryKey(query, input);

    expect(result).toEqual([query, { input, type: 'query' }]);
  });

  it('should handle a query array with multiple elements', () => {
    const query = ['users', 'details', 'profile'];
    const result = buildQueryKey(query);

    expect(result).toEqual([query, { type: 'query' }]);
  });

  it('should handle an empty input', () => {
    const query = ['users'];
    const input = {};
    const result = buildQueryKey(query, input);

    expect(result).toEqual([query, { input, type: 'query' }]);
  });

  it('should handle an input with null or undefined values', () => {
    const query = ['users'];
    const input = { id: null, name: undefined };
    const result = buildQueryKey(query, input);

    expect(result).toEqual([query, { input, type: 'query' }]);
  });

  it('should preserve the original query array reference', () => {
    const query = ['users'];
    const result = buildQueryKey(query);

    expect(result[0]).toBe(query);
  });

  it('should create a new object for the second element of the result', () => {
    const query = ['users'];
    const input = { id: 1 };
    const result = buildQueryKey(query, input);

    expect(result[1]).not.toBe(input);
    expect(typeof result[1] === 'object' && !Array.isArray(result[1])).toBe(
      true,
    );

    // @ts-expect-error - We know result[1] has an input property
    expect(result[1].input).toBe(input);
  });
});
