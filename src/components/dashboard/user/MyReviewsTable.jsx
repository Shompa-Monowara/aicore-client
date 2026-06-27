"use client";

import React from "react";
import Link from "next/link";
import { HiStar, HiOutlineEye, HiOutlineCalendar } from "react-icons/hi";

export default function MyReviewsTable({ reviews }) {
  return (
    <div className="w-full text-sm overflow-x-auto block scrollbar-thin scrollbar-thumb-purple-950/40">
      <table className="w-full text-left border-collapse min-w-[850px]">
        <thead>
        
          <tr className="border-b border-purple-950/30 bg-zinc-950/40 text-zinc-400 font-black text-[10px] tracking-widest uppercase">
            <th className="px-6 py-4.5">Prompt Blueprint</th>
            <th className="px-5 py-4.5">AI Engine</th>
            <th className="px-5 py-4.5">Rating Index</th>
            <th className="px-5 py-4.5">Feedback Note</th>
            <th className="px-5 py-4.5">Submitted Date</th>
            <th className="px-6 py-4.5 text-right">Actions Panel</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-purple-950/10 text-zinc-300">
          {reviews.map((review, i) => (
           
            <tr
              key={i}
              className="hover:bg-purple-950/5 transition-colors duration-150 group"
            >
              <td className="px-6 py-4">
                <p className="text-white font-bold text-sm tracking-tight group-hover:text-purple-400 transition-colors">
                  {review.promptTitle || "Untitled Prompt Layout"}
                </p>
              </td>
              
              <td className="px-5 py-4">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-zinc-900 text-purple-400 border border-purple-950/40">
                  {review.aiTool || "—"}
                </span>
              </td>
              
              <td className="px-5 py-4">
                <div className="flex items-center gap-1 text-xs font-black text-zinc-300 font-mono">
                  <HiStar className="text-amber-500 text-base drop-shadow-[0_0_8px_rgba(245,158,11,0.2)]" />
                  <span>{review.rating ? review.rating.toFixed(1) : "0.0"}</span>
                </div>
              </td>
              
              <td className="px-5 py-4 text-zinc-400 font-medium max-w-[220px] truncate italic">
               
                {review.comment ? `"${review.comment}"` : "—"}
              </td>
              
              <td className="px-5 py-4">
                <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-mono">
                  <HiOutlineCalendar className="text-purple-400/80 text-sm" />
                  {review.createdAt
                    ? new Date(review.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"}
                </div>
              </td>
              
              <td className="px-6 py-4 text-right">
            
                <Link
                  href={`/all-prompts/${review.promptId}`}
                  title="Inspect prompt asset blueprint"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-zinc-400 bg-zinc-900/40 border border-purple-950/30 hover:bg-zinc-900 hover:text-white hover:border-purple-500/40 transition-all cursor-pointer"
                >
                  <HiOutlineEye className="text-base" /> Inspect
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}