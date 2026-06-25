"use client";

import React, { useState, useRef } from "react";
import { Button } from "@heroui/react";
import { Plus } from "@gravity-ui/icons";
import { HiOutlineUpload } from "react-icons/hi";
import { imageUpload } from "@/lib/imgUpload";
import { addPrompt } from "@/lib/action/prompts";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function AddPromptForm({ totalExistingPrompts }) {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const isFreeLimitReached = totalExistingPrompts >= 3;

  const { data: session } = authClient.useSession();
  const userEmail = session?.user?.email;

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
        tags: data.tags,
        difficultyLevel: data.difficultyLevel,
        visibility: data.visibility,
        usageInstructions: data.usageInstructions, 
        thumbnail: uploadedImageUrl,
        copyCount: 0,
        status: "pending",
        email: userEmail,
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
      <div className="w-full max-w-2xl mx-auto p-8 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center backdrop-blur-md">
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
    <div className="w-full max-w-3xl mx-auto bg-[#13112b]/40 border border-purple-950/30 p-6 rounded-2xl backdrop-blur-md font-sans">
      <div className="flex items-center gap-2 mb-6 border-b border-purple-950/20 pb-4">
        <Plus className="text-orange-400 size-6" />
        <h1 className="text-xl font-bold text-white">Add New Prompt (User)</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Prompt Title <span className="text-orange-400">*</span>
          </label>
          <input
            type="text"
            name="title"
            placeholder="Enter prompt title"
            className="w-full bg-[#0b0813]/50 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 transition-colors"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Prompt Description <span className="text-orange-400">*</span>
          </label>
          <textarea
            name="description"
            placeholder="Briefly describe what this prompt does"
            rows={3}
            className="w-full bg-[#0b0813]/50 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
            required
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Prompt Content <span className="text-orange-400">*</span>
          </label>
          <textarea
            name="content"
            placeholder="Paste the actual prompt code/text here"
            rows={5}
            className="w-full bg-[#0b0813]/50 border border-purple-950/40 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
            required
          />
        </div>

        {/* Row 1: Category & AI Engine */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Category <span className="text-orange-400">*</span>
            </label>
            <select
              name="category"
              className="w-full bg-[#0b0813]/80 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-purple-500/50 transition-colors"
              required
            >
              <option value="" disabled selected>Select Category</option>
              <option value="marketing" className="bg-[#13112b]">Marketing</option>
              <option value="coding" className="bg-[#13112b]">Coding</option>
              <option value="writing" className="bg-[#13112b]">Creative Writing</option>
              <option value="graphics-image" className="bg-[#13112b]">Graphics & Image</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              AI Engine <span className="text-orange-400">*</span>
            </label>
            <select
              name="aiTool"
              className="w-full bg-[#0b0813]/80 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-purple-500/50 transition-colors"
              required
            >
              <option value="" disabled selected>Select AI Tool</option>
              <option value="chatgpt" className="bg-[#13112b]">ChatGPT</option>
              <option value="claude" className="bg-[#13112b]">Claude</option>
              <option value="midjourney" className="bg-[#13112b]">Midjourney</option>
              <option value="gemini" className="bg-[#13112b]">Gemini</option>
            </select>
          </div>
        </div>

        {/* Row 2: Difficulty Level & Visibility Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Difficulty Level <span className="text-orange-400">*</span>
            </label>
            <select
              name="difficultyLevel"
              className="w-full bg-[#0b0813]/80 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-purple-500/50 transition-colors"
              required
            >
              <option value="" disabled selected>Select Level</option>
              <option value="beginner" className="bg-[#13112b]">Beginner</option>
              <option value="intermediate" className="bg-[#13112b]">Intermediate</option>
              <option value="pro" className="bg-[#13112b]">Pro</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Visibility Status <span className="text-orange-400">*</span>
            </label>
            <div className="flex flex-wrap items-center gap-5 h-[46px]">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-zinc-300">
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

              <label className="flex items-center gap-2 cursor-pointer text-sm text-zinc-300">
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
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Tags (Comma-Separated)
          </label>
          <input
            type="text"
            name="tags"
            placeholder="e.g. tailwind, card, component, responsive"
            className="w-full bg-[#0b0813]/50 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>

        {/* 🎯 Usage Instructions — নতুন field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Usage Instructions
          </label>
          <textarea
            name="usageInstructions"
            placeholder="Explain how to use this prompt — e.g. replace [topic] with your subject, run in ChatGPT-4..."
            rows={3}
            className="w-full bg-[#0b0813]/50 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
          />
        </div>

        {/* Thumbnail Image upload */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Thumbnail Image Upload
          </label>
          <input
            type="file"
            name="image"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            required
          />

          <div
            onClick={handleUploadClick}
            className="border-2 border-dashed border-purple-950/40 rounded-xl p-5 text-center hover:border-purple-500/40 transition-colors cursor-pointer bg-[#0b0813]/30 overflow-hidden flex flex-col items-center justify-center min-h-[140px]"
          >
            {imagePreview ? (
              <div className="relative w-full max-w-[200px] h-28 rounded-lg overflow-hidden border border-purple-950">
                <img src={imagePreview} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <p className="text-[10px] text-white font-semibold">Change Image</p>
                </div>
              </div>
            ) : (
              <>
                <HiOutlineUpload className="text-2xl text-zinc-400 mb-2" />
                <p className="text-sm font-bold text-white">
                  Click to choose a thumbnail image file
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  Supports PNG, JPG, or WEBP (Max 2MB)
                </p>
              </>
            )}
          </div>
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          isLoading={loading}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 font-bold text-white rounded-xl py-6 mt-2 shadow-[0_0_20px_rgba(249,115,22,0.2)]"
        >
          Submit Prompt for Review
        </Button>
      </form>
    </div>
  );
}