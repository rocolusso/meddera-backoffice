import AddPatientForm from "@/components/AddPatientForm";
import { requireAuth } from "@/lib/auth/require-auth";

export default async function AddPatientPage() {
  await requireAuth();
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Добавить пациента
      </h1>
      <AddPatientForm />
    </div>
  );
}
