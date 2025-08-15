import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const { setCookie } = await cookies();
  const { get } = await cookies();
  const token = await get("token");
  const isPublicPath = pathname === "/authenticate/sign-up" || pathname === "/authenticate/sign-in";


  if (!isPublicPath && (!token || token === "undefined"||token=="")){
      return NextResponse.redirect(new URL("/authenticate/sign-in", req.nextUrl));
  }

  if (isPublicPath && token) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/authenticate/:path*"],
};