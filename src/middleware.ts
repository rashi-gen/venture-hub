// middleware.ts
import authConfig from "@/auth.config";
import {
  apiAuthPrefix,
  authRoutes,
  CHANGE_PASSWORD_ROUTE,
  DEFAULT_LOGIN_REDIRECT,
  protectedRoutes,
  publicApis,
  publicRoutes,
} from "@/routes";
import NextAuth from "next-auth";
import { getToken, GetTokenParams } from "next-auth/jwt";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { auth, nextUrl } = req;
  const isLoggedIn = !!auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute  = publicRoutes.includes(nextUrl.pathname);
  const isPublicApi    = publicApis.some((api) => nextUrl.pathname.startsWith(api));
  const isAuthRoute    = authRoutes.includes(nextUrl.pathname);
  const isChangePasswordRoute = nextUrl.pathname === CHANGE_PASSWORD_ROUTE;

  // ── 1. Always allow NextAuth API routes ────────────────────────────────
  if (isApiAuthRoute) {
    return undefined;
  }

  // ── 2. Auth routes (login, register, etc.) ────────────────────────────
  if (isAuthRoute) {
    if (isLoggedIn) {
      // Logged-in users trying to visit /auth/login etc.
      // If they still need to change password, send them there instead
      const params: GetTokenParams = { req, secret: process.env.AUTH_SECRET! };
      if (process.env.NODE_ENV === "production") params.secureCookie = true;
      const token = await getToken(params);

      if (token?.mustChangePassword) {
        return Response.redirect(new URL(CHANGE_PASSWORD_ROUTE, nextUrl));
      }

      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return undefined;
  }

  // ── 3. Not logged in — redirect to login (except public routes/APIs) ──
  if (!isLoggedIn && !isPublicRoute && !isPublicApi) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  // ── 4. Logged-in users ─────────────────────────────────────────────────
  if (isLoggedIn) {
    const params: GetTokenParams = { req, secret: process.env.AUTH_SECRET! };
    if (process.env.NODE_ENV === "production") params.secureCookie = true;
    const token = await getToken(params);

    if (!token || !token.role) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // ── mustChangePassword guard ────────────────────────────────────────
    // If the user's account was created by an admin with a temp password,
    // block access to every page except /auth/change-password itself.
    if (token.mustChangePassword && !isChangePasswordRoute) {
      return NextResponse.redirect(new URL(CHANGE_PASSWORD_ROUTE, req.url));
    }

    // If they've already changed their password and land on /auth/change-password,
    // send them to the dashboard instead.
    if (!token.mustChangePassword && isChangePasswordRoute) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
    }

    // ── Role-based route protection ─────────────────────────────────────
    for (const pattern in protectedRoutes) {
      const regex = new RegExp(pattern);
      if (regex.test(nextUrl.pathname)) {
        const allowedRoles = protectedRoutes[pattern];
        if (!token.role || !allowedRoles.includes(token.role)) {
          return NextResponse.redirect(new URL("/auth/login", req.url));
        }
      }
    }
  }

  return undefined;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};