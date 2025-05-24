"use client";

import { useEffect } from "react";
import { useMovieStore } from "@/store/movieStore";
import { getImageUrl } from "@/lib/tmdb";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function MovieList() {
  const router = useRouter();
  const { movies, loading, error, currentPage, totalPages, fetchMovies } =
    useMovieStore();

  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage, fetchMovies]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-red-500 p-4"
      >
        {error}
      </motion.div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6"
      >
        Popular Movies
      </motion.h2>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="p-2 sm:p-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      >
        <AnimatePresence mode="wait">
          {movies.map((movie) => (
            <motion.div
              key={movie.id}
              variants={item}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 8px 32px 0 var(--color-accent)",
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-[var(--color-background)] rounded-lg shadow-lg overflow-hidden cursor-pointer"
              onClick={() => router.push(`/movie/${movie.id}`)}
            >
              <div className="relative h-[400px]">
                <Image
                  src={getImageUrl(movie.poster_path, "medium")}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 line-clamp-1 text-[var(--color-text-primary)]">
                  {movie.title}
                </h3>
                <div className="flex items-center mb-2">
                  <span className="text-[var(--color-accent)] mr-1">★</span>
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    {movie.vote_average.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-text-tertiary)] line-clamp-2">
                  {movie.overview}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center items-center gap-4 mt-8"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => fetchMovies(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-md bg-[var(--color-primary)] text-white disabled:bg-[var(--color-background-tertiary)] disabled:cursor-not-allowed hover:bg-[var(--color-primary-hover)]"
        >
          Previous
        </motion.button>
        <span className="text-[var(--color-text-secondary)]">
          Page {currentPage} of {totalPages}
        </span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => fetchMovies(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-md bg-[var(--color-primary)] text-white disabled:bg-[var(--color-background-tertiary)] disabled:cursor-not-allowed hover:bg-[var(--color-primary-hover)]"
        >
          Next
        </motion.button>
      </motion.div>
    </div>
  );
}
