"use client";

import { useState } from "react";
import { Avatar } from "@heroui/react";
import { updateUserRole, deleteUser } from "@/lib/action/admin";
import toast from "react-hot-toast";
import { HiOutlineTrash, HiOutlineCalendar } from "react-icons/hi";

export default function AllUsersTable({ users }) {
  const [items, setItems] = useState(users);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleRoleChange = async (id, newRole) => {
    setUpdatingId(id);
    try {
      const result = await updateUserRole(id, newRole);
      if (result.modifiedCount > 0) {
        setItems((prev) =>
          prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
        );
        toast.success("Role updated successfully!");
      } else {
        toast.error("Could not update role.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    setDeletingId(id);
    try {
      const result = await deleteUser(id);
      if (result.deletedCount > 0) {
        setItems((prev) => prev.filter((u) => u._id !== id));
        toast.success("User deleted successfully!");
      } else {
        toast.error("Could not delete user.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-purple-950/20 text-left text-zinc-500 uppercase text-[11px] tracking-wider">
            <th className="px-5 py-4">Profile Details</th>
            <th className="px-5 py-4">Email Address</th>
            <th className="px-5 py-4">Subscription</th>
            <th className="px-5 py-4">Role Level</th>
            <th className="px-5 py-4">Registered Date</th>
            <th className="px-5 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((user) => {
            const isPremium = user.plan && user.plan !== "free";
            return (
              <tr
                key={user._id}
                className="border-b border-purple-950/10 hover:bg-zinc-900/30 transition-colors"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar size="sm" className="border border-purple-500/20 shrink-0">
                      <Avatar.Image referrerPolicy="no-referrer" alt={user.name} src={user.image} />
                      <Avatar.Fallback>{user.name?.charAt(0) || "U"}</Avatar.Fallback>
                    </Avatar>
                    <span className="text-white font-medium">{user.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-zinc-400">{user.email}</td>
                <td className="px-5 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase border ${
                      isPremium
                        ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                        : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                    }`}
                  >
                    {isPremium ? "Premium" : "Free"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <select
                    value={user.role || "user"}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    disabled={updatingId === user._id}
                    className="bg-[#0b0813]/80 border border-purple-950/40 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500/50 disabled:opacity-40"
                  >
                    <option value="user" className="bg-[#13112b]">User</option>
                    <option value="creator" className="bg-[#13112b]">Creator</option>
                    <option value="admin" className="bg-[#13112b]">Admin</option>
                  </select>
                </td>
                <td className="px-5 py-4 text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <HiOutlineCalendar className="text-zinc-500" />
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "numeric",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </div>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => handleDelete(user._id)}
                    disabled={deletingId === user._id}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-40"
                    title="Delete User"
                  >
                    <HiOutlineTrash className="text-base" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}