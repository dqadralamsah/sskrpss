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

  // If the user is NOT logged in AND is trying to access a non-public route
  if (!session && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  //  If the user IS logged in BUT tries to access a public page
  if (session && isPublic) {
    const redirectPath = rolePaths[session.user.role];

    if (redirectPath) {
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // Loop through each role to restrict access to its own path
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
