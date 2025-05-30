"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  FiGithub,
  FiInstagram,
  FiLinkedin,
  FiGlobe,
} from "react-icons/fi";
import { SiX } from "react-icons/si";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-[var(--color-background-secondary)] border-t border-[var(--color-border)] mt-auto"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
              SVI Movies
            </h3>
            <p className="text-[var(--color-text-secondary)] max-w-xs">
              Discover a curated collection of captivating movies and TV shows
              brought to you by SVI.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/movie"
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                >
                  Movies
                </Link>
              </li>
              <li>
                <Link
                  href="/tv"
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                >
                  TV Shows
                </Link>
              </li>
              <li>
                <Link
                  href="/kids"
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                >
                  Kids
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
              Connect With Us
            </h3>
            <div className="flex space-x-4">
              <motion.a
                href="https://github.com/chuikelvin"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                aria-label="Visit our GitHub"
              >
                <FiGithub className="w-6 h-6" />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/kelvin-chui/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                aria-label="Connect on LinkedIn"
              >
                <FiLinkedin className="w-6 h-6" />
              </motion.a>
              <motion.a
                href="https://x.com/Sir_Chui"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                aria-label="Follow us on X (Formerly Twitter)"
              >
                <SiX className="w-6 h-6" />
              </motion.a>
              <motion.a
                href="https://kelvinchui.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                aria-label="Find us on web"
              >
                <FiGlobe className="w-6 h-6" />
              </motion.a>
              <motion.a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
                aria-label="Follow us on Instagram"
              >
                <FiInstagram className="w-6 h-6" />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-[var(--color-border)] text-center text-[var(--color-text-tertiary)]">
          <p>© {currentYear} SVI Movies. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
}
