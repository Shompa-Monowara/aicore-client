import { getAllPrompts } from "@/lib/api/admin";
import AllPromptsTable from "@/components/dashboard/admin/AllPromptsTable";
import { getTokenServer } from "@/lib/getTokenServer"; 

export default async function AdminAllPromptsPage() {
  const token = await getTokenServer(); 
  const promptsData = await getAllPrompts(token); 
  const prompts = promptsData?.data || [];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 relative">
      <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-purple-900/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mb-8 relative z-10">
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          Prompt Template Submissions Moderation
        </h1>
        <p className="text-zinc-500 text-xs mt-1.5">
          Approve templates, reject with feedback, or tag featured highlights.
        </p>
      </div>

      <div className="mt-8 bg-zinc-900/10 border border-purple-950/20 rounded-2xl overflow-hidden backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative z-10">
        <AllPromptsTable prompts={prompts} token={token} /> {/* 🎯 প্রপ্স পাস */}
      </div>
    </div>
  );
}