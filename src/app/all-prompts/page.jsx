"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { fetchPublicPrompts } from "@/lib/api/prompts";

import PromptFilters from "@/components/prompts/PromptFilters";
import PromptCard from "@/components/prompts/PromptCard";
import { SORT_OPTIONS } from "@/lib/action/promptActions";

export default function AllPromptsPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const [prompts, setPrompts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [aiTool, setAiTool] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [sort, setSort] = useState("latest");

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

  useEffect(() => {
    setPage(1);
  }, [search, category, aiTool, difficulty, sort]);

  
  const handleViewDetails = (id) => {
    if (!id) {
      console.error("Prompt ID is missing!");
      return;
    }
    
   
    const promptId = typeof id === 'object' ? (id?.$oid || id?.toString()) : id;
    

    router.push(`/all-prompts/${promptId}`);
  };

  const handleClear = () => {
    setSearch("");
    setCategory("");
    setAiTool("");
    setDifficulty("");
    setSort("latest");
  };

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Search prompts, tags, AI tool..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0f0f1a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-default-400 focus:outline-none focus:border-primary transition-all"
          />
        </div>

        <div className="flex gap-6">
          {/* Left Sidebar */}
          <PromptFilters
            category={category}
            setCategory={setCategory}
            aiTool={aiTool}
            setAiTool={setAiTool}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            onClear={handleClear}
          />

          {/* Right Content */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="bg-[#0f0f1a] border border-white/10 rounded-xl px-5 py-3 flex items-center gap-3 mb-6 flex-wrap">
              <span className="text-default-400 text-sm">Sort By:</span>
              {SORT_OPTIONS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSort(s.key)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    sort === s.key
                      ? "bg-primary text-white"
                      : "text-default-400 hover:text-white"
                  }`}
                >
                  {s.label}
                </button>
              ))}
              <span className="ml-auto text-default-500 text-xs">
                {total} prompts
              </span>
            </div>

            {/* Results */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : prompts.length === 0 ? (
              <div className="text-center py-20 text-default-400">
                <p className="text-5xl mb-4">🤖</p>
                <p className="text-xl font-medium text-white">
                  No prompts found
                </p>
                <p className="text-sm mt-2">
                  Try different search terms or filters
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {prompts.map((prompt) => (
                    <PromptCard
                      key={prompt._id}
                      prompt={prompt}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                            page === p
                              ? "bg-primary text-white"
                              : "bg-[#0f0f1a] text-default-400 border border-white/10 hover:border-primary"
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}
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