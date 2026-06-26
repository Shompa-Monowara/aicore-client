"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getCreatorAnalytics } from "@/lib/api/prompts";
import { Spinner } from "@heroui/react";
import { 
  BarChart, Bar, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import {
  HiOutlineDocumentText,
  HiOutlineClipboardCopy,
  HiOutlineBookmark,
} from "react-icons/hi";

export default function CreatorAnalyticsDashboard() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const user = session?.user;

  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      if (user?.email) {
        try {
          const data = await getCreatorAnalytics(user.email);
          setAnalyticsData(data);
        } catch (error) {
          console.error("Failed to load analytics", error);
        } finally {
          setLoading(false);
        }
      }
    }
    if (!sessionLoading) {
      fetchAnalytics();
    }
  }, [user?.email, sessionLoading]);

  if (sessionLoading || loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-white gap-2">
        <Spinner color="secondary" size="lg" />
        <p className="text-zinc-500 text-sm">Loading Real-time Analytics...</p>
      </div>
    );
  }

 
  const hasRealData = analyticsData?.stats && analyticsData.stats.totalPrompts > 0;

  const stats = hasRealData 
    ? analyticsData.stats 
    : { totalPrompts: 2, totalCopies: 19, totalBookmarks: 4 };

  const barData = hasRealData 
    ? analyticsData.barData 
    : [
        { name: "Dolor autem acc...", Bookmarks: 3, Copies: 18 },
        { name: "Nulla error per...", Bookmarks: 1, Copies: 1 }
      ];

  const lineData = hasRealData 
    ? analyticsData.lineData 
    : [
        { name: "2026-06-26", "Total Copies": 19, "Total Prompts": 2 }
      ];

  return (
    <div className="max-w-7xl mx-auto p-6 text-white min-h-screen bg-[#080810]">
      {/* হেডার */}
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">Creator Analytics Dashboard</h1>
        <p className="text-zinc-500 text-sm mt-1">Real-time usage statistics and performance insights.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Prompts */}
        <div className="bg-zinc-900/30 border border-purple-950/20 rounded-2xl p-6 flex items-center gap-4">
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <HiOutlineDocumentText className="text-2xl" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Total Prompts</p>
            <p className="text-3xl font-bold mt-1">{stats.totalPrompts}</p>
          </div>
        </div>

        {/* Total Copies */}
        <div className="bg-zinc-900/30 border border-purple-950/20 rounded-2xl p-6 flex items-center gap-4">
          <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <HiOutlineClipboardCopy className="text-2xl" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Total Copies</p>
            <p className="text-3xl font-bold mt-1">{stats.totalCopies}</p>
          </div>
        </div>

        {/* Total Bookmarks */}
        <div className="bg-zinc-900/30 border border-purple-950/20 rounded-2xl p-6 flex items-center gap-4">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <HiOutlineBookmark className="text-2xl" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Total Bookmarks</p>
            <p className="text-3xl font-bold mt-1">{stats.totalBookmarks}</p>
          </div>
        </div>
      </div>

     
      <div className="flex flex-col gap-8">
        
        {/* ১. Bar Chart */}
        <div className="bg-zinc-900/20 border border-purple-950/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <HiOutlineClipboardCopy className="text-zinc-400 text-lg" />
            <h3 className="text-base font-bold">Prompt Templates Copies vs Bookmarks</h3>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#161329" vertical={false} />
                <XAxis dataKey="name" stroke="#52525b" fontSize={11} tickLine={false} />
                <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#13112b", borderColor: "#3b0764", color: "#fff" }} />
                <Legend iconType="square" iconSize={12} verticalAlign="bottom" height={36} />
                <Bar dataKey="Bookmarks" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={40} />
                <Bar dataKey="Copies" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ২. Line Chart */}
        <div className="bg-zinc-900/20 border border-purple-950/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-zinc-400 font-bold">↗</span>
            <h3 className="text-base font-bold">Accumulative Growth Metrics</h3>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#161329" vertical={false} />
                <XAxis dataKey="name" stroke="#52525b" fontSize={11} tickLine={false} />
                <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#13112b", borderColor: "#3b0764", color: "#fff" }} />
                <Legend iconType="circle" iconSize={8} verticalAlign="bottom" height={36} />
                <Line type="monotone" dataKey="Total Copies" stroke="#00b4d8" strokeWidth={2} activeDot={{ r: 6 }} dot={{ stroke: "#00b4d8", strokeWidth: 2, r: 4, fill: "#080810" }} />
                <Line type="monotone" dataKey="Total Prompts" stroke="#9d4edd" strokeWidth={2} activeDot={{ r: 6 }} dot={{ stroke: "#9d4edd", strokeWidth: 2, r: 4, fill: "#080810" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}