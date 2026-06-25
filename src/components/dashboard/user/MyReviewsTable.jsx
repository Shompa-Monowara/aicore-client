import Link from "next/link";
import { HiStar, HiOutlineEye } from "react-icons/hi";

export default function MyReviewsTable({ reviews }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-purple-950/20 text-left text-zinc-500 uppercase text-[11px] tracking-wider">
            <th className="px-5 py-4">Prompt Title</th>
            <th className="px-5 py-4">AI Tool</th>
            <th className="px-5 py-4">Rating</th>
            <th className="px-5 py-4">Comments</th>
            <th className="px-5 py-4">Submitted Date</th>
            <th className="px-5 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review, i) => (
            <tr
              key={i}
              className="border-b border-purple-950/10 hover:bg-zinc-900/30 transition-colors"
            >
              <td className="px-5 py-4 text-white font-medium">
                {review.promptTitle}
              </td>
              <td className="px-5 py-4">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  {review.aiTool || "—"}
                </span>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-1 text-amber-400 font-semibold">
                  <HiStar className="text-sm" />
                  {review.rating?.toFixed(1)}
                </div>
              </td>
              <td className="px-5 py-4 text-zinc-400 max-w-[220px] truncate">
                {review.comment ? `"${review.comment}"` : "—"}
              </td>
              <td className="px-5 py-4 text-zinc-500">
                {review.createdAt
                  ? new Date(review.createdAt).toLocaleDateString("en-US", {
                      month: "numeric",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "—"}
              </td>
              <td className="px-5 py-4 text-right">
                <Link
                  href={`/all-prompts/${review.promptId}`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-zinc-200 bg-zinc-900/60 border border-zinc-700/40 hover:bg-zinc-800 transition-colors"
                >
                  <HiOutlineEye className="text-sm" /> View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}