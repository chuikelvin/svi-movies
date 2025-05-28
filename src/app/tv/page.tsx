"use client";

import { useEffect, useState } from "react";
import { useMovieStore } from "@/store/movieStore";
import { getImageUrl } from "@/lib/tmdb";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { isTVShow } from "@/utils/isTvShow";

export default function SeriesPage() {
  const { series, fetchMovies } = useMovieStore();
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    fetchMovies(currentPage, "tv");
  }, [currentPage, fetchMovies]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8"
        >
          Popular Series
        </motion.h1>

        {series.loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white rounded-full"
            />
          </div>
        ) : series.error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-red-500 p-4"
          >
            {series.error}
          </motion.div>
        ) : (
          <>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
            >
              <AnimatePresence mode="wait">
                {series.items.map((show) => (
                  <motion.div
                    key={show.id}
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 8px 32px 0 var(--color-accent)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[var(--color-background)] rounded-lg shadow-lg overflow-hidden cursor-pointer"
                    onClick={() => router.push(`/tv/${show.id}`)}
                  >
                    <div className="relative h-[400px]">
                      <Image
                        src={getImageUrl(show.poster_path, "medium")}
                        alt={isTVShow(show) ? show.name : show.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2 line-clamp-1 text-[var(--color-text-primary)]">
                        {isTVShow(show) ? show.name : show.title}
                        
                      </h3>
                      <div className="flex items-center mb-2">
                        <span className="text-[var(--color-accent)] mr-1">
                          ★
                        </span>
                        <span className="text-sm text-[var(--color-text-secondary)]">
                          {show.vote_average.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--color-text-tertiary)] line-clamp-2">
                        {show.overview}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            <div className="flex justify-center items-center gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-md bg-[var(--color-primary)] text-white disabled:bg-[var(--color-background-tertiary)] disabled:cursor-not-allowed hover:bg-[var(--color-primary-hover)]"
              >
                Previous
              </motion.button>
              <span className="text-[var(--color-text-secondary)]">
                Page {currentPage} of {series.totalPages}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setCurrentPage((p) => Math.min(series.totalPages, p + 1))
                }
                disabled={currentPage === series.totalPages}
                className="px-4 py-2 rounded-md bg-[var(--color-primary)] text-white disabled:bg-[var(--color-background-tertiary)] disabled:cursor-not-allowed hover:bg-[var(--color-primary-hover)]"
              >
                Next
              </motion.button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
