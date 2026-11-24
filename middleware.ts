// Next discovers middleware next to the current root app/ directory.
export { middleware } from "./src/middleware";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|brand/|editorial/|maps/).*)"],
};
