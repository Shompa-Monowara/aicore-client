"use client";

import { authClient } from "@/lib/auth-client";
import { Avatar, Button, Dropdown } from "@heroui/react";
import Link from "next/link";
import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { MdDashboard } from "react-icons/md";
import { HiMenu, HiX, HiBadgeCheck } from "react-icons/hi";
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
    <nav className="sticky top-0 z-50 w-full border-b border-purple-950/20 bg-[#080810]/70 backdrop-blur-md">
      <header className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        
       
        <div className="flex items-center gap-4">
          <button
            className="text-white md:hidden focus:outline-none cursor-pointer p-1 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
          </button>
          
          <Link href="/">
            <div className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <svg className="h-7 w-7 text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21L7.188 15.904L2 15L7.188 14.096L9 9L9.813 14.096L15 15L9.813 15.904Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.071 4.929a10 10 0 00-14.142 0M19.071 4.929a10 10 0 010 14.142" />
                </svg>
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                AI<span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(168,85,247,0.2)]">Core</span>
              </span>
            </div>
          </Link>
        </div>

       
        <ul className="hidden items-center gap-8 md:flex">
          <li>
            <Link href="/" className={`text-sm font-semibold transition-colors ${pathname === "/" ? "text-purple-400" : "text-zinc-400 hover:text-white"}`}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/all-prompts" className={`text-sm font-semibold transition-colors ${pathname === "/all-prompts" ? "text-purple-400" : "text-zinc-400 hover:text-white"}`}>
              All Prompts
            </Link>
          </li>
        </ul>

       
        <div className="hidden items-center gap-4 md:flex">
          {!user ? (
            <>
              <Link href="/auth/login" className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-2 text-sm font-bold text-zinc-300 transition-all hover:bg-zinc-900 hover:text-white hover:border-zinc-700">
                <LogOutIcon className="rotate-180 text-base" /> Login
              </Link>
              <Link href="/auth/register">
                <Button className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-[0_0_20px_rgba(147,51,234,0.25)] transition-all hover:opacity-95 cursor-pointer">
                  <CgProfile className="text-base" /> Register
                </Button>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-xs font-black text-zinc-400 uppercase tracking-wider leading-none">
                  {user?.role === 'admin' ? "Admin" : user?.role === 'creator' ? "Creator" : "User"} 
                </span>
                
                {(user?.plan === "premium" || user?.plan === "PRO LIFETIME") && (
                  <span className="flex items-center gap-0.5 text-[9px] font-black text-purple-400 mt-1 uppercase tracking-widest">
                    <HiBadgeCheck className="text-purple-400 text-xs" /> PRO
                  </span>
                )}
              </div>

              <Dropdown>
                <Dropdown.Trigger className="rounded-full cursor-pointer">
                  <Avatar size="md" aria-label="Menu" className="border border-purple-500/30 ring-2 ring-purple-500/10 hover:ring-purple-500/30 transition-all">
                    <Avatar.Image referrerPolicy="no-referrer" alt={user?.name} src={user?.image} />
                    <Avatar.Fallback className="bg-purple-950 text-purple-300 font-bold">{user?.name?.charAt(0) || "U"}</Avatar.Fallback>
                  </Avatar>
                </Dropdown.Trigger>
                
                <Dropdown.Popover>
                  <div className="px-4 pt-4 pb-2 bg-[#0d0d15] border border-purple-950/40 text-white rounded-t-xl w-48">
                    <p className="text-xs font-bold truncate">{user?.name}</p>
                    <p className="text-[10px] text-zinc-500 truncate mt-0.5">{user?.email}</p>
                  </div>
                  <Dropdown.Menu className="bg-[#0d0d15] border-x border-b border-purple-950/40 text-zinc-400 rounded-b-xl w-48 p-1">
                    <Dropdown.Item id="dashboard" textValue="Dashboard" className="hover:bg-purple-950/30 hover:text-purple-400 rounded-lg transition-colors">
                      <Link className="flex items-center gap-2 text-xs font-semibold py-1" href={`/dashboard/${user?.role}`}>
                        <MdDashboard className="text-purple-400 text-sm" /> Dashboard
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item id="logout" textValue="Logout" className="text-rose-400/90 hover:bg-rose-950/20 rounded-lg transition-colors" onClick={handleSignOut}>
                      <div className="flex items-center gap-2 text-xs font-semibold py-1"><LogOutIcon className="text-sm" /> Logout</div>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            </div>
          )}
        </div>
      </header>

      
      {isMenuOpen && (
        <div className="border-t border-purple-950/20 bg-[#080810] md:hidden p-4 space-y-4 animate-fadeIn">
          <ul className="space-y-3">
            <li>
              <Link 
                href="/" 
                onClick={() => setIsMenuOpen(false)}
                className={`block text-sm font-semibold p-2 rounded-lg ${pathname === "/" ? "bg-purple-950/30 text-purple-400" : "text-zinc-400"}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                href="/all-prompts" 
                onClick={() => setIsMenuOpen(false)}
                className={`block text-sm font-semibold p-2 rounded-lg ${pathname === "/all-prompts" ? "bg-purple-950/30 text-purple-400" : "text-zinc-400"}`}
              >
                All Prompts
              </Link>
            </li>
          </ul>
          
          <div className="pt-2 border-t border-purple-950/20 flex flex-col gap-2">
            {!user ? (
              <>
                <Link href="/auth/login" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900/40 py-2.5 text-sm font-bold text-zinc-300">
                  Login
                </Link>
                <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-2.5 text-sm font-bold text-white">
                    Register
                  </Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center justify-between p-2 bg-zinc-900/20 rounded-xl border border-purple-950/20">
                <div className="flex items-center gap-2.5">
                  <Avatar size="sm">
                    <Avatar.Image src={user?.image} />
                    <Avatar.Fallback className="bg-purple-950 text-purple-300 font-bold">{user?.name?.charAt(0)}</Avatar.Fallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white truncate max-w-[100px]">{user?.name}</span>
                    <span className="text-[9px] text-purple-400 uppercase font-black tracking-wider">{user?.role}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/dashboard/${user?.role}`} onClick={() => setIsMenuOpen(false)} className="p-2 bg-purple-950/40 text-purple-400 rounded-lg border border-purple-900/30">
                    <MdDashboard />
                  </Link>
                  <button onClick={() => { handleSignOut(); setIsMenuOpen(false); }} className="p-2 bg-rose-950/30 text-rose-400 rounded-lg border border-rose-900/20 cursor-pointer">
                    <LogOutIcon />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;