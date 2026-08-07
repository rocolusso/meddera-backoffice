"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

type CrmShellProps = {
  children: React.ReactNode;
  isSuperAdmin?: boolean;
};

function isStandaloneRoute(pathname: string): boolean {
  if (pathname === "/btn" || pathname.startsWith("/btn/")) {
    return true;
  }

  if (
    pathname === "/login" ||
    pathname === "/access-denied" ||
    pathname === "/auth-error" ||
    pathname.startsWith("/create-user")
  ) {
    return true;
  }

  return /^\/patients\/[^/]+\/print\/?$/.test(pathname);
}

function HamburgerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden>
      <path fillRule="evenodd" d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
    </svg>
  );
}

export default function CrmShell({ children, isSuperAdmin = false }: CrmShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isStandaloneRoute(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile top header */}
      <header className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 h-14 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-800">Beauty Clinic Meddera</p>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          aria-label="Открыть меню"
        >
          <HamburgerIcon />
        </button>
      </header>

      <div className="flex">
        <Sidebar
          isSuperAdmin={isSuperAdmin}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 p-4 md:p-6 min-w-0">{children}</main>
      </div>
    </div>
  );
}
