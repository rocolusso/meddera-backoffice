import type { Patient } from "@/lib/patients";
import PatientCard from "@/components/PatientCard";

type PatientListProps = {
  patients: Patient[];
};

export default function PatientList({ patients }: PatientListProps) {
  if (patients.length === 0) {
    return (
      <p className="text-gray-500 py-8 text-center bg-white border border-gray-200 rounded-lg">
        Пациенты не найдены
      </p>
    );
  }

  return (
    <ul className="bg-white border border-gray-200 rounded-lg px-4">
      {patients.map((patient) => (
        <PatientCard key={patient.id} patient={patient} />
      ))}
    </ul>
  );
}
