"use client";

import { useState, useActionState } from "react";
import { adminSignIn, type SignInResult } from "@/lib/actions/auth-actions";

export default function AdminLoginForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<SignInResult, FormData>(
    adminSignIn,
    null
  );

  return (
    <div className="mt-6 border-t border-gray-100 pt-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-xs text-gray-400 hover:text-gray-600 transition-colors w-full text-center"
      >
        {open ? "Скрыть" : "Вход для администратора"}
      </button>

      {open && (
        <form action={formAction} className="mt-4 flex flex-col gap-3">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-medium text-gray-600 mb-1"
            >
              Email
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="admin@clinic.md"
            />
          </div>
          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-medium text-gray-600 mb-1"
            >
              Пароль
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="••••••••"
            />
          </div>

          {state?.success === false && (
            <p className="text-xs text-red-600">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full py-2 text-sm font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {pending ? "Вход…" : "Войти"}
          </button>
        </form>
      )}
    </div>
  );
}
