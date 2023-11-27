/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";
import { env } from "~/env.mjs";
import { db } from "~/server/db";
import { loginSchema } from "~/validation/validAuth";
import bcrypt from "bcrypt";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const defaultAuthOptions = {
  pages: {
    signIn: "/login",
    newUser: "/signup",
  },

  callbacks: {
    session: ({ token, session, user }) => {
      console.log("session :>> ", session, user);
      return {
        ...session,
        user: {
          ...session.user,
          id: token?.id ?? user.id,
        },
      };
    },
    jwt: ({ token, user, account }) => {
      if (user) {
        return {
          ...token,
          id: user.id,
        };
      }
      return token;
    },
  },

  debug: process.env.NODE_ENV === "development",

  session: {
    maxAge: 1 * 24 * 60 * 60,
  },

  jwt: {
    maxAge: 1 * 24 * 30 * 60,
  },

  adapter: PrismaAdapter(db),

  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
      
    }),
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const cred = await loginSchema.parseAsync(credentials);
        const user = await db.user.findFirst({ where: { email: cred.email } });

        if (!user) {
          console.log("User scope", user);
          return null;
        }
        const isValidPassword = bcrypt.compareSync(
          cred.password,
          user.password!,
        );

        if (!isValidPassword) {
          return null;
        }

        return user;
      },
    }),
  ],
  events: {
    async signOut({ session }) {
      const { sessionToken = "" } = session as unknown as {
        sessionToken?: string;
      };

      if (sessionToken) {
        await db.session.deleteMany({
          where: {
            sessionToken,
          },
        });
      }
    },
  },
} satisfies NextAuthOptions;

export const getServerAuthSession = () => getServerSession(defaultAuthOptions);
