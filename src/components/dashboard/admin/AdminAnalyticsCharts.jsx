"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { HiOutlineDocumentText, HiOutlineChartPie } from "react-icons/hi";

const TOOL_LABELS = {
  chatgpt: "ChatGPT",
  claude: "Claude",
  gemini: "Gemini",
  midjourney: "Midjourney",
  "stable-diffusion": "Stable Diffusion",
};

const TOOL_COLORS = {
  chatgpt: "#a855f7",
  claude: "#10b981",
  gemini: "#06b6d4",
  midjourney: "#f59e0b",
  "stable-diffusion": "#f43f5e",
};

export default function AdminAnalyticsCharts({ engineBreakdown }) {
  const chartData = engineBreakdown.map((item) => ({
    name: TOOL_LABELS[item._id] || item._id || "Unknown",
    Copies: item.totalCopies || 0,
    Prompts: item.promptsCount || 0,
    color: TOOL_COLORS[item._id] || "#71717a",
  }));

  return (
    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart */}
      <div className="bg-zinc-900/30 border border-purple-950/20 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <HiOutlineDocumentText className="text-orange-400" />
          <h2 className="text-sm font-bold text-white">Engine Prompts Density vs Total Copies</h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis dataKey="name" stroke="#71717a" fontSize={12} />
            <YAxis stroke="#71717a" fontSize={12} />
            <Tooltip
              contentStyle={{ background: "#13112b", border: "1px solid rgba(168,85,247,0.2)", borderRadius: 8 }}
              labelStyle={{ color: "#fff" }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Copies" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Prompts" fill="#a855f7" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Donut Chart */}
      <div className="bg-zinc-900/30 border border-purple-950/20 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <HiOutlineChartPie className="text-orange-400" />
          <h2 className="text-sm font-bold text-white">Prompt Distribution Share</h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="Prompts"
              nameKey="name"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={3}
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: "#13112b", border: "1px solid rgba(168,85,247,0.2)", borderRadius: 8 }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}