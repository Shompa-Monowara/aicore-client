import { getAdminAnalytics } from "@/lib/api/admin";
import AdminAnalyticsCharts from "@/components/dashboard/admin/AdminAnalyticsCharts";
import { getTokenServer } from "@/lib/getTokenServer"; 
import {
  HiOutlineUsers,
  HiOutlineDocumentText,
  HiOutlineChatAlt2,
  HiOutlineDuplicate,
  HiOutlineCurrencyDollar,
} from "react-icons/hi";

export default async function AdminAnalyticsPage() {
  
  const token = await getTokenServer();

  
  const data = await getAdminAnalytics(token);

 
  const stats = [
    { label: "Total Users", value: data?.totalUsers || 0, icon: HiOutlineUsers, color: "purple" },
    { label: "Total Prompts", value: data?.totalPrompts || 0, icon: HiOutlineDocumentText, color: "indigo" },
    { label: "Total Reviews", value: data?.totalReviews || 0, icon: HiOutlineChatAlt2, color: "pink" },
    { label: "Total Copies", value: data?.totalCopies || 0, icon: HiOutlineDuplicate, color: "violet" },
    { label: "Total Revenue", value: `$${(data?.totalRevenue || 0).toFixed(2)}`, icon: HiOutlineCurrencyDollar, color: "emerald" },
  ];

  const colorStyles = {
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.05)]",
    indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.05)]",
    pink: "bg-pink-500/10 text-pink-400 border-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.05)]",
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.05)]",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]",
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 relative">
    
      <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-purple-900/5 rounded-full blur-[120px] pointer-events-none" />

  
      <div className="mb-8 relative z-10">
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          Administrative System Analytics
        </h1>
        <p className="text-zinc-500 text-xs mt-1.5">
          Aggregate metrics and engine distribution breakdowns across the prompt ecosystem.
        </p>
      </div>

      
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
        {stats.map((stat) => (
          <div 
            key={stat.label} 
            className="bg-zinc-900/10 border border-purple-950/20 rounded-2xl p-5 backdrop-blur-sm group hover:border-purple-500/20 transition-all duration-300"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${colorStyles[stat.color]}`}>
              <stat.icon className="text-lg shrink-0" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-4">
              {stat.label}
            </p>
            <p className="text-xl md:text-2xl font-black text-white mt-1 font-mono tracking-tight group-hover:text-purple-400 transition-colors">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

     
      <div className="mt-8 relative z-10">
        <AdminAnalyticsCharts engineBreakdown={data?.engineBreakdown || []} />
      </div>
    </div>
  );
}