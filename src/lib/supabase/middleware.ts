import { environment } from "@/environments/environment";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  const { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } = environment;

  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const AUTH_ONLY_ROUTES = ["/login", "/forgot-password"];
  const PUBLIC_PREFIXES = ["/auth", "/reset-password"];

  const pathname = request.nextUrl.pathname;
  const isAuthOnlyRoute = AUTH_ONLY_ROUTES.some((r) => pathname.startsWith(r));
  const isPublicPrefix = PUBLIC_PREFIXES.some((r) => pathname.startsWith(r));

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isAuthOnlyRoute && !isPublicPrefix) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && isAuthOnlyRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
};
