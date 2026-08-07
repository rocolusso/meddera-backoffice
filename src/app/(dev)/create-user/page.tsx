import { notFound } from "next/navigation";
import CreateUserFormClient from "./create-user-form";

export const metadata = { title: "Создать пользователя [DEV]" };

export default function CreateUserPage() {
  if (
    process.env.ENABLE_CREATE_USER !== "true" ||
    process.env.NODE_ENV === "production"
  ) {
    notFound();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-amber-100 border border-amber-300 rounded-xl px-4 py-3 mb-6 text-sm text-amber-800">
          <strong>DEV-только роут.</strong> Удалить перед деплоем в production
          или убрать <code>ENABLE_CREATE_USER=true</code> из env.
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-lg font-semibold text-gray-800 mb-6">
            Создать / обновить пользователя
          </h1>
          <CreateUserFormClient />
        </div>
      </div>
    </div>
  );
}
