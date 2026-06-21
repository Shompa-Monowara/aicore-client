import { auth } from "@/lib/auth";
import {
  Bars,
  Plus,
  Folder,
  Bookmark,
  Comment,
  Person,
  ChartBar,
  Persons,
  CreditCard,
  CircleExclamation,
} from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import { headers } from "next/headers";
import Link from "next/link";

export default async function DashboardSidebar() {

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  const role = user?.role || "user"; 

 
  const daashboardItems = {
    
    user: [
      { icon: Plus, label: "Add Prompt", link: "/dashboard/add-prompt" },
      { icon: Folder, label: "My Prompts", link: "/dashboard/my-prompts" },
      { icon: Bookmark, label: "Saved Prompts", link: "/dashboard/saved-prompts" },
      { icon: Comment, label: "My Reviews", link: "/dashboard/my-reviews" },
      { icon: Person, label: "Profile", link: "/dashboard/profile" },
    ],

    creator: [
      { icon: ChartBar, label: "Creator Dashboard Home", link: "/dashboard/creator" },
      { icon: Plus, label: "Add Prompt", link: "/dashboard/creator/add-prompt" },
      { icon: Folder, label: "My Prompts", link: "/dashboard/creator/my-prompts" },
    ],


    admin: [
      { icon: Persons, label: "All Users", link: "/dashboard/admin/all-users" },
      { icon: Folder, label: "All Prompts", link: "/dashboard/admin/all-prompts" },
      { icon: CreditCard, label: "All Payments", link: "/dashboard/admin/all-payments" },
      { icon: CircleExclamation, label: "Reported Prompts", link: "/dashboard/admin/reported-prompts" },
      { icon: ChartBar, label: "Analytics", link: "/dashboard/admin/analytics" },
    ],
  };

 
  const navItems = daashboardItems[role] ;
  console.log(navItems);

  return (
    <Drawer>
      <Button className="hidden" variant="secondary">
        <Bars />
        Menu
      </Button>

    
      <nav className="flex flex-col gap-1 w-[240px] h-screen border-r border-purple-950/30 bg-[#0b0813]/70 backdrop-blur-md p-4 font-sans">
        
       
        <div className="border-b border-purple-950/20 pb-5 mb-4 pt-2 px-2"> 
          <Link href="/">
            <div className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <svg
                  className="h-7 w-7 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21L7.188 15.904L2 15L7.188 14.096L9 9L9.813 14.096L15 15L9.813 15.904Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.071 4.929a10 10 0 00-14.142 0M19.071 4.929a10 10 0 010 14.142" />
                </svg>
              </div>
              
              <span className="text-2xl font-black tracking-tight text-white">
                AI<span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(251,146,60,0.2)]">Core</span>
              </span>
            </div>
          </Link>
          <div className="mt-2 px-1 text-[10px] uppercase tracking-wider text-orange-400/80 font-bold capitalize">
            {role} Portal
          </div>
        </div>

      
        <div className="flex flex-col gap-1.5 flex-1">
          {navItems && navItems.map((item) => (
            <Link key={item.label} href={item.link} className="w-full">
              <button
                className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-400 hover:bg-zinc-900/50 hover:text-white transition-all duration-200"
                type="button"
              >
                <item.icon className="size-5 text-zinc-400 transition-colors" />
                <span>{item.label}</span>
              </button>
            </Link>
          ))}
        </div>
      </nav>

  
      <Drawer.Backdrop>
        <Drawer.Content placement="left" className="bg-[#0b0813] border-r border-purple-950/30 text-white font-sans">
          <Drawer.Dialog>
            <Drawer.CloseTrigger className="text-white" />
            <Drawer.Header>
              <Drawer.Heading className="text-xl font-black text-white pl-2">Navigation</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>
              <nav className="flex flex-col gap-2 mt-4">
                {navItems && navItems.map((item) => (
                  <Link key={item.label} href={item.link}>
                    <button
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-400 hover:bg-zinc-900/50 hover:text-white transition-all duration-200"
                      type="button"
                    >
                      <item.icon className="size-5 text-zinc-400" />
                      <span>{item.label}</span>
                    </button>
                  </Link>
                ))}
              </nav>
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}