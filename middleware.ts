// Root middleware.ts — required for Vercel build compatibility.
// Next.js 16 renamed middleware.ts → proxy.ts, but Vercel CLI still
// expects .next/server/middleware.js.nft.json. This file generates it.
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
