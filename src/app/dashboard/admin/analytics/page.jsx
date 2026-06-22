import { getAdminAnalytics } from "@/lib/api/admin";
import AdminAnalyticsCharts from "@/components/dashboard/admin/AdminAnalyticsCharts";
import {
  HiOutlineUsers,
  HiOutlineDocumentText,
  HiOutlineChatAlt2,
  HiOutlineDuplicate,
  HiOutlineCurrencyDollar,
} from "react-icons/hi";

export default async function AdminAnalyticsPage() {
  const data = await getAdminAnalytics();

  const stats = [
    { label: "Total Users", value: data.totalUsers || 0, icon: HiOutlineUsers, color: "purple" },
    { label: "Total Prompts", value: data.totalPrompts || 0, icon: HiOutlineDocumentText, color: "cyan" },
    { label: "Total Reviews", value: data.totalReviews || 0, icon: HiOutlineChatAlt2, color: "emerald" },
    { label: "Total Copies", value: data.totalCopies || 0, icon: HiOutlineDuplicate, color: "amber" },
    { label: "Total Revenue", value: `$${(data.totalRevenue || 0).toFixed(2)}`, icon: HiOutlineCurrencyDollar, color: "red" },
  ];

  const colorStyles = {
    purple: "bg-purple-500/15 text-purple-300",
    cyan: "bg-cyan-500/15 text-cyan-300",
    emerald: "bg-emerald-500/15 text-emerald-300",
    amber: "bg-amber-500/15 text-amber-300",
    red: "bg-red-500/15 text-red-300",
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-black text-white tracking-tight">
        Administrative System Analytics
      </h1>
      <p className="text-zinc-500 text-sm mt-1">
        Aggregate metrics and engine distribution breakdowns.
      </p>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-zinc-900/30 border border-purple-950/20 rounded-2xl p-4">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorStyles[stat.color]}`}>
              <stat.icon className="text-lg" />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mt-3">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <AdminAnalyticsCharts engineBreakdown={data.engineBreakdown || []} />
    </div>
  );
}