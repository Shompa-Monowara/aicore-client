"use client";

export default function PromptCard({ prompt, onViewDetails }) {
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
        {prompt.visibility === "private" && (
          <span className="absolute top-3 right-3 bg-orange-500/90 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
            🔒 PREMIUM
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full border border-white/20 text-white/80">
            {prompt.aiTool?.toUpperCase()}
          </span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full border border-white/20 text-white/80">
            {prompt.difficulty?.toUpperCase()}
          </span>
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
        <button
          onClick={() => onViewDetails(prompt._id)}
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all"
        >
          <span>👁</span> View Details
        </button>
      </div>
    </div>
  );
}