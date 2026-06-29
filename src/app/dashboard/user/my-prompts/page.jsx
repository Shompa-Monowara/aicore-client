import { getMyPrompts } from "@/lib/api/prompts";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import MyPromptsTable from "@/components/dashboard/user/MyPromptsTable";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { getTokenServer } from "@/lib/getTokenServer"; 

export default async function MyPromptsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email;
  const token = await getTokenServer(); 

  const promptsData = await getMyPrompts(email, token); 
  const prompts = promptsData?.data || [];

  return (
    <div className="w-full min-h-screen py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">
          My Prompt Templates
        </h1>
        <p className="text-zinc-500 text-xs mt-2">
          Review approval statuses, change details, and check analytics.
        </p>
      </div>

      <div className="w-full max-w-4xl bg-[#0f0d26]/40 border border-purple-950/30 rounded-2xl overflow-hidden backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        {prompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-6">
            <HiOutlineExclamationCircle className="text-4xl text-zinc-500" />
            <h2 className="text-white font-bold mt-4">No Prompts Found</h2>
            <p className="text-zinc-500 text-sm mt-2 max-w-sm">
              You have not published any prompts. Upgraded Creators can build and monetize prompts.
            </p>
          </div>
        ) : (
          <MyPromptsTable prompts={prompts} token={token} />
        )}
      </div>
    </div>
  );
}