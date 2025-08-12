"use client";

import { useEffect, useState } from "react";
import { useMovieStore } from "@/store/movieStore";
import { getImageUrl } from "@/lib/tmdb";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { isTVShow } from "@/utils/isTvShow";
import type { Movie, TVShow } from "@/store/movieStore";

interface MovieListProps {
  title: string;
  type: "movie" | "tv" | "kids";
  gridCols?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  showPagination?: boolean;
  itemsPerPage?: number;
}

export default function MovieList({
  title,
  type,
  gridCols = { sm: 2, md: 3, lg: 4, xl: 5 },
  showPagination = true,
  itemsPerPage = 20,
}: MovieListProps) {
  const { movies, series, kidsContent, fetchMovies } = useMovieStore();
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  // Get the appropriate content state based on type
  const getContentState = () => {
    switch (type) {
      case "movie":
        return movies;
      case "tv":
        return series;
      case "kids":
        return kidsContent;
      default:
        return movies;
    }
  };

  const contentState = getContentState();

  // Fetch content when page changes
  useEffect(() => {
    fetchMovies(currentPage, type);
  }, [currentPage, type, fetchMovies]);

  // Reset to page 1 when type changes
  useEffect(() => {
    setCurrentPage(1);
  }, [type]);

  // Handle page navigation
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate grid classes dynamically
  const getGridClasses = () => {
    const classes = ["grid", "gap-6"];
    if (gridCols.sm) classes.push(`grid-cols-2 sm:grid-cols-${gridCols.sm}`);
    if (gridCols.md) classes.push(`md:grid-cols-${gridCols.md}`);
    if (gridCols.lg) classes.push(`lg:grid-cols-${gridCols.lg}`);
    if (gridCols.xl) classes.push(`xl:grid-cols-${gridCols.xl}`);
    return classes.join(" ");
  };

  // Handle item click navigation
  const handleItemClick = (item: Movie | TVShow) => {
    if (isTVShow(item)) {
      router.push(`/tv/${item.id}`);
    } else {
      router.push(`/movie/${item.id}`);
    }
  };

  if (contentState.loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white rounded-full"
          data-testid="loading-spinner"
        />
      </div>
    );
  }

  if (contentState.error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-red-500 p-4"
      >
        {contentState.error}
      </motion.div>
    );
  }

  if (contentState.items.length === 0) {
    return (
      <div className="text-center text-[var(--color-text-secondary)] p-8">
        No{" "}
        {type === "tv"
          ? "TV shows"
          : type === "kids"
          ? "kids content"
          : "movies"}{" "}
        found.
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8"
      >
        {title}
      </motion.h1>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className={`p-2 sm:p-0 ${getGridClasses()}`}
      >
        <AnimatePresence mode="wait">
          {contentState.items.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 8px 32px 0 var(--color-accent)",
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-[var(--color-background)] rounded-lg shadow-lg overflow-hidden cursor-pointer"
              onClick={() => handleItemClick(item)}
            >
              <div className="relative h-[400px]">
                <Image
                  src={getImageUrl(item.poster_path, "medium")}
                  alt={isTVShow(item) ? item.name : item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 line-clamp-1 text-[var(--color-text-primary)]">
                  {isTVShow(item) ? item.name : item.title}
                </h3>
                <div className="flex items-center mb-2">
                  <span className="text-[var(--color-accent)] mr-1">★</span>
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    {item.vote_average.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-text-tertiary)] line-clamp-2">
                  {item.overview}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Pagination */}
      {showPagination && contentState.totalPages > 1 && (
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

          {/* Page Numbers */}
          <div className="flex items-center gap-2">
            {Array.from(
              { length: Math.min(5, contentState.totalPages) },
              (_, i) => {
                let pageNum;
                if (contentState.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= contentState.totalPages - 2) {
                  pageNum = contentState.totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <motion.button
                    key={pageNum}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 rounded-md text-sm ${
                      currentPage === pageNum
                        ? "bg-[var(--color-accent)] text-white"
                        : "bg-[var(--color-background-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-background-tertiary)]"
                    }`}
                  >
                    {pageNum}
                  </motion.button>
                );
              }
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === contentState.totalPages}
            className="px-4 py-2 rounded-md bg-[var(--color-primary)] text-white disabled:bg-[var(--color-background-tertiary)] disabled:cursor-not-allowed hover:bg-[var(--color-primary-hover)]"
          >
            Next
          </motion.button>
        </motion.div>
      )}

      {/* Page Info */}
      {showPagination && (
        <div className="text-center text-[var(--color-text-secondary)] mt-4">
          Page {currentPage} of {contentState.totalPages}
          {contentState.items.length > 0 && (
            <span className="ml-2">
              • Showing {contentState.items.length} items
            </span>
          )}
        </div>
      )}
    </div>
  );
}
