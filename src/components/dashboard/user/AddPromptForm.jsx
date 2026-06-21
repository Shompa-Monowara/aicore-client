"use client";

import React, { useState, useRef } from "react";
import { Button } from "@heroui/react";
import { Plus } from "@gravity-ui/icons";
import { imageUpload } from "@/lib/imgUpload"; // মেন্টরের ইমেজ আপলোড হেল্পার
import { addPrompt } from "@/lib/action/prompts"; // 🎯 আমাদের নতুন অ্যাকশন

export default function AddPromptForm({ totalExistingPrompts }) {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null); 
  const fileInputRef = useRef(null); 
  const isFreeLimitReached = totalExistingPrompts >= 3; 

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > 5) {
        alert("Image size cannot exceed 5MB!");
        e.target.value = "";
        setImagePreview(null);
        return;
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 🎯 মेंटরের অবিকল ওয়ান-লাইনার ফর্ম সাবমিশন মেকানিজম
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFreeLimitReached) return;
    
    setLoading(true);
    try {
      // ১. মেন্টরের অবিকল native FormData থেকে অবজেক্ট তৈরি
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      
      // ২. মেন্টরের মতো ImgBB এপিআই কল করে লাইভ ইমেজ ইউআরএল আনা
      let uploadedImageUrl = "";
      if (data.image && data.image.size > 0) {
        const imageRes = await imageUpload(data.image);
        uploadedImageUrl = imageRes.url; 
      }
      
      // 🎯 ৩. আপনার রিকোয়ারমেন্ট অবজেক্ট তৈরি
      const promptProduct = {
        title: data.title,
        description: data.description,
        content: data.content,
        category: data.category,
        aiTool: data.aiTool,
        tags: data.tags,
        difficultyLevel: data.difficultyLevel,
        visibility: data.visibility,
        thumbnail: uploadedImageUrl, // ImgBB ইউআরএল
        copyCount: 0,                // initially 0
        status: "pending",           // Default pending
      };

      // ৪. সার্ভার অ্যাকশন কল
      const result = await addPrompt(promptProduct);
      
      if (result.acknowledged) {
        alert("Prompt submitted successfully!");
        e.target.reset(); // ফর্ম ক্লিন
        setImagePreview(null);
      }

    } catch (error) {
      console.error("Submission failed:", error);
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
          <label className="text-xs font-medium text-zinc-400">Prompt Title</label>
          <input 
            type="text" 
            name="title" // 🎯 FormData ক্যাচ করার কী (Key)
            placeholder="Enter prompt title" 
            className="w-full bg-[#0b0813]/50 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 transition-colors"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-400">Prompt Description</label>
          <textarea 
            name="description" // 🎯 FormData কী
            placeholder="Briefly describe what this prompt does" 
            rows={3}
            className="w-full bg-[#0b0813]/50 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
            required
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-400">Prompt Content</label>
          <textarea 
            name="content" // 🎯 FormData কী
            placeholder="Paste the actual prompt code/text here" 
            rows={5}
            className="w-full bg-[#0b0813]/50 border border-purple-950/40 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
            required
          />
        </div>

        {/* Row 1: Category & AI Tool */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400">Category</label>
            <select 
              name="category" // 🎯 FormData কী
              className="w-full bg-[#0b0813]/80 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-purple-500/50 transition-colors"
              required
            >
              <option value="" disabled selected>Select Category</option>
              <option value="marketing" className="bg-[#13112b]">Marketing</option>
              <option value="coding" className="bg-[#13112b]">Coding</option>
              <option value="writing" className="bg-[#13112b]">Creative Writing</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400">AI Tool</label>
            <select 
              name="aiTool" // 🎯 FormData কী
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

        {/* Row 2: Tags, Difficulty, Visibility */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400">Tags</label>
            <input 
              type="text" 
              name="tags" // 🎯 FormData কী
              placeholder="e.g. SEO, React, Copy" 
              className="w-full bg-[#0b0813]/50 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400">Difficulty Level</label>
            <select 
              name="difficultyLevel" // 🎯 FormData কী
              className="w-full bg-[#0b0813]/80 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-purple-500/50 transition-colors"
              required
            >
              <option value="" disabled selected>Select Level</option>
              <option value="beginner" className="bg-[#13112b]">Beginner</option>
              <option value="intermediate" className="bg-[#13112b]">Intermediate</option>
              <option value="pro" className="bg-[#13112b]">Pro</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400">Visibility</label>
            <select 
              name="visibility" // 🎯 FormData কী
              className="w-full bg-[#0b0813]/80 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-purple-500/50 transition-colors"
              required
            >
              <option value="" disabled selected>Select Visibility</option>
              <option value="public" className="bg-[#13112b]">Public</option>
              <option value="private" className="bg-[#13112b]">Private</option>
            </select>
          </div>
        </div>

        {/* Thumbnail Image upload */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-zinc-400">Thumbnail Image (Max 5MB)</label>
          <input 
            type="file" 
            name="image" // 🎯 মেন্টরের মতো ওরিজিনাল কি (Key) নাম "image"
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
              <p className="text-xs text-zinc-500">
                Click to upload or drag & drop your thumbnail image
              </p>
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