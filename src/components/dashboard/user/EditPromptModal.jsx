"use client";

import React, { useState } from "react";
import { Button, Modal } from "@heroui/react";
import { HiX, HiOutlineUpload } from "react-icons/hi";
import { imageUpload } from "@/lib/imgUpload";
import { updatePrompt } from "@/lib/action/prompts";
import toast from "react-hot-toast";

export default function EditPromptModal({ prompt, onClose, onUpdated, token }) {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(prompt?.thumbnail || null);

  
  if (!prompt) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > 5) {
        toast.error("Image size cannot exceed 5MB!");
        return;
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      let uploadedImageUrl = prompt.thumbnail;
      if (data.image && data.image.size > 0) {
        const imageRes = await imageUpload(data.image);
        uploadedImageUrl = imageRes.url;
      }

      const updatedData = {
        title: data.title,
        description: data.description,
        content: data.content,
        category: data.category,
        aiTool: data.aiTool,
        tags: data.tags ? data.tags.split(",").map((t) => t.trim()) : [],
        difficulty: data.difficulty,
        visibility: data.visibility,
        usageInstructions: data.usageInstructions,
        thumbnail: uploadedImageUrl,
      };

      const result = await updatePrompt(prompt._id, updatedData, token);

      if (result && (result.modifiedCount > 0 || result.acknowledged)) {
        toast.success("Prompt layout updated successfully!");
        if (onUpdated) {
          onUpdated({ ...prompt, ...updatedData });
        }
        onClose();
      } else {
        toast.error("No structural changes detected.");
      }
    } catch (error) {
      console.error("Update mutation failed:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onOpenChange={onClose}>
      <Modal.Backdrop>
        <Modal.Container placement="auto">
         
          <Modal.Dialog className="w-full max-w-xl bg-[#080810] border border-purple-950/50 text-zinc-300 rounded-2xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-950/40">
            
       
            <button 
              onClick={onClose} 
              className="absolute right-4 top-4 text-zinc-600 hover:text-white transition-colors cursor-pointer z-10"
            >
              <HiX size={20} />
            </button>

            <Modal.Header className="border-b border-purple-950/10 pb-4 p-6">
              <Modal.Heading className="text-lg font-black text-white tracking-tight">
                Modify Prompt Blueprint
              </Modal.Heading>
            </Modal.Header>

            <form onSubmit={handleSubmit}>
              <Modal.Body className="p-6 flex flex-col gap-4">
                
                {/* Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Prompt Title</label>
                  <input type="text" name="title" defaultValue={prompt.title} className="w-full bg-zinc-950/40 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/40 transition-all" required />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Short Description</label>
                  <textarea name="description" defaultValue={prompt.description} rows={2} className="w-full bg-zinc-950/40 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/40 transition-all resize-none" required />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Prompt Content Template</label>
                  <textarea name="content" defaultValue={prompt.content} rows={4} className="w-full bg-zinc-950/40 border border-purple-950/40 rounded-xl px-4 py-3 text-sm font-mono text-purple-300 focus:outline-none focus:border-purple-500/40 transition-all resize-none" required />
                </div>

                {/* Category & AI Tool */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Category</label>
                    <select name="category" defaultValue={prompt.category || ""} className="w-full bg-zinc-950/60 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-purple-500/40 cursor-pointer" required>
                      <option value="Marketing">Marketing</option>
                      <option value="Coding">Coding</option>
                      <option value="Writing">Creative Writing</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest">AI Engine</label>
                    <select name="aiTool" defaultValue={prompt.aiTool || ""} className="w-full bg-zinc-950/60 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-purple-500/40 cursor-pointer" required>
                      <option value="ChatGPT">ChatGPT</option>
                      <option value="Claude">Claude</option>
                      <option value="Midjourney">Midjourney</option>
                      <option value="Gemini">Gemini</option>
                    </select>
                  </div>
                </div>

                {/* Difficulty & Visibility */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Difficulty Level</label>
                    <select name="difficulty" defaultValue={prompt.difficulty || "Beginner"} className="w-full bg-zinc-950/60 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-purple-500/40 cursor-pointer" required>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Pro">Pro</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Visibility Status</label>
                    <div className="flex items-center gap-6 h-[46px]">
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                        <input type="radio" name="visibility" value="public" defaultChecked={prompt.visibility !== "private"} className="size-4 accent-purple-500" />Public
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                        <input type="radio" name="visibility" value="private" defaultChecked={prompt.visibility === "private"} className="size-4 accent-purple-500" />Private
                      </label>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Tags (Comma-Separated)</label>
                  <input type="text" name="tags" defaultValue={prompt.tags ? prompt.tags.join(", ") : ""} className="w-full bg-zinc-950/40 border border-purple-950/40 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/40 transition-all" />
                </div>

                {/* Image Upload */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Thumbnail Image Replacement</label>
                  <label className="border-2 border-dashed border-purple-950/40 rounded-xl p-4 text-center cursor-pointer bg-zinc-950/20 flex flex-col items-center justify-center min-h-[100px] hover:border-purple-500/30 transition-all">
                    <input type="file" name="image" onChange={handleFileChange} accept="image/*" className="hidden" />
                    {imagePreview ? (
                      <img src={imagePreview} alt="Replacement Preview" className="h-16 max-w-[150px] object-cover rounded-md border border-purple-950/20" />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-zinc-500 text-xs font-bold">
                        <HiOutlineUpload className="text-xl text-purple-400/80" />
                        <span>Upload alternative thumbnail file</span>
                      </div>
                    )}
                  </label>
                </div>

              </Modal.Body>

              <Modal.Footer className="flex items-center justify-end gap-3 p-6 border-t border-purple-950/10">
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-zinc-500 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <Button 
                  type="submit" 
                  isLoading={loading} 
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 font-bold text-xs uppercase tracking-wider text-white shadow-lg shadow-purple-950/30 cursor-pointer"
                >
                  Save Infrastructure Changes
                </Button>
              </Modal.Footer>
            </form>

          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}