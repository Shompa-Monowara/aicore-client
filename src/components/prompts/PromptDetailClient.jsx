"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { incrementCopyCount, toggleBookmark, submitReview, submitReport } from "@/lib/action/interactions";
import {
  HiOutlineClipboardCopy,
  HiBookmark,
  HiOutlineBookmark,
  HiOutlineFlag,
  HiStar,
  HiOutlineStar,
  HiOutlineUser,
} from "react-icons/hi";

const REPORT_REASONS = ["Inappropriate Content", "Spam", "Copyright Violation", "Other"];

export default function PromptDetailClient({ prompt, reviews, user, initialBookmarked }) {
  const router = useRouter();

  const [copyCount, setCopyCount] = useState(prompt.copyCount || 0);
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const [reviewList, setReviewList] = useState(reviews);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState(REPORT_REASONS[0]);
  const [reportDetails, setReportDetails] = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  const requireLogin = () => {
    toast.error("Please log in to continue.");
    router.push("/auth/login");
  };

  const handleCopy = async () => {
    if (!user) return requireLogin();
    try {
      await navigator.clipboard.writeText(prompt.content);
      const result = await incrementCopyCount(prompt._id);
      if (result.modifiedCount > 0) {
        setCopyCount((prev) => prev + 1);
      }
      toast.success("Prompt copied to clipboard!");
    } catch (error) {
      console.error(error);
      toast.error("Could not copy prompt.");
    }
  };

  const handleBookmark = async () => {
    if (!user) return requireLogin();
    setBookmarkLoading(true);
    try {
      const result = await toggleBookmark(user.email, prompt._id);
      setIsBookmarked(result.bookmarked);
      toast.success(result.bookmarked ? "Prompt bookmarked" : "Bookmark removed");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) return requireLogin();
    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }
    setReviewLoading(true);
    try {
      const review = {
        promptId: prompt._id,
        name: user.name,
        email: user.email,
        rating,
        comment,
      };
      const result = await submitReview(review);
      if (result.acknowledged) {
        setReviewList((prev) => [{ ...review, createdAt: new Date() }, ...prev]);
        setRating(0);
        setComment("");
        toast.success("Review submitted!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleSubmitReport = async () => {
    if (!user) return requireLogin();
    setReportLoading(true);
    try {
      const result = await submitReport({
        promptId: prompt._id,
        promptTitle: prompt.title,
        reason: reportReason,
        details: reportDetails,
        reportedByName: user.name,
        reportedByEmail: user.email,
      });
      if (result.acknowledged) {
        toast.success("Report submitted. Our team will review it.");
        setReportOpen(false);
        setReportDetails("");
        setReportReason(REPORT_REASONS[0]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase bg-purple-500/15 text-purple-300 border border-purple-500/30">
                {prompt.aiTool}
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase bg-zinc-800 text-zinc-300 border border-zinc-700">
                {prompt.difficultyLevel}
              </span>
            </div>
            <h1 className="text-3xl font-black text-white">{prompt.title}</h1>
            <p className="text-zinc-400 mt-2 max-w-2xl">{prompt.description}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleBookmark}
              disabled={bookmarkLoading}
              className={`p-3 rounded-xl border transition-colors disabled:opacity-40 ${
                isBookmarked
                  ? "bg-purple-500/15 text-purple-300 border-purple-500/40"
                  : "bg-zinc-900/40 text-zinc-400 border-zinc-700/40 hover:border-zinc-600"
              }`}
              title={isBookmarked ? "Remove bookmark" : "Bookmark prompt"}
            >
              {isBookmarked ? <HiBookmark className="text-lg" /> : <HiOutlineBookmark className="text-lg" />}
            </button>

            <button
              onClick={() => setReportOpen(true)}
              className="p-3 rounded-xl border bg-zinc-900/40 text-zinc-400 border-zinc-700/40 hover:border-red-500/40 hover:text-red-400 transition-colors"
              title="Report prompt"
            >
              <HiOutlineFlag className="text-lg" />
            </button>
          </div>
        </div>

        {/* Thumbnail */}
        {prompt.thumbnail && (
          <img
            src={prompt.thumbnail}
            alt={prompt.title}
            className="w-full max-h-80 object-cover rounded-2xl mt-6 border border-purple-950/30"
          />
        )}

        {/* Content block */}
        <div className="mt-6 bg-zinc-900/30 border border-purple-950/20 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Prompt Content</h2>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 transition-all"
            >
              <HiOutlineClipboardCopy className="text-base" /> Copy Prompt
            </button>
          </div>
          <pre className="whitespace-pre-wrap font-mono text-sm text-zinc-300 bg-[#0b0813]/50 border border-purple-950/30 rounded-xl p-4">
            {prompt.content}
          </pre>
          <p className="text-zinc-500 text-xs mt-3">Copied {copyCount} times</p>
        </div>

        {/* Meta info */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-zinc-900/30 border border-purple-950/20 rounded-xl p-4">
            <p className="text-[11px] text-zinc-500 uppercase font-bold">Category</p>
            <p className="text-white text-sm mt-1 capitalize">{prompt.category}</p>
          </div>
          <div className="bg-zinc-900/30 border border-purple-950/20 rounded-xl p-4">
            <p className="text-[11px] text-zinc-500 uppercase font-bold">Visibility</p>
            <p className="text-white text-sm mt-1 capitalize">{prompt.visibility}</p>
          </div>
          <div className="bg-zinc-900/30 border border-purple-950/20 rounded-xl p-4">
            <p className="text-[11px] text-zinc-500 uppercase font-bold">Creator</p>
            <p className="text-white text-sm mt-1 truncate">{prompt.email}</p>
          </div>
          <div className="bg-zinc-900/30 border border-purple-950/20 rounded-xl p-4">
            <p className="text-[11px] text-zinc-500 uppercase font-bold">Avg Rating</p>
            <p className="text-white text-sm mt-1">
              {prompt.averageRating ? prompt.averageRating.toFixed(1) : "No ratings yet"}
            </p>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white">Reviews ({reviewList.length})</h2>

          {/* Add review form */}
          <div className="mt-4 bg-zinc-900/30 border border-purple-950/20 rounded-2xl p-5">
            <p className="text-sm font-medium text-zinc-400 mb-2">Your Rating</p>
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)} type="button">
                  {star <= rating ? (
                    <HiStar className="text-2xl text-amber-400" />
                  ) : (
                    <HiOutlineStar className="text-2xl text-zinc-600" />
                  )}
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Write your review..."
              className="w-full bg-[#0b0813]/50 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
            />
            <button
              onClick={handleSubmitReview}
              disabled={reviewLoading}
              className="mt-3 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 transition-all disabled:opacity-50"
            >
              Submit Review
            </button>
          </div>

          {/* Review list */}
          <div className="mt-5 flex flex-col gap-4">
            {reviewList.length === 0 ? (
              <p className="text-zinc-500 text-sm">No reviews yet. Be the first to review!</p>
            ) : (
              reviewList.map((r, i) => (
                <div key={i} className="bg-zinc-900/30 border border-purple-950/20 rounded-xl p-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <HiOutlineUser className="text-zinc-500" />
                      <p className="text-white font-semibold text-sm">{r.name}</p>
                      <p className="text-zinc-500 text-xs">({r.email})</p>
                    </div>
                    <p className="text-zinc-500 text-xs">
                      {new Date(r.createdAt).toLocaleDateString("en-US", {
                        month: "numeric",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5 mt-2">
                    {[1, 2, 3, 4, 5].map((star) =>
                      star <= r.rating ? (
                        <HiStar key={star} className="text-sm text-amber-400" />
                      ) : (
                        <HiOutlineStar key={star} className="text-sm text-zinc-600" />
                      )
                    )}
                  </div>
                  <p className="text-zinc-300 text-sm mt-2">{r.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {reportOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-md bg-[#13112b] border border-purple-950/40 rounded-2xl p-6">
            <h3 className="text-white font-bold text-lg">Report Prompt</h3>
            <p className="text-zinc-500 text-sm mt-1">Help us understand the issue.</p>

            <p className="text-xs font-medium text-zinc-400 mt-4 mb-2">Reason</p>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full bg-[#0b0813]/80 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-red-500/50 transition-colors"
            >
              {REPORT_REASONS.map((reason) => (
                <option key={reason} value={reason} className="bg-[#13112b]">
                  {reason}
                </option>
              ))}
            </select>

            <p className="text-xs font-medium text-zinc-400 mt-4 mb-2">Description (optional)</p>
            <textarea
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              rows={3}
              placeholder="Add more details..."
              className="w-full bg-[#0b0813]/60 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/50 transition-colors resize-none"
            />

            <div className="flex items-center justify-end gap-3 mt-5">
              <button
                onClick={() => setReportOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:bg-zinc-900/40 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReport}
                disabled={reportLoading}
                className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}