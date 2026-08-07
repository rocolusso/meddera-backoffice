import type { Patient } from "@/lib/patients";
import { formatDateDisplay } from "@/lib/utils/dates";

type PatientDetailProps = {
  patient: Patient;
};

function DetailSection({ title, value }: { title: string; value: string }) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-gray-800 border-l-2 border-blue-600 pl-3 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 whitespace-pre-wrap">{value || "—"}</p>
    </section>
  );
}

export default function PatientDetail({ patient }: PatientDetailProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Телефон</p>
          <p className="text-gray-900">{patient.phone || "—"}</p>
        </div>
        <div>
          <p className="text-gray-500">Дата рождения</p>
          <p className="text-gray-900">{formatDateDisplay(patient.birthDate) || "—"}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-gray-500">Адрес</p>
          <p className="text-gray-900">{patient.address || "—"}</p>
        </div>
        <div>
          <p className="text-gray-500">IDNP</p>
          <p className="text-gray-900">{patient.idnp || "—"}</p>
        </div>
        <div>
          <p className="text-gray-500">Согласие пациента</p>
          <p className="text-gray-900">{patient.patientConsent ? "Да" : "Нет"}</p>
        </div>
      </section>

      <DetailSection title="Жалобы" value={patient.complaints} />
      <DetailSection title="Анамнез" value={patient.anamnesis} />
      <DetailSection title="Объективный осмотр" value={patient.objectiveExam} />
      <DetailSection title="Диагноз" value={patient.diagnosis} />
      <DetailSection title="Обследования" value={patient.investigations} />
      <DetailSection title="Рекомендации" value={patient.recommendations} />
      <DetailSection title="Лечение" value={patient.treatment} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DetailSection title="Процедура" value={patient.procedure} />
        <DetailSection title="Препарат / продукт" value={patient.product} />
      </div>
    </div>
  );
}
