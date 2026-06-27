import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserBookmarks } from "@/lib/api/prompts";
import SavedPromptsList from "@/components/dashboard/user/SavedPromptsList";
import Link from "next/link";
import { Bookmark } from "@gravity-ui/icons";
import { getTokenServer } from "@/lib/getTokenServer"; // 🎯 টোকেন ইম্পোর্ট

export default async function SavedPromptsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email;
  const token = await getTokenServer(); // 🎯 টোকেন রিড

  const bookmarksData = await getUserBookmarks(email, token); // 🎯 টোকেন পাস
  const savedPrompts = bookmarksData?.data || [];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 relative">
      <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-purple-900/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mb-8 relative z-10">
        <h1 className="text-3xl font-black text-white tracking-tight">
          Saved Prompt Templates
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          Browse your bookmarked templates and parameters.
        </p>
      </div>

      <div className="mt-8 bg-zinc-900/10 border border-purple-950/20 rounded-2xl overflow-hidden backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative z-10">
        {savedPrompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 px-6 space-y-4">
            <div className="w-12 h-12 rounded-xl border border-purple-950/40 bg-purple-950/10 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
              <Bookmark className="size-5" />
            </div>
            <h2 className="text-white font-bold mt-4">No bookmarked prompts</h2>
            <p className="text-zinc-500 text-xs max-w-sm mx-auto leading-relaxed">
              Browse the marketplace and bookmark items to build your private collection.
            </p>
            <Link
              href="/all-prompts"
              className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 font-bold text-xs uppercase tracking-wider text-white rounded-xl py-3 px-6 shadow-lg shadow-purple-950/30 hover:opacity-95 transition-all cursor-pointer"
            >
              Browse Prompts Catalog
            </Link>
          </div>
        ) : (
          <SavedPromptsList prompts={savedPrompts} email={email} token={token} /> 
        )}
      </div>
    </div>
  );
}