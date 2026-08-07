import { notFound } from "next/navigation";
import ExaminationPrintSheet from "@/components/ExaminationPrintSheet";
import PrintControls from "@/components/PrintControls";
import { getPatientById } from "@/lib/patients";
import { requireAuth } from "@/lib/auth/require-auth";

type PatientPrintPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PatientPrintPage({ params }: PatientPrintPageProps) {
  await requireAuth();
  const { id } = await params;
  const patient = await getPatientById(id);

  if (!patient) {
    notFound();
  }

  const printDate = new Date().toLocaleDateString("ru-RU");

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center py-6 print:bg-white print:py-0">
      <PrintControls />
      <ExaminationPrintSheet patient={patient} printDate={printDate} />
    </div>
  );
}
