import type { NextAuthConfig } from "next-auth";

// Edge Runtime compatible config — no Prisma, no bcrypt, no node:crypto.
// Used exclusively by middleware.ts.
export const authConfig: NextAuthConfig = {
  providers: [],
  trustHost: true,

  pages: {
    signIn: "/login",
    error: "/auth-error",
  },

  session: { strategy: "jwt" },

  callbacks: {
    authorized({ auth }) {
      return !!auth;
    },
  },
};
