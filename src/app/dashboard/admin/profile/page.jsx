import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { Avatar } from "@heroui/react";
import { getMyPrompts } from "@/lib/api/prompts";
import {
  HiOutlineMail,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineSparkles,
} from "react-icons/hi";

export default async function AdminProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  const role = user?.role || "admin";

  const isAdmin = role === "admin";
  const plan = isAdmin ? "pro lifetime" : (user?.plan || "free");
  const isVerified = user?.emailVerified;
  const isPro = isAdmin || plan !== "free";

  const promptsData = await getMyPrompts(user?.email);
  const promptsPublished = promptsData?.totalData || 0;

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-black text-white tracking-tight">
        User Account Profile
      </h1>
      <p className="text-zinc-500 text-sm mt-1">
        Manage your plan, credentials, and published prompt details.
      </p>

      <div className="mt-6 bg-zinc-900/30 border border-purple-950/20 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20 border-2 border-purple-500/30 shrink-0">
            <Avatar.Image referrerPolicy="no-referrer" alt={user?.name} src={user?.image} />
            <Avatar.Fallback className="text-2xl font-bold">
              {user?.name?.charAt(0) || "U"}
            </Avatar.Fallback>
          </Avatar>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold text-white">{user?.name || "User"}</p>
              {isPro && (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  💎 PRO
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400 text-sm">
              <HiOutlineMail className="text-base" />
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-purple-500/15 text-purple-300 border border-purple-500/30">
                Role: {role}
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Plan: {plan}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-purple-950/20" />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-900/40 border border-purple-950/20 rounded-xl p-5">
            <HiOutlineDocumentText className="text-xl text-purple-400" />
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mt-2">
              Prompts Published
            </p>
            <p className="text-2xl font-bold text-white mt-1">{promptsPublished}</p>
          </div>

          <div className="bg-zinc-900/40 border border-purple-950/20 rounded-xl p-5">
            {isVerified ? (
              <>
                <HiOutlineCheckCircle className="text-xl text-emerald-400" />
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mt-2">
                  Account Status
                </p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">Verified Member</p>
              </>
            ) : (
              <>
                <HiOutlineXCircle className="text-xl text-red-400" />
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mt-2">
                  Account Status
                </p>
                <p className="text-2xl font-bold text-red-400 mt-1">Unverified</p>
              </>
            )}
          </div>
        </div>

        {isPro ? (
          <div className="mt-5 flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
            <HiOutlineCheckCircle className="text-xl text-emerald-400 shrink-0" />
            <p className="text-sm font-semibold text-emerald-300">
              Lifetime Premium Active – Enjoy complete access to all Prompt Marketplace items!
            </p>
          </div>
        ) : (
          <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-purple-900/30 to-blue-900/20 border border-purple-500/20 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <HiOutlineSparkles className="text-xl text-purple-300 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-white">Upgrade to Pro Lifetime</p>
                <p className="text-sm text-zinc-400 mt-0.5 max-w-md">
                  Unlock access to all private prompt templates, parameter sets, and community reviews for a single one-time contribution of $5.
                </p>
              </div>
            </div>
            <Link
              href="/payment"
              className="w-full sm:w-auto text-center shrink-0 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 font-semibold text-white px-5 py-2.5 transition-all duration-200 hover:shadow-lg hover:shadow-orange-900/30 whitespace-nowrap"
            >
              Upgrade Now ($5)
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}