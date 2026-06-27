"use client";

import { useState } from "react";
import { deletePrompt } from "@/lib/action/prompts";
import {
  updatePromptStatus,
  togglePromptFeatured,
} from "@/lib/action/admin";
import toast from "react-hot-toast";
import {
  HiOutlineEye,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineTrash,
  HiStar,
  HiOutlineStar,
} from "react-icons/hi";

const statusStyles = {
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.05)]",
  approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.05)]",
  rejected: "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_12px_rgba(244,63,94,0.05)]",
};

// 🎯 ১. প্রপ্স এর ভেতর পেরেন্ট সার্ভার পেজ থেকে পাঠানো 'token' রিসিভ করা হলো
export default function AllPromptsTable({ prompts, token }) {
  // সেফগার্ড হিসেবে prompts || [] দেওয়া হলো যাতে লুপ কখনো ক্র্যাশ না করে
  const [items, setItems] = useState(prompts || []);
  const [busyId, setBusyId] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null); 
  const [feedbackText, setFeedbackText] = useState("");

  const handleApprove = async (id) => {
    setBusyId(id);
    try {
      // 🎯 ২. এপিআই অ্যাকশনে আর্গুমেন্ট হিসেবে টোকেন পাস করা হলো
      const result = await updatePromptStatus(id, "approved", "", token);
      if (result && result.modifiedCount > 0) {
        setItems((prev) =>
          prev.map((p) => (p._id === id ? { ...p, status: "approved" } : p))
        );
        toast.success("Prompt approved!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setBusyId(null);
    }
  };

  const openRejectModal = (id) => {
    setRejectTarget(id);
    setFeedbackText("");
  };

  const confirmReject = async () => {
    if (!feedbackText.trim()) {
      toast.error("Please provide rejection feedback.");
      return;
    }
    setBusyId(rejectTarget);
    try {
      // 🎯 ৩. রিজেক্ট অ্যাকশনে টোকেন প্যারামিটার পাস করা হলো
      const result = await updatePromptStatus(rejectTarget, "rejected", feedbackText, token);
      if (result && result.modifiedCount > 0) {
        setItems((prev) =>
          prev.map((p) =>
            p._id === rejectTarget
              ? { ...p, status: "rejected", rejectionFeedback: feedbackText }
              : p
          )
        );
        toast.success("Prompt rejected with feedback.");
        setRejectTarget(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleFeature = async (id, current) => {
    setBusyId(id);
    try {
      // 🎯 ৪. ফিচার টগলে টোকেন প্যারামিটার পাস করা হলো
      const result = await togglePromptFeatured(id, !current, token);
      if (result && result.modifiedCount > 0) {
        setItems((prev) =>
          prev.map((p) => (p._id === id ? { ...p, featured: !current } : p))
        );
        toast.success(!current ? "Marked as featured!" : "Removed from featured.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this prompt?")) return;
    setBusyId(id);
    try {
      // 🎯 ৫. ডিলিট অ্যাকশনে টোকেন প্যারামিটার পাস করা হলো
      const result = await deletePrompt(id, token);
      if (result && result.deletedCount > 0) {
        setItems((prev) => prev.filter((p) => p._id !== id));
        toast.success("Prompt deleted.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <div className="w-full text-sm overflow-x-auto block scrollbar-thin scrollbar-thumb-purple-950/40">
        <table className="w-full text-left border-collapse min-w-[950px]">
          <thead>
            <tr className="border-b border-purple-950/30 bg-zinc-950/40 text-zinc-400 font-black text-[10px] tracking-widest uppercase">
              <th className="px-6 py-4.5">Template Title</th>
              <th className="px-5 py-4.5">Creator</th>
              <th className="px-5 py-4.5">AI Engine</th>
              <th className="px-5 py-4.5">Visibility</th>
              <th className="px-5 py-4.5">Featured</th>
              <th className="px-5 py-4.5">Status</th>
              <th className="px-5 py-4.5 text-right">Actions Panel</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-950/10 text-zinc-300">
            {items?.map((p) => (
              <tr
                key={p._id}
                className="hover:bg-purple-950/5 transition-colors duration-150 group"
              >
                <td className="px-6 py-4">
                  <p className="text-white font-bold text-sm tracking-tight group-hover:text-purple-400 transition-colors">{p.title}</p>
                  <p className="text-zinc-500 text-[11px] font-medium mt-0.5 capitalize">Category: {p.category}</p>
                </td>
                
                <td className="px-5 py-4">
                  <p className="text-white font-semibold text-xs">{p.creatorName || "Anonymous Creator"}</p>
                  <p className="text-zinc-500 text-[11px] font-mono mt-0.5">{p.email}</p>
                </td>
                
                <td className="px-5 py-4">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-zinc-900 text-purple-400 border border-purple-950/40">
                    {p.aiTool || "—"}
                  </span>
                </td>
                
                <td className="px-5 py-4 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                  {p.visibility || "Public"}
                </td>
                
                <td className="px-5 py-4">
                  <button
                    onClick={() => handleToggleFeature(p._id, p.featured)}
                    disabled={busyId === p._id}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black uppercase border transition-all cursor-pointer disabled:opacity-40 ${
                      p.featured
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.1)]"
                        : "bg-zinc-900/20 text-zinc-500 border-purple-950/20 hover:border-purple-500/30 hover:text-white"
                    }`}
                  >
                    {p.featured ? <HiStar className="text-sm" /> : <HiOutlineStar className="text-sm" />}
                    {p.featured ? "Featured" : "Feature"}
                  </button>
                </td>
                
                <td className="px-5 py-4">
                  <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase border ${statusStyles[p.status] || statusStyles.pending}`}>
                    {p.status || "PENDING"}
                  </span>
                </td>
                
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      disabled
                      title="View Details (coming soon)"
                      className="p-2 rounded-xl text-zinc-600 bg-zinc-900/10 border border-purple-950/10 cursor-not-allowed"
                    >
                      <HiOutlineEye className="text-base" />
                    </button>

                    <button
                      onClick={() => handleApprove(p._id)}
                      disabled={busyId === p._id || p.status === "approved"}
                      title="Approve Asset"
                      className="p-2 rounded-xl text-emerald-400 bg-zinc-900/40 border border-purple-950/30 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all disabled:opacity-20 cursor-pointer"
                    >
                      <HiOutlineCheckCircle className="text-base" />
                    </button>

                    <button
                      onClick={() => openRejectModal(p._id)}
                      disabled={busyId === p._id || p.status === "rejected"}
                      title="Reject Asset"
                      className="p-2 rounded-xl text-rose-400 bg-zinc-900/40 border border-purple-950/30 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all disabled:opacity-20 cursor-pointer"
                    >
                      <HiOutlineXCircle className="text-base" />
                    </button>

                    <button
                      onClick={() => handleDelete(p._id)}
                      disabled={busyId === p._id}
                      title="Delete Permanently"
                      className="p-2 rounded-xl text-zinc-500 bg-zinc-900/40 border border-purple-950/30 hover:bg-rose-600 hover:text-white hover:border-rose-500/30 transition-all disabled:opacity-20 cursor-pointer"
                    >
                      <HiOutlineTrash className="text-base" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rejectTarget && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-md bg-[#080810] border border-purple-950/50 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div>
              <h3 className="text-white font-black text-lg tracking-tight">Reject Asset Blueprint</h3>
              <p className="text-zinc-500 text-xs mt-0.5">
                Provide feedback explaining why this prompt does not meet platform guidelines.
              </p>
            </div>
            
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={4}
              placeholder="e.g. Content architecture violates copyright or formatting guidelines..."
              className="w-full bg-[#0f111a] border border-purple-950/40 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
            />
            
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                disabled={busyId === rejectTarget}
                className="px-4 py-2 rounded-xl text-xs font-black text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-950/30 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}