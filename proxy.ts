import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  if (
    (token &&
      (url.pathname.startsWith("/sign-up") ||
        url.pathname.startsWith("/sign-in") ||
        url.pathname.startsWith("/verify"))) ||
    url.pathname.startsWith("/")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/sign-in", "/sign-up", "/", "/dashboard:path*", "/verify:path*"],
};
