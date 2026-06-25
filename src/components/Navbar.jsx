"use client";

import { authClient } from "@/lib/auth-client";
import { Avatar, Button, Dropdown } from "@heroui/react";
import Link from "next/link";
import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { MdDashboard } from "react-icons/md";
import { HiMenu, HiX, HiBadgeCheck } from "react-icons/hi"; // 🎯 HiBadgeCheck যোগ করা হয়েছে
import { BiLogOut as LogOutIcon } from "react-icons/bi";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const pathname = usePathname();
  
  if (pathname.includes("dashboard")) {
    return null;
  }

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-purple-950/30 bg-[#0b0813]/70 backdrop-blur-md">
      <header className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        
        <div className="flex items-center gap-4">
          <button
            className="text-white md:hidden focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
          </button>
          
          <Link href="/">
            <div className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <svg className="h-7 w-7 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21L7.188 15.904L2 15L7.188 14.096L9 9L9.813 14.096L15 15L9.813 15.904Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.071 4.929a10 10 0 00-14.142 0M19.071 4.929a10 10 0 010 14.142" />
                </svg>
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                AI<span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(251,146,60,0.2)]">Core</span>
              </span>
            </div>
          </Link>
        </div>

        <ul className="hidden items-center gap-8 md:flex">
          <li><Link href="/" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">Home</Link></li>
          <li><Link href="/all-prompts" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">All Prompts</Link></li>
        </ul>

        <div className="hidden items-center gap-4 md:flex">
          {!user ? (
            <>
              <Link href="/auth/login" className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-zinc-800 hover:border-zinc-700">
                <LogOutIcon className="rotate-180 text-lg" /> Login
              </Link>
              <Link href="/auth/register">
                <Button className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all hover:opacity-95">
                  <CgProfile className="text-lg" /> Register
                </Button>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-white leading-none">
  {user?.role === 'admin' 
    ? "Admin" 
    : user?.role === 'creator' 
      ? "Creator" 
      : "User"} 
</span>
                
                {(user?.plan === "premium" || user?.plan === "PRO LIFETIME") && (
                  <span className="flex items-center gap-0.5 text-[10px] font-bold text-cyan-400">
                    <HiBadgeCheck className="text-cyan-400" /> PRO
                  </span>
                )}
              </div>

              <Dropdown>
                <Dropdown.Trigger className="rounded-full cursor-pointer">
                  <Avatar size="md" aria-label="Menu" className="border border-purple-500/30">
                    <Avatar.Image referrerPolicy="no-referrer" alt={user?.name} src={user?.image} />
                    <Avatar.Fallback>{user?.name?.charAt(0) || "U"}</Avatar.Fallback>
                  </Avatar>
                </Dropdown.Trigger>
                
                <Dropdown.Popover>
                  <div className="px-3 pt-3 pb-1 bg-[#13112b] border-b border-purple-950/40 text-white rounded-t-xl">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-zinc-400">{user?.email}</p>
                  </div>
                  <Dropdown.Menu className="bg-[#13112b] text-zinc-300 rounded-b-xl">
                    <Dropdown.Item id="dashboard" textValue="Dashboard" className="hover:bg-purple-950/30">
                      <Link className="flex items-center gap-2" href={`/dashboard/${user?.role}`}>
                        <MdDashboard className="text-orange-400" /> Dashboard
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item id="logout" textValue="Logout" className="text-rose-400" onClick={handleSignOut}>
                      <div className="flex items-center gap-2"><LogOutIcon /> Logout</div>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            </div>
          )}
        </div>
      </header>

      {isMenuOpen && (
        <div className="border-t border-purple-950/20 bg-[#0b0813] md:hidden p-4">
           {/* মোবাইল মেনু কন্টেন্ট */}
        </div>
      )}
    </nav>
  );
};

export default Navbar;