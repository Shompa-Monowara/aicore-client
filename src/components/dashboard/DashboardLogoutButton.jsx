"use client";

import { authClient } from "@/lib/auth-client";
import { ArrowRightFromSquare } from "@gravity-ui/icons";
import { useRouter } from "next/navigation";

export default function DashboardLogoutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/auth/login"); 
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider text-rose-400/80 hover:bg-rose-500/10 hover:text-rose-400 border border-transparent hover:border-rose-500/10 transition-all duration-200 cursor-pointer"
    >
      <ArrowRightFromSquare className="size-4 shrink-0" />
      <span>Logout Workspace</span>
    </button>
  );
}