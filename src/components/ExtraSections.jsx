"use client";
import React from "react";
import { motion } from "framer-motion";

export default function ExtraSections({ fadeInUp }) {
  
  const stats = [
    { value: "50K+", label: "Prompts Copied" },
    { value: "12K+", label: "Active Engineers" },
    { value: "99.4%", label: "Success Rate" },
    { value: "$4.50", label: "Avg. Prompt Price" },
  ];

  return (
    <div className=" text-white">
   
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-purple-950/20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <span className="text-3xl md:text-5xl font-black bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
                {stat.value}
              </span>
              <span className="text-zinc-500 text-xs md:text-sm mt-2 font-medium">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900/40 to-purple-950/20 border border-purple-900/30 p-8 md:p-12 text-center"
        >
          {/* ✨ ব্যাকগ্রাউন্ড গ্লো লাইট */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400 px-3 py-1 rounded-full bg-purple-950/50 border border-purple-900/40">
              Ready to elevate your workflow?
            </span>
            
            <h2 className="text-3xl md:text-5xl font-black mt-6 tracking-tight leading-tight">
              Start Engineering Your <br className="hidden md:block" />
              Next Big Idea Today
            </h2>
            
            <p className="text-zinc-400 text-xs md:text-sm mt-4 max-w-lg mx-auto leading-relaxed">
              Join thousands of creators and developers who speed up their production lifecycle by deploying optimized, tested prompts.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => window.location.href = "/auth/register"}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 font-bold text-sm text-white shadow-lg shadow-purple-900/30 transition-all cursor-pointer"
              >
                Get Started for Free
              </button>
              
              <button 
                onClick={() => window.location.href = "/all-prompts"}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 font-bold text-sm text-zinc-300 transition-all cursor-pointer"
              >
                Browse Marketplace
              </button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}