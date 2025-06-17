import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth();

  const publicPath = ['/login', '/unauthorized'];
  const isPublic = publicPath.includes(pathname);

  // Not Session and Not Login
  if (!session && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Loggedin user tries to access public pages
  if (session && isPublic) {
    const role = session.user.role.toLowerCase();

    return NextResponse.redirect(new URL(`/${role}`, request.url));
  }

  const rolePaths: Record<string, string> = {
    admin: '/admin',
    purchasing: '/purchasing',
    warehouse: '/warehouse',
  };

  for (const [role, route] of Object.entries(rolePaths)) {
    if (pathname.startsWith(route) && session?.user?.role?.toLocaleLowerCase() !== role) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // '/dashboard/:path*',
    '/login',
    '/admin/:path*',
    '/purchasing/:path*',
    '/warehouse/:path*',
  ],
};
