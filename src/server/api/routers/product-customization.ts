import { z } from 'zod';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

export const productCustomizationRouter = createTRPCRouter({
  getProductProperties: publicProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ ctx, input }) => {
      const properties = await ctx.db.productProperty.findMany({
        where: { productId: input.productId },
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

      return properties;
    }),

  createPropertyWithOptions: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        name: z.string(),
        options: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.productProperty.create({
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
    }),

  addPropertyOption: protectedProcedure
    .input(
      z.object({
        propertyId: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.productPropertyOption.create({
        data: {
          propertyId: input.propertyId,
          name: input.name,
        },
      });
    }),

  createOptionIncompatibility: protectedProcedure
    .input(
      z.object({
        optionId1: z.string(),
        optionId2: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.productPropertyOption.update({
        where: { id: input.optionId1 },
        data: {
          incompatibleWith: {
            connect: { id: input.optionId2 },
          },
        },
      });

      await ctx.db.productPropertyOption.update({
        where: { id: input.optionId2 },
        data: {
          incompatibleWith: {
            connect: { id: input.optionId1 },
          },
        },
      });

      return { success: true };
    }),

  removeOptionIncompatibility: protectedProcedure
    .input(
      z.object({
        optionId1: z.string(),
        optionId2: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.productPropertyOption.update({
        where: { id: input.optionId1 },
        data: {
          incompatibleWith: {
            disconnect: { id: input.optionId2 },
          },
        },
      });

      await ctx.db.productPropertyOption.update({
        where: { id: input.optionId2 },
        data: {
          incompatibleWith: {
            disconnect: { id: input.optionId1 },
          },
        },
      });

      return { success: true };
    }),

  updatePropertyName: protectedProcedure
    .input(
      z.object({
        propertyId: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.productProperty.update({
        where: { id: input.propertyId },
        data: { name: input.name },
      });
    }),

  updateOptionName: protectedProcedure
    .input(
      z.object({
        optionId: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.productPropertyOption.update({
        where: { id: input.optionId },
        data: { name: input.name },
      });
    }),

  deleteProperty: protectedProcedure
    .input(z.object({ propertyId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.productProperty.delete({
        where: { id: input.propertyId },
      });
    }),

  deleteOption: protectedProcedure
    .input(z.object({ optionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.productPropertyOption.delete({
        where: { id: input.optionId },
      });
    }),

  updateOptionStock: protectedProcedure
    .input(
      z.object({
        optionId: z.string(),
        hasStock: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.productPropertyOption.update({
        where: { id: input.optionId },
        data: { hasStock: input.hasStock },
      });
    }),
});
