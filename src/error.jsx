"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-7xl mb-6"
        >
        
        </motion.div>

        <h1 className="text-3xl font-black text-white mb-3">
          Something Went Wrong
        </h1>

        <p className="text-zinc-500 text-sm leading-relaxed mb-8">
          An unexpected error occurred. Please try again or return to the homepage.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Button
            onPress={() => reset()}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl px-6"
          >
            Try Again
          </Button>
          <Button
            as="a"
            href="/"
            variant="bordered"
            className="border-zinc-800 text-zinc-300 font-bold rounded-xl px-6 hover:border-purple-500/50 hover:text-white"
          >
            Go Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
}