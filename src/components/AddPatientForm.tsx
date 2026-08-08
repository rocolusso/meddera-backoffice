"use client";

import { useActionState } from "react";
import { createPatientAction } from "@/lib/actions/patient-actions";
import PatientFormFields from "@/components/PatientFormFields";
import { todayIsoDate } from "@/lib/utils/dates";

export default function AddPatientForm() {
  const [state, formAction, pending] = useActionState(createPatientAction, null);

  return (
    <form action={formAction} className="bg-white border border-gray-200 rounded-lg p-6">
      {state?.error ? (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {state.error}
        </p>
      ) : null}

      <PatientFormFields defaultValues={{ lastVisitDate: todayIsoDate() }} />

      <div className="mt-6">
        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
        >
          {pending ? "Сохранение..." : "Сохранить пациента"}
        </button>
      </div>
    </form>
  );
}
