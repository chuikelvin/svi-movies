"use client";

import MovieList from "@/components/MovieList";
import Header from "@/components/Header";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] flex flex-col items-center justify-start py-12 px-0 w-full">
      <Header />
      <main className="flex flex-col items-center justify-center flex-1 w-full px-0">
        <Hero />
        <MovieList />
      </main>
    </div>
  );
}
