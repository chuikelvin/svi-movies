"use client";

import { useState } from "react";
import { useMovieStore } from "@/store/movieStore";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";

export default function MovieSearch() {
  const [query, setQuery] = useState("");
  const { searchMovies } = useMovieStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      searchMovies(query, 1); // Reset to page 1 when searching
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSearch}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="flex-1 flex justify-center gap-2 bg-[var(--color-background-secondary)] rounded-full px-4 py-2">
        <motion.input
          whileFocus={{ scale: 1.02 }}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies..."
          className="bg-transparent border-none outline-none flex-1 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]"
        />
        <button
          className="w-10 h-10 rounded-full bg-[var(--color-accent)] flex items-center justify-center hover:opacity-90 transition-colors"
          aria-label="Search"
          type="submit"
        >
          <FiSearch className="w-5 h-5 text-[var(--color-background)]" />
        </button>
      </div>
    </motion.form>
  );
}