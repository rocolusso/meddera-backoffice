import { Suspense } from "react";
import PatientList from "@/components/PatientList";
import PatientSearch from "@/components/PatientSearch";
import Pagination from "@/components/Pagination";
import { getPatients } from "@/lib/patients";
import { requireAuth } from "@/lib/auth/require-auth";

type PatientsPageProps = {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
};

export default async function PatientsPage({ searchParams }: PatientsPageProps) {
  await requireAuth();
  const params = await searchParams;
  const query = params.q ?? "";
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  const { items, page: currentPage, totalPages } = await getPatients({
    query,
    page,
    pageSize: 10,
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Пациенты</h1>
      <Suspense
        fallback={
          <div className="mb-6 h-10 max-w-xl bg-gray-100 rounded-lg animate-pulse" />
        }
      >
        <PatientSearch defaultQuery={query} />
      </Suspense>
      <PatientList patients={items} />
      <Pagination page={currentPage} totalPages={totalPages} query={query} />
    </div>
  );
}
