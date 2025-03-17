import { ProductType } from '@prisma/client';
import { z } from 'zod';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';

export const productRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        offset: z.number().optional(),
        categoryId: z.string().optional(),
        type: z.nativeEnum(ProductType).optional(),
        isActive: z.boolean().optional(),
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
          ...(input.isActive !== undefined && { isActive: input.isActive }),
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
        isActive: z.boolean().default(true),
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
        isActive: z.boolean(),
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
