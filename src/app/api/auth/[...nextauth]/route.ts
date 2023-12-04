import NextAuth, { type NextAuthOptions } from "next-auth";
import { type NextRequest, type NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { v4 as uuidv4 } from "uuid";
import { encode, decode } from "next-auth/jwt";

import { cookies } from "next/headers";
import { authOptions } from "~/server/auth";

const generateSessionToken = () => {
  return randomUUID?.() ?? uuidv4();
};

const getExpiryDate = (maxAge: number, date = Date.now()) => {
  return new Date(date + maxAge * 1000);
};

function handler(
  request: NextRequest,
  context: { params: { nextauth: string[] } },
) {
  const { params } = context;
  const isCredentialsCallback =
    params?.nextauth?.includes("callback") &&
    params.nextauth.includes("credentials") &&
    request.method === "POST";

  return NextAuth(request, context, {
    ...authOptions,
    callbacks: {
      ...authOptions.callbacks,
      signIn: async ({ user }) => {
        if (isCredentialsCallback) {
          if (user) {
            const sessionToken = generateSessionToken();

            const sessionExpiry = getExpiryDate(authOptions.session!.maxAge!);


            await authOptions.adapter!.createSession?.({
              sessionToken,
              userId: user.id,
              expires: sessionExpiry,
            });

            cookies().set("next-auth.session-token", sessionToken, {
              expires: sessionExpiry,
            });
          }
        }
        return true;
      },
    },
    jwt: {
      ...authOptions.jwt,
      encode: async (arg) => {
        if (isCredentialsCallback) {
          const cookie = cookies().get("next-auth.session-token");

          if (cookie) return cookie.value;
          return "";
        }

        return encode(arg);
      },

      decode: async (arg) => {
        if (isCredentialsCallback) {
          return null;
        }
        return decode(arg);
      },
    },
  } as NextAuthOptions) as NextResponse;
}

export { handler as GET, handler as POST };
