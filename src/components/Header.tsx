"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AuthModal from "./AuthModal";
import MovieSearch from "./MovieSearch";
import { useAuthStore } from "@/store/authStore";
import { FiUser, FiLogOut } from "react-icons/fi";

export default function Header() {
  const [authOpen, setAuthOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="w-full flex items-center justify-between mb-16 relative h-16 px-8">
      {/* Logo */}
      <div className="font-extrabold text-xl text-[var(--color-accent)] tracking-wide">
        SVI Movies
      </div>
      {/* Search & Login */}
      <MovieSearch />

      {user ? (
        <motion.div
          className="flex items-center gap-4"
          initial={false}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
            <FiUser className="w-4 h-4" />
            <span>{user.email}</span>
          </div>
          <motion.button
            className="px-6 py-2 rounded-full bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] font-semibold hover:bg-[var(--color-background-tertiary)] transition flex items-center gap-2"
            onClick={handleLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiLogOut className="w-4 h-4" />
            Logout
          </motion.button>
        </motion.div>
      ) : (
        <motion.button
          className="px-6 py-2 rounded-full bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] font-semibold hover:bg-[var(--color-background-tertiary)] transition relative"
          onClick={() => setAuthOpen(true)}
          initial={false}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{ zIndex: 1 }}
        >
          Login
        </motion.button>
      )}

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
}
