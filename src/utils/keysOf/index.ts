export const keysOf = <T extends Record<string, unknown>>(o: T) =>
  Object.keys(o) as (keyof typeof o)[];
