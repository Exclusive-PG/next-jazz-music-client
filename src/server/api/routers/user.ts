import { TRPCError } from "@trpc/server";
import { string, z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import bcrypt from "bcrypt";

export const userRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  registerUser: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { email, password } = input;
      const userIsExists = await ctx.db.user.findFirst({ where: { email } });

      if (userIsExists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `User already with email ${email} already exists.`,
        });
      }
      const saltRounds = 8;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(password, salt);
      return await ctx.db.user.create({
        data: {
          email: email,
          password: hash,
        },
      });
    }),
});
