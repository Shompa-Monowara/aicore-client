"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
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

export default function CreatorAnalyticsDashboard() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const user = session?.user;

  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      if (user?.email) {
        try {
          const tokenRes = await authClient.token();
          const token = tokenRes?.token;

          const baseURl = process.env.NEXT_PUBLIC_SERVER_URL;
          const res = await fetch(`${baseURl}/api/creator/analytics?email=${user.email}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });

          const data = await res.json();
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-white gap-3">
        <Spinner color="secondary" size="lg" />
        <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">Loading Real-time Analytics...</p>
      </div>
    );
  }

  const hasRealData = analyticsData?.stats && analyticsData.stats.totalPrompts > 0;

  const stats = hasRealData 
    ? analyticsData.stats 
    : { totalPrompts: 0, totalCopies: 0, totalBookmarks: 0 };

  const barData = hasRealData 
    ? analyticsData.barData 
    : [];

  const lineData = hasRealData 
    ? analyticsData.lineData 
    : [];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 text-white min-h-screen bg-[#080810] relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-purple-900/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mb-10 relative z-10">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight">Creator Analytics Workspace</h1>
        <p className="text-zinc-500 text-xs mt-1">Real-time template tracking metrics and asset distribution index.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10 relative z-10">
        <div className="bg-zinc-900/10 border border-purple-950/20 rounded-2xl p-6 flex items-center gap-4 backdrop-blur-sm group hover:border-purple-500/20 transition-colors">
          <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.05)]">
            <HiOutlineDocumentText className="text-2xl" />
          </div>
          <div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total Prompts</p>
            <p className="text-2xl md:text-3xl font-black mt-1 font-mono tracking-tight">{stats.totalPrompts}</p>
          </div>
        </div>

        <div className="bg-zinc-900/10 border border-purple-950/20 rounded-2xl p-6 flex items-center gap-4 backdrop-blur-sm group hover:border-purple-500/20 transition-colors">
          <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.05)]">
            <HiOutlineClipboardCopy className="text-2xl" />
          </div>
          <div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total Copies</p>
            <p className="text-2xl md:text-3xl font-black mt-1 font-mono tracking-tight">{stats.totalCopies}</p>
          </div>
        </div>

        <div className="bg-zinc-900/10 border border-purple-950/20 rounded-2xl p-6 flex items-center gap-4 backdrop-blur-sm group hover:border-purple-500/20 transition-colors sm:col-span-2 lg:col-span-1">
          <div className="p-3.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.05)]">
            <HiOutlineBookmark className="text-2xl" />
          </div>
          <div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total Bookmarks</p>
            <p className="text-2xl md:text-3xl font-black mt-1 font-mono tracking-tight">{stats.totalBookmarks}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8 relative z-10">
        <div className="bg-zinc-900/10 border border-purple-950/20 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-8 border-b border-purple-950/10 pb-4">
            <HiOutlineClipboardCopy className="text-purple-400 text-lg" />
            <h3 className="text-sm font-black uppercase tracking-wider">Asset Interaction Distribution</h3>
          </div>
          <div className="h-80 w-full font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#161329" vertical={false} />
                <XAxis dataKey="name" stroke="#4b5563" fontSize={10} tickLine={false} />
                <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: "rgba(147, 51, 234, 0.03)" }}
                  contentStyle={{ backgroundColor: "#080810", borderColor: "#3b0764", borderRadius: "12px", color: "#fff", fontSize: "11px", fontWeight: "bold" }} 
                />
                <Legend iconType="circle" iconSize={8} verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", color: "#6b7280" }} />
                <Bar dataKey="Bookmarks" fill="#ec4899" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="Copies" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-zinc-900/10 border border-purple-950/20 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-8 border-b border-purple-950/10 pb-4">
            <HiTrendingUp className="text-purple-400 text-lg" />
            <h3 className="text-sm font-black uppercase tracking-wider">Accumulative Growth Engine</h3>
          </div>
          <div className="h-80 w-full font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#161329" vertical={false} />
                <XAxis dataKey="name" stroke="#4b5563" fontSize={10} tickLine={false} />
                <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#080810", borderColor: "#3b0764", borderRadius: "12px", color: "#fff", fontSize: "11px", fontWeight: "bold" }} 
                />
                <Legend iconType="circle" iconSize={8} verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", color: "#6b7280" }} />
                <Line type="monotone" dataKey="Total Copies" stroke="#6366f1" strokeWidth={2.5} activeDot={{ r: 6, fill: "#6366f1" }} dot={{ stroke: "#6366f1", strokeWidth: 2, r: 3, fill: "#080810" }} />
                <Line type="monotone" dataKey="Total Prompts" stroke="#d946ef" strokeWidth={2.5} activeDot={{ r: 6, fill: "#d946ef" }} dot={{ stroke: "#d946ef", strokeWidth: 2, r: 3, fill: "#080810" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}