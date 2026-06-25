"use client";

import { useState } from "react";
import { deletePrompt } from "@/lib/action/prompts";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineChartBar,
  HiOutlineEye,
  HiStar,
} from "react-icons/hi";
import EditPromptModal from "./EditPromptModal";
import AnalyticsModal from "./AnalyticsModal"; // 🎯 ইমপোর্ট করা হলো

const statusStyles = {
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function MyPromptsTable({ prompts }) {
  const [items, setItems] = useState(prompts);
  const [deletingId, setDeletingId] = useState(null);
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [viewingAnalytics, setViewingAnalytics] = useState(null); // 🎯 নতুন স্টেট

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this prompt?")) return;
    setDeletingId(id);
    try {
      const result = await deletePrompt(id);
      if (result.deletedCount > 0) {
        setItems((prev) => prev.filter((p) => p._id !== id));
        toast.success("Prompt deleted successfully!");
      } else {
        toast.error("Could not delete prompt.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdated = (updatedPrompt) => {
    setItems((prev) => prev.map((p) => (p._id === updatedPrompt._id ? updatedPrompt : p)));
  };

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="overflow-x-auto border border-purple-950/30 rounded-2xl bg-[#070510]/40 backdrop-blur-md shadow-2xl">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-purple-950/40 bg-[#070510]/50 text-zinc-400 font-bold text-xs tracking-wider uppercase">
                <th className="px-6 py-4">Title</th>
                <th className="px-4 py-4">AI Engine</th>
                <th className="px-4 py-4">Visibility</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4 text-center">Copies</th>
                <th className="px-4 py-4">Rating</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-950/20 text-zinc-300">
              {items.map((prompt) => (
                <tr key={prompt._id} className="hover:bg-[#13112b]/30 transition-colors duration-150">
                  <td className="px-6 py-4">
                    <p className="text-white font-bold text-sm tracking-wide line-clamp-1">{prompt.title}</p>
                    <p className="text-zinc-500 text-xs mt-0.5 capitalize">Category: {prompt.category}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-purple-950/40 text-purple-300 border border-purple-800/30">
                      {prompt.aiTool || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-zinc-300 text-xs font-semibold capitalize">
                    {prompt.visibility || "Public"}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${statusStyles[prompt.status] || statusStyles.pending}`}>
                      {prompt.status || "PENDING"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center text-white font-black text-sm">
                    {prompt.copyCount || 0}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 text-xs font-bold text-zinc-300">
                      <HiStar className="text-amber-400 text-sm" />
                      <span>{prompt.averageRating ? prompt.averageRating.toFixed(1) : "0.0"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/all-prompts/${prompt._id}`}
                        className="p-2 rounded-lg bg-[#16142e] border border-purple-950/40 text-zinc-400 hover:text-white hover:border-purple-500/40 transition-colors"
                        title="View Details"
                      >
                        <HiOutlineEye className="text-sm" />
                      </Link>
                      <button
                        onClick={() => setEditingPrompt(prompt)}
                        className="p-2 rounded-lg bg-[#16142e] border border-purple-950/40 text-zinc-400 hover:text-white hover:border-purple-500/40 transition-colors"
                        title="Update"
                      >
                        <HiOutlinePencil className="text-sm" />
                      </button>
                      
                      {/* 🎯 Analytics Button */}
                      <button
                        onClick={() => setViewingAnalytics(prompt)}
                        className="p-2 rounded-lg bg-[#16142e] border border-purple-950/40 text-zinc-400 hover:text-white hover:border-purple-500/40 transition-colors"
                        title="View Analytics"
                      >
                        <HiOutlineChartBar className="text-sm" />
                      </button>

                      <button
                        onClick={() => handleDelete(prompt._id)}
                        disabled={deletingId === prompt._id}
                        className="p-2 rounded-lg bg-[#16142e] border border-purple-950/40 text-zinc-400 hover:text-red-400 hover:border-red-500/30 transition-colors disabled:opacity-40"
                        title="Delete"
                      >
                        <HiOutlineTrash className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {editingPrompt && (
          <EditPromptModal
            prompt={editingPrompt}
            onClose={() => setEditingPrompt(null)}
            onUpdated={handleUpdated}
          />
        )}

        {/* Analytics Modal */}
        {viewingAnalytics && (
          <AnalyticsModal
            prompt={viewingAnalytics}
            onClose={() => setViewingAnalytics(null)}
          />
        )}
      </div>
    </>
  );
}