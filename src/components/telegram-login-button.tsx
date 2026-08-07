"use client";

import { useEffect, useRef, useState } from "react";
import { signIn } from "next-auth/react";

declare global {
  interface Window {
    Telegram?: {
      Login: {
        init: (options: TelegramInitOptions, callback: TelegramCallback) => void;
        open: (callback?: TelegramCallback) => void;
        auth: (options: TelegramInitOptions, callback: TelegramCallback) => void;
      };
    };
  }
}

interface TelegramInitOptions {
  client_id: number;
  scope?: string[];
  lang?: string;
  nonce?: string;
}

type TelegramCallback = (result: TelegramCallbackResult) => void;

interface TelegramCallbackResult {
  id_token?: string;
  user?: Record<string, unknown>;
  error?: string;
}

export default function TelegramLoginButton() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_TELEGRAM_CLIENT_ID;
    if (!clientId) return;

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-login.js";
    script.async = true;
    script.onload = () => setReady(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_TELEGRAM_CLIENT_ID;
    if (!clientId || !window.Telegram?.Login) return;

    window.Telegram.Login.auth(
      { client_id: Number(clientId), scope: ["profile"] },
      async (result) => {
        if (result.error || !result.id_token) {
          setError("Ошибка входа через Telegram. Попробуйте ещё раз.");
          return;
        }

        setError(null);
        setLoading(true);
        try {
          const res = await signIn("telegram", {
            idToken: result.id_token,
            redirect: false,
          });
          if (res?.error || res?.ok === false) {
            setError("Аккаунт не найден. Обратитесь к администратору клиники.");
          } else if (res?.url) {
            window.location.href = res.url;
          } else {
            window.location.href = "/";
          }
        } catch {
          setError("Ошибка входа. Попробуйте ещё раз.");
        } finally {
          setLoading(false);
        }
      }
    );
  };

  if (!process.env.NEXT_PUBLIC_TELEGRAM_CLIENT_ID) return null;

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-2">
      {loading ? (
        <p className="text-sm text-gray-500">Выполняется вход…</p>
      ) : (
        <button
          onClick={handleLogin}
          disabled={!ready}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-gray-700 shadow-sm transition-colors"
        >
          <TelegramIcon />
          Войти через Telegram
        </button>
      )}
      {error && (
        <p className="text-sm text-red-600 text-center mt-1">{error}</p>
      )}
    </div>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden fill="#229ED9">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 13.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.978.942z" />
    </svg>
  );
}
