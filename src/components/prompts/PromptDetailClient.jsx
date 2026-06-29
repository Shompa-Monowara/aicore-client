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
  token,
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

  const handleCopy = async () => {
    if (!liveUser) return requireLogin();
    if (isLocked) {
      toast.error("Subscribe to Premium to copy this prompt.");
      goToPayment();
      return;
    }
    try {
      const result = await incrementCopyCount(prompt._id, liveUser.email, token);
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
      const result = await toggleBookmark(liveUser.email, prompt._id.toString(), token);
      setIsBookmarked(result.bookmarked);
      if (typeof result.bookmarkCount === "number") {
        setBookmarkCount(result.bookmarkCount);
      } else {
        setBookmarkCount((prev) => (result.bookmarked ? prev + 1 : Math.max(0, prev - 1)));
      }
      toast.success(result.bookmarked ? "Prompt bookmarked!" : "Bookmark removed!");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!liveUser) return requireLogin();
    if (isLocked && liveUser?.role !== "admin") {
      toast.error("Subscribe to Premium to review this prompt.");
      return;
    }
    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }
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
      } else {
        toast.error(result.message || "Could not submit review.");
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
      } else {
        toast.error(result.message || "Could not submit report.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080810] text-white relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-900/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 py-10 relative z-10">

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-purple-400 transition-colors group mb-8 cursor-pointer"
        >
          <HiArrowLeft className="transform group-hover:-translate-x-0.5 transition-transform" />
          Back to previous page
        </button>

        <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8 pb-6 border-b border-purple-950/20">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {isLocked && (
                <span className="flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-950 text-purple-400 border border-purple-900/30 shadow-[0_0_15px_rgba(147,51,234,0.1)]">
                  <HiLockClosed className="text-xs" /> Premium Locked
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">{prompt.title}</h1>
            <p className="text-zinc-400 text-sm max-w-3xl leading-relaxed">{prompt.description}</p>
            {Array.isArray(prompt.tags) && prompt.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {prompt.tags.map((tag, idx) => (
                  <span key={idx} className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-zinc-900/40 text-zinc-400 border border-purple-950/20">
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
              className={`p-3 rounded-xl border transition-all cursor-pointer disabled:opacity-40 ${
                isBookmarked
                  ? "bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-950/30"
                  : "bg-zinc-900/20 text-zinc-400 border-purple-950/20 hover:border-purple-500/30 hover:text-white"
              }`}
            >
              {isBookmarked ? <HiBookmark className="text-lg" /> : <HiOutlineBookmark className="text-lg" />}
            </button>
            <button
              onClick={() => { if (!liveUser) return requireLogin(); setReportOpen(true); }}
              className="p-3 rounded-xl border bg-zinc-900/20 text-zinc-500 border-purple-950/20 hover:border-rose-500/30 hover:text-rose-400 transition-all cursor-pointer"
            >
              <HiOutlineFlag className="text-lg" />
            </button>
          </div>
        </div>

        {prompt.thumbnail && (
          <div className="w-full max-h-72 overflow-hidden rounded-2xl mb-8 border border-purple-950/20">
            <img src={prompt.thumbnail} alt={prompt.title} className="w-full h-full object-cover opacity-80" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-6">

            <div className="bg-zinc-900/10 border border-purple-950/20 rounded-2xl p-5 relative overflow-hidden backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-white">Prompt Template Workspace</h2>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 transition-all shadow-md shadow-purple-950/30 cursor-pointer hover:opacity-95"
                >
                  <HiOutlineClipboardCopy className="text-base" />
                  {isLocked ? "Unlock Code Structure" : "Copy Template"}
                </button>
              </div>

              <div onClick={handleContentClick} className={isLocked ? "cursor-pointer" : ""}>
                <pre 
                  style={isLocked ? { filter: "blur(6px)", userSelect: "none", pointerEvents: "none" } : {}}
                  className="whitespace-pre-wrap font-mono text-xs text-purple-300 bg-[#0f111a]/40 border border-purple-950/30 rounded-xl p-4 min-h-[140px] leading-relaxed"
                >
                  {prompt.content}
                </pre>
              </div>

              {isLocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#080810]/90 backdrop-blur-sm rounded-2xl px-6 text-center">
                  <HiLockClosed className="text-3xl text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]" />
                  <h3 className="text-white font-bold mt-3 text-sm">Premium Prompt Locked</h3>
                  <p className="text-zinc-500 text-xs mt-1.5 max-w-xs leading-relaxed">
                    This is a private, high-tier prompt architecture. Subscribe to premium deployment workspace to unlock the full layout.
                  </p>
                  <Link 
                    href={`/payment?prompt_id=${prompt._id}`} 
                    className="mt-5 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg shadow-purple-950/40 text-center inline-block"
                  >
                    Subscribe to Premium ($5)
                  </Link>
                </div>
              )}

              {!isLocked && <p className="text-zinc-600 text-[11px] font-medium mt-3">Copied {copyCount} times within the ecosystem.</p>}
            </div>

            {prompt.usageInstructions && (
              <div className="bg-zinc-900/10 border border-purple-950/20 rounded-2xl p-5 backdrop-blur-sm">
                <h2 className="text-sm font-bold uppercase tracking-wider text-white mb-3">Deployment Guide</h2>
                <p className="text-zinc-400 text-xs leading-relaxed whitespace-pre-wrap">{prompt.usageInstructions}</p>
              </div>
            )}

            <div className="bg-zinc-900/10 border border-purple-950/20 rounded-2xl p-5 backdrop-blur-sm space-y-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Community Reviews ({reviewList.length})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

                <div className="bg-[#0f111a]/40 border border-purple-950/20 rounded-xl p-4 flex flex-col justify-center min-h-[240px]">
                  {isLocked ? (
                    <div className="flex flex-col items-center text-center p-4">
                      <HiLockClosed className="text-xl text-zinc-700 mb-2" />
                      <p className="text-zinc-500 text-xs leading-relaxed">Workspace is locked. Subscribe to premium to post validation ratings.</p>
                    </div>
                  ) : reviewList.some((r) => r.email === liveUser?.email) ? (
                    <div className="flex items-start gap-2.5 p-4 bg-purple-950/20 border border-purple-900/20 rounded-xl text-purple-400 py-6">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full border border-purple-500/30 text-[10px] mt-0.5 shrink-0">✓</div>
                      <p className="text-xs font-bold leading-relaxed">
                        You have already reviewed this prompt template. Thank you for logging your validation feedback!
                      </p>
                    </div>
                  ) : (
                    <>
                      <span className="text-[10px] font-black tracking-widest text-purple-400 uppercase mb-3">Submit a Review</span>
                      <span className="text-[9px] font-black text-zinc-500 tracking-wider uppercase mb-1">RATING INDEX</span>
                      <div className="flex items-center gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button 
                            key={star} 
                            onClick={() => {
                              setRating(star);
                              toast.success(`Selected ${star} ${star === 1 ? "star" : "stars"}!`);
                            }} 
                            type="button"
                            className="cursor-pointer"
                          >
                            {star <= rating
                              ? <HiStar className="text-xl text-amber-400" />
                              : <HiOutlineStar className="text-xl text-zinc-700" />}
                          </button>
                        ))}
                      </div>
                      <span className="text-[9px] font-black text-zinc-500 tracking-wider uppercase mb-1">FEEDBACK COMMENT</span>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                        placeholder="Write your review here. What configurations worked? How did you optimize it?"
                        className="w-full bg-[#080810]/60 border border-purple-950/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500/40 transition-colors resize-none"
                      />
                      <button
                        onClick={handleSubmitReview}
                        disabled={reviewLoading}
                        className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {reviewLoading ? "Submitting..." : "Publish Review"}
                      </button>
                    </>
                  )}
                </div>

                <div className="flex flex-col gap-3 max-h-[240px] overflow-y-auto pr-1">
                  {reviewList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-12 bg-[#0f111a]/20 border border-purple-950/10 rounded-xl min-h-[240px]">
                      <HiOutlineUser className="text-zinc-700 text-xl mb-2" />
                      <p className="text-zinc-600 text-xs px-4">No validation deployment notes posted yet for this layout.</p>
                    </div>
                  ) : (
                    reviewList.map((r, i) => (
                      <div key={i} className="bg-[#0f111a]/30 border border-purple-950/20 rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-purple-950 flex items-center justify-center border border-purple-900/30">
                              <HiOutlineUser className="text-purple-400 text-xs" />
                            </div>
                            <div>
                              <p className="text-white font-bold text-xs truncate max-w-[110px]">{r.name}</p>
                            </div>
                          </div>
                          <p className="text-zinc-600 text-[10px] font-mono">
                            {new Date(r.createdAt).toLocaleDateString("en-US", {
                              month: "short", day: "numeric", year: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) =>
                            star <= r.rating ? (
                              <HiStar key={star} className="text-xs text-amber-500" />
                            ) : (
                              <HiOutlineStar key={star} className="text-xs text-zinc-700" />
                            )
                          )}
                        </div>
                        <p className="text-zinc-400 text-xs leading-relaxed italic">
                          {`"${r.comment}"`}
                        </p>
                      </div>
                    ))
                  )}
                </div>

              </div>
            </div>

          </div>

          <div className="space-y-5">

            <div className="bg-zinc-900/10 border border-purple-950/20 rounded-2xl p-5 backdrop-blur-sm">
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-4">Template Specification</h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: "AI Engine Base", value: prompt.aiTool, badge: true },
                  { label: "Core Category", value: prompt.category, badge: true },
                  { label: "Target Complexity", value: prompt.difficulty || "Standard", badge: true },
                  { label: "Graph Privacy", value: prompt.visibility, badge: false },
                  { label: "Workspace Copies", value: copyCount, badge: false },
                  { label: "Global Bookmarks", value: bookmarkCount, badge: false },
                ].map(({ label, value, badge }, i, arr) => (
                  <div key={label}>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 text-xs font-semibold">{label}</span>
                      {badge ? (
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wide bg-zinc-900 text-zinc-300 border border-purple-950/40">
                          {value}
                        </span>
                      ) : (
                        <span className="text-white text-xs font-black uppercase tracking-wide">{value}</span>
                      )}
                    </div>
                    {i < arr.length - 1 && <div className="h-px bg-purple-950/10 mt-3" />}
                  </div>
                ))}
                <div className="h-px bg-purple-950/10" />
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 text-xs font-semibold">User Experience Index</span>
                  <span className="flex items-center gap-1 text-xs font-black text-white">
                    <HiStar className="text-amber-500 text-sm" />
                    {prompt.averageRating ? prompt.averageRating.toFixed(1) : "0.0"}
                    <span className="text-zinc-600 font-medium">
                      ({prompt.reviewCount || reviewList.length})
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/10 border border-purple-950/20 rounded-2xl p-5 backdrop-blur-sm">
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-4">Verified Prompt Architect</h3>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-400 text-purple-950 font-black border border-purple-500/30 flex items-center justify-center shrink-0">
                  <HiOutlineUser className="text-base" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white font-bold text-xs truncate">{prompt.creatorName || "Anonymous Architect"}</p>
                  <p className="text-zinc-600 text-[11px] font-mono truncate mt-0.5">{prompt.creatorEmail || prompt.email || "—"}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {reportOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-md bg-[#080810] border border-purple-950/50 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div>
              <h3 className="text-white font-black text-lg tracking-tight">Report Asset Architecture</h3>
              <p className="text-zinc-500 text-xs mt-0.5">Help us keep the marketplace safe. Identify the core policy violation issue.</p>
            </div>

            <div>
              <span className="text-[10px] font-black text-purple-400 tracking-wider uppercase block mb-1.5">Violation Reason</span>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full bg-[#0f111a] border border-purple-950/40 rounded-xl px-4 py-3 text-xs font-semibold text-zinc-300 focus:outline-none focus:border-purple-500/50 transition-colors"
              >
                {REPORT_REASONS.map((reason) => (
                  <option key={reason} value={reason} className="bg-[#080810]">{reason}</option>
                ))}
              </select>
            </div>

            <div>
              <span className="text-[10px] font-black text-purple-400 tracking-wider uppercase block mb-1.5">Context Description (optional)</span>
              <textarea
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                rows={3}
                placeholder="Provide specific details regarding broken output tokens, licensing bugs, or copyright behaviors..."
                className="w-full bg-[#0f111a] border border-purple-950/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setReportOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReport}
                disabled={reportLoading}
                className="px-4 py-2 rounded-xl text-xs font-black text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-950/30 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {reportLoading ? "Processing..." : "Dispatch Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}