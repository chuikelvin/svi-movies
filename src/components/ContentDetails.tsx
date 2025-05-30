"use client";

import { useEffect } from "react";
import { useMovieStore } from "@/store/movieStore";
import type { ContentDetails, Movie, TVShow } from "@/store/movieStore";
import { getImageUrl } from "@/lib/tmdb";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { isTVShow } from "@/utils/isTvShow";

type ContentType = "movie" | "tv" | "kids";

interface ContentDetailsProps {
  id: number;
  type: ContentType;
}

// function isTVShow(item: Movie | TVShow): item is TVShow {
//   return "name" in item;
// }

export default function ContentDetails({ id, type }: ContentDetailsProps) {
  const router = useRouter();
  const { selectedMovie, movies, fetchMovieDetails, clearSelectedMovie } =
    useMovieStore();

  useEffect(() => {
    fetchMovieDetails(id, type);
    return () => clearSelectedMovie();
  }, [id, type, fetchMovieDetails, clearSelectedMovie]);

  if (movies.loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white rounded-full animate-spin" />
      </div>
    );
  }

  if (movies.error || !selectedMovie) {
    return (
      <div className="text-center text-red-500 p-4">
        {movies.error || "Content not found"}
      </div>
    );
  }

  const directors = selectedMovie.crew.filter(
    (person) => person.job === "Director"
  );
  const writers = selectedMovie.crew.filter(
    (person) => person.department === "Writing"
  );

  const title = type === "tv" ? selectedMovie.name : selectedMovie.title;
  const releaseDate =
    type === "tv" ? selectedMovie.first_air_date : selectedMovie.release_date;
  const runtime =
    type === "tv" ? selectedMovie.episode_run_time?.[0] : selectedMovie.runtime;
  const similarContent =
    type === "tv"
      ? selectedMovie.similar_tv || selectedMovie.similar
      : selectedMovie.similar;

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-6 text-[var(--color-text-primary)] hover:text-[var(--color-accent)] flex items-center gap-2 transition-colors"
      >
        <FiArrowLeft className="w-5 h-5" />
        Back to{" "}
        {type === "tv"
          ? "TV Shows"
          : type === "kids"
          ? "Kids Content"
          : "Movies"}
      </button>

      <div className="bg-[var(--color-background-secondary)] rounded-3xl shadow-lg overflow-hidden">
        <div className="relative h-[500px]">
          <Image
            src={getImageUrl(
              selectedMovie.backdrop_path || selectedMovie.poster_path,
              "large",
              "backdrop"
            )}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h1 className="text-4xl font-bold mb-2 text-[var(--color-text-primary)]">
              {title}
            </h1>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[var(--color-accent)]">
                ★ {selectedMovie.vote_average.toFixed(1)}
              </span>
              <span className="text-[var(--color-text-secondary)]">
                {releaseDate.split("-")[0]}
              </span>
              {runtime && (
                <span className="text-[var(--color-text-secondary)]">
                  {runtime} min
                </span>
              )}
              {type === "tv" && selectedMovie.number_of_seasons && (
                <span className="text-[var(--color-text-secondary)]">
                  {selectedMovie.number_of_seasons} Season
                  {selectedMovie.number_of_seasons > 1 ? "s" : ""}
                </span>
              )}
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
                Similar {type === "tv" ? "Shows" : "Movies"}
              </h3>
              <div className="space-y-4">
                {similarContent.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 cursor-pointer bg-[var(--color-background-tertiary)] p-3 rounded-lg hover:bg-[var(--color-accent)] hover:text-[var(--color-background)] transition-colors"
                    onClick={() => router.push(`/${type}/${item.id}`)}
                  >
                    <div className="relative w-20 h-30">
                      <Image
                        src={getImageUrl(item.poster_path, "small")}
                        alt={isTVShow(item) ? item.name : item.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {isTVShow(item) ? item.name : item.title}
                      </h4>
                      <p className="text-sm opacity-80">
                        {
                          (isTVShow(item)
                            ? item.first_air_date
                            : item.release_date
                          ).split("-")[0]
                        }
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
