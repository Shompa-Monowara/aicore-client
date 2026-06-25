import { auth } from "@/lib/auth";
import {
  Bars,
  Folder,
  Bookmark,
  Comment,
  Person,
  ChartBar,
  Persons,
  CreditCard,
  CircleExclamation,
  Plus,
} from "@gravity-ui/icons";
import { Avatar, Button, Drawer } from "@heroui/react";
import { headers } from "next/headers";
import Link from "next/link";

import DashboardLogoutButton from "./DashboardLogoutButton";
import DashboardNavItem from "../DashboardNavItem";

export default async function DashboardSidebar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  const role = user?.role || "user";

  const dashboardItems = {
    user: [
      { icon: Person, label: "My Profile", link: "/dashboard/user/profile" },
      { icon: Plus, label: "Add Prompt", link: "/dashboard/user/add-prompt" },
      { icon: Folder, label: "My Prompts", link: "/dashboard/user/my-prompts" },
      { icon: Bookmark, label: "Saved Prompts", link: "/dashboard/user/saved-prompts" },
      { icon: Comment, label: "My Reviews", link: "/dashboard/user/my-reviews" },
    ],
    creator: [
      { icon: ChartBar, label: "Creator Dashboard Home", link: "/dashboard/creator" },
      { icon: Plus, label: "Add Prompt", link: "/dashboard/creator/add-prompt" },
      { icon: Folder, label: "My Prompts", link: "/dashboard/creator/my-prompts" },
    ],
    admin: [
      { icon: Person, label: "My Profile", link: "/dashboard/admin/profile" },
      { icon: ChartBar, label: "Admin Analytics", link: "/dashboard/admin/analytics" },
      { icon: Persons, label: "All Users", link: "/dashboard/admin/all-users" },
      { icon: Folder, label: "All Prompts", link: "/dashboard/admin/all-prompts" },
      { icon: CreditCard, label: "All Payments", link: "/dashboard/admin/all-payments" },
      { icon: CircleExclamation, label: "Reported Prompts", link: "/dashboard/admin/reported-prompts" },
    ],
  };

  const navItems = dashboardItems[role] || dashboardItems["user"];

  return (
    <Drawer>
      <Button className="hidden" variant="secondary">
        <Bars />
        Menu
      </Button>

      <nav className="flex flex-col gap-1 w-[260px] h-screen border-r border-purple-950/20 bg-[#0b0813] p-4 font-sans shrink-0 justify-between">
        
        <div className="flex flex-col gap-1">
          <div className="pb-5 mb-4 pt-2 px-2">
            <Link href="/" className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <svg className="h-7 w-7 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21L7.188 15.904L2 15L7.188 14.096L9 9L9.813 14.096L15 15L9.813 15.904Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.071 4.929a10 10 0 00-14.142 0M19.071 4.929a10 10 0 010 14.142" />
                </svg>
              </div>

              <div className="flex items-center">
                <span className="text-2xl font-black tracking-tight text-white">
                  AI<span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(251,146,60,0.2)]">Core</span>
                </span>
                {(user?.plan === "premium" || user?.plan === "PRO LIFETIME") && (
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-md border border-cyan-500/30 ml-2 shrink-0">
                    PRO
                  </span>
                )}
              </div>
            </Link>

            <div className="mt-5 flex items-center gap-3 p-3 rounded-xl bg-zinc-900/30 border border-purple-950/20">
              <Avatar size="sm" className="border border-purple-500/20 shrink-0">
                <Avatar.Image referrerPolicy="no-referrer" alt={user?.name} src={user?.image} />
                <Avatar.Fallback>{user?.name?.charAt(0) || "U"}</Avatar.Fallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 max-w-full">
                  <p className="text-sm font-semibold text-white truncate max-w-[110px]">
                    {user?.role === 'admin' ? "Admin" : user?.role === 'creator' ? "Creator" : "User"}
                  </p>
                  {(user?.plan === "premium" || user?.plan === "PRO LIFETIME") && (
                    <span className="text-[9px] font-extrabold bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded-md border border-cyan-500/20 tracking-wider shrink-0">
                      PRO
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">{role}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            {navItems.map((item) => (
              <DashboardNavItem key={item.label} link={item.link} label={item.label}>
                <item.icon className="size-5" />
              </DashboardNavItem>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-purple-950/20">
          <DashboardLogoutButton />
        </div>
      </nav>
    </Drawer>
  );
}