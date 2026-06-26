import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Avatar } from "@heroui/react";
import { getMyPrompts } from "@/lib/api/prompts";
import {
  HiOutlineMail,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiBadgeCheck,
} from "react-icons/hi";

export const dynamic = "force-dynamic";

export default async function CreatorProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  const role = user?.role || "creator"; 
  
  // ইউজার প্রোফাইলের মতো হুবহু প্রিমিয়াম কন্ডিশন লজিক
  const plan = user?.plan || "free";
  const isPremium = plan === "premium" || plan === "PRO LIFETIME";
  const isVerified = user?.emailVerified;

  const promptsData = await getMyPrompts(user?.email);
  const promptsPublished = promptsData?.totalData || 0;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-black text-white tracking-tight">
        Creator Account Profile
      </h1>
      <p className="text-zinc-500 text-sm mt-1">
        Manage your credentials and published prompt details.
      </p>

      <div className="mt-6 bg-zinc-900/30 border border-purple-950/20 rounded-2xl p-6">
        {/* প্রোফাইল হেডার */}
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20 border-2 border-purple-500/30 shrink-0">
            <Avatar.Image referrerPolicy="no-referrer" alt={user?.name} src={user?.image} />
            <Avatar.Fallback className="text-2xl font-bold">
              {user?.name?.charAt(0) || "C"}
            </Avatar.Fallback>
          </Avatar>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold text-white">
                {role === 'admin' ? "Admin" : role === 'creator' ? "Creator" : role === 'user' ? "User" : user?.name}
              </p>
              {/* ইউজার প্রোফাইলের মতো ডাইনামিক PRO ব্যাজ */}
              {isPremium && (
                <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20">
                  <HiBadgeCheck /> PRO
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
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Plan: {isPremium ? "PRO LIFETIME" : "Free"}
              </span>
            </div>
          </div>
        </div>

        {/* ইউজার প্রোফাইলের মতো গ্রীন প্রিমিয়াম একটিভ মেসেজ কার্ড */}
        {isPremium && (
          <div className="mt-5 flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-emerald-400">
            <HiOutlineCheckCircle className="text-xl shrink-0" />
            <div>
              <p className="font-bold">Lifetime Premium Active</p>
              <p className="text-sm text-emerald-400/80">
                Enjoy complete access to all Prompt Marketplace items!
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 border-t border-purple-950/20" />

        {/* স্ট্যাটাস কার্ডসমূহ */}
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
      </div>
    </div>
  );
}