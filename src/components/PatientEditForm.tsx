"use client";

import Link from "next/link";
import { useActionState } from "react";
import { updatePatientAction } from "@/lib/actions/patient-actions";
import type { Patient } from "@/lib/patients";
import PatientFormFields from "@/components/PatientFormFields";

type PatientEditFormProps = {
  patient: Patient;
};

export default function PatientEditForm({ patient }: PatientEditFormProps) {
  const boundAction = updatePatientAction.bind(null, patient.id);
  const [state, formAction, pending] = useActionState(boundAction, null);

  return (
    <form action={formAction} className="bg-white border border-gray-200 rounded-lg p-6">
      {state?.error ? (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {state.error}
        </p>
      ) : null}

      <PatientFormFields defaultValues={patient} />

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
        >
          {pending ? "Сохранение..." : "Сохранить"}
        </button>
        <Link
          href={`/patients/${patient.id}`}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          Отмена
        </Link>
      </div>
    </form>
  );
}
