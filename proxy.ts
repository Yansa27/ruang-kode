import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'ruangkode_super_secret_jwt_key_2026_modern_edtech'
);
const AUTH_COOKIE_NAME = 'ruangkode_session';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  let session: { id: string; email: string; name: string; role: string } | null = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      session = {
        id: payload.id as string,
        email: payload.email as string,
        name: payload.name as string,
        role: (payload.role as string) || 'STUDENT',
      };
    } catch {
      session = null;
    }
  }

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isProtectedPage =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/learn') ||
    pathname.startsWith('/profile');
  const isAdminPage = pathname.startsWith('/admin');

  // If visiting login/register while authenticated, redirect to dashboard
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If visiting protected page while not authenticated, redirect to login
  if ((isProtectedPage || isAdminPage) && !session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If visiting admin page while not admin, redirect to dashboard
  if (isAdminPage && session?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/learn/:path*',
    '/profile/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
};
