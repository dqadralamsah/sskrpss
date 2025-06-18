import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth();

  const publicPath = ['/login', '/unauthorized'];
  const isPublic = publicPath.includes(pathname);

  const rolePaths: Record<string, string> = {
    Admin: '/admin',
    Purchasing: '/purchasing',
    Warehouse: '/warehouse',
  };

  // Not Session and Not Login
  if (!session && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Logged In but user tries to access public pages => dierct to page role
  if (session && isPublic) {
    const redirectPath = rolePaths[session.user.role];

    if (redirectPath) {
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  for (const [role, route] of Object.entries(rolePaths)) {
    if (pathname.startsWith(route) && session?.user?.role !== role) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/admin/:path*', '/purchasing/:path*', '/warehouse/:path*'],
};
