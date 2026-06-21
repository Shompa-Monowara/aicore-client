"use client";

import { useState } from "react";
import { deletePrompt } from "@/lib/action/prompts";
import toast from "react-hot-toast";
import Link from "next/link";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineChartBar } from "react-icons/hi";

const statusStyles = {
  pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  approved: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  rejected: "bg-red-500/15 text-red-300 border-red-500/30",
};

export default function MyPromptsTable({ prompts }) {
  const [items, setItems] = useState(prompts);
  const [deletingId, setDeletingId] = useState(null);

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

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-purple-950/20 text-left text-zinc-500 uppercase text-[11px] tracking-wider">
            <th className="px-5 py-4">Title</th>
            <th className="px-5 py-4">Category</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Copies</th>
            <th className="px-5 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((prompt) => (
            <tr key={prompt._id} className="border-b border-purple-950/10 hover:bg-zinc-900/30 transition-colors">
              <td className="px-5 py-4 text-white font-medium">{prompt.title}</td>
              <td className="px-5 py-4 text-zinc-400 capitalize">{prompt.category}</td>
              <td className="px-5 py-4">
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase border ${statusStyles[prompt.status] || statusStyles.pending}`}>
                  {prompt.status}
                </span>
              </td>
              <td className="px-5 py-4 text-zinc-400">{prompt.copyCount || 0}</td>
              <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/dashboard/user/my-prompts/${prompt._id}/edit`}
                    className="p-2 rounded-lg text-zinc-400 hover:bg-purple-500/10 hover:text-purple-300 transition-colors"
                    title="Update"
                  >
                    <HiOutlinePencil className="text-base" />
                  </Link>
                  <Link
                    href={`/dashboard/user/my-prompts/${prompt._id}/analytics`}
                    className="p-2 rounded-lg text-zinc-400 hover:bg-orange-500/10 hover:text-orange-300 transition-colors"
                    title="View Analytics"
                  >
                    <HiOutlineChartBar className="text-base" />
                  </Link>
                  <button
                    onClick={() => handleDelete(prompt._id)}
                    disabled={deletingId === prompt._id}
                    className="p-2 rounded-lg text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-40"
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
  );
}