"use client";

import { useEffect } from "react";
import { useMovieStore } from "@/store/movieStore";
import { getImageUrl } from "@/lib/tmdb";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface ContentSectionProps {
  title: string;
  type: "movie" | "tv" | "kids";
  limit?: number;
  showViewAll?: boolean;
}

export default function ContentSection({
  title,
  type,
  limit = 8,
  showViewAll = true,
}: ContentSectionProps) {
  const { movies, series, kidsContent, fetchMovies } = useMovieStore();
  const router = useRouter();

  const contentState =
    type === "movie" ? movies : type === "tv" ? series : kidsContent;

  useEffect(() => {
    fetchMovies(1, type);
  }, [type, fetchMovies]);

  if (contentState.loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <motion.div
          role="status"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white rounded-full"
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

  const displayedItems = contentState.items.slice(0, limit);

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
    <section className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold"
        >
          {title}
        </motion.h2>
        {showViewAll && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push(`/${type}`)}
            className="text-[var(--color-accent)] hover:underline"
          >
            View All
          </motion.button>
        )}
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="wait">
          {displayedItems.map((contentItem) => (
            <motion.div
              key={contentItem.id}
              variants={item}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 8px 32px 0 var(--color-accent)",
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-[var(--color-background)] rounded-lg shadow-lg overflow-hidden cursor-pointer"
              onClick={() => router.push(`/${type}/${contentItem.id}`)}
            >
              <div className="relative h-[400px]">
                <Image
                  src={getImageUrl(contentItem.poster_path, "medium")}
                  alt={contentItem.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 line-clamp-1 text-[var(--color-text-primary)]">
                  {contentItem.title}
                </h3>
                <div className="flex items-center mb-2">
                  <span className="text-[var(--color-accent)] mr-1">★</span>
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    {contentItem.vote_average.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-text-tertiary)] line-clamp-2">
                  {contentItem.overview}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}