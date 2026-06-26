import { getMyPrompts } from "@/lib/api/prompts";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import CreatorMyPromptsTable from "@/components/dashboard/creator/CreatorMyPromptsTable";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import Link from "next/link";
import { Plus } from "@gravity-ui/icons";

export const dynamic = "force-dynamic";

export default async function CreatorMyPromptsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email;

  const promptsData = await getMyPrompts(email);
  const prompts = promptsData?.data || [];

  return (
    <div className="w-full min-h-screen py-10 px-4 flex flex-col items-center">
      
    
      <div className="w-full max-w-4xl flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-black text-white tracking-tight">
            My Prompt Templates
          </h1>
          <p className="text-zinc-500 text-xs mt-2">
            Review approval statuses, change details, and check analytics.
          </p>
        </div>
        
       
        <Link
          href="/dashboard/creator/add-prompt"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 transition-all font-bold text-sm text-white shadow-[0_0_15px_rgba(168,85,247,0.3)] shrink-0"
        >
          <Plus className="size-4" /> Create New Prompt
        </Link>
      </div>

      <div className="w-full max-w-4xl bg-zinc-900/20 border border-purple-500/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {prompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-6">
            <HiOutlineExclamationCircle className="text-4xl text-zinc-500" />
            <h2 className="text-white font-bold mt-4">No Prompts Found</h2>
            <p className="text-zinc-500 text-sm mt-2 max-w-sm">
              You have not created any prompt templates yet. Start by clicking the button above to build and publish your prompts!
            </p>
          </div>
        ) : (
          <CreatorMyPromptsTable prompts={prompts} />
        )}
      </div>
    </div>
  );
}