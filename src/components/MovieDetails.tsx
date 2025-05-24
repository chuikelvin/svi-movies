"use client";

import { useEffect } from "react";
import { useMovieStore } from "@/store/movieStore";
import { getImageUrl } from "@/lib/tmdb";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

interface MovieDetailsProps {
  movieId: number;
}

export default function MovieDetails({ movieId }: MovieDetailsProps) {
  const router = useRouter();
  const {
    selectedMovie,
    loading,
    error,
    fetchMovieDetails,
    clearSelectedMovie,
  } = useMovieStore();

  useEffect(() => {
    fetchMovieDetails(movieId);
    return () => clearSelectedMovie();
  }, [movieId, fetchMovieDetails, clearSelectedMovie]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="h-12 w-12 border-t-2 border-b-2 border-[var(--color-text-primary)] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !selectedMovie) {
    return (
      <div className="text-center text-[var(--color-error)] p-4">
        {error || "Movie not found"}
      </div>
    );
  }

  const directors = selectedMovie.crew.filter(
    (person) => person.job === "Director"
  );
  const writers = selectedMovie.crew.filter(
    (person) => person.department === "Writing"
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-6 text-[var(--color-text-primary)] hover:text-[var(--color-accent)] flex items-center gap-2 transition-colors"
      >
        <FiArrowLeft className="w-5 h-5" />
        Back to Movies
      </button>

      <div className="bg-[var(--color-background-secondary)] rounded-3xl shadow-lg overflow-hidden">
        <div className="relative h-[500px]">
          <Image
            src={getImageUrl(
              selectedMovie.backdrop_path || selectedMovie.poster_path,
              "large",
              "backdrop"
            )}
            alt={selectedMovie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h1 className="text-4xl font-bold mb-2 text-[var(--color-text-primary)]">
              {selectedMovie.title}
            </h1>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[var(--color-accent)]">
                ★ {selectedMovie.vote_average.toFixed(1)}
              </span>
              <span className="text-[var(--color-text-secondary)]">
                {selectedMovie.release_date.split("-")[0]}
              </span>
              <span className="text-[var(--color-text-secondary)]">
                {selectedMovie.runtime} min
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-4 text-[var(--color-text-primary)]">
                Overview
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6">
                {selectedMovie.overview}
              </p>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2 text-[var(--color-text-primary)]">
                  Cast
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {selectedMovie.cast.slice(0, 8).map((person) => (
                    <div
                      key={person.id}
                      className="bg-[var(--color-background-tertiary)] p-3 rounded-lg"
                    >
                      <p className="font-medium text-[var(--color-text-primary)]">
                        {person.name}
                      </p>
                      <p className="text-[var(--color-text-tertiary)]">
                        {person.character}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2 text-[var(--color-text-primary)]">
                  Crew
                </h3>
                <div className="space-y-2">
                  {directors.length > 0 && (
                    <div className="bg-[var(--color-background-tertiary)] p-3 rounded-lg">
                      <span className="font-medium text-[var(--color-text-primary)]">
                        Director{directors.length > 1 ? "s" : ""}:{" "}
                      </span>
                      <span className="text-[var(--color-text-secondary)]">
                        {directors.map((d) => d.name).join(", ")}
                      </span>
                    </div>
                  )}
                  {writers.length > 0 && (
                    <div className="bg-[var(--color-background-tertiary)] p-3 rounded-lg">
                      <span className="font-medium text-[var(--color-text-primary)]">
                        Writer{writers.length > 1 ? "s" : ""}:{" "}
                      </span>
                      <span className="text-[var(--color-text-secondary)]">
                        {writers.map((w) => w.name).join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-[var(--color-text-primary)]">
                Similar Movies
              </h3>
              <div className="space-y-4">
                {selectedMovie.similar.slice(0, 5).map((movie) => (
                  <div
                    key={movie.id}
                    className="flex gap-4 cursor-pointer bg-[var(--color-background-tertiary)] p-3 rounded-lg hover:bg-[var(--color-accent)] hover:text-[var(--color-background)] transition-colors"
                    onClick={() => router.push(`/movie/${movie.id}`)}
                  >
                    <div className="relative w-20 h-30">
                      <Image
                        src={getImageUrl(movie.poster_path, "small")}
                        alt={movie.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{movie.title}</h4>
                      <p className="text-sm opacity-80">
                        {movie.release_date.split("-")[0]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
