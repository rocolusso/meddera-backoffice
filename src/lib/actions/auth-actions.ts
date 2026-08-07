"use server";

import { AuthError } from "next-auth";
import { signIn } from "../../../auth";

// Next.js implements redirect() by throwing an error with a special digest.
// We must re-throw it so the framework can handle the navigation.
function isNextRedirect(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "digest" in err &&
    typeof (err as { digest: unknown }).digest === "string" &&
    (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

export type SignInResult =
  | { success: false; error: string }
  | null;

export async function adminSignIn(
  _prev: SignInResult,
  formData: FormData
): Promise<SignInResult> {
  try {
    await signIn("superadmin-credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/",
    });
    return null;
  } catch (err) {
    // NEXT_REDIRECT is how Next.js App Router performs redirects — must re-throw.
    if (isNextRedirect(err)) throw err;

    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
          return { success: false, error: "Неверный email или пароль." };
        default:
          return { success: false, error: `Ошибка авторизации (${err.type}).` };
      }
    }

    console.error("[adminSignIn] unexpected error:", err);
    return { success: false, error: "Внутренняя ошибка. Попробуйте ещё раз." };
  }
}
