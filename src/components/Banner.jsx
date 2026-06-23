"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HiSearch } from "react-icons/hi";


const TRENDING_TAGS = ["ChatGPT", "Midjourney", "Copywriting", "SaaS Automation", "UI Design", "Stable Diffusion"];

export default function Banner() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    router.push(`/all-prompts?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleTagClick = (tag) => {
    router.push(`/all-prompts?search=${encodeURIComponent(tag)}`);
  };

  // Framer Motion Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }, 
    },
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center bg-[#080810] text-white overflow-hidden pt-16 px-4">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        className="max-w-4xl mx-auto text-center z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.span 
          variants={fadeInUp}
          className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-6 tracking-wider"
        >
          🚀 Maximize Your Productivity with AI
        </motion.span>

        {/* Heading */}
        <motion.h1 
          variants={fadeInUp}
          className="text-4xl md:text-6xl font-black tracking-tight leading-tight md:leading-none mb-6"
        >
          Discover & Share the Best <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">
            AI Prompts
          </span> for Creativity
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          variants={fadeInUp}
          className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto mb-8"
        >
          Automate tasks, supercharge your workflow, and unlock endless creative possibilities with hand-crafted prompts for ChatGPT, Midjourney, and more.
        </motion.p>

        {/* Call To Action (CTA) & Explore Button */}
        <motion.div 
          variants={fadeInUp}
          className="flex flex-wrap items-center justify-center gap-4 mb-10"
        >
          <button 
            onClick={() => router.push("/all-prompts")}
            className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 shadow-lg shadow-purple-600/20 transition-all text-sm"
          >
            Explore Prompts
          </button>
          <button 
            onClick={() => router.push("/create-prompt")} // assuming you have this route
            className="px-6 py-3 rounded-xl font-bold bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all text-sm"
          >
            Share a Prompt
          </button>
        </motion.div>

        {/* Search Bar Section */}
        <motion.form 
          variants={fadeInUp}
          onSubmit={handleSearch}
          className="relative max-w-2xl mx-auto mb-6 bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-1.5 flex items-center shadow-2xl focus-within:border-purple-500/50 transition-all"
        >
          <div className="pl-4 text-zinc-500 text-xl">
            <HiSearch />
          </div>
          <input
            type="text"
            placeholder="Search prompts, tags, automation tools (e.g., Midjourney)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent pl-3 pr-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-sm font-bold bg-purple-600 hover:bg-purple-700 text-white transition-all shrink-0"
          >
            Search
          </button>
        </motion.form>

        {/* Trending Tags */}
        <motion.div 
          variants={fadeInUp}
          className="flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-500"
        >
          <span className="font-medium text-zinc-400">Trending:</span>
          {TRENDING_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="px-2.5 py-1 rounded-md bg-zinc-900/60 border border-zinc-800 hover:border-purple-500/30 hover:text-purple-300 transition-all"
            >
              #{tag}
            </button>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}