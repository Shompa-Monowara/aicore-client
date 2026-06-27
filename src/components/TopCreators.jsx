"use client";
import React from "react";
import { motion } from "framer-motion";

export default function TopCreators({ creators = [], containerVariants, fadeInUp }) {
  
 
  const fallbackCreators = [
    { _id: "c1", name: "Alex PromptEngine", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150", sales: 1420, templatesCount: 24, badge: "Master" },
    { _id: "c2", name: "Rahat AI Lab", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150", sales: 980, templatesCount: 18, badge: "Expert" },
    { _id: "c3", name: "Sarah CodeWizard", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", sales: 850, templatesCount: 15, badge: "Pro" }
  ];

  const displayCreators = creators && creators.length > 0 ? creators : fallbackCreators;

  return (
    <motion.section 
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true }} 
      variants={containerVariants}
      className="max-w-7xl mx-auto px-6 py-16 bg-[#080810]"
    >
      <div className="mb-12">
        <h2 className="text-2xl md:text-3xl font-black text-white">Top Engineering Minds</h2>
        <p className="text-zinc-500 text-xs mt-1">The most influential creators building high-performance prompts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayCreators.map((creator) => (
          <motion.div 
            key={creator._id} 
            variants={fadeInUp}
            whileHover={{ y: -5 }}
            className="bg-zinc-900/20 border border-zinc-800/40 rounded-2xl p-6 backdrop-blur-sm flex items-center gap-4 hover:border-purple-500/30 transition-all group"
          >
            <img 
              src={creator.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"} 
              alt={creator.name} 
              className="w-14 h-14 rounded-full object-cover border-2 border-purple-950 group-hover:border-purple-500 transition-colors"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white truncate group-hover:text-purple-400 transition-colors">{creator.name}</h3>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-900/30">
                  {creator.badge || "Creator"}
                </span>
              </div>
              <p className="text-zinc-500 text-[11px] mt-1">
                {creator.templatesCount || 0} Templates • <span className="text-zinc-400">{creator.sales || 0} Copies</span>
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}