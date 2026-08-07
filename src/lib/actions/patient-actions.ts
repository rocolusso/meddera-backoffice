"use server";

import { redirect } from "next/navigation";
import { createPatient, updatePatient, type Patient } from "@/lib/patients";

function parsePatientFormData(formData: FormData): Omit<Patient, "id" | "lastVisitDate"> {
  const getString = (key: keyof Omit<Patient, "id" | "lastVisitDate" | "patientConsent">) =>
    String(formData.get(key) ?? "").trim();

  return {
    fullName: getString("fullName"),
    phone: getString("phone"),
    birthDate: getString("birthDate"),
    address: getString("address"),
    idnp: getString("idnp"),
    complaints: getString("complaints"),
    anamnesis: getString("anamnesis"),
    objectiveExam: getString("objectiveExam"),
    diagnosis: getString("diagnosis"),
    investigations: getString("investigations"),
    recommendations: getString("recommendations"),
    treatment: getString("treatment"),
    procedure: getString("procedure"),
    product: getString("product"),
    patientConsent: formData.get("patientConsent") === "on",
  };
}

export async function createPatientAction(
  _prevState: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string } | null> {
  const data = parsePatientFormData(formData);

  if (!data.fullName || !data.phone) {
    return { error: "Укажите ФИО и телефон пациента." };
  }

  const patient = await createPatient(data);
  redirect(`/patients/${patient.id}`);
}

export async function updatePatientAction(
  id: string,
  _prevState: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string } | null> {
  const data = parsePatientFormData(formData);

  if (!data.fullName || !data.phone) {
    return { error: "Укажите ФИО и телефон пациента." };
  }

  try {
    await updatePatient(id, data);
  } catch {
    return { error: "Пациент не найден." };
  }

  redirect(`/patients/${id}`);
}
