"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { HiX, HiChartBar, HiCalendar } from "react-icons/hi";
import { Button } from "@heroui/react";

export default function AnalyticsModal({ prompt, onClose }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!prompt || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-[#0f0d1f] border border-purple-950/50 rounded-2xl shadow-2xl p-6 text-zinc-300">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
             <div className="text-purple-400 bg-purple-950/40 p-2 rounded-xl"><HiChartBar className="size-6" /></div>
             <h2 className="text-xl font-bold text-white">Prompt Analytics</h2>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white"><HiX size={24} /></button>
        </div>

        {/* Content */}
        <div className="space-y-4">
           <h3 className="text-lg font-bold text-white">{prompt.title}</h3>
           <p className="text-xs text-zinc-500">Performance metrics compiled dynamically.</p>
           
           <div className="space-y-3 mt-4">
             <div className="flex justify-between"><span>Total Copies</span> <span className="text-cyan-400 font-bold">{prompt.copyCount || 0}</span></div>
             <div className="flex justify-between"><span>Bookmarks Saved</span> <span className="text-purple-400 font-bold">0</span></div>
             <div className="flex justify-between"><span>Average Review Rating</span> <span className="text-amber-400 font-bold">★ {prompt.averageRating?.toFixed(1) || "0.0"}</span></div>
             <div className="flex justify-between"><span>Review Feedbacks</span> <span>{prompt.reviewCount || 0} reviews</span></div>
             <div className="pt-4 border-t border-purple-950/40 flex justify-between">
                <span className="flex items-center gap-2"><HiCalendar /> Created Date</span> 
                <span className="text-zinc-400">{new Date(prompt.createdAt).toLocaleDateString()}</span>
             </div>
           </div>
        </div>

        <Button onClick={onClose} className="w-full mt-6 bg-purple-600 text-white font-bold">
          Close Analytics
        </Button>
      </div>
    </div>,
    document.body
  );
}