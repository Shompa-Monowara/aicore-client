"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAllPublicReviews } from "@/lib/api/prompts";

export default function CustomerReviews({ containerVariants, fadeInUp }) {
  const [reviews, setReviews] = useState([]);

  
  useEffect(() => {
    async function loadReviews() {
      const data = await getAllPublicReviews();
     
      if (data && data.length > 0) {
        setReviews(data.slice(0, 3));
      }
    }
    loadReviews();
  }, []);

 
  const fallbackReviews = [
    { _id: "r1", name: "Anisur Rahman", comment: "The Next.js clean architecture prompt saved me at least 20 hours of boilerplate coding. Highly recommended!", rating: 5, promptTitle: "Next.js 15 Clean Architecture Code" },
    { _id: "r2", name: "Tanvir Hasan", comment: "B2B cold emails generated through these prompt structures got an amazing 45% open rate. Insane value!", rating: 5, promptTitle: "AI Cold Email Personalizer" },
    { _id: "r3", name: "Sultana Kamal", comment: "The photorealistic portraits are mindblowing. The token structures are extremely well-optimized.", rating: 4, promptTitle: "Midjourney Photorealistic Portrait" }
  ];

  const displayReviews = reviews && reviews.length > 0 ? reviews : fallbackReviews;

  return (
    <motion.section 
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true }} 
      variants={containerVariants}
      className="max-w-7xl mx-auto px-6 py-16 bg-[#080810]"
    >
   
      <div className="mb-12">
        <h2 className="text-2xl md:text-3xl font-black text-white">What Our Creators Say</h2>
        <p className="text-zinc-500 text-xs mt-1">Real feedback from developers, copywriters, and prompt engineers.</p>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayReviews.map((review) => (
          <motion.div 
            key={review._id} 
            variants={fadeInUp}
            whileHover={{ y: -5 }}
            className="bg-zinc-900/10 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-sm flex flex-col justify-between hover:border-purple-500/20 transition-all group"
          >
            <div>
             
              <div className="flex gap-1 text-amber-500 text-sm">
                {Array.from({ length: review.rating || 5 }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>

             
              <p className="text-zinc-300 text-xs mt-4 italic leading-relaxed group-hover:text-white transition-colors">
                {"\""}{review.comment}{"\""}
              </p>
            </div>

           
            <div className="mt-6 pt-4 border-t border-purple-950/10 flex flex-col gap-1">
              <span className="text-sm font-bold text-white">{review.name}</span>
              {review.promptTitle && (
                <span className="text-[10px] text-purple-400 font-medium truncate">
                  Reviewed: {review.promptTitle}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}