import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login', '/register', '/api/auth', '/api/register', '/preview', '/site', '/api/seed', '/sitemap.xml', '/robots.txt'];
const ADMIN_PATHS = ['/dashboard', '/pages'];

export default async function proxy(req: NextRequest) {
  const { pathname, hostname } = req.nextUrl;

  // Check if it's a custom domain request (not localhost, not app.pageforge.io)
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  if (!isLocalhost && !hostname.includes('pageforge')) {
    // Custom domain — rewrite to site renderer
    const url = req.nextUrl.clone();
    url.pathname = `/site${pathname}`;
    return NextResponse.rewrite(url);
  }

  // Rewrite root '/' to '/site' so http://localhost:3001 renders the homepage directly
  if (pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = '/site';
    return NextResponse.rewrite(url);
  }

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Protect admin paths
  if (ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    const token =
      req.cookies.get('authjs.session-token') ||
      req.cookies.get('next-auth.session-token') ||
      req.cookies.get('__Secure-authjs.session-token') ||
      req.cookies.get('__Secure-next-auth.session-token');

    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
