import { auth } from "../../../auth";
import { redirect } from "next/navigation";

/**
 * Server-side auth guard for Server Components and Server Actions.
 * Redirects to /login if the user has no active session.
 * Use this in every protected page as a second layer of defence
 * alongside middleware.
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}
