"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiUser, FiLogOut } from "react-icons/fi";
import AuthModal from "./AuthModal";
import { useAuthStore } from "@/store/authStore";

interface AuthButtonProps {
  variant?: "desktop" | "mobile";
  onLoginClick?: () => void;
}

export default function AuthButton({
  variant = "desktop",
  onLoginClick,
}: AuthButtonProps) {
  const [authOpen, setAuthOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  const handleLoginClick = () => {
    if (variant === "mobile" && onLoginClick) {
      onLoginClick();
    }
    setAuthOpen(true);
  };

  if (user) {
    if (variant === "mobile") {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)] px-4">
            <FiUser className="w-4 h-4" />
            <span className="truncate">{user.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 rounded-lg bg-[var(--color-background-tertiary)] text-[var(--color-text-primary)] hover:bg-[var(--color-accent)] hover:text-[var(--color-background)] transition-colors flex items-center justify-center gap-2"
          >
            <FiLogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      );
    }

    return (
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
    );
  }

  if (variant === "mobile") {
    return (
      <>
        <button
          onClick={handleLoginClick}
          className="w-full px-4 py-2 rounded-lg bg-[var(--color-accent)] text-[var(--color-background)] hover:opacity-90 transition-colors"
        >
          Login
        </button>
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      </>
    );
  }

  return (
    <>
      <motion.button
        className="px-6 h-12 rounded-full bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] font-semibold hover:bg-[var(--color-background-tertiary)] transition relative"
        onClick={handleLoginClick}
        initial={false}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{ zIndex: 1 }}
      >
        Login
      </motion.button>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
