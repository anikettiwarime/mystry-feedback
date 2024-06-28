import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

import {auth} from './app/api/auth/[...nextauth]/auth';

export async function middleware(request: NextRequest) {
  const session = await auth();
  const url = request.nextUrl;

  if (session?.user) {
    // If the user is authenticated and tries to access authentication-related pages, redirect them to the dashboard
    if (
      url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify')
    ) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else {
    // If the user is not authenticated and tries to access protected routes, redirect them to sign-in
    if (
      url.pathname.startsWith('/dashboard') ||
      url.pathname.startsWith('/verify')
      // || url.pathname === '/'
    ) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*'],
};
