import Link from "next/link";
import type { Patient } from "@/lib/patients";
import { formatDateDisplay } from "@/lib/utils/dates";
import { getInitials } from "@/lib/utils/initials";

type PatientCardProps = {
  patient: Patient;
};

function ChevronRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-400 shrink-0" aria-hidden>
      <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
    </svg>
  );
}

export default function PatientCard({ patient }: PatientCardProps) {
  return (
    <li className="border-b border-gray-100 last:border-0">
      <Link
        href={`/patients/${patient.id}`}
        className="flex items-center gap-3 py-3 px-1 hover:bg-gray-50/60 transition-colors group"
      >
        <div
          className="shrink-0 w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold"
          aria-hidden
        >
          {getInitials(patient.fullName)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-gray-900 truncate">{patient.fullName}</p>
            <ChevronRightIcon />
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
            <span className="text-xs text-gray-500">{patient.phone}</span>
            {patient.birthDate && (
              <span className="text-xs text-gray-400">{formatDateDisplay(patient.birthDate)}</span>
            )}
            {patient.idnp && (
              <span className="text-xs text-gray-400 hidden sm:inline">{patient.idnp}</span>
            )}
            {patient.lastVisitDate && (
              <span className="text-xs text-gray-400 hidden md:inline">
                Визит: {formatDateDisplay(patient.lastVisitDate)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
}
