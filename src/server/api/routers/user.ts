import { TRPCError } from "@trpc/server";
import {} from "next-auth";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
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

      const createdUser = await ctx.db.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: email,
            password: hash,
          },
        });

        await tx.account.create({
          data: {
            userId: user.id,
            provider: "credentials",
            type: "credentials",
            providerAccountId: user.id,
          },
        });

        return user;
      });

      return createdUser;
    }),
});
