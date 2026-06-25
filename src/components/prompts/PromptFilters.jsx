"use client";

import { AI_TOOLS, CATEGORIES, DIFFICULTIES } from "@/lib/action/promptActions";

function FilterGroup({ title, items, selected, onSelect }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold text-default-400 tracking-widest uppercase mb-3">
        {title}
      </p>
      <div className="flex flex-col gap-1">
     
        <button
          onClick={() => onSelect("")}
          className={`text-left px-3 py-2 rounded-lg text-sm transition-all border ${
            selected === ""
              ? "bg-purple-500/10 text-purple-400 border-purple-500/40 font-medium shadow-sm shadow-purple-500/5"
              : "text-default-400 border-transparent hover:text-white hover:bg-default-100/5"
          }`}
        >
          All
        </button>
        
      
        {items.map((item) => (
          <button
            key={item}
            onClick={() => onSelect(item)}
            className={`text-left px-3 py-2 rounded-lg text-sm transition-all border ${
              selected === item
                ? "bg-purple-500/10 text-purple-400 border-purple-500/40 font-medium shadow-sm shadow-purple-500/5"
                : "text-default-400 border-transparent hover:text-white hover:bg-default-100/5"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PromptFilters({
  category,
  setCategory,
  aiTool,
  setAiTool,
  difficulty,
  setDifficulty,
  onClear,
}) {
  return (
    <div className="w-64 shrink-0 bg-[#0f0f1a] border border-white/10 rounded-xl p-5 h-fit sticky top-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-white text-base">⚙</span>
          <span className="text-white font-semibold text-base">Filters</span>
        </div>
        <button
          onClick={onClear}
          className="text-sm text-default-400 hover:text-white transition-colors"
        >
          Reset
        </button>
      </div>

      <FilterGroup
        title="AI Engine"
        items={AI_TOOLS}
        selected={aiTool}
        onSelect={setAiTool}
      />
      <FilterGroup
        title="Category"
        items={CATEGORIES}
        selected={category}
        onSelect={setCategory}
      />
      <FilterGroup
        title="Difficulty"
        items={DIFFICULTIES}
        selected={difficulty}
        onSelect={setDifficulty}
      />
    </div>
  );
}