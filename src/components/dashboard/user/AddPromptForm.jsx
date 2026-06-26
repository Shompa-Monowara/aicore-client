"use client";
import React, { useState, useRef } from "react";
import { Button } from "@heroui/react";
import { Plus } from "@gravity-ui/icons";
import { HiOutlineUpload } from "react-icons/hi";
import { imageUpload } from "@/lib/imgUpload";
import { addPrompt } from "@/lib/action/prompts";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function AddPromptForm({ totalExistingPrompts, role = "user" }) {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  
  // মেন্টরের নির্দেশ অনুযায়ী ক্রিয়েটরদের জন্য কোনো সাবমিশন লিমিট থাকবে না (সম্পূর্ণ ফ্রি)
  const isFreeLimitReached = role === "user" && totalExistingPrompts >= 3;

  const { data: session } = authClient.useSession();
  const userEmail = session?.user?.email;
  const userName = session?.user?.name;

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

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
    if (isFreeLimitReached) return;

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
        difficultyLevel: data.difficultyLevel,
        visibility: data.visibility,
        usageInstructions: data.usageInstructions, 
        thumbnail: uploadedImageUrl,
        copyCount: 0,
        status: "pending",
        email: userEmail,
        creatorName: userName, // ডাইনামিক ইমেইল ও নাম পাঠানো নিশ্চিত করা হলো
        creatorRole: role
      };

      const result = await addPrompt(promptProduct);

      if (result.acknowledged) {
        toast.success("Prompt submitted successfully!");
        e.target.reset();
        setImagePreview(null); 
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
      <div className="w-full p-8 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center backdrop-blur-md">
        <h2 className="text-xl font-bold text-amber-400 mb-2">Prompt Limit Reached!</h2>
        <p className="text-zinc-400 text-sm mb-6">
          Free users can add only up to 3 prompts. Upgrade your account to premium to unlock unlimited prompt submissions.
        </p>
        <Button className="bg-gradient-to-r from-orange-500 to-amber-500 font-semibold text-white rounded-xl">
          Upgrade to Premium
        </Button>
      </div>
    );
  }

  return (
    // 🎯 এখানে padding, ml-0 এবং গ্লাস মরফিজম বর্ডার শেড ফিক্স করা হয়েছে (SaaS Vibe)
    <div className="w-full bg-zinc-900/20 border border-purple-500/10 p-6 md:p-8 rounded-2xl backdrop-blur-xl font-sans shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      <div className="flex flex-col mb-6 border-b border-purple-950/20 pb-4">
        <div className="flex items-center gap-2">
          <Plus className="text-orange-500 size-6 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]" />
          <h1 className="text-xl font-bold text-white tracking-wide">Add New Prompt Template</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Prompt Title <span className="text-orange-400">*</span>
          </label>
          <input
            type="text"
            name="title"
            placeholder="e.g. Optimized React Tailwind Card Builder"
            className="w-full bg-zinc-950/40 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500/40 transition-all duration-300"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Short Description <span className="text-orange-400">*</span>
          </label>
          <textarea
            name="description"
            placeholder="Explain what this prompt accomplishes in 1–2 sentences"
            rows={2}
            className="w-full bg-zinc-950/40 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500/40 transition-all duration-300 resize-none"
            required
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Prompt Content Template <span className="text-orange-400">*</span>
          </label>
          <textarea
            name="content"
            placeholder="Write the full, detailed prompt instructions. Use brackets to indicate variables e.g., 'Act as a [role]...'"
            rows={5}
            className="w-full bg-zinc-950/40 border border-purple-950/40 rounded-xl px-4 py-3 text-sm font-mono text-purple-200 placeholder-zinc-600 focus:outline-none focus:border-purple-500/40 transition-all duration-300 resize-none"
            required
          />
        </div>

        {/* Row 1: Category & AI Engine */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Category <span className="text-orange-400">*</span>
            </label>
            <select
              name="category"
              defaultValue=""
              className="w-full bg-zinc-950/60 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-purple-500/40 transition-colors cursor-pointer"
              required
            >
              <option value="" disabled>Select Category</option>
              <option value="Marketing" className="bg-[#0b0813]">Marketing</option>
              <option value="Coding" className="bg-[#0b0813]">Coding</option>
              <option value="Writing" className="bg-[#0b0813]">Creative Writing</option>
              <option value="Graphics & Image" className="bg-[#0b0813]">Graphics & Image</option>
              <option value="Idea Generation" className="bg-[#0b0813]">Idea Generation</option>
              <option value="System Assistant" className="bg-[#0b0813]">System Assistant</option>
              <option value="Other" className="bg-[#0b0813]">Other</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              AI Engine <span className="text-orange-400">*</span>
            </label>
            <select
              name="aiTool"
              defaultValue=""
              className="w-full bg-zinc-950/60 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-purple-500/40 transition-colors cursor-pointer"
              required
            >
              <option value="" disabled>Select AI Tool</option>
              <option value="ChatGPT" className="bg-[#0b0813]">ChatGPT</option>
              <option value="Claude" className="bg-[#0b0813]">Claude</option>
              <option value="Midjourney" className="bg-[#0b0813]">Midjourney</option>
              <option value="Gemini" className="bg-[#0b0813]">Gemini</option>
              <option value="Stable Diffusion" className="bg-[#0b0813]">Stable Diffusion</option>
              <option value="Other" className="bg-[#0b0813]">Other</option>
            </select>
          </div>
        </div>

        {/* Row 2: Difficulty Level & Visibility Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Difficulty Level <span className="text-orange-400">*</span>
            </label>
            <select
              name="difficultyLevel"
              defaultValue=""
              className="w-full bg-zinc-950/60 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-purple-500/40 transition-colors cursor-pointer"
              required
            >
              <option value="" disabled>Select Level</option>
              <option value="Beginner" className="bg-[#0b0813]">Beginner</option>
              <option value="Intermediate" className="bg-[#0b0813]">Intermediate</option>
              <option value="Pro" className="bg-[#0b0813]">Pro</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Visibility Status <span className="text-orange-400">*</span>
            </label>
            <div className="flex items-center gap-6 h-[46px]">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-zinc-300 select-none">
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  defaultChecked
                  required
                  className="size-4 accent-orange-500 cursor-pointer"
                />
                Public (Free access)
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm text-zinc-300 select-none">
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  className="size-4 accent-orange-500 cursor-pointer"
                />
                Private (Premium lock)
              </label>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Tags (Comma-Separated)
          </label>
          <input
            type="text"
            name="tags"
            placeholder="e.g. tailwind, card, component, responsive"
            className="w-full bg-zinc-950/40 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500/40 transition-all duration-300"
          />
        </div>

        {/* Usage Instructions */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Usage Instructions
          </label>
          <textarea
            name="usageInstructions"
            placeholder="Explain how to use this prompt — e.g. replace [product description] with your data..."
            rows={2}
            className="w-full bg-zinc-950/40 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500/40 transition-all duration-300 resize-none"
          />
        </div>

        {/* Thumbnail Upload */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Thumbnail Image Upload
          </label>
          <input
            type="file"
            name="image"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <div
            onClick={handleUploadClick}
            className="border-2 border-dashed border-purple-950/40 rounded-xl p-5 text-center hover:border-purple-500/30 transition-colors cursor-pointer bg-zinc-950/20 overflow-hidden flex flex-col items-center justify-center min-h-[140px]"
          >
            {imagePreview ? (
              <div className="relative w-full max-w-[200px] h-28 rounded-lg overflow-hidden border border-purple-950">
                <img src={imagePreview} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <p className="text-[11px] text-white font-medium">Change Image</p>
                </div>
              </div>
            ) : (
              <>
                <HiOutlineUpload className="text-2xl text-zinc-500 mb-2" />
                <p className="text-sm font-bold text-zinc-300">Click to choose a thumbnail image file</p>
                <p className="text-xs text-zinc-500 mt-1">Supports PNG, JPG, or WEBP (Max 5MB)</p>
              </>
            )}
          </div>
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          isLoading={loading}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 font-bold text-white rounded-xl py-6 mt-2 shadow-[0_4px_20px_rgba(249,115,22,0.2)] transition-transform duration-300 hover:-translate-y-0.5"
        >
          Submit Prompt for Review
        </Button>
      </form>
    </div>
  );
}