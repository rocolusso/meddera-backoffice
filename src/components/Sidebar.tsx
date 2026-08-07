"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "@/components/sign-out-button";

function UsersIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-4 h-4 shrink-0"
      aria-hidden
    >
      <path d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 8a2 2 0 1 1 4 0 2 2 0 0 1-4 0ZM1.49 15.326a.78.78 0 0 1-.358-.442 3 3 0 0 1 4.308-3.516 6.484 6.484 0 0 0-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 0 1-2.07-.655ZM16.44 15.98a4.96 4.96 0 0 0 1.966-2.636 3 3 0 0 1-4.243-4.243 6.484 6.484 0 0 0-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 0 1-2.07-.655 3 3 0 0 1 4.308-3.516.78.78 0 0 1-.358.442 6.484 6.484 0 0 0 1.905-3.959 3 3 0 0 1 4.243 4.243 4.96 4.96 0 0 0-1.966 2.636.78.78 0 0 1 .358.442 3 3 0 0 1-4.308 3.516 4.97 4.97 0 0 1 2.07.655c.039-.212.048-.432.025-.654a6.484 6.484 0 0 0 1.905-3.959Z" />
    </svg>
  );
}

function UserPlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-4 h-4 shrink-0"
      aria-hidden
    >
      <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074 0Z" />
      <path d="M15.75 7.5a.75.75 0 0 0-1.5 0v1.75H12.5a.75.75 0 0 0 0 1.5h1.75V12.5a.75.75 0 0 0 1.5 0v-1.75h1.75a.75.75 0 0 0 0-1.5H15.75V7.5Z" />
    </svg>
  );
}

function StaffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-4 h-4 shrink-0"
      aria-hidden
    >
      <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.465 7.465 0 0 1 14.5 16Z" />
    </svg>
  );
}

type NavItemProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick?: () => void;
};

function NavItem({ href, label, icon, active, onClick }: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={
        active
          ? "flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium bg-blue-50 text-blue-600 border-l-2 border-blue-600 rounded-r-lg"
          : "flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-2 border-transparent rounded-r-lg transition-colors"
      }
    >
      {icon}
      {label}
    </Link>
  );
}

type SidebarProps = {
  isSuperAdmin?: boolean;
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isSuperAdmin = false, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const isPatientsList = pathname === "/patients";
  const isAddPatient = pathname === "/patients/add";
  const isUsers = pathname === "/users";

  const sidebarContent = (
    <aside className="w-[220px] bg-white flex flex-col h-full">
      <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-800 leading-snug">
          Beauty Clinic Meddera
        </p>
        <button
          onClick={onClose}
          className="md:hidden p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Закрыть меню"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden>
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      </div>

      <nav className="py-2 flex flex-col flex-1 gap-0.5">
        <NavItem
          href="/patients"
          label="Все пациенты"
          icon={<UsersIcon />}
          active={isPatientsList}
          onClick={onClose}
        />
        <NavItem
          href="/patients/add"
          label="Добавить"
          icon={<UserPlusIcon />}
          active={isAddPatient}
          onClick={onClose}
        />
        {isSuperAdmin && (
          <>
            <div className="mx-3 my-2 h-px bg-gray-100" />
            <NavItem
              href="/users"
              label="Сотрудники"
              icon={<StaffIcon />}
              active={isUsers}
              onClick={onClose}
            />
          </>
        )}
      </nav>

      <div className="border-t border-gray-100 py-2">
        <SignOutButton />
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar — always visible */}
      <div className="hidden md:flex md:w-[220px] md:shrink-0 md:border-r md:border-gray-200 md:min-h-screen">
        {sidebarContent}
      </div>

      {/* Mobile drawer overlay */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={onClose}
          aria-hidden
        />
        {/* Drawer */}
        <div
          className={`absolute left-0 top-0 bottom-0 shadow-xl transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {sidebarContent}
        </div>
      </div>
    </>
  );
}
