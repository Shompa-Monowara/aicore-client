"use client";

export default function SearchBar({ search, setSearch }) {
  return (
    <div className="mb-8">
      <div className="relative group">
        <input
          type="text"
          placeholder="Search optimized prompt templates, categories, or AI architectures..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-900/20 border border-purple-950/40 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/50 focus:bg-zinc-900/40 backdrop-blur-sm transition-all text-sm group-hover:border-purple-900/30"
        />
        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 text-xs tracking-wider font-mono bg-zinc-950/60 border border-zinc-800/40 px-2.5 py-1 rounded-lg hidden sm:block">
          CTRL + K
        </span>
      </div>
    </div>
  );
}