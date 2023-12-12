import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const trackRouter = createTRPCRouter({
  getFiles: protectedProcedure.query(async ({ ctx }) => {
    const tracks = await ctx.db.track.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
    return tracks;
  }),
  deleteFile: protectedProcedure
    .input(
      z.object({
        trackId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { trackId } = input;
      return await ctx.db.track.delete({
        where: {
          id: trackId,
        },
      });
    }),
  addFile: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        singer: z.string(),
        ref: z.string(),
        url: z.string(),
        duration: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { name, singer, url, ref, duration } = input;
        await ctx.db.track.create({
          data: {
            name,
            ref,
            singer,
            url,
            duration,
            userId: ctx.session.user.id,
          },
        });
      } catch (error) {}
    }),
  updateFile: protectedProcedure
    .input(
      z.object({
        trackId: z.string(),
        url: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { trackId, url } = input;
      return await ctx.db.track.update({
        data: {
          url,
        },
        where: {
          id: trackId,
        },
      });
    }),
});
