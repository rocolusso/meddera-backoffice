import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import CrmShell from "@/components/CrmShell";
import Providers from "@/components/providers";
import { auth } from "../../auth";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beauty Clinic Meddera — Login",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const isSuperAdmin = session?.user?.role === "SUPERADMIN";

  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Providers>
          <CrmShell isSuperAdmin={isSuperAdmin}>{children}</CrmShell>
        </Providers>
      </body>
    </html>
  );
}
