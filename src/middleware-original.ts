import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Rutas que requieren autenticación
  const protectedRoutes = ['/dashboard', '/products', '/admin', '/profile'];
  
  // Rutas solo para admins
  const adminRoutes = ['/admin'];
  
  // Rutas de autenticación (no accesibles si ya está autenticado)
  const authRoutes = ['/login', '/register'];
  
  const { pathname } = request.nextUrl;
  
  // Obtener token de las cookies o localStorage (en el cliente)
  // Nota: En middleware solo podemos acceder a cookies, no a localStorage
  const token = request.cookies.get('token')?.value;
  
  // Verificar si la ruta actual está protegida
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.includes(pathname);
  
  // Si es una ruta protegida y no hay token, redirigir al login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Si es una ruta de autenticación y ya hay token, redirigir al dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Para rutas de admin, necesitaríamos verificar el rol del usuario
  // Esto requeriría decodificar el JWT, lo cual es más complejo en middleware
  // Por ahora, delegamos esta verificación a los componentes ProtectedRoute
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
