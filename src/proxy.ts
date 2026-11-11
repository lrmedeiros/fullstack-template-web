import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "session";

/**
 * Checagem otimista (só olha se o cookie existe) para redirecionar cedo.
 * A validação de verdade do token acontece na DAL (src/lib/dal.ts) e na API.
 */
export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);
  const isAuthPage = pathname === "/login" || pathname === "/register";

  // Sessão expirada: a DAL manda para /login?expired=1 e aqui o cookie é limpo.
  if (pathname === "/login" && searchParams.has("expired")) {
    const response = NextResponse.next();
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  if (pathname.startsWith("/dashboard") && !hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
