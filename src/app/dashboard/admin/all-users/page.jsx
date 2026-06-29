import { getAllUsers } from "@/lib/api/admin";
import { getTokenServer } from "@/lib/getTokenServer";
import AllUsersPageClient from "@/components/dashboard/admin/AllUsersPageClient";

export const dynamic = "force-dynamic";

export default async function AllUsersPage() {
  const token = await getTokenServer();
  const usersData = await getAllUsers(token, 1, 10);

  return (
    <AllUsersPageClient
      initialUsers={usersData?.data || []}
      initialTotal={usersData?.total || 0}
      initialTotalPages={usersData?.totalPages || 1}
      token={token}
    />
  );
}