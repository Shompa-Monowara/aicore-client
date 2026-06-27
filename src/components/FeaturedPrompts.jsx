"use client";
import React from "react";
import { motion } from "framer-motion";

export default function FeaturedPrompts({ featured = [], handleViewDetails, containerVariants, fadeInUp }) {
  
  
  const fallbackPrompts = [
    { _id: "6a3bfe6ffb10f7dfa495d237", title: "High-Retention Instagram Reel Hook Engine", description: "Brainstorm dynamic psychology hooks designed to crash scrolling drops.", aiTool: "Marketing", category: "ChatGPT", copyCount: 202 },
    { _id: "6a3bfe6ffb10f7dfa495d232", title: "Product Launch Facebook Ad Strategist", description: "Compose multiple high-CTR copy hooks targeting lookalike lists.", aiTool: "ChatGPT", category: "Marketing", copyCount: 177 },
    { _id: "6a3bfe6ffb10f7dfa495d234", title: "Minimalist Line Art Logo Asset", description: "Create vector styled luxury iconography for premium branding structures.", aiTool: "Midjourney", category: "Graphics & Images", copyCount: 168 },
    { _id: "6a3bfe6ffb10f7dfa495d230", title: "Watercolor Children Storybook Backdrop", description: "Design charming hand-painted canvas textures for illustration workflows.", aiTool: "Midjourney", category: "Graphics & Images", copyCount: 146 },
    { _id: "6a3bfe6ffb10f7dfa495d22f", title: "Creative Brand Naming Lab", description: "Brainstorm premium available branding identities based on dynamic motifs.", aiTool: "ChatGPT", category: "Idea Generation", copyCount: 133 },
    { _id: "6a3bfe6ffb10f7dfa495d231", title: "B2B SaaS Whitepaper Architect", description: "Generate futuristic, neon-lit cyberpunk vector style character designs and background illustration patterns.", aiTool: "Gemini", category: "Writing", copyCount: 39 }
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

          return (
            <motion.div 
              key={promptId} 
              variants={fadeInUp}
              className="bg-zinc-900/20 border border-purple-950/20 rounded-2xl p-5 backdrop-blur-sm hover:border-purple-500/30 transition-all flex flex-col justify-between group"
            >
              <div>
                
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-purple-950/50 text-purple-300 border border-purple-900/30">
                    {prompt.aiTool || "ChatGPT"}
                  </span>
                  {prompt.category && (
                    <span className="text-[10px] text-zinc-500 font-medium">
                      {prompt.category}
                    </span>
                  )}
                </div>
                
               
                <h3 className="text-lg font-bold mt-3 text-white line-clamp-1 group-hover:text-purple-400 transition-colors">
                  {prompt.title}
                </h3>
                <p className="text-zinc-400 text-xs mt-2 line-clamp-2 leading-relaxed">
                  {prompt.description}
                </p>
              </div>

          
              <div className="mt-5 pt-4 border-t border-purple-950/10 flex items-center justify-between">
                <span className="text-zinc-500 text-xs">
                  Copied {prompt.copyCount || 0} times
                </span>
                
               
                <button 
                  onClick={() => {
                    if (handleViewDetails) {
                      
                      handleViewDetails(promptId);
                    } else {
                     
                      window.location.href = `/all-prompts/${promptId}`;
                    }
                  }}
                  className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  View Details <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}