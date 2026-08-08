import type { Patient } from "@/lib/patients";

type PatientFormValues = Partial<Omit<Patient, "id">>;

type PatientFormFieldsProps = {
  defaultValues?: PatientFormValues;
};

const inputClassName =
  "border border-gray-300 rounded-lg px-3 py-2 w-full text-gray-900 bg-white";
const textareaClassName = `${inputClassName} min-h-[88px]`;

function FieldLabel({
  htmlFor,
  ru,
  ro,
}: {
  htmlFor: string;
  ru: string;
  ro: string;
}) {
  return (
    <label htmlFor={htmlFor} className="block mb-1">
      <span className="text-sm text-gray-700">{ro}</span>
      {ru !== ro && (
        <span className="text-xs text-gray-400 ml-1.5">{ru}</span>
      )}
    </label>
  );
}

export default function PatientFormFields({
  defaultValues = {},
}: PatientFormFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FieldLabel htmlFor="fullName" ru="ФИО пациента" ro="Pacient" />
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            defaultValue={defaultValues.fullName ?? ""}
            className={inputClassName}
          />
        </div>
        <div>
          <FieldLabel htmlFor="phone" ru="Телефон" ro="Telefon" />
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            defaultValue={defaultValues.phone ?? ""}
            className={inputClassName}
          />
        </div>
        <div>
          <FieldLabel htmlFor="birthDate" ru="Дата рождения" ro="Data Nașterii" />
          <input
            id="birthDate"
            name="birthDate"
            type="date"
            defaultValue={defaultValues.birthDate ?? ""}
            className={inputClassName}
          />
        </div>
        <div>
          <FieldLabel htmlFor="lastVisitDate" ru="Дата визита" ro="Data vizitei" />
          <input
            id="lastVisitDate"
            name="lastVisitDate"
            type="date"
            defaultValue={defaultValues.lastVisitDate ?? ""}
            className={inputClassName}
          />
        </div>
        <div>
          <FieldLabel htmlFor="idnp" ru="IDNP" ro="IDNP" />
          <input
            id="idnp"
            name="idnp"
            type="text"
            defaultValue={defaultValues.idnp ?? ""}
            className={inputClassName}
          />
        </div>
      </div>

      <div className="mt-4">
        <FieldLabel htmlFor="address" ru="Адрес проживания" ro="Adresă de domiciliu" />
        <input
          id="address"
          name="address"
          type="text"
          defaultValue={defaultValues.address ?? ""}
          className={inputClassName}
        />
      </div>

      <div className="mt-4 space-y-4">
        {(
          [
            ["complaints",     "Жалобы",               "Acuze"],
            ["anamnesis",      "Анамнез",               "Anamneza"],
            ["objectiveExam",  "Объективный осмотр",    "Examen obiectiv"],
            ["diagnosis",      "Диагноз",               "Diagnosticul"],
            ["investigations", "Обследования",          "Investigatii"],
            ["recommendations","Рекомендации",          "Recomendatii"],
            ["treatment",      "Лечение",               "Tratament"],
          ] as const
        ).map(([name, ru, ro]) => (
          <div key={name}>
            <FieldLabel htmlFor={name} ru={ru} ro={ro} />
            <textarea
              id={name}
              name={name}
              defaultValue={defaultValues[name] ?? ""}
              className={textareaClassName}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <FieldLabel htmlFor="procedure" ru="Процедура" ro="Procedura" />
          <textarea
            id="procedure"
            name="procedure"
            defaultValue={defaultValues.procedure ?? ""}
            className={textareaClassName}
          />
        </div>
        <div>
          <FieldLabel htmlFor="product" ru="Препарат / продукт" ro="Preparat / Produs" />
          <textarea
            id="product"
            name="product"
            defaultValue={defaultValues.product ?? ""}
            className={textareaClassName}
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="flex items-start gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            name="patientConsent"
            defaultChecked={defaultValues.patientConsent ?? false}
            className="mt-1 rounded border-gray-300"
          />
          <span>
            Acordul pacientului
            <span className="text-xs text-gray-400 ml-1.5">Пациент согласен с проведением процедуры/лечения</span>
          </span>
        </label>
      </div>
    </>
  );
}
