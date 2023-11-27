

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import { env } from "~/env.mjs";
import { db } from "~/server/db";
import { loginSchema } from "~/domains/auth/validAuth";
import bcrypt from "bcrypt";

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

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
    newUser: "/signup",
  },
  callbacks: {
    session: ({ token, session }) => {
      console.log("Session Callback", { token, session });
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
      };
    },
    jwt: ({ token, user, account }) => {
      console.log("JWT Callback", { token, user });
      if (user) {
        return {
          ...token,
          id: user.id,
        };
      }
      return token;
    },
  },
  debug: true,
  session: {
    strategy: "jwt",
  },
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
        console.log("credentials", credentials);
        const cred = await loginSchema.parseAsync(credentials);
        const user = await db.user.findFirst({ where: { email: cred.email } });

        console.log("Cred", cred.email);
        console.log("User", user);
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
};

export const getServerAuthSession = () => getServerSession(authOptions);
