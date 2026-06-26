"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client"; 
import toast from "react-hot-toast";
import {
  incrementCopyCount,
  toggleBookmark,
  submitReview,
  submitReport,
} from "@/lib/action/interactions";
import {
  HiOutlineClipboardCopy,
  HiBookmark,
  HiOutlineBookmark,
  HiOutlineFlag,
  HiStar,
  HiOutlineStar,
  HiOutlineUser,
  HiArrowLeft,
  HiLockClosed,
} from "react-icons/hi";

const REPORT_REASONS = [
  "Inappropriate Content",
  "Spam",
  "Copyright Violation",
  "Other",
];

export default function PromptDetailClient({
  prompt,
  reviews,
  user: initialUser, 
  initialBookmarked,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get("payment");
  
  const { data: session } = authClient.useSession();
  const liveUser = session?.user || initialUser; 

  const [copyCount, setCopyCount] = useState(prompt.copyCount || 0);
  const [bookmarkCount, setBookmarkCount] = useState(
    prompt.bookmarkCount || (initialBookmarked ? 1 : 0)
  );
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

  const isPremiumUser =
    liveUser?.role === "admin" || (liveUser?.plan && liveUser.plan.toLowerCase() !== "free");

  const promptVisibility = prompt?.visibility?.toLowerCase();
  const promptDifficulty = prompt?.difficulty?.toLowerCase();

  const isLocked = 
    (promptVisibility === "pro" || 
     promptVisibility === "private" || 
     promptDifficulty === "pro" || 
     promptDifficulty === "premium") && !isPremiumUser;

  useEffect(() => {
    if (paymentStatus === "success") {
      toast.success("🎉 Payment Successful! Unlocking premium prompt...");
      
      setTimeout(() => {
        window.location.href = `/all-prompts/${prompt._id}`;
      }, 1500);
    }
  }, [paymentStatus, prompt._id]);

  const requireLogin = () => {
    toast.error("Please log in to continue.");
    router.push("/auth/login");
  };

  const goToPayment = () => router.push(`/payment?prompt_id=${prompt._id}`);

  const handleContentClick = () => {
    if (!liveUser) return requireLogin();
    if (isLocked) {
      toast.error("Subscribe to Premium to access this prompt.");
      goToPayment();
    }
  };

  // 🎯 এখানে আপনার নতুন কাউন্ট ট্র্যাকিং এবং রিফ্রেশ সহ ফাংশনটি রিপ্লেস করা হলো
  const handleCopy = async () => {
    if (!liveUser) return requireLogin();
    if (isLocked) {
      toast.error("Subscribe to Premium to copy this prompt.");
      goToPayment();
      return;
    }
    try {
      const result = await incrementCopyCount(prompt._id, liveUser.email);
      if (result?.limitReached) {
        toast.error(result.message || "Free users can only copy up to 3 prompts. Upgrade to Premium!");
        return;
      }
      await navigator.clipboard.writeText(prompt.content);
      
      if (result && typeof result.copyCount === "number") {
        setCopyCount(result.copyCount);
      } else {
        setCopyCount((prev) => prev + 1);
      }
      
      toast.success("Prompt copied to clipboard!");
      router.refresh(); 
    } catch (error) {
      console.error(error);
      toast.error("Could not copy prompt.");
    }
  };

  const handleBookmark = async () => {
    if (!liveUser) return requireLogin();
    setBookmarkLoading(true);
    try {
      const result = await toggleBookmark(liveUser.email, prompt._id);
      setIsBookmarked(result.bookmarked);
      setBookmarkCount((prev) => result.bookmarked ? prev + 1 : prev - 1);
      toast.success(result.bookmarked ? "Prompt bookmarked!" : "Bookmark removed!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!liveUser) return requireLogin();
    if (isLocked) { toast.error("Subscribe to Premium to review this prompt."); return; }
    if (rating === 0) { toast.error("Please select a rating."); return; }
    setReviewLoading(true);
    try {
      const review = {
        promptId: prompt._id,
        name: liveUser.name,
        email: liveUser.email,
        rating,
        comment,
        aiTool: prompt.aiTool,
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
    if (!liveUser) return requireLogin();
    setReportLoading(true);
    try {
      const result = await submitReport({
        promptId: prompt._id,
        promptTitle: prompt.title,
        reason: reportReason,
        details: reportDetails,
        reportedByName: liveUser.name,
        reportedByEmail: liveUser.email,
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
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors font-medium group mb-6"
        >
          <HiArrowLeft className="transform group-hover:-translate-x-0.5 transition-transform" />
          Back to previous page
        </button>

        {/* Title Row */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {isLocked && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  <HiLockClosed className="text-xs" /> Premium
                </span>
              )}
            </div>
            <h1 className="text-3xl font-black text-white">{prompt.title}</h1>
            <p className="text-zinc-400 mt-2 max-w-2xl">{prompt.description}</p>
            {Array.isArray(prompt.tags) && prompt.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {prompt.tags.map((tag, idx) => (
                  <span key={idx} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-zinc-800/60 text-zinc-300 border border-zinc-700/50">
                    #{typeof tag === "string" ? tag.trim() : tag}
                  </span>
                ))}
              </div>
            )}
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
            >
              {isBookmarked ? <HiBookmark className="text-lg" /> : <HiOutlineBookmark className="text-lg" />}
            </button>
            <button
              onClick={() => { if (!liveUser) return requireLogin(); setReportOpen(true); }}
              className="p-3 rounded-xl border bg-zinc-900/40 text-zinc-400 border-zinc-700/40 hover:border-red-500/40 hover:text-red-400 transition-colors"
            >
              <HiOutlineFlag className="text-lg" />
            </button>
          </div>
        </div>

        {/* Thumbnail */}
        {prompt.thumbnail && (
          <img src={prompt.thumbnail} alt={prompt.title} className="w-full max-h-72 object-cover rounded-2xl mb-6 border border-purple-950/30" />
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Prompt Template */}
            <div className="bg-[#0f0d1f] border border-purple-950/30 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-white">Prompt Template</h2>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 transition-all"
                >
                  <HiOutlineClipboardCopy className="text-base" />
                  {isLocked ? "Unlock to Copy" : "Copy"}
                </button>
              </div>

              <div onClick={handleContentClick} className={isLocked ? "cursor-pointer" : ""}>
                <pre 
                  style={isLocked ? { filter: "blur(6px)", userSelect: "none", pointerEvents: "none" } : {}}
                  className="whitespace-pre-wrap font-mono text-sm text-purple-300 bg-[#090814] border border-purple-950/30 rounded-xl p-4 min-h-[140px]"
                >
                  {prompt.content}
                </pre>
              </div>

              {/* subscription button link */}
              {isLocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#080810]/80 backdrop-blur-sm rounded-2xl px-6 text-center">
                  <HiLockClosed className="text-3xl text-amber-400" />
                  <p className="text-white font-bold">Premium Prompt Locked</p>
                  <p className="text-zinc-400 text-sm max-w-sm">
                    This is a private, premium prompt. Subscribe to unlock the full content and copy it.
                  </p>
                  <Link 
                    href={`/payment?prompt_id=${prompt._id}`} 
                    className="mt-1 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#00b4d8] hover:bg-[#0096c7] transition-all shadow-lg text-center inline-block"
                  >
                    Subscribe to Premium ($5)
                  </Link>
                </div>
              )}

              {!isLocked && <p className="text-zinc-500 text-xs mt-3">Copied {copyCount} times</p>}
            </div>

            {/* Usage Instructions */}
            {prompt.usageInstructions && (
              <div className="bg-[#0f0d1f] border border-purple-950/30 rounded-2xl p-5">
                <h2 className="text-base font-bold text-white mb-3">Usage Instructions</h2>
                <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{prompt.usageInstructions}</p>
              </div>
            )}

            {/* Community Reviews */}
            <div className="bg-[#0f0d1f] border border-purple-950/30 rounded-2xl p-5">
              <h2 className="text-base font-bold text-white mb-5">
                Community Reviews ({reviewList.length})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Submit Form */}
                <div className="bg-[#090814] border border-purple-950/20 rounded-xl p-4 flex flex-col justify-center h-full min-h-[220px]">
                  {isLocked ? (
                    <div className="flex flex-col items-center text-center gap-2 py-4">
                      <HiLockClosed className="text-2xl text-amber-400" />
                      <p className="text-zinc-300 text-sm">Subscribe to Premium to write a review.</p>
                      <Link 
                        href={`/payment?prompt_id=${prompt._id}`} 
                        className="mt-1 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#00b4d8] hover:bg-[#0096c7] transition-all text-center inline-block"
                      >
                        Subscribe to Premium ($5)
                      </Link>
                    </div>
                  ) : reviewList.some((r) => r.email === liveUser?.email) ? (
                    <div className="flex items-start gap-2.5 p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-emerald-400 py-6 w-full">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full border border-emerald-500/30 text-xs mt-0.5 shrink-0">
                        ✓
                      </div>
                      <p className="text-sm font-medium leading-relaxed">
                        You have already reviewed this prompt template. Thank you for your feedback!
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs font-bold text-zinc-400 uppercase mb-3">Submit a Review</p>
                      <p className="text-xs font-medium text-zinc-500 mb-1">RATING</p>
                      <div className="flex items-center gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button 
                            key={star} 
                            onClick={() => {
                              setRating(star);
                              toast.success(`Selected ${star} ${star === 1 ? "star" : "stars"}!`);
                            }} 
                            type="button"
                          >
                            {star <= rating
                              ? <HiStar className="text-2xl text-amber-400" />
                              : <HiOutlineStar className="text-2xl text-zinc-600" />}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs font-medium text-zinc-500 mb-1">COMMENT</p>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                        placeholder="Write your review here. What worked? How did you test it?"
                        className="w-full bg-[#0b0813]/50 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
                      />
                      <button
                        onClick={handleSubmitReview}
                        disabled={reviewLoading}
                        className="mt-3 w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 transition-all disabled:opacity-50"
                      >
                        {reviewLoading ? "Submitting..." : "✈ Submit Review"}
                      </button>
                    </>
                  )}
                </div>

                {/* Review List */}
                <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1">
                  {reviewList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-10 gap-3 bg-[#090814] border border-purple-950/20 rounded-xl">
                      <div className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center">
                        <HiOutlineUser className="text-zinc-500 text-lg" />
                      </div>
                      <p className="text-zinc-400 text-sm">No reviews submitted yet. Be the first to share your thoughts!</p>
                    </div>
                  ) : (
                    reviewList.map((r, i) => (
                      <div key={i} className="bg-[#090814] border border-purple-950/20 rounded-xl p-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center">
                              <HiOutlineUser className="text-purple-300 text-xs" />
                            </div>
                            <div>
                              <p className="text-white font-semibold text-sm">{r.name}</p>
                              <p className="text-zinc-500 text-xs">{r.email}</p>
                            </div>
                          </div>
                          <p className="text-zinc-500 text-xs">
                            {new Date(r.createdAt).toLocaleDateString("en-US", {
                              month: "numeric", day: "numeric", year: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-0.5 mt-2">
                          {[1, 2, 3, 4, 5].map((star) =>
                            star <= r.rating
                              ? <HiStar key={star} className="text-sm text-amber-400" />
                              : <HiOutlineStar key={star} className="text-sm text-zinc-600" />
                          )}
                        </div>
                        <p className="text-zinc-300 text-sm mt-2">{r.comment}</p>
                      </div>
                    ))
                  )}
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR */}
          <div className="flex flex-col gap-4">

            {/* Prompt Details */}
            <div className="bg-[#0f0d1f] border border-purple-950/30 rounded-2xl p-5">
              <h3 className="text-base font-bold text-white mb-4">Prompt Details</h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: "AI Engine", value: prompt.aiTool, badge: true },
                  { label: "Category", value: prompt.category, badge: true },
                  { label: "Difficulty", value: prompt.difficulty || prompt.difficultyLevel || "—", badge: true },
                  { label: "Visibility", value: prompt.visibility, badge: false },
                  { label: "Copies Made", value: copyCount, badge: false },
                  { label: "Bookmarks", value: bookmarkCount, badge: false },
                ].map(({ label, value, badge }, i, arr) => (
                  <div key={label}>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400 text-sm">{label}</span>
                      {badge ? (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase bg-zinc-800 text-zinc-200 border border-zinc-700">
                          {value}
                        </span>
                      ) : (
                        <span className="text-white text-sm font-semibold uppercase">{value}</span>
                      )}
                    </div>
                    {i < arr.length - 1 && <div className="h-px bg-purple-950/30 mt-3" />}
                  </div>
                ))}
                <div className="h-px bg-purple-950/30" />
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">Community Rating</span>
                  <span className="flex items-center gap-1 text-sm font-bold text-white">
                    <HiStar className="text-amber-400" />
                    {prompt.averageRating ? prompt.averageRating.toFixed(1) : "0.0"}
                    <span className="text-zinc-500 font-normal">
                      ({prompt.reviewCount || reviewList.length})
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Creator Information */}
            <div className="bg-[#0f0d1f] border border-purple-950/30 rounded-2xl p-5">
              <h3 className="text-base font-bold text-white mb-4">Creator Information</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                  <HiOutlineUser className="text-purple-300 text-lg" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{prompt.creatorName || "Creator"}</p>
                  <p className="text-zinc-500 text-xs">{prompt.creatorEmail || prompt.email || "—"}</p>
                </div>
              </div>
            </div>

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
                <option key={reason} value={reason} className="bg-[#13112b]">{reason}</option>
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
                {reportLoading ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}