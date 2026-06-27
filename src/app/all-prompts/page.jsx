"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation"; 
import { authClient } from "@/lib/auth-client";
import { fetchPublicPrompts } from "@/lib/api/prompts";

import PromptFilters from "@/components/prompts/PromptFilters";
import PromptCard from "@/components/prompts/PromptCard";
import { SORT_OPTIONS } from "@/lib/action/promptActions";

const getPageNumbers = (page, totalPages) => {
  const pages = [];
  pages.push(1);
  if (page > 3) {
    pages.push("ellipsis");
  }
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  if (page < totalPages - 2) {
    pages.push("ellipsis");
  }
  if (totalPages > 1) {
    pages.push(totalPages);
  }
  return pages;
};

export default function AllPromptsPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const searchParams = useSearchParams(); 

  const querySearch = searchParams.get("search") || "";

  const [prompts, setPrompts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState(querySearch); 
  const [category, setCategory] = useState("");
  const [aiTool, setAiTool] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [sort, setSort] = useState("latest");

  useEffect(() => {
    if (querySearch) {
      setSearch(querySearch);
      setPage(1);
    }
  }, [querySearch]);

  const loadPrompts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPublicPrompts({
        search,
        category,
        aiTool,
        difficulty,
        sort,
        page,
      });
      setPrompts(data.data || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, category, aiTool, difficulty, sort, page]);

  useEffect(() => {
    loadPrompts();
  }, [loadPrompts]);

  const handleViewDetails = (id) => {
    if (!id) return;
    const promptId = typeof id === "object" ? (id?.$oid || id?.toString()) : id;
    if (!session) {
      router.push("/auth/login");
    } else {
      router.push(`/all-prompts/${promptId}`);
    }
  };

  const handleClear = () => {
    setSearch("");
    setCategory("");
    setAiTool("");
    setDifficulty("");
    setSort("latest");
    router.push("/all-prompts");
  };

  const startItem = total === 0 ? 0 : (page - 1) * 9 + 1;
  const endItem = Math.min(page * 9, total);

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      {/* 🔮 ব্যাকগ্রাউন্ড গ্লো ইফেক্ট */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-900/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 py-10 relative z-10">
        
        {/* 🔍 সার্চ বার থিম টিউনিং */}
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

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 🛠️ বাম পাশের ফিল্টার প্যানেল */}
          <div className="w-full lg:w-64 shrink-0">
            <PromptFilters
              category={category}
              setCategory={setCategory}
              aiTool={aiTool}
              setAiTool={setAiTool}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              onClear={handleClear}
            />
          </div>

          {/* 🎴 ডান পাশের মেইন গ্রিড এরিয়া */}
          <div className="flex-1">
            
            {/* 📊 সর্টিং টগল প্যানেল */}
            <div className="bg-zinc-900/10 border border-purple-950/20 rounded-2xl px-5 py-3.5 flex items-center gap-3 mb-6 flex-wrap backdrop-blur-sm">
              <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Sort By:</span>
              <div className="flex gap-2 flex-wrap">
                {SORT_OPTIONS.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setSort(s.key)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      sort === s.key
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-500/30 shadow-lg shadow-purple-950/30"
                        : "text-zinc-400 bg-zinc-900/30 border-zinc-800/50 hover:text-white hover:border-zinc-700"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 🌀 লোডিং অ্যানিমেশন */}
            {loading ? (
              <div className="flex justify-center items-center py-32">
                <div className="w-10 h-10 border-[3px] border-purple-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : prompts.length === 0 ? (
              /* 🤖 নো ডাটা ফাউন্ড কার্ড */
              <div className="text-center py-28 bg-zinc-900/10 border border-purple-950/10 rounded-3xl backdrop-blur-sm">
                <p className="text-4xl mb-4">🤖</p>
                <h3 className="text-lg font-bold text-white">No Prompts Found</h3>
                <p className="text-zinc-500 text-xs mt-1.5 max-w-xs mx-auto leading-relaxed">
                  We couldn't find any match. Try resetting your tags or adjusting search parameters.
                </p>
                <button 
                  onClick={handleClear}
                  className="mt-5 px-5 py-2 text-xs font-bold text-purple-400 hover:text-purple-300 bg-purple-950/20 border border-purple-900/30 rounded-xl transition-all cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* 🎴 প্রম্পট কার্ডস গ্রিড */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {prompts.map((prompt) => (
                    <PromptCard
                      key={prompt._id}
                      prompt={prompt}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>

                {/* 📊 প্রিমিয়াম কাস্টম পেজিনেশন */}
                {totalPages > 1 && (
                  <div className="flex flex-col items-center gap-4 mt-12 w-full pt-6 border-t border-purple-950/10">
                    <p className="text-zinc-500 text-xs font-medium">
                      Showing <span className="text-zinc-300">{startItem}-{endItem}</span> of <span className="text-zinc-300">{total}</span> assets
                    </p>
                    
                    <div className="flex items-center gap-2 select-none">
                      {/* Previous Button */}
                      <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="px-4 py-2 rounded-xl bg-zinc-900/30 border border-purple-950/30 text-zinc-400 text-xs font-bold hover:text-white hover:border-purple-500/40 disabled:opacity-40 disabled:hover:border-purple-950/30 disabled:hover:text-zinc-400 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
                      >
                        &larr; Prev
                      </button>

                      {/* Page Numbers & Ellipsis */}
                      {getPageNumbers(page, totalPages).map((p, i) =>
                        p === "ellipsis" ? (
                          <span
                            key={`ellipsis-${i}`}
                            className="px-2 py-1 text-zinc-600 font-bold"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                              p === page
                                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-500/30 shadow-md shadow-purple-950/20"
                                : "bg-zinc-900/20 border-purple-950/30 text-zinc-400 hover:text-white hover:border-purple-500/40"
                            }`}
                          >
                            {p}
                          </button>
                        )
                      )}

                      {/* Next Button */}
                      <button
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        className="px-4 py-2 rounded-xl bg-zinc-900/30 border border-purple-950/30 text-zinc-400 text-xs font-bold hover:text-white hover:border-purple-500/40 disabled:opacity-40 disabled:hover:border-purple-950/30 disabled:hover:text-zinc-400 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
                      >
                        Next &rarr;
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}