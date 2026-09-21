import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login', '/register', '/api', '/preview', '/site', '/sitemap.xml', '/robots.txt'];
const ADMIN_PATHS = ['/dashboard', '/pages'];

export default async function proxy(req: NextRequest) {
  const { pathname, hostname } = req.nextUrl;

  // 1. Check custom domains (e.g., custom domains mapped to PageForge)
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  if (!isLocalhost && !hostname.includes('pageforge')) {
    const url = req.nextUrl.clone();
    url.pathname = `/site${pathname}`;
    return NextResponse.rewrite(url);
  }

  // 2. Protect admin paths
  if (ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    const token =
      req.cookies.get('authjs.session-token') ||
      req.cookies.get('next-auth.session-token') ||
      req.cookies.get('__Secure-authjs.session-token') ||
      req.cookies.get('__Secure-next-auth.session-token');

    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
  }

  // 3. Allow internal/static/app paths directly
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // 4. Rewrite all public site URLs (e.g. /, /test, /cakes, /track-order) to /site dynamic renderer
  const url = req.nextUrl.clone();
  url.pathname = pathname === '/' ? '/site' : `/site${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
