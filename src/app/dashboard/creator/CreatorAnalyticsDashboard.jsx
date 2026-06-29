"use client";

import React from "react";
import { Spinner } from "@heroui/react";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import {
  HiOutlineDocumentText,
  HiOutlineClipboardCopy,
  HiOutlineBookmark,
  HiTrendingUp,
} from "react-icons/hi";

export default function CreatorAnalyticsDashboard({ analyticsData }) {
  const hasData = analyticsData?.stats && analyticsData.stats.totalPrompts > 0;
  const stats = hasData ? analyticsData.stats : { totalPrompts: 0, totalCopies: 0, totalBookmarks: 0 };
  const barData = hasData ? analyticsData.barData : [];
  const lineData = hasData ? analyticsData.lineData : [];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 text-white min-h-screen bg-[#080810] relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-purple-900/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mb-10 relative z-10">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight">Creator Analytics Workspace</h1>
        <p className="text-zinc-500 text-xs mt-1">Real-time template tracking metrics and asset distribution index.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10 relative z-10">
        {[
          { label: "Total Prompts", value: stats.totalPrompts, icon: <HiOutlineDocumentText className="text-2xl" />, bg: "bg-purple-500/10 border-purple-500/20 text-purple-400" },
          { label: "Total Copies", value: stats.totalCopies, icon: <HiOutlineClipboardCopy className="text-2xl" />, bg: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" },
          { label: "Total Bookmarks", value: stats.totalBookmarks, icon: <HiOutlineBookmark className="text-2xl" />, bg: "bg-pink-500/10 border-pink-500/20 text-pink-400" },
        ].map((card) => (
          <div key={card.label} className="bg-zinc-900/10 border border-purple-950/20 rounded-2xl p-6 flex items-center gap-4 backdrop-blur-sm hover:border-purple-500/20 transition-colors">
            <div className={`p-3.5 rounded-xl border ${card.bg}`}>{card.icon}</div>
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{card.label}</p>
              <p className="text-2xl md:text-3xl font-black mt-1 font-mono">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-8 relative z-10">
        {/* Bar Chart */}
        <div className="bg-zinc-900/10 border border-purple-950/20 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-6 border-b border-purple-950/10 pb-4">
            <HiOutlineClipboardCopy className="text-purple-400 text-lg" />
            <h3 className="text-sm font-black uppercase tracking-wider">Asset Interaction Distribution</h3>
          </div>
          {barData.length === 0 ? (
            <p className="text-zinc-500 text-sm text-center py-16">No data yet. Add some prompts to see analytics.</p>
          ) : (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#161329" vertical={false} />
                  <XAxis dataKey="name" stroke="#4b5563" fontSize={10} tickLine={false} />
                  <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#080810", borderColor: "#3b0764", borderRadius: "12px", color: "#fff", fontSize: "11px" }} />
                  <Legend iconType="circle" iconSize={8} verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "11px", color: "#6b7280" }} />
                  <Bar dataKey="Bookmarks" fill="#ec4899" radius={[4, 4, 0, 0]} barSize={24} />
                  <Bar dataKey="Copies" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Line Chart */}
        <div className="bg-zinc-900/10 border border-purple-950/20 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-6 border-b border-purple-950/10 pb-4">
            <HiTrendingUp className="text-purple-400 text-lg" />
            <h3 className="text-sm font-black uppercase tracking-wider">Accumulative Growth Engine</h3>
          </div>
          {lineData.length === 0 ? (
            <p className="text-zinc-500 text-sm text-center py-16">No growth data available yet.</p>
          ) : (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#161329" vertical={false} />
                  <XAxis dataKey="name" stroke="#4b5563" fontSize={10} tickLine={false} />
                  <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#080810", borderColor: "#3b0764", borderRadius: "12px", color: "#fff", fontSize: "11px" }} />
                  <Legend iconType="circle" iconSize={8} verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "11px", color: "#6b7280" }} />
                  <Line type="monotone" dataKey="Total Copies" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3, fill: "#080810", stroke: "#6366f1", strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="Total Prompts" stroke="#d946ef" strokeWidth={2.5} dot={{ r: 3, fill: "#080810", stroke: "#d946ef", strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}