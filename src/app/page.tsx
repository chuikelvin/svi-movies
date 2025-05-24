"use client";

import MovieList from "@/components/MovieList";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] flex flex-col items-center justify-start py-12 px-0 w-full">
        <MovieList />
    </div>
  );
}
