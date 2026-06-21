import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getMyPrompts } from "@/lib/api/prompts";
import MyPromptsTable from "@/components/dashboard/user/MyPromptsTable";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default async function MyPromptsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email;

  const promptsData = await getMyPrompts(email);
  const prompts = promptsData?.data || [];

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-black text-white tracking-tight">
        My Prompt Templates
      </h1>
      <p className="text-zinc-500 text-sm mt-1">
        Review approval statuses, change details, and check analytics.
      </p>

      <div className="mt-6 bg-zinc-900/30 border border-purple-950/20 rounded-2xl">
        {prompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-6">
            <HiOutlineExclamationCircle className="text-4xl text-zinc-500" />
            <h2 className="text-white font-bold mt-4">No Prompts Found</h2>
            <p className="text-zinc-500 text-sm mt-2 max-w-sm">
              You have not published any prompts. Upgraded Creators can build and monetize prompts.
            </p>
          </div>
        ) : (
          <MyPromptsTable prompts={prompts} />
        )}
      </div>
    </div>
  );
}