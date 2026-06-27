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
import EditPromptModal from "../user/EditPromptModal"; 
import AnalyticsModal from "../user/AnalyticsModal"; 

const statusStyles = {
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.05)]",
  approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/10 shadow-[0_0_12px_rgba(16,185,129,0.05)]",
  rejected: "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_12px_rgba(244,63,94,0.05)]",
};

// 🎯 পেরেন্ট থেকে 'token' প্রপ্স রিসিভ করা হলো
export default function CreatorMyPromptsTable({ prompts, token }) {
  const [items, setItems] = useState(prompts || []);
  const [deletingId, setDeletingId] = useState(null);
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [viewingAnalytics, setViewingAnalytics] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this prompt?")) return;
    setDeletingId(id);
    try {
      // 🎯 ডিলিট অ্যাকশনে সার্ভার টোকেন পাস করা হলো
      const result = await deletePrompt(id, token);
      if (result && result.deletedCount > 0) {
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
      <div className="w-full text-sm overflow-x-auto block scrollbar-thin scrollbar-thumb-purple-950/40">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-purple-950/30 bg-zinc-950/40 text-zinc-400 font-black text-[10px] tracking-widest uppercase">
              <th className="px-6 py-4.5">Prompt Blueprint</th>
              <th className="px-4 py-4.5">AI Engine</th>
              <th className="px-4 py-4.5">Visibility</th>
              <th className="px-4 py-4.5">Status</th>
              <th className="px-4 py-4.5 text-center">Copies</th>
              <th className="px-4 py-4.5">Rating</th>
              <th className="px-6 py-4.5 text-right">Actions Panel</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-950/10 text-zinc-300">
            {items?.map((prompt) => (
              <tr key={prompt._id} className="hover:bg-purple-950/5 transition-colors duration-150 group">
                <td className="px-6 py-4">
                  <p className="text-white font-bold text-sm tracking-tight line-clamp-1 group-hover:text-purple-400 transition-colors">{prompt.title}</p>
                  <p className="text-zinc-500 text-[11px] mt-0.5 font-medium capitalize">Category: {prompt.category}</p>
                </td>
                
                <td className="px-4 py-4">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-zinc-900 text-purple-400 border border-purple-950/40">
                    {prompt.aiTool || "—"}
                  </span>
                </td>
                
                <td className="px-4 py-4 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                  {prompt.visibility || "Public"}
                </td>
                
                <td className="px-4 py-4">
                  <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase border ${statusStyles[prompt.status] || statusStyles.pending}`}>
                    {prompt.status || "PENDING"}
                  </span>
                </td>
                
                <td className="px-4 py-4 text-center text-white font-black text-sm font-mono">
                  {prompt.copyCount || 0}
                </td>
                
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1 text-xs font-black text-zinc-300 font-mono">
                    <HiStar className="text-amber-500 text-base drop-shadow-[0_0_8px_rgba(245,158,11,0.2)]" />
                    <span>{prompt.averageRating ? prompt.averageRating.toFixed(1) : "0.0"}</span>
                  </div>
                </td>
                
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/all-prompts/${prompt._id}`}
                      className="p-2 rounded-xl bg-zinc-900/40 border border-purple-950/30 text-zinc-500 hover:text-white hover:border-purple-500/40 transition-all cursor-pointer"
                      title="View Details"
                    >
                      <HiOutlineEye className="text-base" />
                    </Link>
                    
                    <button
                      onClick={() => setEditingPrompt(prompt)}
                      className="p-2 rounded-xl bg-zinc-900/40 border border-purple-950/30 text-zinc-500 hover:text-white hover:border-purple-500/40 transition-all cursor-pointer"
                      title="Update"
                    >
                      <HiOutlinePencil className="text-base" />
                    </button>
                    
                    <button
                      onClick={() => setViewingAnalytics(prompt)}
                      className="p-2 rounded-xl bg-zinc-900/40 border border-purple-950/30 text-zinc-500 hover:text-white hover:border-purple-500/40 transition-all cursor-pointer"
                      title="View Analytics"
                    >
                      <HiOutlineChartBar className="text-base" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(prompt._id)}
                      disabled={deletingId === prompt._id}
                      className="p-2 rounded-xl bg-zinc-900/40 border border-purple-950/30 text-zinc-500 hover:text-rose-400 hover:border-rose-500/30 transition-all disabled:opacity-30 cursor-pointer"
                      title="Delete"
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

      {editingPrompt && (
        <EditPromptModal
          prompt={editingPrompt}
          onClose={() => setEditingPrompt(null)}
          onUpdated={handleUpdated}
          token={token} 
        />
      )}

      {viewingAnalytics && (
        <AnalyticsModal
          prompt={viewingAnalytics}
          onClose={() => setViewingAnalytics(null)}
        />
      )}
    </>
  );
}