import Link from "next/link";
import { Comment } from "@gravity-ui/icons";

export default function MyReviewsPage() {
  const reviews = [];

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-black text-white tracking-tight">
        My Product Reviews
      </h1>
      <p className="text-zinc-500 text-sm mt-1">
        Feedback and ratings you've posted on the marketplace.
      </p>

      <div
        className="mt-6 border border-purple-950/20 rounded-2xl"
        style={{ backgroundColor: "rgba(11, 8, 19, 0.7)" }}
      >
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-6">
            <Comment className="text-zinc-500 size-10" />
            <h2 className="text-white font-bold mt-4">No reviews submitted yet</h2>
            <p className="text-zinc-500 text-sm mt-2 max-w-sm">
              Try templates from our catalog and share your experiences to assist other users!
            </p>
            <Link
              href="/all-prompts"
              className="bg-gradient-to-r from-orange-500 to-amber-500 font-bold text-white rounded-xl px-6 py-3 mt-5 shadow-[0_0_20px_rgba(249,115,22,0.2)] hover:opacity-90 transition-all"
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