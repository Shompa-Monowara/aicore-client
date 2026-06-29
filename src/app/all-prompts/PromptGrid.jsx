"use client";

import { Suspense } from "react";
import PromptCard from "@/components/prompts/PromptCard";
import Pagination from "./Pagination";

function PromptCardSkeleton() {
  return (
    <div className="rounded-2xl border border-purple-950/20 bg-zinc-900/10 p-5 animate-pulse">
      <div className="h-4 w-2/3 bg-zinc-800/60 rounded-lg mb-3" />
      <div className="h-3 w-full bg-zinc-800/40 rounded mb-2" />
      <div className="h-3 w-4/5 bg-zinc-800/40 rounded mb-4" />
      <div className="flex gap-2">
        <div className="h-5 w-16 bg-zinc-800/50 rounded-full" />
        <div className="h-5 w-16 bg-zinc-800/50 rounded-full" />
      </div>
    </div>
  );
}

function PromptGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <PromptCardSkeleton key={i} />
      ))}
    </div>
  );
}

function PromptList({ prompts, onViewDetails }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {prompts.map((prompt) => (
        <PromptCard
          key={prompt._id}
          prompt={prompt}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}

export default function PromptGrid({
  prompts,
  loading,
  onViewDetails,
  onClear,
  page,
  totalPages,
  total,
  onPageChange,
}) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="w-10 h-10 border-[3px] border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (prompts.length === 0) {
    return (
      <div className="text-center py-28 bg-zinc-900/10 border border-purple-950/10 rounded-3xl backdrop-blur-sm">
        <p className="text-4xl mb-4">🤖</p>
        <h3 className="text-lg font-bold text-white">No Prompts Found</h3>
        <p className="text-zinc-500 text-xs mt-1.5 max-w-xs mx-auto leading-relaxed">
          We couldn't find any match. Try resetting your tags or adjusting search parameters.
        </p>
        <button
          onClick={onClear}
          className="mt-5 px-5 py-2 text-xs font-bold text-purple-400 hover:text-purple-300 bg-purple-950/20 border border-purple-900/30 rounded-xl transition-all cursor-pointer"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <>
      <Suspense fallback={<PromptGridSkeleton />}>
        <PromptList prompts={prompts} onViewDetails={onViewDetails} />
      </Suspense>

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={onPageChange}
      />
    </>
  );
}