"use client";

import React from 'react';
import { Button, Modal } from "@heroui/react";
import {
  BarChart3,
  Star,
  Calendar,
  Tag,
  Layers,
  Bot,
  Gauge,
  Lock,
  Globe,
  FileText,
  Code2,
} from "lucide-react";

const statusBadgeStyles = {
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/10",
  rejected: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const CreatorAnalyticModal = ({ isOpen, onClose, prompt }) => {
  if (!prompt) return null;

  const createdDate = prompt.createdAt
    ? new Date(prompt.createdAt).toLocaleDateString()
    : "—";

  const tags = Array.isArray(prompt.tags) ? prompt.tags : [];

  return (
    // 
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <Modal.Backdrop>
       
        <Modal.Container placement="auto">
          
          {/* max-w-xl উইডথ এবং max-h অবিকল ডেমো ফাইলের মতো রেন্ডার করা হয়েছে */}
          <Modal.Dialog className="w-full max-w-xl bg-[#0a0c14] border border-gray-800 text-white rounded-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">

            {/* Modal Header */}
            <Modal.Header className="relative flex flex-col items-start gap-1 border-b border-gray-800/60 pb-4 p-6">
              <Modal.CloseTrigger 
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors cursor-pointer z-10" 
              />
              
              <div className="flex items-center gap-2">
                <BarChart3 className="size-5 text-gray-300" />
                <Modal.Heading className="text-xl font-bold tracking-wide text-white">
                  Prompt Overview
                </Modal.Heading>
              </div>
              
              <div className="mt-4 flex items-start gap-3 w-full">
                {prompt.thumbnail && (
                  <img
                    src={prompt.thumbnail}
                    alt={prompt.title}
                    className="w-14 h-14 rounded-lg object-cover border border-gray-800 shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-gray-100 truncate">
                    {prompt.title || "Unknown Prompt"}
                  </h3>
                  {prompt.status && (
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase border ${statusBadgeStyles[prompt.status] || statusBadgeStyles.pending}`}>
                      {prompt.status}
                    </span>
                  )}
                </div>
              </div>
            </Modal.Header>

            {/* Modal Body */}
            <Modal.Body className="p-6 flex flex-col gap-6">

              {/* Description */}
              {prompt.description && (
                <div className="flex flex-col gap-1.5">
                  <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-purple-400">
                    <FileText className="size-3.5" /> Description
                  </span>
                  <p className="text-sm text-gray-300 leading-relaxed">{prompt.description}</p>
                </div>
              )}

              {/* Specification badges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 bg-white/5 border border-gray-800/60 rounded-xl px-3 py-2.5">
                  <Bot className="size-4 text-purple-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-wider text-gray-500">AI Engine</p>
                    <p className="text-xs font-bold text-gray-200 truncate">{prompt.aiTool || "—"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-gray-800/60 rounded-xl px-3 py-2.5">
                  <Layers className="size-4 text-purple-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-wider text-gray-500">Category</p>
                    <p className="text-xs font-bold text-gray-200 truncate">{prompt.category || "—"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-gray-800/60 rounded-xl px-3 py-2.5">
                  <Gauge className="size-4 text-purple-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-wider text-gray-500">Difficulty</p>
                    <p className="text-xs font-bold text-gray-200 truncate">{prompt.difficulty || "—"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-gray-800/60 rounded-xl px-3 py-2.5">
                  {prompt.visibility === "private" ? (
                    <Lock className="size-4 text-purple-400 shrink-0" />
                  ) : (
                    <Globe className="size-4 text-purple-400 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-wider text-gray-500">Visibility</p>
                    <p className="text-xs font-bold text-gray-200 truncate capitalize">{prompt.visibility || "Public"}</p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-purple-400">
                    <Tag className="size-3.5" /> Tags
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-white/5 text-gray-400 border border-gray-800/60">
                        #{typeof tag === "string" ? tag.trim() : tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Prompt content */}
              {prompt.content && (
                <div className="flex flex-col gap-1.5">
                  <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-purple-400">
                    <Code2 className="size-3.5" /> Prompt Content
                  </span>
                  <pre className="whitespace-pre-wrap font-mono text-[11px] text-purple-300 bg-black/30 border border-gray-800/60 rounded-xl p-3 leading-relaxed">
                    {prompt.content}
                  </pre>
                </div>
              )}

              <div className="h-[1px] bg-gray-800/60" />

              {/* Total Copies */}
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-[15px] font-medium">Total Copies</span>
                <span className="text-cyan-400 text-xl font-bold">
                  {prompt.copyCount || 0}
                </span>
              </div>

              {/* Bookmarks Saved */}
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-[15px] font-medium">Bookmarks Saved</span>
                <span className="text-purple-400 text-xl font-bold">
                  {prompt.bookmarkCount || 0} 
                </span>
              </div>

              {/* Average Review Rating */}
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-[15px] font-medium">Average Review Rating</span>
                <div className="flex items-center gap-1 text-amber-500 text-xl font-bold">
                  <Star className="size-5 fill-amber-500 stroke-amber-500" />
                  <span>{prompt.averageRating ? prompt.averageRating.toFixed(1) : "0.0"}</span>
                </div>
              </div>

              {/* Review Feedbacks */}
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-[15px] font-medium">Review Feedbacks</span>
                <span className="text-white text-base font-bold">
                  {prompt.reviewCount || 0} reviews
                </span>
              </div>

              <div className="h-[1px] bg-gray-800/60 my-1" />

              {/* Created Date */}
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-[15px] font-medium">Created Date</span>
                <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                  <Calendar className="size-4" />
                  <span>{createdDate}</span>
                </div>
              </div>

            </Modal.Body>

            {/* Modal Footer */}
            <Modal.Footer className="p-6 border-t border-gray-800/60">
              <Button 
                onClick={onClose}
                className="w-full bg-[#6d28d9] hover:bg-[#5b21b6] text-white font-semibold py-3 rounded-xl text-base transition-colors cursor-pointer"
              >
                Close Analytics
              </Button>
            </Modal.Footer>

          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default CreatorAnalyticModal;