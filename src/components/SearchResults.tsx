"use client";

import { useMovieStore } from "@/store/movieStore";
import { getImageUrl } from "@/lib/tmdb";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const page = parseInt(searchParams.get("page") || "1");

  const {
    searchResults,
    searchLoading,
    searchError,
    currentPage,
    totalPages,
    searchMovies,
  } = useMovieStore();

  const handlePageChange = (newPage: number) => {
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}&page=${newPage}`);
    }
  };

  if (searchLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white rounded-full"
          data-testid="search-loading-spinner"
        />
      </div>
    );
  }

  if (searchError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-red-500 p-4"
      >
        {searchError}
      </motion.div>
    );
  }

  if (searchResults.length === 0) {
    return (
      <div className="text-center text-[var(--color-text-secondary)] p-8">
        No movies found for &ldquo;{query}&rdquo;
      </div>
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
    <div className="container mx-auto px-4 py-4">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6"
      >
        Search Results
      </motion.h2>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="p-2 sm:p-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      >
        <AnimatePresence mode="wait">
          {searchResults.map((movie) => (
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

      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center items-center gap-4 mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePageChange(currentPage - 1)}
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
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-md bg-[var(--color-primary)] text-white disabled:bg-[var(--color-background-tertiary)] disabled:cursor-not-allowed hover:bg-[var(--color-primary-hover)]"
          >
            Next
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
