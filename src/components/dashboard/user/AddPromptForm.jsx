"use client";

import { useState, useRef } from "react";
import { Button } from "@heroui/react";
import { Plus } from "@gravity-ui/icons";
import { HiOutlineUpload, HiLockClosed } from "react-icons/hi";
import { imageUpload } from "@/lib/imgUpload";
import { addPrompt } from "@/lib/action/prompts";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function AddPromptForm({ totalExistingPrompts, token }) {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // সাধারণ ইউজারদের জন্য ৩টি সাবমিশন লিমিট
  const isFreeLimitReached = totalExistingPrompts >= 3;

  const { data: session } = authClient.useSession();
  const userEmail = session?.user?.email;
  const userName = session?.user?.name;

  const handleUploadClick = () => { fileInputRef.current.click(); };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > 5) {
        toast.error("Image size cannot exceed 5MB!");
        e.target.value = "";
        setImagePreview(null);
        return;
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Authentication token missing. Please re-login.");
      return;
    }

    if (isFreeLimitReached) {
      toast.error("Limit reached! Free accounts cannot submit more than 3 prompts.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      let uploadedImageUrl = "";
      if (data.image && data.image.size > 0) {
        const imageRes = await imageUpload(data.image);
        uploadedImageUrl = imageRes.url;
      }

      const promptProduct = {
        title: data.title,
        description: data.description,
        content: data.content,
        category: data.category,
        aiTool: data.aiTool,
        tags: data.tags ? data.tags.split(",").map(tag => tag.trim()) : [],
        difficulty: data.difficulty,
        visibility: data.visibility,
        usageInstructions: data.usageInstructions,
        thumbnail: uploadedImageUrl,
        copyCount: 0,
        status: "pending",
        email: userEmail,
        creatorEmail: userEmail,
        creatorName: userName,
        creatorRole: "user"
      };

      const result = await addPrompt(promptProduct, token);

      if (result && result.acknowledged) {
        toast.success("User prompt submitted successfully for review!");
        e.target.reset();
        setImagePreview(null);
        window.location.reload();
      } else {
        toast.error(result?.message || "Submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isFreeLimitReached) {
    return (
      <div className="w-full max-w-4xl bg-zinc-900/10 border border-purple-950/30 p-8 rounded-2xl text-center backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-xl border border-purple-950/40 bg-purple-950/10 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
          <HiLockClosed className="text-2xl" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-black text-white tracking-tight">Prompt Limit Reached!</h2>
          <p className="text-zinc-500 text-xs max-w-md mx-auto leading-relaxed">
            Free accounts are restricted to 3 active prompt architectures. Upgrade your workspace to premium network status to unlock unlimited templates.
          </p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 font-bold text-xs uppercase tracking-wider text-white rounded-xl py-5 px-6 shadow-lg shadow-purple-950/30 cursor-pointer">
          Upgrade to Premium ($5)
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full bg-zinc-900/10 border border-purple-950/20 p-6 md:p-8 rounded-2xl backdrop-blur-sm font-sans shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      <div className="flex flex-col mb-6 border-b border-purple-950/10 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Plus className="text-purple-400 size-6 drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]" />
            <h2 className="text-lg font-black text-white tracking-tight">Add New Prompt Template (User Mode)</h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-zinc-950 border border-purple-950/40 text-zinc-400">
            Usage: {totalExistingPrompts} / 3 Prompts
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Prompt Title <span className="text-purple-400">*</span></label>
          <input type="text" name="title" placeholder="e.g. Optimized React Tailwind Card Builder" className="w-full bg-zinc-950/40 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/40 transition-all duration-300" required />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Short Description <span className="text-purple-400">*</span></label>
          <textarea name="description" placeholder="Explain what this prompt accomplishes in 1–2 sentences..." rows={2} className="w-full bg-zinc-950/40 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/40 transition-all duration-300 resize-none" required />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Prompt Content Template <span className="text-purple-400">*</span></label>
          <textarea name="content" placeholder="Write the full, detailed prompt instructions here..." rows={5} className="w-full bg-zinc-950/40 border border-purple-950/40 rounded-xl px-4 py-3 text-sm font-mono text-purple-300 placeholder:text-zinc-700 focus:outline-none focus:border-purple-500/40 transition-all duration-300 resize-none" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Category <span className="text-purple-400">*</span></label>
            <select name="category" defaultValue="" className="w-full bg-zinc-950/60 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-purple-500/40 transition-colors cursor-pointer" required>
              <option value="" disabled>Select Category</option>
              <option value="Marketing" className="bg-[#080810]">Marketing</option>
              <option value="Coding" className="bg-[#080810]">Coding</option>
              <option value="Writing" className="bg-[#080810]">Creative Writing</option>
              <option value="Other" className="bg-[#080810]">Other</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest">AI Engine <span className="text-purple-400">*</span></label>
            <select name="aiTool" defaultValue="" className="w-full bg-zinc-950/60 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-purple-500/40 transition-colors cursor-pointer" required>
              <option value="" disabled>Select AI Tool</option>
              <option value="ChatGPT" className="bg-[#080810]">ChatGPT</option>
              <option value="Claude" className="bg-[#080810]">Claude</option>
              <option value="Gemini" className="bg-[#080810]">Gemini</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Difficulty Level <span className="text-purple-400">*</span></label>
            <select name="difficulty" defaultValue="" className="w-full bg-zinc-950/60 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-purple-500/40 transition-colors cursor-pointer" required>
              <option value="" disabled>Select Level</option>
              <option value="Beginner" className="bg-[#080810]">Beginner</option>
              <option value="Intermediate" className="bg-[#080810]">Intermediate</option>
              <option value="Pro" className="bg-[#080810]">Pro</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Visibility Status <span className="text-purple-400">*</span></label>
            <div className="flex items-center gap-6 h-[46px]">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                <input type="radio" name="visibility" value="public" defaultChecked required className="size-4 accent-purple-500" />Public
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                <input type="radio" name="visibility" value="private" className="size-4 accent-purple-500" />Private
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Tags (Comma-Separated)</label>
          <input type="text" name="tags" placeholder="e.g. tailwind, card" className="w-full bg-zinc-950/40 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/40 transition-all duration-300" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Usage Instructions</label>
          <textarea name="usageInstructions" placeholder="Explain how to use this prompt..." rows={2} className="w-full bg-zinc-950/40 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/40 transition-all duration-300 resize-none" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Thumbnail Image Upload</label>
          <input type="file" name="image" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          <div onClick={handleUploadClick} className="border-2 border-dashed border-purple-950/40 rounded-xl p-5 text-center cursor-pointer bg-zinc-950/20 min-h-[140px] flex flex-col items-center justify-center transition-all hover:border-purple-500/30">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="max-w-[200px] h-28 object-cover rounded-lg border border-purple-950/30" />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <HiOutlineUpload className="text-2xl text-purple-400/80" />
                <p className="text-xs font-bold text-zinc-400 group-hover:text-zinc-300">Click to choose a thumbnail file</p>
              </div>
            )}
          </div>
        </div>

        <Button 
          type="submit" 
          isLoading={loading} 
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 font-bold text-xs uppercase tracking-wider text-white rounded-xl py-6 mt-2 shadow-lg shadow-purple-950/30 cursor-pointer"
        >
          Submit User Prompt
        </Button>
      </form>
    </div>
  );
}