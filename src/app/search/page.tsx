"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useMovieStore } from "@/store/movieStore";
import SearchResults from "@/components/SearchResults";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const { searchMovies } = useMovieStore();

  useEffect(() => {
    if (query) {
      const page = parseInt(searchParams.get("page") || "1");
      searchMovies(query, page);
    }
  }, [query, searchMovies, searchParams]);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">
        Search Results for &ldquo;{query}&rdquo;
      </h1>
      <SearchResults />
    </div>
  );
}
