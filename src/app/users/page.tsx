import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { getUsers } from "@/lib/actions/user-actions";
import UsersClient from "./users-client";

export const metadata = { title: "Сотрудники — Beauty Clinic Meddera" };

export default async function UsersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "SUPERADMIN") redirect("/patients");

  const users = await getUsers();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Сотрудники
      </h1>
      <UsersClient initialUsers={users} />
    </div>
  );
}
