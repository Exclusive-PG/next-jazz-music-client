import { TRPCError } from "@trpc/server";
import { string, z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const uploadRouter = createTRPCRouter({
  getFiles: protectedProcedure.mutation(async ({ ctx, input }) => {
    return await ctx.db.track.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  deleteFile: protectedProcedure
    .input(
      z.object({
        trackId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { trackId } = input;
      console.log(input);
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
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { name, singer, url, ref, userId } = input;
        console.log(input);
        await ctx.db.track.create({
          data: {
            name: name,
            ref: ref,
            singer: singer,
            url: url,
            userId: userId,
          },
        });
      } catch (error) {
        console.log(error);
      }
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
      console.log(input);
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
