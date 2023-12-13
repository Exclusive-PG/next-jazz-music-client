import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import {
  type DefaultSession,
  getServerSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { loginSchema } from "~/domains/auth/validAuth";
import { env } from "~/env.mjs";
import { db } from "~/server/db";

/* eslint-disable */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
/* eslint-enable */

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
    newUser: "/signup",
  },
  callbacks: {
    session: ({ token, session, user }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token?.id ?? user.id,
        },
      };
    },
    jwt: ({ token, user }) => {
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
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "database",
    maxAge: 1 * 24 * 60 * 60,
  },
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
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
      const cookie = cookies().get("next-auth.session-token");
      if (cookie) {
        cookies().delete("next-auth.session-token");
      }
    },
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
