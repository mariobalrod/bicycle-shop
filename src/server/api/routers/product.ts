import { ProductType } from '@prisma/client';
import { z } from 'zod';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';

export const productRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }),

  list: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        offset: z.number().optional(),
        categoryId: z.string().optional(),
        type: z.nativeEnum(ProductType).optional(),
        hasStock: z.boolean().optional(),
        search: z.string().optional(),
        sortBy: z.enum(['createdAt', 'price', 'name']).optional(),
        sortOrder: z.enum(['asc', 'desc']).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.product.findMany({
        include: {
          category: true,
        },
        where: {
          ...(input.categoryId && { categoryId: input.categoryId }),
          ...(input.type && { type: input.type }),
          ...(input.hasStock !== undefined && { hasStock: input.hasStock }),
          ...(input.search && {
            name: { contains: input.search, mode: 'insensitive' },
          }),
        },
        orderBy: {
          [input.sortBy ?? 'createdAt']: input.sortOrder ?? 'desc',
        },
        take: input.limit ?? 10,
        skip: input.offset ?? 0,
      });
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.product.findUnique({
        where: { slug: input.slug },
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
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.product.findUnique({
        where: { id: input.id },
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
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        price: z.number(),
        type: z.nativeEnum(ProductType),
        imageUrl: z.string(),
        hasStock: z.boolean().default(true),
        categoryId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.product.create({
        data: { ...input, slug: input.name.toLowerCase().replace(/ /g, '-') },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().optional(),
        price: z.number(),
        type: z.nativeEnum(ProductType),
        imageUrl: z.string(),
        hasStock: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.product.update({
        where: { id },
        data: { ...data, slug: data.name.toLowerCase().replace(/ /g, '-') },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.product.delete({
        where: { id: input.id },
      });
    }),
});
