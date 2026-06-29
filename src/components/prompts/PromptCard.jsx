"use client";

import Link from "next/link";
import { HiLockClosed, HiOutlineEye } from "react-icons/hi"; 

export default function PromptCard({ prompt, onViewDetails }) {
  //locked pompt condition
  const isLocked = 
    prompt.visibility?.toLowerCase() === "private" || 
    prompt.difficulty?.toLowerCase() === "premium";

  return (
    <div className="bg-[#0f0f1a] border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-200 flex flex-col">
      {/* Thumbnail */}
      <div className="relative h-44 bg-[#1a1a2e] flex items-center justify-center overflow-hidden">
        {prompt.thumbnail ? (
          <img
            src={prompt.thumbnail}
            alt={prompt.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-default-600 text-4xl">✦</span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Badges Row  */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            
            <span className="text-xs font-semibold px-3 py-1 rounded-full border border-white/20 text-white/80">
              {prompt.aiTool?.toUpperCase()}
            </span>
            {/* difficulty badge */}
            <span className="text-xs font-semibold px-3 py-1 rounded-full border border-white/20 text-white/80">
              {prompt.difficulty?.toLowerCase() === "premium" ? "PRO" : prompt.difficulty?.toUpperCase()}
            </span>
          </div>

          {/* premium badge condition*/}
          {isLocked && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase bg-red-500/15 text-red-400 border border-red-500/30">
              <HiLockClosed className="text-xs" /> PREMIUM
            </span>
          )}
        </div>

        <h3 className="text-white font-bold text-lg line-clamp-2 leading-snug">
          {prompt.title}
        </h3>

        <p className="text-default-400 text-sm line-clamp-2">
          {prompt.description}
        </p>

        <div className="flex items-center gap-1 text-default-400 text-xs">
          <span>✦</span>
          <span className="uppercase tracking-wider">{prompt.category}</span>
        </div>

        <div className="flex items-center justify-between text-default-400 text-sm mt-auto pt-2 border-t border-white/10">
          <div className="flex items-center gap-1">
            <span>👤</span>
            <span className="text-white/70 text-xs">
              {prompt.creatorName || "Unknown"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span>📋</span>
              <span>{prompt.copyCount || 0}</span>
            </span>
            <span className="flex items-center gap-1">
              <span>⭐</span>
              <span>{prompt.averageRating?.toFixed(0) || 0}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Button */}
   <div className="px-4 pb-4">
  <Link
    href={`/all-prompts/${prompt._id}`}
    className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 text-center hover:-translate-y-0.5 shadow-md hover:shadow-xl hover:shadow-violet-600/20 active:translate-y-0 text-sm group"
  >
    <HiOutlineEye className="text-lg transition-transform duration-300 group-hover:scale-110" /> 
    View Details
  </Link>
</div>
    </div>
  );
}