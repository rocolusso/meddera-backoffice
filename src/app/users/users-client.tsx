"use client";

import { useActionState, useState, useTransition } from "react";
import {
  createUser,
  updateUser,
  toggleUserActive,
  deleteUser,
  type CreateUserResult,
  type UserRow,
} from "@/lib/actions/user-actions";

type Props = { initialUsers: UserRow[] };

export default function UsersClient({ initialUsers }: Props) {
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  function handleUpdated(updated: UserRow) {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    setEditingId(null);
  }

  function handleCreated(newUser: UserRow) {
    setUsers((prev) => {
      const idx = prev.findIndex((u) => u.email === newUser.email);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = newUser;
        return next;
      }
      return [...prev, newUser];
    });
    setShowAddForm(false);
  }

  async function handleToggle(userId: string, isActive: boolean) {
    const res = await toggleUserActive(userId, isActive);
    if (res.success) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isActive: !isActive } : u))
      );
    }
  }

  async function handleDelete(userId: string) {
    const res = await deleteUser(userId);
    if (res.success) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    }
    setDeleteTargetId(null);
  }

  return (
    <div className="space-y-6">
      {/* Delete confirmation modal */}
      {deleteTargetId && (
        <DeleteConfirmModal
          user={users.find((u) => u.id === deleteTargetId)!}
          onConfirm={() => handleDelete(deleteTargetId)}
          onCancel={() => setDeleteTargetId(null)}
        />
      )}

      {/* Mobile: card list */}
      <div className="md:hidden space-y-3">
        {users.length === 0 && (
          <p className="text-center text-gray-400 py-8 bg-white rounded-2xl border border-gray-100">
            Нет пользователей
          </p>
        )}
        {users.map((u) =>
          editingId === u.id ? (
            <EditCard
              key={u.id}
              user={u}
              onSaved={handleUpdated}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <UserCard
              key={u.id}
              user={u}
              onEdit={() => setEditingId(u.id)}
              onToggle={handleToggle}
              onDelete={() => setDeleteTargetId(u.id)}
            />
          )
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
              <th className="px-4 py-3">Имя / Email</th>
              <th className="px-4 py-3">Роль</th>
              <th className="px-4 py-3">Telegram ID</th>
              <th className="px-4 py-3 text-center">Статус</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  Нет пользователей
                </td>
              </tr>
            )}
            {users.map((u) =>
              editingId === u.id ? (
                <EditRow
                  key={u.id}
                  user={u}
                  onSaved={handleUpdated}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <ViewRow
                  key={u.id}
                  user={u}
                  onEdit={() => setEditingId(u.id)}
                  onToggle={handleToggle}
                  onDelete={() => setDeleteTargetId(u.id)}
                />
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Add button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden>
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
          Добавить сотрудника
        </button>
      )}

      {/* Add form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-800">Новый сотрудник</h2>
            <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600 text-sm">
              ✕ Отмена
            </button>
          </div>
          <AddUserForm onSuccess={handleCreated} />
        </div>
      )}
    </div>
  );
}

// ─── Mobile: User Card ────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
      role === "SUPERADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
    }`}>
      {role === "SUPERADMIN" ? "Суперадмин" : "Врач"}
    </span>
  );
}

function UserCard({
  user,
  onEdit,
  onToggle,
  onDelete,
}: {
  user: UserRow;
  onEdit: () => void;
  onToggle: (id: string, active: boolean) => void;
  onDelete: () => void;
}) {
  const [togglePending, startToggle] = useTransition();

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-4 ${!user.isActive ? "opacity-60" : ""}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <p className="font-medium text-gray-900 text-sm truncate">{user.name}</p>
          <p className="text-xs text-gray-400 truncate">{user.email}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <RoleBadge role={user.role} />
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${user.isActive ? "bg-green-400" : "bg-gray-300"}`}
            title={user.isActive ? "Активен" : "Деактивирован"}
          />
        </div>
      </div>

      {user.telegramId && (
        <p className="text-xs text-gray-500 font-mono mb-3">
          Telegram: {user.telegramId}
        </p>
      )}

      <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
        <button
          onClick={onEdit}
          className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Изменить
        </button>
        <button
          disabled={togglePending}
          onClick={() => startToggle(() => onToggle(user.id, user.isActive))}
          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-40 ${
            user.isActive
              ? "border-amber-200 text-amber-600 hover:bg-amber-50"
              : "border-green-200 text-green-700 hover:bg-green-50"
          }`}
        >
          {togglePending ? "…" : user.isActive ? "Деактивировать" : "Активировать"}
        </button>
        {user.role !== "SUPERADMIN" && (
          <button
            onClick={onDelete}
            className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
          >
            Удалить
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Mobile: Edit Card ────────────────────────────────────────────────────────

function EditCard({
  user,
  onSaved,
  onCancel,
}: {
  user: UserRow;
  onSaved: (updated: UserRow) => void;
  onCancel: () => void;
}) {
  const [result, formAction, pending] = useActionState<CreateUserResult | null, FormData>(
    async (_prev, formData) => {
      const res = await updateUser(user.id, formData);
      if (res.success) {
        onSaved({
          ...user,
          name: (formData.get("name") as string).trim(),
          telegramId: (formData.get("telegramId") as string)?.trim() || null,
          googleId: (formData.get("googleId") as string)?.trim() || null,
        });
      }
      return res;
    },
    null
  );

  return (
    <div className="bg-blue-50/40 rounded-2xl border border-blue-200 p-4">
      <p className="text-xs font-semibold text-blue-700 mb-3">Редактирование: {user.name}</p>
      <form action={formAction} className="space-y-3">
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Имя *</label>
            <input
              name="name"
              type="text"
              required
              defaultValue={user.name}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Telegram ID</label>
            <input
              name="telegramId"
              type="text"
              defaultValue={user.telegramId ?? ""}
              placeholder="123456789"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Google ID</label>
            <input
              name="googleId"
              type="text"
              defaultValue={user.googleId ?? ""}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          {user.role === "SUPERADMIN" && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Новый пароль</label>
              <input
                name="password"
                type="password"
                placeholder="оставьте пустым чтобы не менять"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          )}
        </div>

        {result && !result.success && (
          <p className="text-xs text-red-600">{result.error}</p>
        )}

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={pending}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {pending ? "Сохраняю…" : "Сохранить"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Desktop: View row ────────────────────────────────────────────────────────

function ViewRow({
  user,
  onEdit,
  onToggle,
  onDelete,
}: {
  user: UserRow;
  onEdit: () => void;
  onToggle: (id: string, active: boolean) => void;
  onDelete: () => void;
}) {
  const [togglePending, startToggle] = useTransition();

  return (
    <tr className={`transition-colors hover:bg-gray-50/60 ${user.isActive ? "" : "opacity-50 bg-gray-50"}`}>
      <td className="px-4 py-3">
        <p className="font-medium text-gray-900">{user.name}</p>
        <p className="text-xs text-gray-400">{user.email}</p>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
          user.role === "SUPERADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
        }`}>
          {user.role === "SUPERADMIN" ? "Суперадмин" : "Врач"}
        </span>
      </td>
      <td className="px-4 py-3 text-gray-500 font-mono text-xs">
        {user.telegramId ?? <span className="text-gray-300">—</span>}
      </td>
      <td className="px-4 py-3 text-center">
        <span
          className={`inline-block w-2 h-2 rounded-full ${user.isActive ? "bg-green-400" : "bg-gray-300"}`}
          title={user.isActive ? "Активен" : "Деактивирован"}
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onEdit}
            className="text-xs px-3 py-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Изменить
          </button>
          <button
            disabled={togglePending}
            onClick={() => startToggle(() => onToggle(user.id, user.isActive))}
            className={`text-xs px-3 py-1 rounded-lg border transition-colors disabled:opacity-40 ${
              user.isActive
                ? "border-amber-200 text-amber-600 hover:bg-amber-50"
                : "border-green-200 text-green-700 hover:bg-green-50"
            }`}
          >
            {togglePending ? "…" : user.isActive ? "Деактивировать" : "Активировать"}
          </button>
          {user.role !== "SUPERADMIN" && (
            <button
              onClick={onDelete}
              className="text-xs px-3 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
            >
              Удалить
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

// ─── Desktop: Edit row (inline) ───────────────────────────────────────────────

function EditRow({
  user,
  onSaved,
  onCancel,
}: {
  user: UserRow;
  onSaved: (updated: UserRow) => void;
  onCancel: () => void;
}) {
  const [result, formAction, pending] = useActionState<CreateUserResult | null, FormData>(
    async (_prev, formData) => {
      const res = await updateUser(user.id, formData);
      if (res.success) {
        onSaved({
          ...user,
          name: (formData.get("name") as string).trim(),
          telegramId: (formData.get("telegramId") as string)?.trim() || null,
          googleId: (formData.get("googleId") as string)?.trim() || null,
        });
      }
      return res;
    },
    null
  );

  return (
    <tr className="bg-blue-50/40 border-l-2 border-blue-400">
      <td colSpan={5} className="px-4 py-4">
        <form action={formAction}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">Имя *</label>
              <input
                name="name"
                type="text"
                required
                defaultValue={user.name}
                className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">Telegram ID</label>
              <input
                name="telegramId"
                type="text"
                defaultValue={user.telegramId ?? ""}
                placeholder="123456789"
                className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">Google ID</label>
              <input
                name="googleId"
                type="text"
                defaultValue={user.googleId ?? ""}
                className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Новый пароль{user.role === "SUPERADMIN" ? "" : " (не нужен)"}
              </label>
              <input
                name="password"
                type="password"
                placeholder={user.role === "SUPERADMIN" ? "оставьте пустым чтобы не менять" : "только для суперадмина"}
                disabled={user.role !== "SUPERADMIN"}
                className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-50 disabled:text-gray-300"
              />
            </div>
          </div>

          {result && !result.success && (
            <p className="text-xs text-red-600 mb-3">{result.error}</p>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={pending}
              className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {pending ? "Сохраняю…" : "Сохранить"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
          </div>
        </form>
      </td>
    </tr>
  );
}

// ─── Delete confirmation modal ────────────────────────────────────────────────

function DeleteConfirmModal({
  user,
  onConfirm,
  onCancel,
}: {
  user: UserRow;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-full max-w-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-red-600" aria-hidden>
              <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Удалить пользователя?</p>
            <p className="text-sm text-gray-500">{user.name} ({user.email})</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Это действие необратимо. Пользователь потеряет доступ к системе.
        </p>
        <div className="flex gap-3">
          <button
            disabled={pending}
            onClick={() => startTransition(onConfirm)}
            className="flex-1 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {pending ? "Удаляю…" : "Удалить"}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2 text-sm text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Add user form ────────────────────────────────────────────────────────────

function AddUserForm({ onSuccess }: { onSuccess: (u: UserRow) => void }) {
  const [role, setRole] = useState<"DOCTOR" | "SUPERADMIN">("DOCTOR");
  const [result, formAction, pending] = useActionState<CreateUserResult | null, FormData>(
    async (_prev, formData) => {
      const res = await createUser(formData);
      if (res.success) {
        onSuccess({
          id: crypto.randomUUID(),
          email: (formData.get("email") as string).trim(),
          name: (formData.get("name") as string).trim(),
          role: formData.get("role") as "DOCTOR" | "SUPERADMIN",
          telegramId: (formData.get("telegramId") as string)?.trim() || null,
          googleId: null,
          isActive: true,
          mustChangePassword: formData.get("role") === "SUPERADMIN",
        });
      }
      return res;
    },
    null
  );

  return (
    <form action={formAction} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field id="email" label="Email *" type="email" required />
      <Field id="name" label="Имя *" type="text" required />

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Роль *</label>
        <select
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value as "DOCTOR" | "SUPERADMIN")}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="DOCTOR">Врач</option>
          <option value="SUPERADMIN">Суперадмин</option>
        </select>
      </div>

      <Field id="telegramId" label="Telegram ID (числовой)" type="text" placeholder="123456789" />

      {role === "SUPERADMIN" && (
        <Field id="password" label="Пароль *" type="password" required placeholder="••••••••" />
      )}

      {result && !result.success && (
        <div className="sm:col-span-2 rounded-lg px-4 py-3 text-sm bg-red-50 text-red-700 border border-red-200">
          {result.error}
        </div>
      )}

      <div className="sm:col-span-2 flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {pending ? "Сохраняю…" : "Сохранить"}
        </button>
      </div>
    </form>
  );
}

function Field({
  id, label, type, required, placeholder,
}: {
  id: string; label: string; type: string; required?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input
        id={id} name={id} type={type} required={required} placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
    </div>
  );
}
