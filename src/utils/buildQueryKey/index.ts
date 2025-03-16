export const buildQueryKey = (
  query: string[],
  input?: Record<string, unknown>,
) => [query, { ...(input ? { input } : {}), type: 'query' }];
