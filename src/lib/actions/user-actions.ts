"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { auth } from "../../../auth";
import type { Role } from "@prisma/client";

async function requireSuperAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "SUPERADMIN") redirect("/");
}

export type CreateUserResult =
  | { success: true; message: string }
  | { success: false; error: string };

export type UserRow = {
  id: string;
  email: string;
  name: string;
  role: Role;
  telegramId: string | null;
  googleId: string | null;
  isActive: boolean;
  mustChangePassword: boolean;
};

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function getUsers(): Promise<UserRow[]> {
  await requireSuperAdmin();
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      telegramId: true,
      googleId: true,
      isActive: true,
      mustChangePassword: true,
    },
    orderBy: [{ role: "asc" }, { name: "asc" }],
  });
}

// ─── Create / Update ──────────────────────────────────────────────────────────

export async function createUser(
  formData: FormData
): Promise<CreateUserResult> {
  await requireSuperAdmin();

  const email = (formData.get("email") as string | null)?.trim();
  const name = (formData.get("name") as string | null)?.trim();
  const role = (formData.get("role") as string | null) as Role | null;
  const telegramId =
    (formData.get("telegramId") as string | null)?.trim() || null;
  const googleId =
    (formData.get("googleId") as string | null)?.trim() || null;
  const password =
    (formData.get("password") as string | null)?.trim() || null;

  if (!email || !name || !role) {
    return { success: false, error: "Email, имя и роль обязательны." };
  }

  if (!["DOCTOR", "SUPERADMIN"].includes(role)) {
    return { success: false, error: "Неверная роль." };
  }

  let passwordHash: string | null = null;
  if (role === "SUPERADMIN") {
    if (!password) {
      return { success: false, error: "Для суперадмина необходим пароль." };
    }
    passwordHash = await bcrypt.hash(password, 12);
  }

  try {
    await prisma.user.upsert({
      where: { email },
      update: {
        name,
        role,
        telegramId: telegramId ?? undefined,
        googleId: googleId ?? undefined,
        ...(passwordHash ? { passwordHash } : {}),
      },
      create: {
        email,
        name,
        role,
        telegramId,
        googleId,
        passwordHash,
        isActive: true,
        mustChangePassword: role === "SUPERADMIN",
      },
    });

    return { success: true, message: `Пользователь ${name} (${email}) сохранён.` };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("Unique constraint")) {
      return {
        success: false,
        error:
          "Пользователь с таким email, telegramId или googleId уже существует.",
      };
    }
    return { success: false, error: "Ошибка базы данных." };
  }
}

// ─── Update existing user ─────────────────────────────────────────────────────

export async function updateUser(
  userId: string,
  formData: FormData
): Promise<CreateUserResult> {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "SUPERADMIN") redirect("/");

  const name = (formData.get("name") as string | null)?.trim();
  const telegramId =
    (formData.get("telegramId") as string | null)?.trim() || null;
  const googleId =
    (formData.get("googleId") as string | null)?.trim() || null;
  const password =
    (formData.get("password") as string | null)?.trim() || null;

  if (!name) return { success: false, error: "Имя обязательно." };

  let passwordHash: string | undefined;
  if (password) {
    passwordHash = await bcrypt.hash(password, 12);
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        telegramId,
        googleId,
        ...(passwordHash ? { passwordHash, mustChangePassword: false } : {}),
      },
    });
    return { success: true, message: "Данные сохранены." };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("Unique constraint")) {
      return {
        success: false,
        error: "Telegram ID или Google ID уже используется другим пользователем.",
      };
    }
    return { success: false, error: "Ошибка базы данных." };
  }
}

// ─── Toggle active status ─────────────────────────────────────────────────────

export async function toggleUserActive(
  userId: string,
  currentlyActive: boolean
): Promise<CreateUserResult> {
  await requireSuperAdmin();
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: !currentlyActive },
    });
    return {
      success: true,
      message: `Пользователь ${currentlyActive ? "деактивирован" : "активирован"}.`,
    };
  } catch {
    return { success: false, error: "Ошибка обновления." };
  }
}

// ─── Delete user ──────────────────────────────────────────────────────────────

export async function deleteUser(userId: string): Promise<CreateUserResult> {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "SUPERADMIN") redirect("/");

  // Prevent self-deletion
  if (session.user.id === userId) {
    return { success: false, error: "Нельзя удалить собственный аккаунт." };
  }

  // Prevent deletion of any SUPERADMIN account
  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, name: true },
  });
  if (!target) {
    return { success: false, error: "Пользователь не найден." };
  }
  if (target.role === "SUPERADMIN") {
    return { success: false, error: "Нельзя удалить аккаунт суперадмина." };
  }

  try {
    await prisma.user.delete({ where: { id: userId } });
    return { success: true, message: "Пользователь удалён." };
  } catch {
    return { success: false, error: "Ошибка удаления." };
  }
}
