import { CLINIC_CONFIG } from "@/lib/clinic-config";
import type { Patient } from "@/lib/patients";
import { formatDateDisplay } from "@/lib/utils/dates";

type ExaminationPrintSheetProps = {
  patient: Patient;
  printDate: string;
};

export default function ExaminationPrintSheet({
  patient,
  printDate,
}: ExaminationPrintSheetProps) {
  return (
    <div
      className="print-sheet bg-white shadow-2xl print:shadow-none box-border"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "8mm",
      }}
    >
      <header className="border-b border-gray-300 pb-1.5 mb-1.5">
        <div className="flex justify-between items-start gap-3">
          <div>
            <h2 className="text-[18px] text-gray-500 leading-tight">
              {CLINIC_CONFIG.legalName}
            </h2>
            <span className="text-[14px] text-gray-800">{CLINIC_CONFIG.formTitle}</span>
          </div>
          <ul className="text-[12px] text-gray-700 leading-snug text-right">
            <li>
              <strong>{CLINIC_CONFIG.doctorTitle}: </strong>
              {CLINIC_CONFIG.doctorName}
            </li>
            {CLINIC_CONFIG.phones.map((phone) => (
              <li key={phone}>{phone}</li>
            ))}
          </ul>
        </div>
      </header>

      <main className="space-y-2 border border-gray-300 p-1.5">
        <section className="print-section grid grid-cols-2 gap-x-4 gap-y-0.5 px-1">
          <div className="flex gap-1.5 items-baseline">
            <h3 className="print-label font-bold shrink-0">Pacient:</h3>
            <span className="print-value">{patient.fullName}</span>
          </div>
          <div className="flex gap-1.5 items-baseline">
            <h3 className="print-label font-bold shrink-0">Telefon:</h3>
            <span className="print-value">{patient.phone}</span>
          </div>
          <div className="flex gap-1.5 items-baseline">
            <h3 className="print-label font-bold shrink-0">Data Nașterii:</h3>
            <span className="print-value">{formatDateDisplay(patient.birthDate)}</span>
          </div>
          <div className="flex gap-1.5 items-baseline">
            <h3 className="print-label font-bold shrink-0">Adresă de domiciliu:</h3>
            <span className="print-value">{patient.address}</span>
          </div>
          <div className="flex gap-1.5 items-baseline">
            <h3 className="print-label font-bold shrink-0">IDNP:</h3>
            <span className="print-value">{patient.idnp}</span>
          </div>
        </section>

        <section className="print-section px-1">
          <h3 className="print-label font-bold border-l-2 border-blue-600 pl-1.5">Acuze</h3>
          <p className="mt-0.5 print-value">{patient.complaints}</p>
        </section>

        <section className="print-section px-1">
          <h3 className="print-label font-bold border-l-2 border-blue-600 pl-1.5">Anamneza</h3>
          <p className="mt-0.5 print-value">{patient.anamnesis}</p>
        </section>

        <section className="print-section px-1">
          <h3 className="print-label font-bold border-l-2 border-blue-600 pl-1.5">
            Examen obiectiv
          </h3>
          <p className="mt-0.5 print-value">{patient.objectiveExam}</p>
        </section>

        <section className="print-section px-1">
          <h3 className="print-label font-bold border-l-2 border-blue-600 pl-1.5">
            Diagnosticul
          </h3>
          <p className="mt-0.5 print-value">{patient.diagnosis}</p>
        </section>

        <section className="print-section px-1">
          <h3 className="print-label font-bold border-l-2 border-blue-600 pl-1.5">
            Investigatii
          </h3>
          <p className="mt-0.5 print-value">{patient.investigations}</p>
        </section>

        <section className="print-section px-1">
          <h3 className="print-label font-bold border-l-2 border-blue-600 pl-1.5">
            Recomendatii
          </h3>
          <p className="mt-0.5 print-value">{patient.recommendations}</p>
        </section>

        <section className="print-section px-1">
          <h3 className="print-label font-bold border-l-2 border-blue-600 pl-1.5">Tratament</h3>
          <p className="mt-0.5 print-value">{patient.treatment}</p>
        </section>

        <div className="grid grid-cols-2 gap-2 px-1">
          <section className="print-section">
            <h3 className="print-label font-bold border-l-2 border-blue-600 pl-1.5">
              Procedura
            </h3>
            <p className="mt-0.5 print-value">{patient.procedure}</p>
          </section>

          <section className="print-section">
            <h3 className="print-label font-bold border-l-2 border-blue-600 pl-1.5">
              Preparat / Produs
            </h3>
            <p className="mt-0.5 print-value">{patient.product}</p>
          </section>
        </div>

        <div className="grid grid-cols-2 gap-2 px-1">
          <section className="print-section">
            <p className="mb-1 print-value font-bold">{CLINIC_CONFIG.consentText}</p>
            <span className="print-value block mb-1">{patient.fullName}</span>
            <h3 className="print-label font-bold border-l-2 border-blue-600 pl-1.5">
              Acordul pacientului
            </h3>
          </section>

          <section className="print-section flex flex-col gap-1">
            <div className="flex flex-row items-baseline gap-1.5">
              <h3 className="print-label font-bold border-l-2 border-blue-600 pl-1.5">Date</h3>
              <span className="print-value">{printDate}</span>
            </div>
            <h3 className="print-label font-bold border-l-2 border-blue-600 pl-1.5">
              Semnatura (medic)
            </h3>
          </section>
        </div>
      </main>
    </div>
  );
}
