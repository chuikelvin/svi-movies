"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiX, FiClock } from "react-icons/fi";
import { useMovieStore } from "@/store/movieStore";
import { getImageUrl } from "@/lib/tmdb";
import Image from "next/image";
import type { Movie, TVShow } from "@/store/movieStore";

interface MovieSearchProps {
  onSearch?: () => void;
}

const SEARCH_HISTORY_KEY = "movie-search-history";
const MAX_HISTORY_ITEMS = 5;

function isTVShow(item: Movie | TVShow): item is TVShow {
  return "name" in item;
}

export default function MovieSearch({ onSearch }: MovieSearchProps) {
  const [query, setQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [contentType, setContentType] = useState<"movie" | "tv">("movie");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { searchResults, searchLoading, liveSearch, clearSearchResults } =
    useMovieStore();

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // Save search history to localStorage
  const saveToHistory = (searchQuery: string) => {
    const newHistory = [
      searchQuery,
      ...searchHistory.filter((item) => item !== searchQuery),
    ].slice(0, MAX_HISTORY_ITEMS);
    setSearchHistory(newHistory);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  };

  // Clear search history
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  };

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
        liveSearch(query.trim(), contentType);
        setIsDropdownOpen(true);
      } else {
        clearSearchResults();
        setIsDropdownOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, contentType, liveSearch, clearSearchResults]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      saveToHistory(trimmedQuery);
      router.push(
        `/search?q=${encodeURIComponent(trimmedQuery)}&type=${contentType}`
      );
      setIsDropdownOpen(false);
      onSearch?.();
    }
  };

  const handleMovieClick = (movieId: number) => {
    router.push(`/${contentType}/${movieId}`);
    setIsDropdownOpen(false);
    onSearch?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isDropdownOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          Math.min(prev + 1, searchResults.length - 1)
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          handleMovieClick(searchResults[selectedIndex].id);
        } else if (query.trim()) {
          handleSearch(e);
        }
        break;
      case "Escape":
        setIsDropdownOpen(false);
        break;
    }
  };

  const clearSearch = () => {
    setQuery("");
    setSelectedIndex(-1);
    clearSearchResults();
    inputRef.current?.focus();
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
            ref={inputRef}
            whileFocus={{ scale: 1.02 }}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.trim() && setIsDropdownOpen(true)}
            placeholder="Search for movies..."
            className="bg-transparent border-none outline-none flex-1 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
              aria-label="Clear search"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setContentType("movie")}
              className={`px-2 py-1 rounded-md text-sm transition-colors ${
                contentType === "movie"
                  ? "bg-[var(--color-accent)] text-[var(--color-background)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              Movies
            </button>
            <button
              type="button"
              onClick={() => setContentType("tv")}
              className={`px-2 py-1 rounded-md text-sm transition-colors ${
                contentType === "tv"
                  ? "bg-[var(--color-accent)] text-[var(--color-background)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              TV Shows
            </button>
          </div>
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
        {isDropdownOpen &&
          (query.trim() || searchLoading || searchHistory.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-background-secondary)] rounded-lg shadow-lg overflow-hidden z-50"
            >
              {searchLoading ? (
                <div className="p-4 text-center">
                  <div
                    className="animate-spin h-6 w-6 border-2 border-[var(--color-accent)] border-t-transparent rounded-full mx-auto"
                    role="status"
                    aria-label="Loading search results"
                    aria-busy="true"
                  ></div>
                </div>
              ) : query.trim() ? (
                searchResults.length > 0 ? (
                  <>
                    <div className="max-h-[400px] overflow-y-auto">
                      {searchResults.map((movie, index) => (
                        <motion.div
                          key={movie.id}
                          whileHover={{
                            backgroundColor: "var(--color-background-tertiary)",
                          }}
                          className={`flex items-center gap-4 p-3 cursor-pointer hover:bg-[var(--color-background-tertiary)] ${
                            index === selectedIndex
                              ? "bg-[var(--color-background-tertiary)]"
                              : ""
                          }`}
                          onClick={() => handleMovieClick(movie.id)}
                        >
                          <div className="relative w-12 h-18 flex-shrink-0">
                            {/* <Image
                              src={getImageUrl(movie.poster_path, "small")}
                              alt={isTVShow(movie) ? movie.name : movie.title}
                              fill
                              className="object-cover rounded"
                            /> */}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-[var(--color-text-primary)] font-medium truncate">
                              {isTVShow(movie) ? movie.name : movie.title}
                            </h3>
                            <p className="text-sm text-[var(--color-text-secondary)] truncate">
                              {isTVShow(movie)
                                ? movie.first_air_date?.split("-")[0]
                                : movie.release_date?.split("-")[0]}
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
                ) : (
                  <div className="p-4 text-center text-[var(--color-text-secondary)]">
                    No {contentType === "tv" ? "TV shows" : "movies"} found
                  </div>
                )
              ) : searchHistory.length > 0 ? (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">
                      Recent Searches
                    </h3>
                    <button
                      onClick={clearHistory}
                      className="text-xs text-[var(--color-accent)] hover:underline"
                    >
                      Clear History
                    </button>
                  </div>
                  <div className="space-y-2">
                    {searchHistory.map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          setQuery(item);
                          inputRef.current?.focus();
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-[var(--color-background-tertiary)] text-left"
                      >
                        <FiClock className="w-4 h-4 text-[var(--color-text-tertiary)]" />
                        <span className="text-[var(--color-text-primary)]">
                          {item}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}
