import Link from "next/link";
import { notFound } from "next/navigation";
import PatientDetail from "@/components/PatientDetail";
import PatientEditForm from "@/components/PatientEditForm";
import { getPatientById } from "@/lib/patients";
import { formatDateDisplay } from "@/lib/utils/dates";
import { getInitials } from "@/lib/utils/initials";
import { requireAuth } from "@/lib/auth/require-auth";

type PatientDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
};

export default async function PatientDetailPage({
  params,
  searchParams,
}: PatientDetailPageProps) {
  await requireAuth();
  const { id } = await params;
  const { edit } = await searchParams;
  const patient = await getPatientById(id);

  if (!patient) {
    notFound();
  }

  const isEdit = edit === "1";

  return (
    <div>
      <Link
        href="/patients"
        className="inline-block text-sm text-blue-600 hover:underline mb-4"
      >
        ← Все пациенты
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-semibold shrink-0"
            aria-hidden
          >
            {getInitials(patient.fullName)}
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{patient.fullName}</h1>
            <p className="text-sm text-gray-500">
              IDNP: {patient.idnp || "—"} · Последний визит:{" "}
              {formatDateDisplay(patient.lastVisitDate)}
            </p>
          </div>
        </div>

        {!isEdit ? (
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto shrink-0">
            <Link
              href={`/patients/${patient.id}/print`}
              target="_blank"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm text-center"
            >
              Распечатать
            </Link>
            <Link
              href={`/patients/${patient.id}?edit=1`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm text-center"
            >
              Редактировать
            </Link>
          </div>
        ) : null}
      </div>

      {isEdit ? (
        <PatientEditForm patient={patient} />
      ) : (
        <PatientDetail patient={patient} />
      )}
    </div>
  );
}
