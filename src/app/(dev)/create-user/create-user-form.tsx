"use client";

import { useActionState } from "react";
import { createUser, type CreateUserResult } from "@/lib/actions/user-actions";

const initialState: CreateUserResult | null = null;

export default function CreateUserFormClient() {
  const [result, formAction, pending] = useActionState<
    CreateUserResult | null,
    FormData
  >(
    async (_prev, formData) => createUser(formData),
    initialState
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field id="email" label="Email *" type="email" required />
      <Field id="name" label="Имя *" type="text" required />

      <div>
        <label
          htmlFor="role"
          className="block text-xs font-medium text-gray-600 mb-1"
        >
          Роль *
        </label>
        <select
          id="role"
          name="role"
          required
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="DOCTOR">Врач (DOCTOR)</option>
          <option value="SUPERADMIN">Суперадмин (SUPERADMIN)</option>
        </select>
      </div>

      <Field
        id="telegramId"
        label="Telegram ID (числовой)"
        type="text"
        placeholder="123456789"
      />
      <Field id="googleId" label="Google ID (опционально)" type="text" />
      <Field
        id="password"
        label="Пароль (только для SUPERADMIN)"
        type="password"
        placeholder="••••••••"
      />

      {result && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            result.success
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {result.success ? result.message : result.error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors mt-2"
      >
        {pending ? "Сохраняю…" : "Сохранить"}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  type,
  required,
  placeholder,
}: {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-medium text-gray-600 mb-1"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
    </div>
  );
}
