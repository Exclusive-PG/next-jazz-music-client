import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const protectedPages = ["/dashboard","/upload"]

export function middleware(req: NextRequest) {
  const cookie = cookies().get("next-auth.session-token");

  if (protectedPages.includes(req.nextUrl.pathname)) {
    if (!cookie) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
}
