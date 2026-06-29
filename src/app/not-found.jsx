"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@heroui/react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md relative"
      >
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />

        {/* 404 */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[120px] font-black leading-none bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent"
        >
          404
        </motion.h1>

        <h2 className="text-2xl font-black text-white mt-2 mb-3">
          Page Not Found
        </h2>

        <p className="text-zinc-500 text-sm leading-relaxed mb-8">
          The page you are looking for doesn't exist or has been moved. Head back to explore our AI prompt marketplace.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Button
            as={Link}
            href="/"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl px-6"
          >
            Go Home
          </Button>
          <Button
            as={Link}
            href="/all-prompts"
            variant="bordered"
            className="border-zinc-800 text-zinc-300 font-bold rounded-xl px-6 hover:border-purple-500/50 hover:text-white"
          >
            Browse Prompts
          </Button>
        </div>
      </motion.div>
    </div>
  );
}