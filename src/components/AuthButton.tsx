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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
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
      <div className="relative">
        <motion.button
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-background-tertiary)] transition"
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiUser className="w-4 h-4" />
          <span className="truncate max-w-[150px]">{user.email}</span>
        </motion.button>

        {userMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-64 rounded-lg bg-[var(--color-background-secondary)] shadow-lg border border-[var(--color-border)]"
          >
            <div className="p-4">
              <div className="flex items-center gap-2 text-[var(--color-text-secondary)] mb-4">
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
          </motion.div>
        )}
      </div>
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
