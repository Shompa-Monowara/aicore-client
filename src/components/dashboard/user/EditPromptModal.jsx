"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { updatePrompt } from "@/lib/action/prompts";
import toast from "react-hot-toast";
import { HiOutlineSave, HiX } from "react-icons/hi";
import { HiPencilSquare } from "react-icons/hi2";
import { Button } from "@heroui/react";

export default function EditPromptModal({ prompt, onClose, onUpdated }) {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!prompt || !mounted) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      if (data.tags) data.tags = data.tags.split(",").map(t => t.trim()).filter(Boolean);
      
      const result = await updatePrompt(prompt._id, data);
      if (result.acknowledged || result.modifiedCount > 0) {
        toast.success("Updated successfully!");
        onUpdated({ ...prompt, ...data });
        onClose();
      }
    } catch (e) { 
      toast.error("Error updating template"); 
    } finally { 
      setLoading(false); 
    }
  };

  const currentVisibility = prompt.visibility?.toLowerCase() || "public";

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
    
      <div className="relative w-full max-w-2xl bg-[#080810] border border-purple-950/50 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] text-zinc-400 overflow-hidden">
        
        
        <div className="absolute -top-20 -left-20 w-44 h-44 bg-purple-900/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Header */}
        <div className="p-6 border-b border-purple-950/10 flex items-center justify-between shrink-0 relative z-10">
          <div className="flex items-center gap-3">
             <div className="text-purple-400 bg-purple-950/40 p-2 rounded-xl border border-purple-900/20">
               <HiPencilSquare className="size-5" />
             </div>
             <h2 className="text-lg font-black text-white tracking-tight">Update Prompt Template</h2>
          </div>
          <button onClick={onClose} className="text-zinc-600 hover:text-white transition-colors cursor-pointer"><HiX size={20} /></button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 gap-5 flex flex-col relative z-10 scrollbar-thin scrollbar-thumb-purple-950/40">
           
           {/* Title Input */}
           <div className="flex flex-col gap-1.5">
             <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Prompt Title *</label>
             <input name="title" defaultValue={prompt.title} type="text" className="w-full bg-zinc-950/40 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/40 transition-all" required />
           </div>

           {/* Description Textarea */}
           <div className="flex flex-col gap-1.5">
             <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Prompt Description *</label>
             <textarea name="description" defaultValue={prompt.description} rows={2} className="w-full bg-zinc-950/40 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/40 transition-all resize-none" required />
           </div>

           {/* Content Code Textarea */}
           <div className="flex flex-col gap-1.5">
             <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Prompt Content Template *</label>
             <textarea name="content" defaultValue={prompt.content} rows={4} className="w-full bg-zinc-950/40 border border-purple-950/40 rounded-xl px-4 py-3 text-xs font-mono text-purple-300 placeholder:text-zinc-700 focus:outline-none focus:border-purple-500/40 transition-all resize-none" required />
           </div>
           
           {/* Dropdowns Line 1 */}
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <select name="category" defaultValue={prompt.category} className="bg-zinc-950/60 border border-purple-950/40 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-300 focus:outline-none focus:border-purple-500/40 cursor-pointer transition-colors">
               <option value="marketing" className="bg-[#080810]">Marketing</option>
               <option value="coding" className="bg-[#080810]">Coding</option>
               <option value="writing" className="bg-[#080810]">Creative Writing</option>
               <option value="graphics-image" className="bg-[#080810]">Graphics & Image</option>
               <option value="Idea-generatiion" className="bg-[#080810]">Idea Generation</option>
               <option value="system-assistant" className="bg-[#080810]">System Assistant</option>
               <option value="other" className="bg-[#080810]">Other</option>
             </select>
             
             <select name="aiTool" defaultValue={prompt.aiTool} className="bg-zinc-950/60 border border-purple-950/40 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-300 focus:outline-none focus:border-purple-500/40 cursor-pointer transition-colors">
               <option value="chatgpt" className="bg-[#080810]">ChatGPT</option>
               <option value="claude" className="bg-[#080810]">Claude</option>
               <option value="gemini" className="bg-[#080810]">Gemini</option>
               <option value="stable-diffusion" className="bg-[#080810]">Stable Diffusion</option>
               <option value="other" className="bg-[#080810]">Other</option>
             </select>
           </div>

           {/* Dropdowns Line 2 + Radio Button */}
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <select name="difficultyLevel" defaultValue={prompt.difficultyLevel} className="bg-zinc-950/60 border border-purple-950/40 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-300 focus:outline-none focus:border-purple-500/40 cursor-pointer transition-colors">
               <option value="beginner" className="bg-[#080810]">Beginner</option>
               <option value="intermediate" className="bg-[#080810]">Intermediate</option>
               <option value="pro" className="bg-[#080810]">Pro</option>
             </select>
             
             <div className="flex items-center gap-6 px-4 bg-zinc-950/40 border border-purple-950/40 rounded-xl h-[46px]">
               <label className="flex items-center gap-2 cursor-pointer text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors">
                 <input type="radio" name="visibility" value="public" defaultChecked={currentVisibility === "public"} className="size-4 accent-purple-500" /> Public
               </label>
               <label className="flex items-center gap-2 cursor-pointer text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors">
                 <input type="radio" name="visibility" value="private" defaultChecked={currentVisibility === "private"} className="size-4 accent-purple-500" /> Private
               </label>
             </div>
           </div>

           {/* Tags Input */}
           <div className="flex flex-col gap-1.5">
             <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Tags (Comma-Separated)</label>
             <input name="tags" defaultValue={Array.isArray(prompt.tags) ? prompt.tags.join(", ") : prompt.tags} type="text" className="w-full bg-zinc-950/40 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/40 transition-all" placeholder="Tags (comma separated)" />
           </div>
           
           {/* Footer Options */}
           <div className="flex justify-end gap-2 pt-4 border-t border-purple-950/10 mt-2">
             <Button variant="bordered" onClick={onClose} className="border-purple-950/40 text-zinc-400 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-zinc-900 hover:text-white transition-colors">
               Cancel
             </Button>
             <Button type="submit" isLoading={loading} className="bg-gradient-to-r from-purple-600 to-indigo-600 font-bold text-xs uppercase tracking-wider text-white rounded-xl py-5 shadow-md shadow-purple-950/30">
               Save Changes
             </Button>
           </div>
        </form>
      </div>
    </div>,
    document.body
  );
}