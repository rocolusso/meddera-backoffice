"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type PatientSearchProps = {
  defaultQuery: string;
};

export default function PatientSearch({ defaultQuery }: PatientSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [localQuery, setLocalQuery] = useState(
    searchParams.get("q") ?? defaultQuery,
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = localQuery.trim();

      if (trimmed.length >= 2) {
        const params = new URLSearchParams();
        params.set("q", trimmed);
        router.replace(`/patients?${params.toString()}`, { scroll: false });
      } else {
        router.replace("/patients", { scroll: false });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localQuery, router]);

  return (
    <div className="mb-6 relative max-w-xl">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
            clipRule="evenodd"
          />
        </svg>
      </span>
      <input
        type="text"
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        placeholder="Поиск по имени, телефону или IDNP"
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
      />
    </div>
  );
}
