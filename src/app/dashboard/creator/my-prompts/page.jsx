import { getMyPrompts } from "@/lib/api/prompts";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import CreatorMyPromptsTable from "@/components/dashboard/creator/CreatorMyPromptsTable";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import Link from "next/link";
import { Plus } from "@gravity-ui/icons";
import { getTokenServer } from "@/lib/getTokenServer"; // 🎯 টোকেন ইম্পোর্ট

export const dynamic = "force-dynamic";

export default async function CreatorMyPromptsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email;
  const token = await getTokenServer(); // 🎯 টোকেন রিড

  const promptsData = await getMyPrompts(email, token); // 🎯 টোকেন পাস
  const prompts = promptsData?.data || [];

  return (
    <div className="w-full min-h-screen py-6 px-2 flex flex-col items-center relative">
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-purple-900/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-4xl flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 relative z-10">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            My Prompt Templates
          </h1>
          <p className="text-zinc-500 text-xs mt-1">
            Review approval statuses, change details, and check analytics.
          </p>
        </div>
        
        <Link
          href="/dashboard/creator/add-prompt"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 transition-all font-bold text-xs uppercase tracking-wider text-white shadow-[0_0_20px_rgba(147,51,234,0.25)] shrink-0 cursor-pointer"
        >
          <Plus className="size-4" /> Create New Prompt
        </Link>
      </div>

      <div className="w-full max-w-4xl bg-zinc-900/10 border border-purple-950/20 rounded-2xl overflow-hidden backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative z-10">
        {prompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 px-6 space-y-4">
            <div className="w-12 h-12 rounded-full border border-purple-950/40 bg-purple-950/10 flex items-center justify-center text-purple-400">
              <HiOutlineExclamationCircle className="text-2xl" />
            </div>
            <div className="space-y-1">
              <h2 className="text-white font-bold text-base">No Prompts Found</h2>
              <p className="text-zinc-500 text-xs max-w-sm leading-relaxed">
                You have not created any prompt templates yet. Start by clicking the button above to build and publish your prompts!
              </p>
            </div>
          </div>
        ) : (
          <CreatorMyPromptsTable prompts={prompts} token={token} /> 
        )}
      </div>
    </div>
  );
}