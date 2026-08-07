import Link from "next/link";

type PaginationProps = {
  page: number;
  totalPages: number;
  query?: string;
};

function buildHref(page: number, query?: string): string {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/patients?${qs}` : "/patients";
}

function getPageNumbers(page: number, totalPages: number): number[] {
  if (totalPages <= 10) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, totalPages, page, page - 1, page + 1]);
  return [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
}

export default function Pagination({ page, totalPages, query }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <nav
      className="mt-6 flex items-center justify-center gap-2 flex-wrap"
      aria-label="Пагинация"
    >
      {page > 1 ? (
        <Link
          href={buildHref(page - 1, query)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Назад
        </Link>
      ) : (
        <span className="px-3 py-1.5 text-sm border border-gray-200 rounded-md text-gray-400">
          Назад
        </span>
      )}

      {pageNumbers.map((pageNumber) => (
        <Link
          key={pageNumber}
          href={buildHref(pageNumber, query)}
          className={
            pageNumber === page
              ? "px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white"
              : "px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          }
          aria-current={pageNumber === page ? "page" : undefined}
        >
          {pageNumber}
        </Link>
      ))}

      {page < totalPages ? (
        <Link
          href={buildHref(page + 1, query)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Вперёд
        </Link>
      ) : (
        <span className="px-3 py-1.5 text-sm border border-gray-200 rounded-md text-gray-400">
          Вперёд
        </span>
      )}
    </nav>
  );
}
