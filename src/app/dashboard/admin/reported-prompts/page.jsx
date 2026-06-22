import { getReportedPrompts } from "@/lib/api/admin";
import ReportedPromptsList from "@/components/dashboard/admin/ReportedPromptsList";

export default async function ReportedPromptsPage() {
  const reportsData = await getReportedPrompts();
  const reports = reportsData?.data || [];

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-black text-white tracking-tight">
        Reported Prompts Moderation Queue
      </h1>
      <p className="text-zinc-500 text-sm mt-1">
        Review community warnings, warn creators, dismiss complaints, or remove posts.
      </p>

      <div className="mt-6 flex flex-col gap-5">
        {reports.length === 0 ? (
          <div className="bg-zinc-900/30 border border-purple-950/20 rounded-2xl py-16 text-center">
            <p className="text-white font-bold">No reports in the queue</p>
            <p className="text-zinc-500 text-sm mt-1">
              Community reports will appear here once submitted.
            </p>
          </div>
        ) : (
          <ReportedPromptsList reports={reports} />
        )}
      </div>
    </div>
  );
}