"use client";

import React from "react";
import { HiOutlineUser, HiOutlineCalendar } from "react-icons/hi";

export default function AllPaymentsTable({ payments }) {
  return (
    <div className="w-full text-sm overflow-x-auto block scrollbar-thin scrollbar-thumb-purple-950/40">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          {/* 🎯 টেবিল হেডার থিম টিউনিং */}
          <tr className="border-b border-purple-950/30 bg-zinc-950/40 text-zinc-400 font-black text-[10px] tracking-widest uppercase">
            <th className="px-6 py-4.5">Transaction ID</th>
            <th className="px-5 py-4.5">Purchaser Details</th>
            <th className="px-5 py-4.5">Billing Email</th>
            <th className="px-5 py-4.5">Amount Charged</th>
            <th className="px-5 py-4.5">Payment Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-purple-950/10 text-zinc-300">
          {payments.map((payment) => (
            /* 🎯 প্রতি রোর হোভার ইফেক্ট পার্পল টিন্টে ফিক্সড */
            <tr
              key={payment._id}
              className="hover:bg-purple-950/5 transition-colors duration-150 group"
            >
              <td className="px-6 py-4">
                {/* 🎯 ট্রানজেকশন আইডি সায়ান থেকে বদলে পার্পল ক্যাপিসুল লুক দেওয়া হয়েছে */}
                <span className="font-mono text-xs font-bold text-purple-400 bg-purple-950/30 border border-purple-900/20 px-2.5 py-1 rounded-lg">
                  {payment.sessionId ? payment.sessionId.substring(0, 18) + "..." : "—"}
                </span>
              </td>

              <td className="px-5 py-4">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-purple-950 flex items-center justify-center border border-purple-900/30 mt-0.5 shrink-0">
                    <HiOutlineUser className="text-purple-400 text-xs" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-bold text-sm tracking-tight group-hover:text-purple-400 transition-colors">
                      {payment.purchaserName || "Deleted Account"}
                    </p>
                    {payment.purchaserId && (
                      <p className="text-zinc-500 text-[11px] font-mono mt-0.5">
                        UID: {payment.purchaserId.toString().substring(0, 12)}...
                      </p>
                    )}
                  </div>
                </div>
              </td>

              <td className="px-5 py-4 text-zinc-400 font-medium">{payment.email}</td>

              <td className="px-5 py-4">
                {/* 🎯 অ্যামাউন্ট গ্রিন কালার প্যাটার্ন শার্প করা হয়েছে */}
                <span className="text-emerald-400 font-black font-mono text-sm bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded-md">
                  ${Number(payment.amount).toFixed(2)}
                </span>
              </td>

              <td className="px-5 py-4">
                <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-mono">
                  <HiOutlineCalendar className="text-purple-400/80 text-sm" />
                  {payment.createdAt
                    ? new Date(payment.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : "—"}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}