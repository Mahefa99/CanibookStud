// Next discovers middleware next to the current root app/ directory.
export { middleware } from "./src/middleware";

export const config = {
  matcher: ["/((?!api/webhooks/stripe$|_next/static|_next/image|favicon.ico|brand/|editorial/|maps/).*)"],
};

