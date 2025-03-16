import { describe, it, expect } from 'vitest';

import { keysOf } from '.';

describe('keysOf', () => {
  it('Should return an array', () => {
    expect(keysOf({ a: null, b: null, c: null })).toEqual(['a', 'b', 'c']);
  });

  it('Should return an empty array', () => {
    expect(keysOf({})).toEqual([]);
  });
});
