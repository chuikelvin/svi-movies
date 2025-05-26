"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import { useMovieStore } from "@/store/movieStore";
import { getImageUrl } from "@/lib/tmdb";
import Image from "next/image";

interface MovieSearchProps {
  onSearch?: () => void;
}

export default function MovieSearch({ onSearch }: MovieSearchProps) {
  const [query, setQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { searchResults, searchLoading, liveSearch, clearSearchResults } =
    useMovieStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        liveSearch(query.trim());
        setIsDropdownOpen(true);
      } else {
        clearSearchResults();
        setIsDropdownOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, liveSearch, clearSearchResults]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      setIsDropdownOpen(false);
      onSearch?.();
    }
  };

  const handleMovieClick = (movieId: number) => {
    router.push(`/movie/${movieId}`);
    setIsDropdownOpen(false);
    onSearch?.();
  };

  return (
    <div className="w-full relative" ref={dropdownRef}>
      <motion.form
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSearch}
        className="w-full max-w-2xl mx-auto"
        data-testid="search-form"
      >
        <div className="flex-1 flex justify-center gap-2 bg-[var(--color-background-secondary)] rounded-full pl-4 pr-2 py-2 h-12">
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for movies..."
            className="bg-transparent border-none outline-none flex-1 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]"
          />
          <button
            className="rounded-full bg-[var(--color-accent)] flex items-center justify-center hover:opacity-90 transition-colors p-2"
            aria-label="Search"
            type="submit"
          >
            <FiSearch className="w-5 h-5 text-[var(--color-background)]" />
          </button>
        </div>
      </motion.form>

      <AnimatePresence>
        {isDropdownOpen && (query.trim() || searchLoading) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-background-secondary)] rounded-lg shadow-lg overflow-hidden z-50"
          >
            {searchLoading ? (
              <div className="p-4 text-center">
                <div className="animate-spin h-6 w-6 border-2 border-[var(--color-accent)] border-t-transparent rounded-full mx-auto"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <>
                <div className="max-h-[400px] overflow-y-auto">
                  {searchResults.map((movie) => (
                    <motion.div
                      key={movie.id}
                      whileHover={{
                        backgroundColor: "var(--color-background-tertiary)",
                      }}
                      className="flex items-center gap-4 p-3 cursor-pointer hover:bg-[var(--color-background-tertiary)]"
                      onClick={() => handleMovieClick(movie.id)}
                    >
                      <div className="relative w-12 h-18 flex-shrink-0">
                        <Image
                          src={getImageUrl(movie.poster_path, "small")}
                          alt={movie.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[var(--color-text-primary)] font-medium truncate">
                          {movie.title}
                        </h3>
                        <p className="text-sm text-[var(--color-text-secondary)] truncate">
                          {movie.release_date?.split("-")[0]}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="border-t border-[var(--color-background-tertiary)] p-3">
                  <button
                    onClick={handleSearch}
                    className="w-full text-center text-[var(--color-accent)] hover:underline"
                  >
                    See all results
                  </button>
                </div>
              </>
            ) : query.trim() ? (
              <div className="p-4 text-center text-[var(--color-text-secondary)]">
                No movies found
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
