"use client";
import React from "react";
import { motion } from "framer-motion";

const idImages = {
  "6a3bfe6ffb10f7dfa495d237": "https://images.unsplash.com/photo-1611224885990-ab7363d1f2a9?w=400",
  "6a3bfe6ffb10f7dfa495d232": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
  "6a3bfe6ffb10f7dfa495d234": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400",
  "6a3bfe6ffb10f7dfa495d230": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400",
  "6a3bfe6ffb10f7dfa495d22f": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400",
  "6a3bfe6ffb10f7dfa495d231": "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400",
};

const defaultImage = "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&auto=format&fit=crop&q=80";

export default function FeaturedPrompts({ featured = [], handleViewDetails, containerVariants, fadeInUp }) {

  const fallbackPrompts = [
    { _id: "6a3bfe6ffb10f7dfa495d237", title: "High-Retention Instagram Reel Hook Engine", description: "Brainstorm dynamic psychology hooks designed to crash scrolling drops.", aiTool: "ChatGPT", category: "Marketing", copyCount: 202 },
    { _id: "6a3bfe6ffb10f7dfa495d232", title: "Product Launch Facebook Ad Strategist", description: "Compose multiple high-CTR copy hooks targeting lookalike lists.", aiTool: "ChatGPT", category: "Marketing", copyCount: 177 },
    { _id: "6a3bfe6ffb10f7dfa495d234", title: "Minimalist Line Art Logo Asset", description: "Create vector styled luxury iconography for premium branding structures.", aiTool: "Midjourney", category: "Graphics & Images", copyCount: 168 },
    { _id: "6a3bfe6ffb10f7dfa495d230", title: "Watercolor Children Storybook Backdrop", description: "Design charming hand-painted canvas textures for illustration workflows.", aiTool: "Midjourney", category: "Graphics & Images", copyCount: 146 },
    { _id: "6a3bfe6ffb10f7dfa495d22f", title: "Creative Brand Naming Lab", description: "Brainstorm premium available branding identities based on dynamic motifs.", aiTool: "ChatGPT", category: "Idea Generation", copyCount: 133 },
    { _id: "6a3bfe6ffb10f7dfa495d231", title: "B2B SaaS Whitepaper Architect", description: "Generate futuristic neon-lit cyberpunk vector style character designs.", aiTool: "Gemini", category: "Writing", copyCount: 39 }
  ];

  const displayPrompts = featured && featured.length > 0 ? featured : fallbackPrompts;

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="max-w-7xl mx-auto px-6 py-16"
    >
      <div className="mb-10">
        <h2 className="text-2xl md:text-3xl font-black text-white">Trending Prompt Templates</h2>
        <p className="text-zinc-500 text-xs mt-1">Handpicked optimized prompt templates ready to deploy.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayPrompts.map((prompt) => {
          const promptId = prompt._id?.toString() || prompt._id;
          const thumbnail = prompt.image || prompt.thumbnail || idImages[promptId] || defaultImage;

          return (
            <motion.div
              key={promptId}
              variants={fadeInUp}
              className="bg-zinc-900/20 border border-purple-950/20 rounded-2xl overflow-hidden backdrop-blur-sm hover:border-purple-500/30 transition-all flex flex-col justify-between group"
            >
              <div className="w-full h-36 overflow-hidden relative">
                <img
                  src={thumbnail}
                  alt={prompt.title}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
                <span className="absolute bottom-3 left-3 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-900/40 backdrop-blur-sm">
                  {prompt.aiTool || "ChatGPT"}
                </span>
                {prompt.category && (
                  <span className="absolute bottom-3 right-3 text-[10px] text-zinc-400 font-medium bg-zinc-950/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {prompt.category}
                  </span>
                )}
              </div>

              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-purple-400 transition-colors">
                    {prompt.title}
                  </h3>
                  <p className="text-zinc-400 text-xs mt-2 line-clamp-2 leading-relaxed">
                    {prompt.description}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-purple-950/10 flex items-center justify-between">
                  <span className="text-zinc-500 text-xs">
                    Copied {prompt.copyCount || 0} times
                  </span>
                  <button
                    onClick={() => handleViewDetails ? handleViewDetails(promptId) : window.location.href = `/all-prompts/${promptId}`}
                    className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    View Details <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}