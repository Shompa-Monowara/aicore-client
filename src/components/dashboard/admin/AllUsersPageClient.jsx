"use client";

import { useEffect, useRef, useState } from "react";
import { getAllUsers } from "@/lib/api/admin";
import AllUsersTable from "@/components/dashboard/admin/AllUsersTable";
import { HiOutlineUsers } from "react-icons/hi";

const LIMIT = 10;

const getPageNumbers = (page, totalPages) => {
  const pages = [];
  pages.push(1);
  if (page > 3) {
    pages.push("ellipsis");
  }
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  if (page < totalPages - 2) {
    pages.push("ellipsis");
  }
  if (totalPages > 1) {
    pages.push(totalPages);
  }
  return pages;
};

export default function AllUsersPageClient({
  initialUsers,
  initialTotal,
  initialTotalPages,
  token,
}) {
  const [users, setUsers] = useState(initialUsers);
  const [total, setTotal] = useState(initialTotal);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Page 1-er data already server theke ashche, tai mount-e re-fetch lagbe na
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    let active = true;

    async function loadPage() {
      setLoading(true);
      try {
        const data = await getAllUsers(token, page, LIMIT);
        if (!active) return;
        setUsers(data?.data || []);
        setTotal(data?.total || 0);
        setTotalPages(data?.totalPages || 1);
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPage();
    return () => {
      active = false;
    };
  }, [page, token]);

  const startItem = total === 0 ? 0 : (page - 1) * LIMIT + 1;
  const endItem = Math.min(page * LIMIT, total);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 relative">
      <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-purple-900/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mb-8 relative z-10">
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          User Role &amp; Accounts Management
        </h1>
        <p className="text-zinc-500 text-xs mt-1.5">
          Review accounts, modify role scopes, and delete users.
        </p>
      </div>

      <div className="mt-8 bg-zinc-900/10 border border-purple-950/20 rounded-2xl overflow-hidden backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative z-10">
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-10 h-10 border-[3px] border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 px-6 space-y-4">
            <div className="w-12 h-12 rounded-xl border border-purple-950/40 bg-purple-950/10 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
              <HiOutlineUsers className="text-2xl" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-white font-bold text-base">No registered users found</h2>
              <p className="text-zinc-500 text-xs max-w-sm mx-auto leading-relaxed">
                Active user profiles and credentials will be mapped here once accounts are initialized.
              </p>
            </div>
          </div>
        ) : (
          <>
            <AllUsersTable users={users} token={token} />

            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-4 py-6 border-t border-purple-950/10">
                <p className="text-zinc-500 text-xs font-medium">
                  Showing <span className="text-zinc-300">{startItem}-{endItem}</span> of <span className="text-zinc-300">{total}</span> users
                </p>

                <div className="flex items-center gap-2 select-none">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-4 py-2 rounded-xl bg-zinc-900/30 border border-purple-950/30 text-zinc-400 text-xs font-bold hover:text-white hover:border-purple-500/40 disabled:opacity-40 disabled:hover:border-purple-950/30 disabled:hover:text-zinc-400 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
                  >
                    &larr; Prev
                  </button>

                  {getPageNumbers(page, totalPages).map((p, i) =>
                    p === "ellipsis" ? (
                      <span key={`ellipsis-${i}`} className="px-2 py-1 text-zinc-600 font-bold">
                        ...
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                          p === page
                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-500/30 shadow-md shadow-purple-950/20"
                            : "bg-zinc-900/20 border-purple-950/30 text-zinc-400 hover:text-white hover:border-purple-500/40"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="px-4 py-2 rounded-xl bg-zinc-900/30 border border-purple-950/30 text-zinc-400 text-xs font-bold hover:text-white hover:border-purple-500/40 disabled:opacity-40 disabled:hover:border-purple-950/30 disabled:hover:text-zinc-400 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
                  >
                    Next &rarr;
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}