"use client";

import { useEffect } from "react";
import { useMovieStore } from "@/store/movieStore";
import { getImageUrl } from "@/lib/tmdb";
import Image from "next/image";

export default function MovieList() {
  const { movies, loading, error, fetchMovies } = useMovieStore();

  useEffect(() => {
    fetchMovies(1);
  }, [fetchMovies]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="h-12 w-12 border-t-2 border-b-2 border-[var(--color-text-primary)] rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-[var(--color-error)] p-4">{error}</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-[var(--color-text-primary)]">
        Popular Movies
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="bg-[var(--color-background-secondary)] rounded-lg shadow-lg overflow-hidden"
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
          </div>
        ))}
      </div>
    </div>
  );
}
