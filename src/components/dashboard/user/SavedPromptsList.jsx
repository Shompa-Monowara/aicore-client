"use client";

import { useState } from "react";
import Link from "next/link";
import { toggleBookmark } from "@/lib/action/interactions";
import toast from "react-hot-toast";
import { HiOutlineEye, HiOutlineTrash } from "react-icons/hi";

export default function SavedPromptsList({ prompts, email }) {
  const [items, setItems] = useState(prompts);
  const [removingId, setRemovingId] = useState(null);

  const handleRemoveBookmark = async (promptId) => {
    setRemovingId(promptId);
    try {
      const result = await toggleBookmark(email, promptId);
      if (result.bookmarked === false) {
        setItems((prev) => prev.filter((p) => p._id !== promptId));
        toast.success("Bookmark removed");
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6">
      {items.map((prompt) => (
        <div
          key={prompt._id}
          className="bg-zinc-900/30 border border-purple-950/20 rounded-xl overflow-hidden flex flex-col"
        >
          {/* Thumbnail */}
          <div className="h-36 bg-zinc-900/50 flex items-center justify-center overflow-hidden">
            {prompt.thumbnail ? (
              <img
                src={prompt.thumbnail}
                alt={prompt.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-zinc-600 text-3xl">✦</span>
            )}
          </div>

          {/* Body */}
          <div className="p-4 flex flex-col gap-2 flex-1">
            <div className="flex flex-wrap gap-2">
              <span className="text-[11px] font-bold uppercase px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                {prompt.aiTool}
              </span>
              <span className="text-[11px] font-bold uppercase px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                {prompt.category}
              </span>
            </div>
            <h3 className="text-white font-bold line-clamp-2">{prompt.title}</h3>
            <p className="text-zinc-500 text-sm line-clamp-2">{prompt.description}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 p-4 pt-0">
            <Link
              href={`/all-prompts/${prompt._id}`}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 transition-all"
            >
              <HiOutlineEye className="text-base" /> View Details
            </Link>
            <button
              onClick={() => handleRemoveBookmark(prompt._id)}
              disabled={removingId === prompt._id}
              title="Remove Bookmark"
              className="p-2.5 rounded-xl text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors disabled:opacity-40"
            >
              <HiOutlineTrash className="text-base" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}