"use client";

import { useState } from "react";
import { changeUserRole, deleteUser } from "@/lib/action/admin";
import toast from "react-hot-toast";
import { HiOutlineTrash, HiOutlineChevronDown } from "react-icons/hi";

const ROLES = ["user", "creator", "admin"];

const roleStyles = {
  admin: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  creator: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  user: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

export default function AllUsersTable({ users, token }) {
  const [items, setItems] = useState(users || []);
  const [busyId, setBusyId] = useState(null);

  const handleRoleChange = async (id, newRole) => {
    setBusyId(id);
    try {
      const result = await changeUserRole(id, newRole, token);
      if (result?.modifiedCount > 0) {
        setItems((prev) =>
          prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
        );
        toast.success(`Role updated to ${newRole}`);
      }
    } catch (err) {
      toast.error("Failed to update role.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setBusyId(id);
    try {
      const result = await deleteUser(id, token);
      if (result?.deletedCount > 0) {
        setItems((prev) => prev.filter((u) => u._id !== id));
        toast.success("User deleted.");
      }
    } catch (err) {
      toast.error("Failed to delete user.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="w-full text-sm overflow-x-auto block scrollbar-thin scrollbar-thumb-purple-950/40">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b border-purple-950/30 bg-zinc-950/40 text-zinc-400 font-black text-[10px] tracking-widest uppercase">
            <th className="px-6 py-4">Name</th>
            <th className="px-5 py-4">Email</th>
            <th className="px-5 py-4">Role</th>
            <th className="px-5 py-4">Plan</th>
            <th className="px-5 py-4">Change Role</th>
            <th className="px-5 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-purple-950/10 text-zinc-300">
          {items.map((u) => (
            <tr key={u._id} className="hover:bg-purple-950/5 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  {u.image ? (
                    <img src={u.image} alt={u.name} referrerPolicy="no-referrer" className="w-8 h-8 rounded-full border border-purple-950/30 object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/20 flex items-center justify-center text-purple-300 text-xs font-bold">
                      {u.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <p className="text-white font-semibold text-sm group-hover:text-purple-400 transition-colors">
                    {u.name || "—"}
                  </p>
                </div>
              </td>

              <td className="px-5 py-4 text-zinc-400 text-xs font-mono">{u.email}</td>

              <td className="px-5 py-4">
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase border ${roleStyles[u.role] || roleStyles.user}`}>
                  {u.role || "user"}
                </span>
              </td>

              <td className="px-5 py-4">
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase border ${
                  u.plan === "premium"
                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                    : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                }`}>
                  {u.plan || "free"}
                </span>
              </td>

              <td className="px-5 py-4">
                <div className="relative inline-block">
                  <select
                    value={u.role || "user"}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    disabled={busyId === u._id}
                    className="appearance-none bg-zinc-900/60 border border-purple-950/30 rounded-xl px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-purple-500/40 pr-7 cursor-pointer disabled:opacity-50"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r} className="bg-zinc-900">{r}</option>
                    ))}
                  </select>
                  <HiOutlineChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 text-xs pointer-events-none" />
                </div>
              </td>

              <td className="px-5 py-4 text-right">
                <button
                  onClick={() => handleDelete(u._id)}
                  disabled={busyId === u._id}
                  className="p-2 rounded-xl text-zinc-500 bg-zinc-900/40 border border-purple-950/30 hover:bg-rose-600 hover:text-white hover:border-rose-500/30 transition-all disabled:opacity-20 cursor-pointer"
                >
                  <HiOutlineTrash className="text-base" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}