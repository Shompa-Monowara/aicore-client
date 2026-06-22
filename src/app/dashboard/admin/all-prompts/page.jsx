import { getAllPrompts } from "@/lib/api/admin";
import AllPromptsTable from "@/components/dashboard/admin/AllPromptsTable";

export default async function AdminAllPromptsPage() {
  const promptsData = await getAllPrompts();
  const prompts = promptsData?.data || [];

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-black text-white tracking-tight">
        Prompt Template Submissions Moderation
      </h1>
      <p className="text-zinc-500 text-sm mt-1">
        Approve templates, reject with feedback, or tag featured highlights.
      </p>

      <div className="mt-6 bg-zinc-900/30 border border-purple-950/20 rounded-2xl overflow-hidden">
        <AllPromptsTable prompts={prompts} />
      </div>
    </div>
  );
}