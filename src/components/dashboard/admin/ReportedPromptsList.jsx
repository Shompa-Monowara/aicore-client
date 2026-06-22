"use client";

import { useState } from "react";
import {
  dismissReport,
  warnCreator,
  removeReportedPrompt,
} from "@/lib/action/admin";
import toast from "react-hot-toast";
import {
  HiOutlineExclamation,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineEye,
  HiOutlineCheckCircle,
  HiOutlineFlag,
  HiOutlineTrash,
} from "react-icons/hi";

const statusBadge = {
  pending: "bg-red-500/15 text-red-300 border-red-500/30",
  dismissed: "bg-zinc-700/30 text-zinc-400 border-zinc-700/40",
  warned: "bg-amber-500/15 text-amber-300 border-amber-500/30",
};

export default function ReportedPromptsList({ reports }) {
  const [items, setItems] = useState(reports);
  const [busyId, setBusyId] = useState(null);

  const handleDismiss = async (id) => {
    setBusyId(id);
    try {
      const result = await dismissReport(id);
      if (result.modifiedCount > 0) {
        setItems((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: "dismissed" } : r))
        );
        toast.success("Report dismissed.");
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
      const result = await warnCreator(id);
      if (result.modifiedCount > 0) {
        setItems((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: "warned" } : r))
        );
        toast.success("Creator warned.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setBusyId(null);
    }
  };

  const handleRemove = async (id) => {
    if (!confirm("Remove this prompt permanently? This cannot be undone.")) return;
    setBusyId(id);
    try {
      const result = await removeReportedPrompt(id);
      if (result.deletedCount > 0) {
        setItems((prev) => prev.filter((r) => r._id !== id));
        toast.success("Prompt removed.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      {items.map((report) => (
        <div
          key={report._id}
          className="bg-zinc-900/30 border border-purple-950/20 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase border ${
                statusBadge[report.status] || statusBadge.pending
              }`}
            >
              <HiOutlineExclamation className="text-sm" />
              Reason: {report.reason || "Other"}
            </span>
            <span className="flex items-center gap-1.5 text-zinc-500 text-xs">
              <HiOutlineCalendar />
              Reported on{" "}
              {report.createdAt
                ? new Date(report.createdAt).toLocaleDateString("en-US", {
                    month: "numeric",
                    day: "numeric",
                    year: "numeric",
                  })
                : "—"}
            </span>
          </div>

          <h3 className="text-white font-bold text-lg mt-3">
            Prompt: {report.promptTitle || "Untitled"}
          </h3>

          <div className="mt-3 bg-[#0b0813]/50 border border-purple-950/30 rounded-xl px-4 py-3">
            <span className="text-zinc-400 text-sm font-semibold">Report Details: </span>
            <span className="text-zinc-300 text-sm">"{report.details}"</span>
          </div>

          <div className="mt-4 border-t border-purple-950/20" />

          <div className="flex items-center justify-between flex-wrap gap-3 mt-4">
            <div className="flex items-center gap-1.5 text-zinc-500 text-sm">
              <HiOutlineUser />
              Reported by: {report.reportedByName} ({report.reportedByEmail})
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled
                title="Inspect (coming soon)"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-zinc-500 bg-zinc-900/50 cursor-not-allowed"
              >
                <HiOutlineEye className="text-sm" /> Inspect
              </button>

              <button
                onClick={() => handleDismiss(report._id)}
                disabled={busyId === report._id || report.status === "dismissed"}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors disabled:opacity-30"
              >
                <HiOutlineCheckCircle className="text-sm" /> Dismiss
              </button>

              <button
                onClick={() => handleWarn(report._id)}
                disabled={busyId === report._id || report.status === "warned"}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 transition-colors disabled:opacity-30"
              >
                <HiOutlineFlag className="text-sm" /> Warn Creator
              </button>

              <button
                onClick={() => handleRemove(report._id)}
                disabled={busyId === report._id}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-red-300 bg-red-500/10 hover:bg-red-500/20 transition-colors disabled:opacity-30"
              >
                <HiOutlineTrash className="text-sm" /> Remove Prompt
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}