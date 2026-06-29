"use client";

import React from 'react';
import { Modal, Button } from "@heroui/react";
import {
  HiOutlineChartBar,
  HiOutlineClipboardCopy,
  HiOutlineBookmark,
  HiStar,
  HiOutlineCalendar,
  HiOutlineEye,
} from "react-icons/hi";

export default function AnalyticsModal({ isOpen, prompt, onClose }) {
  if (!prompt) return null;

  const stats = [
    {
      label: "Total Copies",
      value: prompt.copyCount || 0,
      icon: <HiOutlineClipboardCopy className="text-lg" />,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/20",
    },
    {
      label: "Bookmarks Saved",
      value: prompt.bookmarkCount || 0,
      icon: <HiOutlineBookmark className="text-lg" />,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
    },
    {
      label: "Average Review Rating",
      value: (
        <span className="flex items-center gap-1">
          <HiStar className="text-amber-400" />
          {prompt.averageRating ? prompt.averageRating.toFixed(1) : "0.0"}
        </span>
      ),
      icon: <HiStar className="text-lg" />,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "Review Feedbacks",
      value: `${prompt.reviewCount || 0} reviews`,
      icon: <HiOutlineEye className="text-lg" />,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      {/* ডেমো কোড অনুযায়ী ব্যাকড্রপের কোনো ক্লোজিং স্ল্যাশ থাকবে না, এটি পুরো কন্টেইনারকে র‍্যাপ করবে */}
      <Modal.Backdrop>
        
        <Modal.Container placement="auto">
          {/* অবিকল ডেমো কোডের মতো max-w-xl উইডথ এবং স্ক্রলিং হ্যান্ডেলার সেট করা হয়েছে */}
          <Modal.Dialog className="w-full max-w-xl bg-zinc-950 border border-zinc-800/50 text-white rounded-2xl max-h-[90vh] overflow-y-auto scrollbar-thin shadow-2xl">
            <Modal.CloseTrigger onClick={onClose} />

            {/* Modal Header */}
            <Modal.Header className="p-6 pb-4 flex flex-col items-start gap-2 border-b border-gray-800/60 w-full">
              <Modal.Icon className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <HiOutlineChartBar className="size-5" />
              </Modal.Icon>
              <div>
                <Modal.Heading className="text-white font-black text-xl">
                  Prompt Analytics
                </Modal.Heading>
                <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
                  Performance metrics compiled dynamically.
                </p>
              </div>
            </Modal.Header>

            {/* Modal Body */}
            <Modal.Body className="p-6 flex flex-col gap-5">
              {/* Prompt Title */}
              <div className="pb-4 border-b border-purple-950/20">
                <p className="text-white font-bold text-sm">{prompt.title}</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-zinc-900 text-purple-400 border border-purple-950/30">
                    {prompt.aiTool}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-zinc-900 text-zinc-400 border border-purple-950/30">
                    {prompt.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-zinc-900 text-zinc-400 border border-purple-950/30">
                    {prompt.difficulty}
                  </span>
                </div>
              </div>

              {/* Stats mapping */}
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center justify-between py-1 border-b border-purple-950/10 last:border-0"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg border ${stat.bg} ${stat.color}`}>
                      {stat.icon}
                    </div>
                    <span className="text-zinc-400 text-sm font-semibold">
                      {stat.label}
                    </span>
                  </div>
                  <span className={`text-base font-black ${stat.color} flex items-center gap-1`}>
                    {stat.value}
                  </span>
                </div>
              ))}

              <div className="h-[1px] bg-gray-800/60 my-1" />

              {/* Created Date */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg border bg-zinc-500/10 border-zinc-500/20 text-zinc-400">
                    <HiOutlineCalendar className="text-lg" />
                  </div>
                  <span className="text-zinc-400 text-sm font-semibold">Created Date</span>
                </div>
                <span className="text-sm font-black text-zinc-300">
                  {prompt.createdAt
                    ? new Date(prompt.createdAt).toLocaleDateString("en-US", {
                        month: "numeric",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"}
                </span>
              </div>
            </Modal.Body>

            {/* Modal Footer */}
            <Modal.Footer className="p-6 border-t border-gray-800/60">
              <Button
                onPress={onClose}
                className="w-full bg-[#6d28d9] hover:bg-[#5b21b6] text-white font-bold text-sm rounded-xl py-3 transition-colors cursor-pointer"
              >
                Close Analytics
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>

      </Modal.Backdrop>
    </Modal>
  );
}