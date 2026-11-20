// import { NextRequest, NextResponse } from 'next/server';
// import createMiddleware from 'next-intl/middleware';
// import { routing } from './i18n/routing';
// import { jwtVerify } from 'jose'; 

// // 1. Setup next-intl middleware
// const intlMiddleware = createMiddleware(routing);

// // 2. Define protected route prefixes and their required roles
// const ROLE_PATH_MAP: Record<string, string> = {
//   '/candidate': 'candidate',
//   '/employer': 'employer',
//   '/admin': 'admin',
// };

// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // Strip locale prefix (/en, /si, /ta) to check the actual route
//   const pathnameWithoutLocale = pathname.replace(/^\/(en|si|ta)/, '') || '/';
  
//   const matchedPrefix = Object.keys(ROLE_PATH_MAP).find((prefix) =>
//     pathnameWithoutLocale.startsWith(prefix)
//   );

//   // If it's a protected route, verify JWT token
//   if (matchedPrefix) {
//     const token = req.cookies.get('access_token')?.value;
//     const locale = pathname.split('/')[1] || 'en';

//     if (!token) {
//       return NextResponse.redirect(new URL(`/${locale}/login?next=${pathname}`, req.url));
//     }

//     try {
//       // Verify JWT (Ensure JWT_SECRET matches your FastAPI backend)
//       const secret = new TextEncoder().encode(process.env.JWT_SECRET || "supersecretkey");
//       const { payload } = await jwtVerify(token, secret);
//       const userRole = payload.role as string;
//       const requiredRole = ROLE_PATH_MAP[matchedPrefix];

//       // Redirect mismatched roles to their correct dashboard
//       if (userRole !== requiredRole) {
//         return NextResponse.redirect(new URL(`/${locale}/${userRole}/dashboard`, req.url));
//       }
//     } catch (error) {
//       // Invalid or expired token
//       const response = NextResponse.redirect(new URL(`/${locale}/login`, req.url));
//       response.cookies.delete('access_token');
//       return response;
//     }
//   }

//   // Proceed with next-intl middleware for language routing
//   return intlMiddleware(req);
// }

// export const config = {
//   // Skip all internal paths (_next, api, public files)
//   matcher: ['/((?!api|_next|.*\\..*).*)'],
// };


import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};