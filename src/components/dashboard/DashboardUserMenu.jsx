"use client";

import { authClient } from "@/lib/auth-client";
import { Avatar, Dropdown } from "@heroui/react";
import Link from "next/link";
import React from "react";
import { CgProfile } from "react-icons/cg";
import { MdDashboard } from "react-icons/md";
import { BiLogOut as LogOutIcon } from "react-icons/bi";

export default function DashboardUserMenu({ initialUser }) {
  const { data: session } = authClient.useSession();
  const user = session?.user || initialUser;

  if (!user) return null;

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  return (
    <div className="flex justify-end w-full">
      <Dropdown>
        <Dropdown.Trigger className="rounded-full cursor-pointer focus:outline-none">
          <Avatar size="sm" aria-label="Menu" className="border border-purple-500/30">
            <Avatar.Image
              referrerPolicy="no-referrer"
              alt={user?.name || "User Avatar"}
              src={user?.image}
            />
            <Avatar.Fallback>{user?.name?.charAt(0) || "U"}</Avatar.Fallback>
          </Avatar>
        </Dropdown.Trigger>
        
        
        <Dropdown.Popover className="bg-[#13112b] border border-purple-950/40 rounded-xl shadow-2xl w-[240px] min-w-[240px] max-w-[240px]">
          
          <div className="px-3 pt-3 pb-1 bg-[#13112b] border-b border-purple-950/40 text-white rounded-t-xl w-full">
            <div className="flex items-center gap-2">
              <Avatar size="sm" className="border border-purple-500/20 shrink-0">
                <Avatar.Image alt={user?.name} src={user?.image} />
                <Avatar.Fallback>{user?.name?.charAt(0)}</Avatar.Fallback>
              </Avatar>
              <div className="flex flex-col gap-0 min-w-0">
                <p className="text-sm leading-5 font-medium text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs leading-none text-zinc-400 mt-0.5 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
          
         
          <Dropdown.Menu
            className="bg-[#13112b] text-zinc-300 rounded-b-xl w-full"
            onAction={(key) => console.log(`Selected: ${key}`)}
          >
            <Dropdown.Item id="dashboard" textValue="Dashboard" className="hover:bg-purple-950/30">
              <Link
                className="flex items-center gap-2 text-zinc-200 hover:text-white w-full"
                href={`/dashboard/${user?.role || "user"}`}
              >
                <MdDashboard className="text-lg text-orange-400" />
                <span>Dashboard</span>
              </Link>
            </Dropdown.Item>

            <Dropdown.Item id="profile" textValue="Profile" className="hover:bg-purple-950/30">
              <Link
                className="flex items-center gap-2 text-zinc-200 hover:text-white w-full"
                href="/dashboard/profile"
              >
                <CgProfile className="text-lg text-orange-400" />
                <span>Profile</span>
              </Link>
            </Dropdown.Item>

            <Dropdown.Item
              id="logout"
              textValue="Logout"
              className="text-rose-400 hover:bg-rose-500/10 focus:bg-rose-500/10"
              onClick={handleSignOut}
            >
              <div className="flex items-center gap-2">
                <LogOutIcon className="text-lg" />
                <span>Logout</span>
              </div>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
    </div>
  );
}