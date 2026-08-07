import Link from "next/link";

export const metadata = { title: "Ошибка входа — Beauty Clinic Meddera" };

type Props = {
  searchParams: Promise<{ error?: string }>;
};

const ERROR_MESSAGES: Record<string, string> = {
  OAuthSignin: "Не удалось начать вход через OAuth.",
  OAuthCallback: "Ошибка при обработке ответа от OAuth-провайдера.",
  OAuthCreateAccount: "Не удалось создать аккаунт через OAuth.",
  OAuthAccountNotLinked:
    "Этот email уже используется с другим способом входа.",
  Callback: "Внутренняя ошибка при обработке входа.",
  Default: "Произошла непредвиденная ошибка при входе.",
};

export default async function AuthErrorPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const message =
    (error && ERROR_MESSAGES[error]) ?? ERROR_MESSAGES.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-sky-50 px-4">
      <div className="w-full max-w-sm text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="w-8 h-8 text-orange-500"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l5.654-4.654m5.965-3.641a3 3 0 0 0-4.243 0l-2.25 2.25a3 3 0 0 0 0 4.243"
            />
          </svg>
        </div>

        <h1 className="text-xl font-semibold text-gray-800 mb-3">
          Ошибка входа
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-2">{message}</p>
        {error && (
          <p className="text-xs text-gray-400 mb-8 font-mono">
            Код: {error}
          </p>
        )}

        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
              clipRule="evenodd"
            />
          </svg>
          Вернуться на страницу входа
        </Link>
      </div>
    </div>
  );
}
