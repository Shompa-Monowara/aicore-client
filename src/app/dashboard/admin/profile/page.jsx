import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Avatar } from "@heroui/react";
import { getTokenServer } from "@/lib/getTokenServer";
import { getAdminAnalytics } from "@/lib/api/admin";
import {
  HiOutlineMail,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiBadgeCheck,
} from "react-icons/hi";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const token = await getTokenServer();

  const user = session?.user;
  const plan = user?.plan || "free";
  const isPremium = plan === "premium" || plan === "PRO LIFETIME";
  const isVerified = user?.role === "admin";

  const data = await getAdminAnalytics(token);
  const totalPrompts = data?.totalPrompts || 0;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 relative">
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-purple-900/5 rounded-full blur-[100px] pointer-events-none" />

      <div>
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          Admin Account Profile
        </h1>
        <p className="text-zinc-500 text-xs mt-1">
          Manage your admin credentials and platform overview.
        </p>
      </div>

      <div className="mt-8 bg-zinc-900/10 border border-purple-950/20 rounded-2xl p-6 backdrop-blur-sm relative z-10">

        {/* Avatar & Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
          <Avatar className="w-20 h-20 border-2 border-purple-500/20 ring-4 ring-purple-500/5 shrink-0 transition-transform duration-300 hover:scale-105">
            <Avatar.Image referrerPolicy="no-referrer" alt={user?.name} src={user?.image} />
            <Avatar.Fallback className="text-2xl font-black bg-purple-950 text-purple-300">
              {user?.name?.charAt(0) || "A"}
            </Avatar.Fallback>
          </Avatar>

          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <p className="text-lg md:text-xl font-black text-white tracking-tight truncate">
                {user?.name || "Admin"}
              </p>
              {isPremium && (
                <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[9px] font-black tracking-widest text-purple-400 bg-purple-500/10 border border-purple-500/20 uppercase">
                  <HiBadgeCheck className="text-xs" /> PRO
                </span>
              )}
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-zinc-400 text-xs font-medium">
              <HiOutlineMail className="text-sm text-purple-400" />
              <span className="truncate">{user?.email}</span>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-zinc-900/60 text-zinc-400 border border-purple-950/40">
                Role: Admin
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-zinc-900/60 text-zinc-400 border border-purple-950/40">
                Plan: {isPremium ? "PRO LIFETIME" : "Free"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-purple-950/10" />

        {/* Stats — creator এর মতো 2 card */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Prompts Published */}
          <div className="bg-zinc-900/20 border border-purple-950/20 rounded-xl p-5 backdrop-blur-sm group hover:border-purple-500/20 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-purple-950/40 border border-purple-900/30 flex items-center justify-center">
              <HiOutlineDocumentText className="text-lg text-purple-400" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-4">
              Prompts Published
            </p>
            <p className="text-2xl font-black text-white mt-1 font-mono tracking-tight">
              {totalPrompts}
            </p>
          </div>

          {/* Account Status */}
          <div className="bg-zinc-900/20 border border-purple-950/20 rounded-xl p-5 backdrop-blur-sm group hover:border-purple-500/20 transition-colors">
            {isVerified ? (
              <>
                <div className="w-8 h-8 rounded-lg bg-purple-950/40 border border-purple-900/30 flex items-center justify-center">
                  <HiOutlineCheckCircle className="text-lg text-purple-400" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-4">
                  Account Status
                </p>
                <p className="text-base font-black text-purple-400 mt-1 uppercase tracking-wider">
                  Verified Member
                </p>
              </>
            ) : (
              <>
                <div className="w-8 h-8 rounded-lg bg-rose-950/20 border border-rose-900/20 flex items-center justify-center">
                  <HiOutlineCheckCircle className="text-lg text-rose-400" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-4">
                  Account Status
                </p>
                <p className="text-base font-black text-rose-400 mt-1 uppercase tracking-wider">
                  Unverified
                </p>
              </>
            )}
          </div>
        </div>

        {/* Premium Banner */}
        {isPremium && (
          <div className="mt-6 flex items-start gap-3 bg-purple-950/20 border border-purple-900/20 rounded-xl p-4 text-purple-400">
            <HiBadgeCheck className="text-xl shrink-0 mt-0.5 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
            <div className="space-y-0.5">
              <p className="text-xs font-black uppercase tracking-wider text-white">Lifetime Premium Active</p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Full administrative access to all platform controls and analytics.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}