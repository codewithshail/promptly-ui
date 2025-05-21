import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const middleware = clerkMiddleware(async (auth, req) => {
  // Always treat all /sign-in and /sign-up subpaths as public
  const isPublicRoute =
    req.nextUrl.pathname === '/' ||
    req.nextUrl.pathname.startsWith('/apps') ||
    req.nextUrl.pathname.startsWith('/custom-ai') ||
    req.nextUrl.pathname.startsWith('/api/tools') ||
    req.nextUrl.pathname.startsWith('/api/categories') ||
    req.nextUrl.pathname.startsWith('/sign-in') ||
    req.nextUrl.pathname.startsWith('/sign-up');

  if (!isPublicRoute) {
    const { userId } = await auth();
    console.log('userId:', userId);
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      console.log('Redirecting to:', signInUrl.toString());
      return NextResponse.redirect(signInUrl);
    }
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