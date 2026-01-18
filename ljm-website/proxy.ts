import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  const publicRoutes = [
    "/",
    "/login",
    "/sign-up",
    "/check-email",
    "/forgot-password",
    "/update-password",
    "/error",
    "/confirm",
    "/events",
    "/articles",
    "/about",
    "/contact",
    "/donation",
  ];

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (
    isPublicRoute ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return supabaseResponse;
  }

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const { data: userData } = await supabase
    .from("users")
    .select("role, formcompleted")
    .eq("id", user.id)
    .single();

  const { data: volunteerStatus } = await supabase
    .from("volunteer_form")
    .select("status")
    .eq("id", user.id)
    .single();

  if (
    userData?.role !== "admin" &&
    !userData?.formcompleted &&
    pathname !== "/volunteerForm" &&
    pathname !== "/confirmation"
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/volunteerForm";
    return NextResponse.redirect(url);
  }

  if (
    userData?.role !== "admin" &&
    userData?.formcompleted &&
    volunteerStatus?.status === "Pending" &&
    !pathname.startsWith("/confirmation")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/confirmation";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/dashboard")) {
    if (userData?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/UserDashboard";
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/UserDashboard")) {
    if (userData?.role === "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    if (volunteerStatus?.status !== "Approved") {
      const url = request.nextUrl.clone();
      url.pathname = "/confirmation";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
