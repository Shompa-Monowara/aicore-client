"use client";

import { useEffect, useState } from "react";
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
         toast.success("Updated!");
        onUpdated({ ...prompt, ...data });
        onClose();
       }
    } catch (e) { toast.error("Error"); }
    finally { setLoading(false); }
  };

  const currentVisibility = prompt.visibility?.toLowerCase() || "public";

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-[#0f0d1f] border border-purple-950/50 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-purple-950/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
             <div className="bg-purple-950/40 text-purple-400 p-2 rounded-xl"><HiPencilSquare className="size-5" /></div>
             <h2 className="text-xl font-bold text-white">Update Prompt Template</h2>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white"><HiX size={24} /></button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 gap-5 flex flex-col">
           <div className="flex flex-col gap-1.5">
             <label className="text-xs font-semibold text-zinc-400 uppercase">Prompt Title *</label>
             <input name="title" defaultValue={prompt.title} className="w-full bg-[#0b0813] border border-purple-950/40 rounded-xl px-4 py-3 text-white" required />
           </div>

           <div className="flex flex-col gap-1.5">
             <label className="text-xs font-semibold text-zinc-400 uppercase">Prompt Description *</label>
             <textarea name="description" defaultValue={prompt.description} rows={2} className="w-full bg-[#0b0813] border border-purple-950/40 rounded-xl px-4 py-3 text-white" />
           </div>

           <div className="flex flex-col gap-1.5">
             <label className="text-xs font-semibold text-zinc-400 uppercase">Prompt Content Template *</label>
             <textarea name="content" defaultValue={prompt.content} rows={4} className="w-full bg-[#0b0813] border border-purple-950/40 rounded-xl px-4 py-3 text-white" />
           </div>
           
           <div className="grid grid-cols-2 gap-4">
             <select name="category" defaultValue={prompt.category} className="bg-[#0b0813] border border-purple-950/40 rounded-xl px-4 py-3 text-zinc-300">
               <option value="marketing">Marketing</option>
               <option value="coding">Coding</option>
               <option value="writing">Creative Writing</option>
               <option value="graphics-image">Graphics & Image</option>
               <option value="Idea-generatiion" className="bg-[#13112b]">Idea Generation</option>
              <option value="system-assistant" className="bg-[#13112b]">System Assistant</option>
              <option value="other" className="bg-[#13112b]">Other</option>
             </select>
             <select name="aiTool" defaultValue={prompt.aiTool} className="bg-[#0b0813] border border-purple-950/40 rounded-xl px-4 py-3 text-zinc-300">
               <option value="chatgpt">ChatGPT</option>
               <option value="claude">Claude</option>
               <option value="gemini">Gemini</option>
               <option value="stable-diffusion" className="bg-[#13112b]">Stable Diffusion</option>
              <option value="other" className="bg-[#13112b]">Other</option>
             </select>
           </div>

           <div className="grid grid-cols-2 gap-4">
             <select name="difficultyLevel" defaultValue={prompt.difficultyLevel} className="bg-[#0b0813] border border-purple-950/40 rounded-xl px-4 py-3 text-zinc-300">
               <option value="beginner">Beginner</option>
               <option value="intermediate">Intermediate</option>
               <option value="pro">Pro</option>
             </select>
             <div className="flex items-center gap-4 px-4 bg-[#0b0813] border border-purple-950/40 rounded-xl">
               <label className="flex items-center gap-2 text-zinc-300 text-sm"><input type="radio" name="visibility" value="public" defaultChecked={currentVisibility === "public"} /> Public</label>
               <label className="flex items-center gap-2 text-zinc-300 text-sm"><input type="radio" name="visibility" value="private" defaultChecked={currentVisibility === "private"} /> Private</label>
             </div>
           </div>

           <input name="tags" defaultValue={Array.isArray(prompt.tags) ? prompt.tags.join(", ") : prompt.tags} className="w-full bg-[#0b0813] border border-purple-950/40 rounded-xl px-4 py-3 text-white" placeholder="Tags (comma separated)" />
           
           {/* Footer */}
           <div className="flex justify-end gap-3 pt-4 border-t border-purple-950/40">
             <Button variant="bordered" onClick={onClose} className="text-zinc-400">Cancel</Button>
             <Button type="submit" isLoading={loading} className="bg-purple-600 text-white font-bold">Save Changes</Button>
           </div>
        </form>
      </div>
    </div>,
    document.body
  );
}