"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { fetchPublicPrompts } from "@/lib/api/prompts";
import { SORT_OPTIONS } from "@/lib/action/promptActions";
import SearchBar from "./SearchBar";
import PromptFilters from "@/components/prompts/PromptFilters";
import PromptGrid from "./PromptGrid";

export default function AllPromptsPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initial state directly URL theke read hocche (mount er somoy ekbar)
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [aiTool, setAiTool] = useState(searchParams.get("aiTool") || "");
  const [difficulty, setDifficulty] = useState(searchParams.get("difficulty") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "latest");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const [prompts, setPrompts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const isFirstRender = useRef(true);
  const isUrlSyncFirstRender = useRef(true);

  // Search input - 400ms debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Filter/sort/search change hole page 1-e reset
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setPage(1);
  }, [debouncedSearch, category, aiTool, difficulty, sort]);

  // 🔥 URL sync — search/filter/sort/page change hole address bar update hobe
  useEffect(() => {
    if (isUrlSyncFirstRender.current) {
      isUrlSyncFirstRender.current = false;
      return; // mount-e URL already thik ache, dobara replace lagbe na
    }

    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (category) params.set("category", category);
    if (aiTool) params.set("aiTool", aiTool);
    if (difficulty) params.set("difficulty", difficulty);
    if (sort && sort !== "latest") params.set("sort", sort);
    if (page > 1) params.set("page", page);

    const query = params.toString();
    router.replace(query ? `/all-prompts?${query}` : "/all-prompts", { scroll: false });
  }, [debouncedSearch, category, aiTool, difficulty, sort, page, router]);

  const loadPrompts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPublicPrompts({
        search: debouncedSearch,
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
  }, [debouncedSearch, category, aiTool, difficulty, sort, page]);

  useEffect(() => {
    loadPrompts();
  }, [loadPrompts]);

  const handleViewDetails = (id) => {
    if (!id) return;
    const promptId =
      typeof id === "object" ? id?.$oid || id?.toString() : id;
    if (!session) {
      router.push("/auth/login");
    } else {
      router.push(`/all-prompts/${promptId}`);
    }
  };

  const handleClear = () => {
    setSearch("");
    setDebouncedSearch("");
    setCategory("");
    setAiTool("");
    setDifficulty("");
    setSort("latest");
    setPage(1);
    router.replace("/all-prompts", { scroll: false });
  };

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-900/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 py-10 relative z-10">
        <SearchBar search={search} setSearch={setSearch} />

        <div className="flex flex-col lg:flex-row gap-8">
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

          <div className="flex-1">
            <div className="bg-zinc-900/10 border border-purple-950/20 rounded-2xl px-5 py-3.5 flex items-center gap-3 mb-6 flex-wrap backdrop-blur-sm">
              <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
                Sort By:
              </span>
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

            <PromptGrid
              prompts={prompts}
              loading={loading}
              onViewDetails={handleViewDetails}
              onClear={handleClear}
              page={page}
              totalPages={totalPages}
              total={total}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}