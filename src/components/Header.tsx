"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AuthModal from "./AuthModal";
import MovieSearch from "./MovieSearch";

export default function Header() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <header className="w-full flex items-center justify-between mb-16 relative h-16 px-8">
      {/* Logo */}
      <div className="font-extrabold text-xl text-[var(--color-accent)] tracking-wide">
        SVI Movies
      </div>
      {/* Search & Login */}
      <MovieSearch />

      <motion.button
        className="px-6 py-2 rounded-full bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] font-semibold hover:bg-[var(--color-background-tertiary)] transition relative"
        onClick={() => setAuthOpen(true)}
        initial={false}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        style={{ zIndex: 1 }}
      >
        Login
      </motion.button>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
}
