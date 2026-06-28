"use client";

import { useState } from "react";
import {
  dismissReport,
  warnCreator,
  removeReportedPrompt,
} from "@/lib/action/admin";
import toast from "react-hot-toast";
import {
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineTrash,
} from "react-icons/hi";

const statusStyles = {
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.05)]",
  dismissed: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  warned: "bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-[0_0_12px_rgba(249,115,22,0.05)]",
};

export default function ReportedPromptsList({ reports, token }) {
  const [items, setItems] = useState(reports || []);
  const [busyId, setBusyId] = useState(null);

  const handleDismiss = async (id) => {
    setBusyId(id);
    try {
      const result = await dismissReport(id, token);
      if (result && result.modifiedCount > 0) {
        setItems((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: "dismissed" } : r))
        );
        toast.success("Report dismissed.");
      } else {
        toast.error("Could not dismiss report.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setBusyId(null);
    }
  };

  const handleWarn = async (id) => {
    setBusyId(id);
    try {
      const result = await warnCreator(id, token);
      if (result && result.modifiedCount > 0) {
        setItems((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: "warned" } : r))
        );
        toast.success("Creator warned.");
      } else {
        toast.error("Could not warn creator.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setBusyId(null);
    }
  };

  const handleRemovePrompt = async (id) => {
    if (!confirm("This will permanently delete the reported prompt and close this report. Continue?")) return;
    setBusyId(id);
    try {
      const result = await removeReportedPrompt(id, token);
      if (result && result.deletedCount > 0) {
        setItems((prev) => prev.filter((r) => r._id !== id));
        toast.success("Prompt removed and report closed.");
      } else {
        toast.error("Could not remove prompt.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="bg-zinc-900/10 border border-purple-950/20 rounded-2xl overflow-hidden backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      <div className="w-full text-sm overflow-x-auto block scrollbar-thin scrollbar-thumb-purple-950/40">
        <table className="w-full text-left border-collapse min-w-[950px]">
          <thead>
            <tr className="border-b border-purple-950/30 bg-zinc-950/40 text-zinc-400 font-black text-[10px] tracking-widest uppercase">
              <th className="px-6 py-4.5">Reported Prompt</th>
              <th className="px-5 py-4.5">Reason</th>
              <th className="px-5 py-4.5">Reported By</th>
              <th className="px-5 py-4.5">Status</th>
              <th className="px-5 py-4.5">Date</th>
              <th className="px-6 py-4.5 text-right">Actions Panel</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-950/10 text-zinc-300">
            {items?.map((r) => (
              <tr key={r._id} className="hover:bg-purple-950/5 transition-colors duration-150 group">
                <td className="px-6 py-4 max-w-[220px]">
                  <p className="text-white font-bold text-sm tracking-tight line-clamp-1 group-hover:text-purple-400 transition-colors">
                    {r.promptTitle || "Unknown Prompt"}
                  </p>
                  {r.details && (
                    <p className="text-zinc-500 text-[11px] mt-0.5 line-clamp-1" title={r.details}>
                      {r.details}
                    </p>
                  )}
                </td>

                <td className="px-5 py-4">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-zinc-900 text-rose-400 border border-rose-950/40">
                    {r.reason || "Other"}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <p className="text-white font-semibold text-xs">{r.reportedByName || "Anonymous"}</p>
                  <p className="text-zinc-500 text-[11px] font-mono mt-0.5">{r.reportedByEmail || "—"}</p>
                </td>

                <td className="px-5 py-4">
                  <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase border ${statusStyles[r.status] || statusStyles.pending}`}>
                    {r.status || "PENDING"}
                  </span>
                </td>

                <td className="px-5 py-4 text-zinc-500 text-[11px] font-mono">
                  {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleDismiss(r._id)}
                      disabled={busyId === r._id || r.status === "dismissed"}
                      title="Dismiss Report"
                      className="p-2 rounded-xl text-zinc-400 bg-zinc-900/40 border border-purple-950/30 hover:bg-zinc-500/10 hover:border-zinc-500/30 transition-all disabled:opacity-20 cursor-pointer"
                    >
                      <HiOutlineCheckCircle className="text-base" />
                    </button>

                    <button
                      onClick={() => handleWarn(r._id)}
                      disabled={busyId === r._id || r.status === "warned"}
                      title="Warn Creator"
                      className="p-2 rounded-xl text-orange-400 bg-zinc-900/40 border border-purple-950/30 hover:bg-orange-500/10 hover:border-orange-500/30 transition-all disabled:opacity-20 cursor-pointer"
                    >
                      <HiOutlineExclamationCircle className="text-base" />
                    </button>

                    <button
                      onClick={() => handleRemovePrompt(r._id)}
                      disabled={busyId === r._id}
                      title="Remove Prompt Permanently"
                      className="p-2 rounded-xl text-zinc-500 bg-zinc-900/40 border border-purple-950/30 hover:bg-rose-600 hover:text-white hover:border-rose-500/30 transition-all disabled:opacity-20 cursor-pointer"
                    >
                      <HiOutlineTrash className="text-base" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}