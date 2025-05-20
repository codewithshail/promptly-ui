import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const middleware = clerkMiddleware((auth, req) => {
  const publicRoutes = [
    "/",
    "/apps",
    "/apps/",
    "/custom-ai",
    "/sign-in",
    "/sign-up",
    "/api/tools",
    "/api/categories"
  ];

  const isPublicRoute = publicRoutes.some(route =>
    req.nextUrl.pathname === route ||
    req.nextUrl.pathname.startsWith(`${route}/`)
  );

  if (!isPublicRoute && !auth().userId) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export default middleware;

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
