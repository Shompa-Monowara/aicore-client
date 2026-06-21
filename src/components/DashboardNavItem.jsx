"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardNavItem({ link, label, children }) {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <Link href={link} className="w-full">
      <button
        type="button"
        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
          isActive
            ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
            : "text-zinc-400 hover:bg-zinc-900/40 hover:text-white"
        }`}
      >
        {children}
        <span>{label}</span>
      </button>
    </Link>
  );
}