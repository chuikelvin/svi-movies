"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center w-full px-4 py-12"
    >
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-center leading-tight mb-6">
        Discover Movie Streaming
        <br />
        Experience with{" "}
        <span className="font-extrabold text-[var(--color-text-primary)]">
          SVI Movies
        </span>
      </h1>
      <p className="text-lg sm:text-xl text-[var(--color-text-tertiary)] italic text-center max-w-2xl">
        Discover a curated collection of captivating and insightful movies
        brought to you by SVI — designed to inspire, inform, and entertain.
      </p>
    </motion.section>
  );
}