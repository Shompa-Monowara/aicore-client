import Link from "next/link";
import { Bookmark } from "@gravity-ui/icons";

export default async function SavedPromptsPage() {
  const savedPrompts = [];

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-black text-white tracking-tight">
        Saved Prompt Templates
      </h1>
      <p className="text-zinc-500 text-sm mt-1">
        Browse your bookmarked templates and parameters.
      </p>

      <div
        className="mt-6 border bg-[#13112b]/40 rounded-2xl"
        style={{ backgroundColor: "rgba(11, 8, 19, 0.7)" }}
      >
        {savedPrompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-6">
            <Bookmark className="text-zinc-500 size-10" />
            <h2 className="text-white font-bold mt-4">No bookmarked prompts</h2>
            <p className="text-zinc-500 text-sm mt-2 max-w-sm">
              Browse the marketplace and bookmark items to build your private collection.
            </p>
            <Link
              href="/all-prompts"
              className="mt-5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 font-semibold text-white px-5 py-2.5 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:opacity-90 transition-all"
            >
              Browse Prompts
            </Link>
          </div>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}