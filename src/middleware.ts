import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Define the paths where you want the middleware to run
const protectedPaths = ["/dashboard", "/profile", "/settings"];

export async function middleware(request: NextRequest) {
  // Retrieve the token from the request
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Get the requested path
  const path = request.nextUrl.pathname;

  // Redirect from the root path
  if (path === "/") {
    if (token) {
      // Redirect authenticated users to the dashboard
      const dashboardUrl = new URL("/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    } else {
      // Redirect unauthenticated users to the sign-in page
      const signInUrl = new URL("/sign-in", request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Check if the path is protected
  if (protectedPaths.some((p) => path === p || path.startsWith(p))) {
    // If no token is found, redirect to the sign-in page
    if (!token) {
      const signInUrl = new URL("/sign-in", request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Specify paths for the middleware to apply to
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*", "/"],
};
