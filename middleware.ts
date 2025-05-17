import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Augment the clerk middleware with custom logic
const middleware = clerkMiddleware((auth, req) => {
  // Define public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/apps",
    "/apps/",
    "/custom-ai",
    "/api/tools",
    "/api/categories"
  ];
  
  // Check if the current path matches any of the public routes
  const isPublicRoute = publicRoutes.some(route => 
    req.nextUrl.pathname === route || 
    req.nextUrl.pathname.startsWith(`${route}/`)
  );
  
  // Handle redirect if trying to access protected route while not authenticated
  if (!isPublicRoute) {
    const signInUrl = new URL('/login', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }
  
  // Continue with the request
  return NextResponse.next();
});

export default middleware;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};