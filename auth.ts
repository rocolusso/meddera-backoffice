import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { verifyTelegramIdToken } from "@/lib/auth/telegram-verify";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Credentials({
      id: "telegram",
      name: "Telegram",
      credentials: {
        idToken: { label: "ID Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.idToken) return null;

        const telegramUser = await verifyTelegramIdToken(
          credentials.idToken as string
        );
        if (!telegramUser) return null;

        const user = await prisma.user.findUnique({
          where: { telegramId: String(telegramUser.id) },
        });

        if (!user || !user.isActive) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          mustChangePassword: user.mustChangePassword,
        };
      },
    }),

    Credentials({
      id: "superadmin-credentials",
      name: "Superadmin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.passwordHash || user.role !== "SUPERADMIN") {
          return null;
        }

        if (!user.isActive) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );
        if (!passwordMatch) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          mustChangePassword: user.mustChangePassword,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  pages: {
    signIn: "/login",
    error: "/auth-error",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true;

      const dbUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: user.email ?? "" },
            { googleId: account.providerAccountId },
          ],
        },
      });

      if (!dbUser || !dbUser.isActive) {
        return "/access-denied";
      }

      if (!dbUser.googleId) {
        await prisma.user.update({
          where: { id: dbUser.id },
          data: { googleId: account.providerAccountId },
        });
      }

      // Attach extra fields for jwt callback
      (user as Record<string, unknown>).dbId = dbUser.id;
      (user as Record<string, unknown>).role = dbUser.role;
      (user as Record<string, unknown>).mustChangePassword =
        dbUser.mustChangePassword;

      return true;
    },

    async jwt({ token, user, trigger }) {
      if (trigger === "signIn" && user) {
        const u = user as Record<string, unknown>;
        token.userId = (u.dbId ?? u.id) as string;
        token.role = u.role as "DOCTOR" | "SUPERADMIN";
        token.mustChangePassword = (u.mustChangePassword ?? false) as boolean;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = (token.userId ?? "") as string;
      session.user.role = (token.role ?? "DOCTOR") as "DOCTOR" | "SUPERADMIN";
      session.user.mustChangePassword = (token.mustChangePassword ?? false) as boolean;
      return session;
    },
  },
});
