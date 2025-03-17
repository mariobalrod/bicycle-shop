import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

export const userRouter = createTRPCRouter({
  me: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user.id) {
      return undefined;
    }

    const user = await ctx.db.user.findFirst({
      where: { id: ctx.session.user.id },
    });

    return user;
  }),
});
