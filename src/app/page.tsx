"use client";

import MovieList from "@/components/MovieList";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center flex-1 w-full px-0">
      <Hero />
      <MovieList />
    </main>
  );
}
