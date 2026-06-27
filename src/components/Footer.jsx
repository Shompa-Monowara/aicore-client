"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaGithub, FaLinkedinIn, FaGlobe } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  const pathname = usePathname();

  // ড্যাশবোর্ডে ফুটার হাইড রাখার লজিক
  if (pathname.includes("dashboard")) {
    return null;
  }

  return (
    <footer className="mt-auto border-t border-purple-500/10 bg-[#080810]/80 backdrop-blur-xl shadow-[0_-4px_30px_rgba(0,0,0,0.3)] px-4 sm:px-6 text-zinc-400">
      <div className="mx-auto max-w-7xl">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-12 py-16">

          {/* 🎯 লোগো সেকশন (ন্যাভবারের সাথে ১০০% ম্যাচ) */}
          <div className="flex flex-col space-y-5">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer group w-fit">
                <div className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                  <svg
                    className="h-7 w-7 text-purple-500 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 21L7.188 15.904L2 15L7.188 14.096L9 9L9.813 14.096L15 15L9.813 15.904Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.071 4.929a10 10 0 00-14.142 0M19.071 4.929a10 10 0 010 14.142"
                    />
                  </svg>
                </div>

                <span className="text-2xl font-black tracking-tight text-white">
                  AI
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(168,85,247,0.2)]">
                    Core
                  </span>
                </span>
              </div>
            </Link>

            <p className="max-w-xs text-sm leading-relaxed text-zinc-400/90 font-medium">
              Discover, copy, and create production-ready AI prompts for Gemini,
              ChatGPT, Claude, and Midjourney. Secure workflow.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">
              Platform
            </h3>

            <ul className="space-y-3 text-sm font-semibold">
              <li>
                <Link
                  href="/all-prompts"
                  className="transition-colors hover:text-purple-400"
                >
                  All Prompts
                </Link>
              </li>

              <li>
                <Link
                  href="/#trending"
                  className="transition-colors hover:text-purple-400"
                >
                  Trending Prompts
                </Link>
              </li>

              <li>
                <Link
                  href="/auth/login"
                  className="transition-colors hover:text-purple-400"
                >
                  Login
                </Link>
              </li>

              <li>
                <Link
                  href="/auth/register"
                  className="transition-colors hover:text-purple-400"
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">
              Resources
            </h3>

            <ul className="space-y-3 text-sm font-semibold">
              <li>
                <Link
                  href="/#ui-elements"
                  className="transition-colors hover:text-purple-400"
                >
                  UI Elements
                </Link>
              </li>

              <li>
                <Link
                  href="/#features"
                  className="transition-colors hover:text-purple-400"
                >
                  Platform Benefits
                </Link>
              </li>

              <li>
                <Link
                  href="/pricing"
                  className="transition-colors hover:text-purple-400"
                >
                  Pricing Plan
                </Link>
              </li>

              <li>
                <Link
                  href="/#reviews"
                  className="transition-colors hover:text-purple-400"
                >
                  Customer Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="flex flex-col space-y-4">
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">
                Connect
              </h3>

              <div className="flex flex-wrap gap-2.5">
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-950/40 bg-purple-950/10 text-zinc-400 transition-all hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-purple-400"
                >
                  <FaXTwitter className="h-4 w-4" />
                </Link>

                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-950/40 bg-purple-950/10 text-zinc-400 transition-all hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-purple-400"
                >
                  <FaGithub className="h-4 w-4" />
                </Link>

                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-950/40 bg-purple-950/10 text-zinc-400 transition-all hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-purple-400"
                >
                  <FaLinkedinIn className="h-4 w-4" />
                </Link>

                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-950/40 bg-purple-950/10 text-zinc-400 transition-all hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-purple-400"
                >
                  <FaGlobe className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="text-xs text-zinc-500">
              <p className="font-semibold">
                Questions? Support at:
              </p>

              <a
                href="mailto:support@aicore.com"
                className="mt-1 block text-sm font-semibold text-zinc-300 transition-colors hover:text-purple-400"
              >
                support@aicore.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-purple-950/20 py-8 text-center text-xs tracking-wide text-zinc-500 flex flex-col sm:flex-row items-center justify-center gap-1.5 font-medium">
          <p>
            © {new Date().getFullYear()} AICore. All rights reserved.
          </p>

          <span className="hidden sm:inline text-purple-950/40">
            |
          </span>

          <p>
            Powered by{" "}
            <span className="font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              AICore 
            </span>
          </p>
        </div>

      </div>
    </footer>
  );
}