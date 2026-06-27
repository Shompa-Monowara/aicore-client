"use client";

import { useState } from "react";
import Link from "next/link";
import { toggleBookmark } from "@/lib/action/interactions";
import toast from "react-hot-toast";
import { HiOutlineEye, HiOutlineTrash } from "react-icons/hi";

// 🎯 পেরেন্ট থেকে 'token' প্রপ্স রিসিভ করা হলো
export default function SavedPromptsList({ prompts, email, token }) {
  const [items, setItems] = useState(prompts || []);
  const [removingId, setRemovingId] = useState(null);

  const handleRemoveBookmark = async (promptId) => {
    setRemovingId(promptId);
    try {
      // 🎯 অ্যাকশনে টোকেন প্যারামিটার পাস করা হলো
      const result = await toggleBookmark(email, promptId, token);
      if (result && result.bookmarked === false) {
        setItems((prev) => prev.filter((p) => p._id !== promptId));
        toast.success("Bookmark removed successfully!");
      } else {
        toast.error("Could not remove bookmark.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 w-full max-w-7xl mx-auto">
      {items?.map((prompt) => (
        <div
          key={prompt._id}
          className="bg-zinc-900/10 border border-purple-950/20 rounded-2xl overflow-hidden flex flex-col backdrop-blur-sm group hover:border-purple-500/20 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        >
          <div className="h-40 bg-[#0f111a]/40 border-b border-purple-950/10 flex items-center justify-center overflow-hidden relative">
            {prompt.thumbnail ? (
              <img
                src={prompt.thumbnail}
                alt={prompt.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-102 transition-all duration-300"
              />
            ) : (
              <div className="text-purple-400/30 text-4xl font-light drop-shadow-[0_0_10px_rgba(168,85,247,0.2)]">✦</div>
            )}
          </div>

          <div className="p-5 flex flex-col gap-3 flex-1">
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-zinc-900 text-purple-400 border border-purple-950/40">
                {prompt.aiTool}
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-zinc-900 text-zinc-400 border border-purple-950/40">
                {prompt.category}
              </span>
            </div>
            
            <h3 className="text-white font-bold text-base tracking-tight line-clamp-1 group-hover:text-purple-400 transition-colors">
              {prompt.title}
            </h3>
            <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2">
              {prompt.description}
            </p>
          </div>

          <div className="flex items-center gap-2 p-5 pt-0 mt-auto">
            <Link
              href={`/all-prompts/${prompt._id}`}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md shadow-purple-950/30 cursor-pointer hover:opacity-95 transition-all"
            >
              <HiOutlineEye className="text-base" /> Inspect Asset
            </Link>
            
            <button
              onClick={() => handleRemoveBookmark(prompt._id)}
              disabled={removingId === prompt._id}
              title="Remove Blueprint Bookmark"
              className="p-2.5 rounded-xl text-zinc-500 bg-zinc-900/40 border border-purple-950/30 hover:text-rose-400 hover:border-rose-500/30 transition-all disabled:opacity-30 cursor-pointer"
            >
              <HiOutlineTrash className="text-base" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}