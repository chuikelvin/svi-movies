"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";
import MovieSearch from "./MovieSearch";
import AuthButton from "./AuthButton";

export default function NavigationBar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Movies", href: "/movies" },
    { name: "Series", href: "/series" },
    { name: "Kids", href: "/kids" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-end flex-1">
        <div className="flex items-center gap-8 bg-[var(--color-background-secondary)] rounded-full px-8 py-3 shadow-lg">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} passHref>
              <motion.span
                className={`font-semibold text-base transition-colors ${
                  pathname === link.href
                    ? "text-[var(--color-accent)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {link.name}
              </motion.span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 rounded-lg bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-background-tertiary)] transition-colors"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <FiX className="w-6 h-6" />
        ) : (
          <FiMenu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed top-0 left-0 w-full h-full z-20">
            <div
              className="absolute top-0 left-0 w-full h-full bg-black opacity-50"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 w-64 h-full bg-[var(--color-background-secondary)] shadow-lg z-50 md:hidden overflow-y-auto"
            >
              <div className="flex flex-col p-4 space-y-4">
                {/* Search Bar */}
                <div className="mb-4">
                  <MovieSearch onSearch={() => setIsMobileMenuOpen(false)} />
                </div>

                {/* Navigation Links */}
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      pathname === link.href
                        ? "bg-[var(--color-accent)] text-[var(--color-background)]"
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-background-tertiary)] hover:text-[var(--color-text-primary)]"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                {/* User Section */}
                <div className="border-t border-[var(--color-background-tertiary)] pt-4 mt-4">
                  <AuthButton
                    variant="mobile"
                    // onLoginClick={() => setIsMobileMenuOpen(false)}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
