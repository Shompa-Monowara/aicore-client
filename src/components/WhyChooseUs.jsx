"use client";
import React from "react";
import { motion } from "framer-motion";

export default function WhyChooseUs() {
  // 🎯 আইকনের পরিবর্তে ডাইনামিক এবং প্রিমিয়াম Unsplash ইমেজ যুক্ত করা হলো
  const benefits = [
    {
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80",
      title: "Optimized AI Templates",
      description: "Every prompt is rigorously tested and engineered to deliver precise, high-quality results across various AI models."
    },
    {
      image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&auto=format&fit=crop&q=80",
      title: "1-Click Deploy & Copy",
      description: "Save hours of brainstorming. Copy production-ready prompts instantly and seamlessly inject them into your workflow."
    },
    {
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=80",
      title: "Creator Marketplace",
      description: "Join a thriving ecosystem of top-tier prompt engineers, share your expertise, and monetize your unique AI creations."
    },
    {
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&auto=format&fit=crop&q=80",
      title: "Admin Approved Quality",
      description: "No spam or broken tokens. Our moderation panel ensures only working, high-value prompt architectures go live."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section className="relative max-w-7xl mx-auto px-6 py-20">
    
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

   
      <div className="text-center max-w-2xl mx-auto mb-16 relative z-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Why Choose Our Marketplace?
        </h2>
        <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
          We bridge the gap between human creativity and AI efficiency, offering a secure ecosystem for engineers and creators alike.
        </p>
      </div>

    
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10"
      >
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-4 backdrop-blur-md hover:border-purple-500/40 hover:bg-zinc-900/50 transition-all group flex flex-col justify-between"
          >
            <div>
             
              <div className="w-full h-36 rounded-xl overflow-hidden border border-zinc-800 relative bg-zinc-950">
                <img 
                  src={benefit.image} 
                  alt={benefit.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  loading="lazy"
                />
              </div>

            
              <h3 className="text-base font-bold text-white mt-4 group-hover:text-purple-400 transition-colors">
                {benefit.title}
              </h3>

           
              <p className="text-zinc-400 text-[11px] mt-2 leading-relaxed">
                {benefit.description}
              </p>
            </div>

           
            <div className="mt-5 w-8 h-[2px] bg-zinc-800 group-hover:w-full group-hover:bg-purple-500 transition-all duration-500" />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}