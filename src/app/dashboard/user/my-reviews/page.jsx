import Link from "next/link";
import { Comment } from "@gravity-ui/icons";
import MyReviewsTable from "@/components/dashboard/user/MyReviewsTable";

export default function MyReviewsPage() {

  const reviews = [];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 relative">
    
      <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-purple-900/5 rounded-full blur-[120px] pointer-events-none" />

    
      <div className="mb-8 relative z-10">
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          My Product Reviews
        </h1>
        <p className="text-zinc-500 text-xs mt-1.5">
          Feedback and ratings you've posted on the marketplace deployment assets.
        </p>
      </div>

     
      <div className="mt-8 bg-zinc-900/10 border border-purple-950/20 rounded-2xl overflow-hidden backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative z-10">
        {reviews.length === 0 ? (
        
          <div className="flex flex-col items-center justify-center text-center py-20 px-6 space-y-4">
            <div className="w-12 h-12 rounded-xl border border-purple-950/40 bg-purple-950/10 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
              <Comment className="size-5" />
            </div>
            
            <div className="space-y-1.5">
              <h2 className="text-white font-bold text-base">No reviews submitted yet</h2>
              <p className="text-zinc-500 text-xs max-w-sm mx-auto leading-relaxed">
                Try templates from our catalog and share your experiences to assist other developers in the workspace network.
              </p>
            </div>

            <Link
              href="/all-prompts"
              className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 font-bold text-xs uppercase tracking-wider text-white rounded-xl py-3 px-6 shadow-lg shadow-purple-950/30 hover:opacity-95 transition-all cursor-pointer"
            >
              Browse Prompts Catalog
            </Link>
          </div>
        ) : (
        
          <MyReviewsTable reviews={reviews} />
        )}
      </div>
    </div>
  );
}