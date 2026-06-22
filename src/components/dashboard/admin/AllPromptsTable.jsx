"use client";

import { useState } from "react";
import {
  deletePrompt,
} from "@/lib/action/prompts";
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
  pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  approved: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  rejected: "bg-red-500/15 text-red-300 border-red-500/30",
};

export default function AllPromptsTable({ prompts }) {
  const [items, setItems] = useState(prompts);
  const [busyId, setBusyId] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null); // { id } যখন reject modal খোলা
  const [feedbackText, setFeedbackText] = useState("");

  const handleApprove = async (id) => {
    setBusyId(id);
    try {
      const result = await updatePromptStatus(id, "approved");
      if (result.modifiedCount > 0) {
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
      const result = await updatePromptStatus(rejectTarget, "rejected", feedbackText);
      if (result.modifiedCount > 0) {
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
      const result = await togglePromptFeatured(id, !current);
      if (result.modifiedCount > 0) {
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
      const result = await deletePrompt(id);
      if (result.deletedCount > 0) {
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
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-purple-950/20 text-left text-zinc-500 uppercase text-[11px] tracking-wider">
              <th className="px-5 py-4">Template Title</th>
              <th className="px-5 py-4">Creator</th>
              <th className="px-5 py-4">AI Engine</th>
              <th className="px-5 py-4">Visibility</th>
              <th className="px-5 py-4">Featured</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr
                key={p._id}
                className="border-b border-purple-950/10 hover:bg-zinc-900/30 transition-colors"
              >
                <td className="px-5 py-4">
                  <p className="text-white font-medium">{p.title}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">Category: {p.category}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-white">{p.creatorName || p.email}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{p.email}</p>
                </td>
                <td className="px-5 py-4">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    {p.aiTool}
                  </span>
                </td>
                <td className="px-5 py-4 text-zinc-300 capitalize">{p.visibility}</td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => handleToggleFeature(p._id, p.featured)}
                    disabled={busyId === p._id}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold border transition-colors disabled:opacity-40 ${
                      p.featured
                        ? "bg-amber-500/15 text-amber-300 border-amber-500/40"
                        : "bg-zinc-900/40 text-zinc-500 border-zinc-700/40 hover:border-zinc-600"
                    }`}
                  >
                    {p.featured ? <HiStar className="text-sm" /> : <HiOutlineStar className="text-sm" />}
                    {p.featured ? "Featured" : "Feature"}
                  </button>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase border ${
                      statusStyles[p.status] || statusStyles.pending
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    
                    <button
                      disabled
                      title="View Details (coming soon)"
                      className="p-2 rounded-lg text-zinc-500 bg-zinc-900/40 cursor-not-allowed"
                    >
                      <HiOutlineEye className="text-base" />
                    </button>

                    <button
                      onClick={() => handleApprove(p._id)}
                      disabled={busyId === p._id || p.status === "approved"}
                      title="Approve"
                      className="p-2 rounded-lg text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors disabled:opacity-30"
                    >
                      <HiOutlineCheckCircle className="text-base" />
                    </button>

                    <button
                      onClick={() => openRejectModal(p._id)}
                      disabled={busyId === p._id || p.status === "rejected"}
                      title="Reject"
                      className="p-2 rounded-lg text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors disabled:opacity-30"
                    >
                      <HiOutlineXCircle className="text-base" />
                    </button>

                    <button
                      onClick={() => handleDelete(p._id)}
                      disabled={busyId === p._id}
                      title="Delete"
                      className="p-2 rounded-lg text-zinc-400 bg-zinc-900/40 hover:bg-red-500/20 hover:text-red-400 transition-colors disabled:opacity-30"
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

      {/* Reject Feedback Modal */}
      {rejectTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-md bg-[#13112b] border border-purple-950/40 rounded-2xl p-6">
            <h3 className="text-white font-bold text-lg">Reject Prompt</h3>
            <p className="text-zinc-500 text-sm mt-1">
              Provide feedback explaining why this prompt does not meet platform guidelines.
            </p>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={4}
              placeholder="e.g. Content violates copyright guidelines..."
              className="w-full mt-4 bg-[#0b0813]/60 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/50 transition-colors resize-none"
            />
            <div className="flex items-center justify-end gap-3 mt-5">
              <button
                onClick={() => setRejectTarget(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:bg-zinc-900/40 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                disabled={busyId === rejectTarget}
                className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50"
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