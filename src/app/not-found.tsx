"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiHome, FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center px-4 bg-[var(--color-background)] z-20">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-9xl font-extrabold text-[var(--color-accent)] mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-6">
            Oops! Page Not Found
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-8 max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Let&apos;s get you back on track!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[var(--color-accent)] text-[var(--color-background)] font-semibold hover:opacity-90 transition-colors flex items-center justify-center gap-2"
              >
                <FiHome className="w-5 h-5" />
                Go Home
              </motion.button>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] font-semibold hover:bg-[var(--color-background-tertiary)] transition-colors flex items-center justify-center gap-2"
            >
              <FiArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
