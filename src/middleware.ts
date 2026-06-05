import { auth } from "@/lib/auth";

export default auth((req) => {
  if (!req.auth?.user) {
    return Response.redirect(new URL("/login", req.url));
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
