import { getReportedPrompts } from "@/lib/api/admin";
import ReportedPromptsList from "@/components/dashboard/admin/ReportedPromptsList";
import { HiOutlineShieldExclamation } from "react-icons/hi";
import { getTokenServer } from "@/lib/getTokenServer"; 

export default async function ReportedPromptsPage() {
  const token = await getTokenServer(); 
  const reportsData = await getReportedPrompts(token); 
  const reports = reportsData?.data || [];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 relative">
      <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-purple-900/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mb-8 relative z-10">
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          Reported Prompts Moderation Queue
        </h1>
        <p className="text-zinc-500 text-xs mt-1.5">
          Review community warnings, warn creators, dismiss complaints, or remove posts from the marketplace.
        </p>
      </div>

      <div className="mt-8 relative z-10 w-full">
        {reports.length === 0 ? (
          <div className="bg-zinc-900/10 border border-purple-950/20 rounded-2xl py-20 px-6 text-center backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-xl border border-purple-950/40 bg-purple-950/10 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
              <HiOutlineShieldExclamation className="text-2xl" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-white font-bold text-base">No reports in the queue</h2>
              <p className="text-zinc-500 text-xs max-w-sm mx-auto leading-relaxed">
                Ecosystem architectures are clean. Community report logs will map here if flags are submitted.
              </p>
            </div>
          </div>
        ) : (
          <ReportedPromptsList reports={reports} token={token} /> 
        )}
      </div>
    </div>
  );
}