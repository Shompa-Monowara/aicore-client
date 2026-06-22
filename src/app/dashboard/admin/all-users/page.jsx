import { getAllUsers } from "@/lib/api/admin";
import AllUsersTable from "@/components/dashboard/admin/AllUsersTable";

export default async function AllUsersPage() {
  const usersData = await getAllUsers();
  const users = usersData?.data || [];

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-black text-white tracking-tight">
        User Role &amp; Accounts Management
      </h1>
      <p className="text-zinc-500 text-sm mt-1">
        Review accounts, modify role scopes, and delete users.
      </p>

      <div className="mt-6 bg-zinc-900/30 border border-purple-950/20 rounded-2xl overflow-hidden">
        <AllUsersTable users={users} />
      </div>
    </div>
  );
}